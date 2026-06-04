/** Single uppercase letter for avatar (name first, then email). */
export function getUserDisplayInitial(
  user: Pick<{ displayName?: string | null; email?: string | null }, "displayName" | "email">,
): string {
  const name = user.displayName?.trim();
  if (name) return name.charAt(0).toUpperCase();
  const email = user.email?.trim();
  if (email) return email.charAt(0).toUpperCase();
  return "?";
}
