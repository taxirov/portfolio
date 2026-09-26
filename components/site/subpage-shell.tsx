import { Footer } from "./footer";
import { Navbar } from "./navbar";

/** Navbar, centred content column and footer for pages other than the home page. */
export function SubpageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-16 md:px-10 lg:pb-16 lg:pt-32">{children}</main>
      <Footer />
    </div>
  );
}
