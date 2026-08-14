import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function MarkdownArticle({ content }: { content: string }) {
  return (
    <div className="prose-article">
      <ReactMarkdown
        components={{
          a: ({ href = "", children }) => {
            const external = href.startsWith("http");
            return external ? (
              <a href={href} target="_blank" rel="noreferrer">{children}</a>
            ) : (
              <Link href={href}>{children}</Link>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
