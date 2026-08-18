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
          img: ({ src = "", alt = "" }) => (
            // Admin-selected media may be served from S3 through /api/media or a trusted external host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="my-8 w-full rounded-2xl border border-white/10 bg-white/[0.02] object-cover"
              src={src}
              alt={alt}
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
