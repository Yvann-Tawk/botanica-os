export interface Toast { id: number; text: string; xp?: string }

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}><svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true"><path d="M0 -7 L 1.7 -1.7 L 7 0 L 1.7 1.7 L 0 7 L -1.7 1.7 L -7 0 L -1.7 -1.7 Z" fill="#f3c766"></path></svg><span>{t.text} <b>{t.xp ?? ''}</b></span></div>
      ))}
    </div>
  );
}
