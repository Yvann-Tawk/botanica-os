import { Fragment, type ReactNode } from 'react';

/** Renders lesson text: `code` → inline code, **bold** → bold. Everything else is plain text (no HTML). */
export function Rich({ text }: { text: string }): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 1) return <code key={i} className="inl">{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 3) return <b key={i}>{p.slice(2, -2)}</b>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}
