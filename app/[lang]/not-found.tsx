import Link from "next/link";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { getI18n } from "@/lib/locale";

export default async function NotFound() {
  const { locale, dict } = await getI18n();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-slate-100 to-slate-200">
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <p className="text-7xl font-bold text-indigo-600">404</p>
        <h1 className="text-3xl font-semibold text-slate-800">{dict.notFound.title}</h1>
        <p className="text-slate-600">{dict.notFound.text}</p>
        <Link
          href={`/${locale}`}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          {dict.notFound.home}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
