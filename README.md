# saad.uz

Personal portfolio of Saad Takhir, built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Prisma 7 and PostgreSQL.

- **saad.uz/{uz,ru,en}**: the public portfolio in Uzbek, Russian and English. Profile data lives in `lib/`; skills, projects, social links and blog posts come from the database. The contact form stores messages in the database.
- **saad.uz/{lang}/blogs**: the blog. Posts are written in Markdown in the admin panel.
- **saad.uz/{lang}/domains**: domains for sale (also a section on the home page). Visitors send offers from a dialog; offers land in the admin inbox with the domain and amount, and in Telegram when it is configured.
- **app.saad.uz**: a password-protected admin panel for blog posts, contact messages and domain offers, projects, skills, domains for sale and social links. `proxy.ts` rewrites that host to `/admin`.

## Languages

- Pages live under `app/[lang]` (`/uz`, `/ru`, `/en`). `proxy.ts` sends any other path (including old links like `/blogs/...`) to the visitor's language: the `lang` cookie set by the switcher, then `Accept-Language`, then English.
- Interface text is in `lib/dictionaries/{uz,ru,en}.ts`; the English file defines the shape the others must match.
- Database content that is translated (project title, description and note; skill group names; post title, excerpt and content) has one column per language, e.g. `titleUz`, `titleRu`, `titleEn`. The admin forms show one tab per language. An empty translation falls back to English, then Uzbek, then Russian (`pick()` in `lib/i18n.ts`), and a post shown in another language says so.
- Poppins has no Cyrillic, so Russian pages and Russian content blocks use Montserrat (`app/globals.css`).
- The admin panel (`app/admin`) is a separate root layout and stays in Uzbek.

## Local development

```bash
npm install
cp .env.example .env          # fill in the values
npx prisma dev                # optional: local Postgres; copy the printed TCP URL into DATABASE_URL
npm run db:migrate            # create tables
npm run db:seed               # import the original projects and social links
npm run dev
```

- Site: http://localhost:3000 (redirects to /uz, /ru or /en)
- Admin: http://app.localhost:3000 (or http://localhost:3000/admin)

## Environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon pooled URL in production) |
| `DATABASE_URL_UNPOOLED` | Optional direct connection used by `prisma migrate`; set it when `DATABASE_URL` goes through a pooler |
| `ADMIN_PASSWORD` | Admin panel password |
| `SESSION_SECRET` | At least 32 random characters, used to sign the admin session cookie |
| `ADMIN_HOST` | Admin host name, default `app.saad.uz` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional: get a Telegram message for every new contact form message |

Uploaded images are stored in Netlify Blobs (locally in the gitignored `.uploads/` folder) and served from `/uploads/...` by `app/uploads/[...key]/route.ts`.

## Deploying (Netlify)

1. Create a Netlify site from the GitHub repo. `netlify.toml` sets the build command (`prisma generate && prisma migrate deploy && next build`); Netlify adds its Next.js runtime automatically.
2. Create a Postgres database on [Neon](https://neon.tech) in AWS us-east-2 (Ohio), the same region as Netlify Functions.
3. Add `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (direct), `ADMIN_PASSWORD` and `SESSION_SECRET` (and optionally the Telegram variables) in Site configuration → Environment variables.
4. Netlify Blobs needs no setup. Production uploads go to the `uploads` store; deploy previews write to `uploads-preview`, so they never touch production images.
5. Seed once: run `DATABASE_URL="<Neon URL>" npm run db:seed`.
6. Add the domains `saad.uz`, `www.saad.uz` and `app.saad.uz` in Domain management. In Cloudflare DNS, with the proxy off ("DNS only") so Netlify can issue the certificate:

   | Type | Name | Content |
   | --- | --- | --- |
   | `CNAME` (flattened) | `@` | `apex-loadbalancer.netlify.com` |
   | `CNAME` | `www` | `<site-name>.netlify.app` |
   | `CNAME` | `app` | `<site-name>.netlify.app` |
