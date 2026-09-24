# saad.uz

Personal portfolio of Saad Takhir, built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Prisma 7 and PostgreSQL.

- **saad.uz**: the public portfolio. Skills and profile data live in `lib/`; projects, social links and blog posts come from the database. The contact form stores messages in the database.
- **saad.uz/blogs**: the blog. Posts are written in Markdown in the admin panel.
- **app.saad.uz**: a password-protected admin panel for blog posts, contact messages, projects and social links. `proxy.ts` rewrites that host to `/admin`.

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
| `DATABASE_URL` | Postgres connection string |
| `ADMIN_PASSWORD` | Admin panel password |
| `SESSION_SECRET` | At least 32 random characters, used to sign the admin session cookie |
| `ADMIN_HOST` | Admin host name, default `app.saad.uz` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for image uploads (without it, paste an image URL instead) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional: get a Telegram message for every new contact form message |

## Deploying (Vercel)

1. Import the repo in Vercel. Add a Postgres database (Neon) and a Blob store from the Storage tab; both set their env vars automatically.
2. Add `ADMIN_PASSWORD` and `SESSION_SECRET`.
3. The `vercel-build` script runs `prisma migrate deploy` before `next build`.
4. Add the domains `saad.uz`, `www.saad.uz` and `app.saad.uz` to the project, then point DNS at Vercel as the dashboard shows.
5. Run `npm run db:seed` once against the production `DATABASE_URL`.
