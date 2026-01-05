import { notFound } from "next/navigation";
import Link from "next/link";
import { getAccount, getPropertiesForPartner } from "../../../lib/demo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPartnerHomes({
  params,
}: {
  params: { partnerId: string };
}) {
  const role = cookies().get("cb_role")?.value;
  if (role !== "admin") {
    return (
      <main className="mx-auto max-w-4xl px-5 md:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-sky-900">Access required</h1>
        <p className="mt-2 text-sky-900/70">
          Please{" "}
          <a className="underline" href="/partners/login">
            sign in
          </a>{" "}
          as Coastal admin.
        </p>
      </main>
    );
  }

  const acct = getAccount(params.partnerId);
  if (!acct) {
    return (
      <main className="mx-auto max-w-4xl px-5 md:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-sky-900">Not found</h1>
        <p className="mt-2 text-sky-900/70">Unknown account.</p>
      </main>
    );
  }

  const props = getPropertiesForPartner(acct.id);

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <div className="mb-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-sky-800/80">
          Admin • {acct.name}
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-sky-900">Homes</h1>
        <p className="mt-2 text-sky-900/70">
          Click a home to open the detailed property breakdown.
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-sky-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sky-50/60 text-sky-900/80">
            <tr>
              <th className="px-4 py-3 text-left">Property</th>
              <th className="px-4 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.id} className="border-t border-slate-100/60">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-right">
                  {/* Deep link to the PARTNER property page you already have */}
                  <a
                    href={`/partners/${acct.id}/properties/${p.id}`}
                    className="inline-flex items-center rounded-full border border-sky-200 px-3 py-1.5 text-sky-800 hover:bg-sky-50"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {props.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={2}>
                  No homes found for this account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
