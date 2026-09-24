const devicon = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

export type Skill = { name: string; icon: string };
export type SkillGroup = { title: string; icon: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming languages",
    icon: "bi-translate",
    skills: [
      { name: "TypeScript", icon: devicon("typescript") },
      { name: "JavaScript", icon: devicon("javascript") },
      { name: "Python", icon: devicon("python") },
      { name: "C++", icon: devicon("cplusplus") },
    ],
  },
  {
    title: "Backend",
    icon: "bi-hdd-stack",
    skills: [
      { name: "Node.js", icon: devicon("nodejs") },
      { name: "Express.js", icon: devicon("express") },
      { name: "Prisma", icon: devicon("prisma") },
      { name: "PostgreSQL", icon: devicon("postgresql") },
      { name: "MongoDB", icon: devicon("mongodb") },
      { name: "NGINX", icon: devicon("nginx") },
    ],
  },
  {
    title: "Frontend",
    icon: "bi-window",
    skills: [
      { name: "HTML", icon: devicon("html5") },
      { name: "CSS", icon: devicon("css3") },
      { name: "Tailwind", icon: devicon("tailwindcss") },
      { name: "Bootstrap", icon: devicon("bootstrap") },
      { name: "Svelte", icon: devicon("svelte") },
      { name: "Next.js", icon: devicon("nextjs") },
      { name: "Axios", icon: devicon("axios", "plain") },
    ],
  },
  {
    title: "Tools",
    icon: "bi-wrench-adjustable-circle",
    skills: [
      { name: "Git", icon: devicon("git") },
      { name: "Bash", icon: devicon("bash") },
      { name: "VS Code", icon: devicon("vscode") },
      { name: "Figma", icon: devicon("figma") },
      { name: "Vercel", icon: devicon("vercel") },
      { name: "npm", icon: devicon("npm", "original-wordmark") },
    ],
  },
  {
    title: "Infrastructure",
    icon: "bi-cloud",
    skills: [
      { name: "Debian", icon: devicon("debian") },
      { name: "Cloudflare", icon: devicon("cloudflare") },
      { name: "SSH", icon: devicon("ssh") },
    ],
  },
  {
    title: "Learning now",
    icon: "bi-broadcast",
    skills: [
      { name: "Docker", icon: devicon("docker") },
      { name: "Socket.IO", icon: devicon("socketio") },
      { name: "RabbitMQ", icon: devicon("rabbitmq") },
      { name: "Elasticsearch", icon: devicon("elasticsearch") },
    ],
  },
];
