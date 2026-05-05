import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 pl-5 text-slate-600">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 pl-5 text-slate-600">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="pl-1 text-sm leading-6">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-sky-200 pl-4 text-sm italic text-slate-500">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-slate-700">{children}</em>
        ),
        code: ({ children }) => (
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
