import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function BlogLayout({ children }: LayoutProps<"/blogs">) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:px-10 md:pb-16 md:pt-32">{children}</main>
      <Footer />
    </div>
  );
}
