import { profile } from "@/lib/profile";

export function Footer() {
  return (
    <footer className="pb-24 pt-8 text-center text-sm text-slate-500 lg:pb-8">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
