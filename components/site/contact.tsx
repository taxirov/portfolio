import { profile } from "@/lib/profile";
import { ContactForm } from "./contact-form";
import { SectionTitle } from "./section-title";

export function Contact() {
  return (
    <section id="contact" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>Contact me</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-lg font-medium">Have a project or a question?</p>
          <p className="text-slate-600">
            Send me a message and I will reply by email. You can also reach me directly:
          </p>
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
        <ContactForm />
      </div>
    </section>
  );
}
