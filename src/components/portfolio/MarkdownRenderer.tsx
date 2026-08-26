import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by paragraphs (double newlines)
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((para, index) => {
        const lines = para.split("\n");
        return (
          <p key={index} className="leading-relaxed">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {parseInlineMarkdown(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  interface Token {
    type: "text" | "bold" | "italic" | "code" | "link";
    content: string;
    href?: string;
  }

  let tokens: Token[] = [{ type: "text", content: text }];

  // Helper to run sequential token matchers over text segments
  const processTokens = (
    regex: RegExp,
    type: "bold" | "italic" | "code" | "link",
    builder: (match: RegExpExecArray) => { content: string; href?: string }
  ) => {
    const nextTokens: Token[] = [];
    for (const token of tokens) {
      if (token.type !== "text") {
        nextTokens.push(token);
        continue;
      }

      const remaining = token.content;
      let match;
      regex.lastIndex = 0;

      let lastIndex = 0;
      while ((match = regex.exec(remaining)) !== null) {
        const prefix = remaining.substring(lastIndex, match.index);
        if (prefix) {
          nextTokens.push({ type: "text", content: prefix });
        }

        const buildResult = builder(match);
        nextTokens.push({
          type,
          content: buildResult.content,
          href: buildResult.href,
        });

        lastIndex = regex.lastIndex;
      }

      const suffix = remaining.substring(lastIndex);
      if (suffix) {
        nextTokens.push({ type: "text", content: suffix });
      }
    }
    tokens = nextTokens;
  };

  // 1. Extract links first: [label](url)
  processTokens(/\[([^\]]+)\]\(([^)]+)\)/g, "link", (match) => ({
    content: match[1],
    href: match[2],
  }));

  // 2. Extract bold styling: **text**
  processTokens(/\*\*([^*]+)\*\*/g, "bold", (match) => ({
    content: match[1],
  }));

  // 3. Extract italics styling: *text*
  processTokens(/\*([^*]+)\*/g, "italic", (match) => ({
    content: match[1],
  }));

  // 4. Extract inline code highlights: `text`
  processTokens(/`([^`]+)`/g, "code", (match) => ({
    content: match[1],
  }));

  // Render processed tokens into safe React DOM nodes (avoids XSS vulnerabilities)
  return tokens.map((token, idx) => {
    switch (token.type) {
      case "bold":
        return <strong key={idx} className="font-bold text-white select-all-overrides">{token.content}</strong>;
      case "italic":
        return <em key={idx} className="italic">{token.content}</em>;
      case "code":
        return (
          <code key={idx} className="bg-zinc-900/60 text-zinc-100 border border-zinc-800/80 px-1 py-0.5 rounded font-mono text-[0.85em]">
            {token.content}
          </code>
        );
      case "link":
        return (
          <a
            key={idx}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--theme-primary)] hover:underline font-medium transition-colors"
          >
            {token.content}
          </a>
        );
      default:
        return token.content;
    }
  });
}
