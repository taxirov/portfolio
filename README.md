# saad.uz

Personal portfolio of Saad Takhir, built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Prisma 7 and PostgreSQL.

- **saad.uz**: the public portfolio. Profile data lives in `lib/`; skills, projects, social links and blog posts come from the database. The contact form stores messages in the database.
- **saad.uz/blogs**: the blog. Posts are written in Markdown in the admin panel.
- **app.saad.uz**: a password-protected admin panel for blog posts, contact messages, projects, skills and social links. `proxy.ts` rewrites that host to `/admin`.

## Local development

```bash
npm install
cp .env.example .env          # fill in the values
npx prisma dev                # optional: local Postgres; copy the printed TCP URL into DATABASE_URL
npm run db:migrate            # create tables
npm run db:seed               # import the original projects and social links
npm run dev
```

- Site: http://localhost:3000
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
