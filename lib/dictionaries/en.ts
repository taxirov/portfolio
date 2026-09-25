import type { PluralForms } from "@/lib/i18n";

const en = {
  meta: {
    title: "Saad Takhir - Backend Developer",
    description:
      "Saad Takhir is a backend developer from Uzbekistan working with TypeScript, Node.js, Express, Prisma and PostgreSQL.",
    ogLocale: "en_US",
  },
  profile: {
    jobTitle: "Backend Developer",
    address: "Shavat, Uzbekistan",
  },
  nav: {
    home: "Home",
    skills: "Skills",
    portfolio: "Portfolio",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    email: "Email",
    homeLabel: "Saad Takhir, home",
    language: "Language",
  },
  hero: {
    illustrationAlt: "Illustration of a developer at a laptop",
    viewProjects: "View projects",
    contactMe: "Contact me",
  },
  skills: { title: "Skills" },
  projects: {
    title: "Portfolio",
    comingSoon: "Projects are coming soon.",
    backend: "Backend",
    frontend: "Frontend",
    sourceCode: "Source code",
    liveDemo: "Live demo",
    screenshot: "{title} screenshot",
  },
  blog: {
    title: "Blog",
    intro: "Notes on backend development, tools and things I learn.",
    metaDescription: "Articles by Saad Takhir about backend development, TypeScript, Node.js and more.",
    empty: "No posts yet. Check back soon.",
    allPosts: "All posts",
    readMore: "Read more",
    getInTouch: "Get in touch",
    onlyIn: "This post is not translated yet, so it is shown in {language}.",
    views: { one: "view", other: "views" } as PluralForms,
    shares: { one: "share", other: "shares" } as PluralForms,
    share: "Share",
    shareOn: "Share on {name}",
    copyLink: "Copy link",
    copied: "Copied!",
    moreOptions: "More sharing options",
  },
  about: {
    title: "About",
    fullName: "Full name",
    address: "Address",
    jobTitle: "Job title",
    email: "Email",
    phone: "Phone",
    coding: "Coding",
    findMe: "Find me online",
    codewarsAlt: "Codewars profile badge",
    leetcodeAlt: "LeetCode ranking badge",
  },
  contact: {
    title: "Contact me",
    lead: "Have a project or a question?",
    text: "Send me a message and I will reply by email. You can also reach me directly:",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending...",
    thanks: "Thank you! Your message has been sent.",
    reply: "I will get back to you as soon as possible.",
    checkFields: "Please check the highlighted fields.",
    nameRequired: "Please enter your name.",
    nameTooLong: "Name is too long.",
    emailInvalid: "Please enter a valid email address.",
    messageTooShort: "Message should be at least 10 characters.",
    messageTooLong: "Message is too long (3000 max).",
    tooMany: "Too many messages. Please try again later or email {email}.",
    failed: "Something went wrong. Please email me directly at {email}.",
  },
  notFound: {
    title: "Page not found",
    text: "The page you are looking for does not exist or was moved.",
    home: "Go to the home page",
  },
};

export default en;

/** Every language file must have exactly these keys. */
export type Dictionary = typeof en;
