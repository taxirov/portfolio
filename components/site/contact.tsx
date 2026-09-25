import { getI18n } from "@/lib/locale";
import { profile } from "@/lib/profile";
import { ContactForm } from "./contact-form";
import { SectionTitle } from "./section-title";

export async function Contact() {
  const { locale, dict } = await getI18n();
  return (
    <section id="contact" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>{dict.contact.title}</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-lg font-medium">{dict.contact.lead}</p>
          <p className="text-slate-600">{dict.contact.text}</p>
          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 font-medium hover:text-indigo-600">
            <i className="bi bi-envelope-fill" aria-hidden /> {profile.email}
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 font-medium hover:text-indigo-600"
          >
            <i className="bi bi-telephone-fill" aria-hidden /> {profile.phone}
          </a>
        </div>
        <ContactForm locale={locale} dict={dict.contact} />
      </div>
    </section>
  );
}
