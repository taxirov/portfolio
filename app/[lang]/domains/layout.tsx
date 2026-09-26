import { SubpageShell } from "@/components/site/subpage-shell";

export default function DomainsLayout({ children }: LayoutProps<"/[lang]/domains">) {
  return <SubpageShell>{children}</SubpageShell>;
}
