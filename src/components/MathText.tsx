import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

interface MathPart {
  type: 'text' | 'math';
  content: string;
  display?: boolean;
  html?: string;
}

export const MathText: React.FC<MathTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Regex to match math delimiters:
    // 1. $$...$$ (Display math)
    // 2. \[...\] (Display math)
    // 3. \(...\) (Inline math)
    // 4. $...$ (Inline math, non-empty, not starting or ending with whitespace)
    const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?!\s)(?:[^$\n\\]|\\.)+?(?<!\s)\$)/g;

    const result: MathPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = mathRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = mathRegex.lastIndex;

      if (matchStart > lastIndex) {
        result.push({
          type: 'text',
          content: text.substring(lastIndex, matchStart),
        });
      }

      const raw = match[0];
      let mathContent = '';
      let isDisplay = false;

      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        mathContent = raw.slice(2, -2);
        isDisplay = true;
      } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
        mathContent = raw.slice(2, -2);
        isDisplay = true;
      } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
        mathContent = raw.slice(2, -2);
        isDisplay = false;
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        mathContent = raw.slice(1, -1);
        isDisplay = false;
      }

      if (mathContent) {
        try {
          const renderedHtml = katex.renderToString(mathContent.trim(), {
            displayMode: isDisplay,
            throwOnError: false,
          });
          result.push({
            type: 'math',
            content: mathContent,
            display: isDisplay,
            html: renderedHtml,
          });
        } catch {
          result.push({
            type: 'text',
            content: raw,
          });
        }
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return result;
  }, [text]);

  return (
    <Component className={className}>
      {parts.map((part, idx) => {
        if (part.type === 'math' && part.html) {
          return (
            <span
              key={idx}
              className={
                part.display
                  ? 'block my-2 text-center overflow-x-auto py-1'
                  : 'inline-block mx-0.5 align-baseline'
              }
              dangerouslySetInnerHTML={{ __html: part.html }}
            />
          );
        }
        return <React.Fragment key={idx}>{part.content}</React.Fragment>;
      })}
    </Component>
  );
};
