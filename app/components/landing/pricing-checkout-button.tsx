"use client";

import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { getFreshIdToken } from "@/lib/fresh-id-token";
import { syncApiSession } from "@/lib/sync-api-session";

type CtaVariant = "muted" | "emphasis";

type PricingCheckoutButtonProps = {
  packageId: string;
  label: string;
  variant: CtaVariant;
};

type CreateOrderResponse = {
  keyId: string;
  order: {
    id: string;
    amount: number;
    currency: string;
  };
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
  };
};

type RazorpayHandler = (response: RazorpayPaymentResponse) => void | Promise<void>;

type RazorpayInstance = {
  open(): void;
  on(event: "payment.failed", cb: (response: unknown) => void): void;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: RazorpayHandler;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const buttonBase =
  "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-label-md font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-65";

const styles: Record<CtaVariant, string> = {
  muted: "bg-surface-container-high/80 text-on-surface hover:bg-surface-container-highest",
  emphasis: "bg-white text-black hover:bg-white/92",
};

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_REFYN_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_API_REFYN_URL is not configured.");
  }
  return raw.replace(/\/$/, "");
}

function parseErrorMessage(raw: string, fallback: string) {
  try {
    const body = JSON.parse(raw) as { error?: string; message?: string };
    return body.message || body.error || fallback;
  } catch {
    return raw || fallback;
  }
}

function ensureRazorpayLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("browser_only"));
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("razorpay_script_failed")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("razorpay_script_failed"));
    document.body.appendChild(script);
  });
}

async function createOrder(token: string, packageId: string): Promise<CreateOrderResponse> {
  const res = await fetch(`${apiBase()}/api/billing/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ packageId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(parseErrorMessage(text, `order_create_failed:${res.status}`));
  }
  return (await res.json()) as CreateOrderResponse;
}

async function verifyPayment(
  token: string,
  packageId: string,
  payment: RazorpayPaymentResponse,
): Promise<void> {
  const res = await fetch(`${apiBase()}/api/billing/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      packageId,
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(parseErrorMessage(text, `verify_failed:${res.status}`));
  }
}

async function openCheckout(
  order: CreateOrderResponse,
  userName: string,
  email: string,
): Promise<RazorpayPaymentResponse> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("razorpay_not_loaded"));
      return;
    }
    let settled = false;
    const failIfPending = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const succeedIfPending = (response: RazorpayPaymentResponse) => {
      if (settled) return;
      settled = true;
      resolve(response);
    };

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.order.amount,
      currency: order.order.currency,
      name: "Refyn",
      description: "Subscription payment",
      order_id: order.order.id,
      prefill: {
        name: userName,
        email,
      },
      theme: {
        color: "#5de6ff",
      },
      handler(response) {
        succeedIfPending(response);
      },
      modal: {
        ondismiss() {
          failIfPending(new Error("checkout_cancelled"));
        },
      },
    });
    rzp.on("payment.failed", (response: RazorpayFailureResponse) => {
      const details = [
        response?.error?.description,
        response?.error?.reason,
        response?.error?.step,
      ]
        .filter(Boolean)
        .join(" | ");
      failIfPending(new Error(details ? `payment_failed:${details}` : "payment_failed"));
    });
    rzp.open();
  });
}

export function PricingCheckoutButton({ packageId, label, variant }: PricingCheckoutButtonProps) {
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("");

  async function onClick() {
    setStatusText("");
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Please sign in first from the top-right account button.");
      }

      await syncApiSession(user);
      let token = await getFreshIdToken(user);

      if (packageId === "free") {
        setStatusText("Free plan is active for your account.");
        return;
      }

      await ensureRazorpayLoaded();
      const order = await createOrder(token, packageId);
      const payment = await openCheckout(
        order,
        user.displayName || "",
        user.email || "",
      );

      token = await getFreshIdToken(user);
      await verifyPayment(token, packageId, payment);
      setStatusText("Payment successful. Your plan is now active.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment could not be completed.";
      if (msg === "checkout_cancelled") {
        setStatusText("Checkout cancelled.");
      } else if (msg.startsWith("payment_failed:")) {
        setStatusText(`Payment failed: ${msg.replace("payment_failed:", "")}`);
      } else if (msg === "payment_failed") {
        setStatusText("Payment failed. Please try another method.");
      } else {
        setStatusText(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={busy}
        className={`${buttonBase} ${styles[variant]}`}
      >
        {busy ? "Processing..." : label}
      </button>
      {statusText ? (
        <p className="text-center text-[11px] leading-snug text-on-surface-variant">
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
