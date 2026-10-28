import React from "react";

/**
 * Safely parses inline Markdown (**bold**, *italic*, `code`) into React elements
 * without using dangerouslySetInnerHTML.
 */
const renderInlineMarkdown = (text, keyPrefix = "inline") => {
  if (!text) return null;

  // Tokenize by `code`, **bold**, or *italic*
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  const parts = String(text).split(tokenRegex);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-200/80 text-navy-900 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={key} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

const KNOWN_SECTION_HEADERS = new Set([
  "interview questions",
  "topics to revise",
  "preparation tips",
  "key responsibilities",
  "requirements & qualifications",
  "qualifications & requirements",
  "recommendation",
]);

/**
 * Safe, zero-dependency Markdown renderer for AI Hiring Assistant and AI Interview Prep.
 * Renders headings, bullet lists, numbered lists, code blocks, and paragraphs cleanly.
 */
export const MarkdownRenderer = ({ content, className = "" }) => {
  if (!content || typeof content !== "string") return null;

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      i += 1;
      continue;
    }

    // Fenced code block ```
    if (trimmed.startsWith("```")) {
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // skip closing ```
      blocks.push({
        type: "code",
        content: codeLines.join("\n"),
      });
      continue;
    }

    // Markdown Heading (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].replace(/\*\*$/g, "").replace(/^\*\*/g, ""),
      });
      i += 1;
      continue;
    }

    // Standalone bold heading line e.g. "**Interview Questions**" or known section titles
    const cleanHeaderCandidate = trimmed
      .replace(/^\*\*|\*\*$/g, "")
      .replace(/:$/, "")
      .trim();
    if (
      (trimmed.startsWith("**") &&
        trimmed.endsWith("**") &&
        !trimmed.slice(2, -2).includes("**") &&
        trimmed.length < 70) ||
      KNOWN_SECTION_HEADERS.has(cleanHeaderCandidate.toLowerCase())
    ) {
      blocks.push({
        type: "heading",
        level: 3,
        text: cleanHeaderCandidate,
      });
      i += 1;
      continue;
    }

    // Unordered list (- , * , • )
    if (/^([-*•])\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^([-*•])\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-*•])\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list (1. , 2. , etc.)
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Blockquote (> )
    if (trimmed.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // Regular paragraph (group consecutive non-special lines)
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{1,4})\s+/.test(lines[i].trim()) &&
      !/^([-*•])\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith(">") &&
      !KNOWN_SECTION_HEADERS.has(
        lines[i]
          .trim()
          .replace(/^\*\*|\*\*$/g, "")
          .replace(/:$/, "")
          .toLowerCase(),
      )
    ) {
      paraLines.push(lines[i].trim());
      i += 1;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", text: paraLines.join(" ") });
    } else {
      i += 1;
    }
  }

  return (
    <div className={`space-y-3 text-sm text-slate-700 leading-relaxed ${className}`}>
      {blocks.map((block, index) => {
        const key = `md-block-${index}`;
        if (block.type === "heading") {
          return (
            <h4
              key={key}
              className="font-display text-sm sm:text-base font-bold text-navy-900 pt-2 first:pt-0 pb-1 border-b border-slate-200/80 m-0"
            >
              {renderInlineMarkdown(block.text, key)}
            </h4>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={key}
              className="list-disc pl-5 space-y-1.5 my-2 text-slate-700"
            >
              {block.items.map((item, idx) => (
                <li key={`${key}-li-${idx}`} className="leading-relaxed">
                  {renderInlineMarkdown(item, `${key}-li-${idx}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol
              key={key}
              className="list-decimal pl-5 space-y-2 my-2 text-slate-700"
            >
              {block.items.map((item, idx) => (
                <li
                  key={`${key}-oli-${idx}`}
                  className="leading-relaxed pl-0.5"
                >
                  {renderInlineMarkdown(item, `${key}-oli-${idx}`)}
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "code") {
          return (
            <pre
              key={key}
              className="p-3.5 rounded-xl bg-navy-900 text-slate-100 font-mono text-xs overflow-x-auto my-2"
            >
              <code>{block.content}</code>
            </pre>
          );
        }
        if (block.type === "blockquote") {
          return (
            <blockquote
              key={key}
              className="pl-3.5 py-1 border-l-4 border-teal-600 bg-teal-50/50 rounded-r-lg text-slate-700 italic my-2"
            >
              {renderInlineMarkdown(block.text, key)}
            </blockquote>
          );
        }
        return (
          <p key={key} className="m-0 leading-relaxed text-slate-700">
            {renderInlineMarkdown(block.text, key)}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
