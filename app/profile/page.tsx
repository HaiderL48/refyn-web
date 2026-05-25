import type { Metadata } from "next";
import { Navbar } from "@/app/components/landing/navbar";
import { ProfileDashboard } from "@/app/components/profile/profile-dashboard";
import { SiteFooter } from "@/app/components/site-footer";

export const metadata: Metadata = {
  title: "Account — Refyn",
  description: "View your Refyn cloud plan, daily usage, and account details.",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex flex-1 flex-col pt-14">
        <ProfileDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
