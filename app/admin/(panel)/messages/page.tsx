import type { Metadata } from "next";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { MessageActions } from "@/components/admin/message-actions";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Xabarlar" };

const dateFormat = new Intl.DateTimeFormat("uz-UZ", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tashkent",
});

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await db.message.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }], take: 200 });

  return (
    <>
      <PageHeader title="Xabarlar" />
      {messages.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
          Hali xabar kelmagan. Saytdagi &quot;Contact me&quot; formasi orqali yuborilgan xabarlar shu yerda ko&apos;rinadi.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => {
            const reply = `mailto:${message.email}?subject=${encodeURIComponent("Re: saad.uz")}`;
            return (
              <li
                key={message.id}
                className={`flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:p-5 ${
                  message.read ? "" : "ring-2 ring-indigo-200"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-800">
                    {!message.read && <span className="mr-2 inline-block size-2 rounded-full bg-indigo-500" aria-label="yangi" />}
                    {message.name}{" "}
                    <a href={reply} className="font-normal text-slate-500 hover:text-indigo-600">
                      &lt;{message.email}&gt;
                    </a>
                  </p>
                  <time dateTime={message.createdAt.toISOString()} className="text-sm text-slate-400">
                    {dateFormat.format(message.createdAt)}
                  </time>
                </div>
                <p className="whitespace-pre-wrap break-words text-slate-700">{message.body}</p>
                <MessageActions
                  read={message.read}
                  replyHref={reply}
                  onToggleRead={setMessageRead.bind(null, message.id, !message.read)}
                  onDelete={deleteMessage.bind(null, message.id)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
