import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders post Markdown. Raw HTML is not rendered and react-markdown strips unsafe
 * URLs (javascript: etc.), so admin-authored content cannot inject scripts.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-indigo-600 prose-img:rounded-xl prose-pre:bg-slate-900">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // `node` is react-markdown's AST node; pulled out so it is not spread onto the DOM.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ href, children, node, ...props }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
