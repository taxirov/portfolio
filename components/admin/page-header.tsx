import Link from "next/link";

export function PageHeader({
  title,
  action,
  back,
}: {
  title: string;
  action?: { href: string; label: string };
  back?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {back && (
          <Link href={back} aria-label="Orqaga" className="rounded-md p-1.5 text-slate-500 hover:bg-white">
            <i className="bi bi-arrow-left" aria-hidden />
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          <i className="bi bi-plus-lg" aria-hidden /> {action.label}
        </Link>
      )}
    </div>
  );
}
