// app/coastal/accounts/page.tsx
import { cookies } from "next/headers";
import AdminAccountsClient from "./AdminAccountsClient";

export default function AllAccountsPage() {
  const role = cookies().get("cb_role")?.value;
  if (role !== "admin") {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-xl font-semibold text-sky-900 mb-2">
          Access required
        </h1>
        <a className="text-sky-700 underline" href="/coastal/login">
          Sign in as Coastal admin
        </a>
      </main>
    );
  }
  // your AdminAccountsClient already renders the PM + Condo rows
  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <AdminAccountsClient />
    </main>
  );
}
