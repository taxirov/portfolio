import "server-only";

/**
 * Sends a Telegram message when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set.
 * Never throws: a failed notification must not fail the contact form.
 */
export async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Plain text (no parse_mode) so visitor input needs no escaping.
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] telegram responded", res.status, await res.text());
  } catch (error) {
    console.error("[notify] telegram failed", error);
  }
}
