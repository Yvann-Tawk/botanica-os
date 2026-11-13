import type { PointerEvent } from 'react';
import { AppGlyph } from '../art/AppGlyph';
import { Wallpaper } from '../art/Wallpaper';
import { APPS, type AppId } from '../content/apps';
import type { NextStep } from '../apps/academy/nextLesson';

interface Props {
  /** The next step on the learner's chart, for the pinned note. */
  next: NextStep;
  selIcon: AppId | null;
  onSelect: (id: AppId | null) => void;
  onOpen: (id: AppId) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenMission: (missionId: string) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Desktop({ next, selIcon, onSelect, onOpen, onOpenLesson, onOpenMission }: Props) {
  const note = next.kind === 'lesson'
    ? { title: next.lesson.title, sub: `${next.lesson.regionName} · Lesson ${pad(next.lesson.number)} · about ${next.lesson.minutes} min`, btn: next.lesson.id === 'g01-l01' ? 'Open the Academy' : 'Resume lesson', go: () => onOpenLesson(next.lesson.id) }
    : next.kind === 'mission'
      ? { title: next.title, sub: `${next.regionName} · guided project`, btn: 'Open the project', go: () => onOpenMission(next.missionId) }
      : { title: 'The chart is complete', sub: 'Every system grown', btn: 'View on the chart', go: () => onOpen('universe') };
  const deskDown = (e: PointerEvent<HTMLDivElement>) => {
    const t = e.target as Element;
    if (t === e.currentTarget || t.tagName.toLowerCase() === 'svg') onSelect(null);
  };
  return (
    <div className="desk" onPointerDown={deskDown}>
      <Wallpaper />

      <div className="dicons">
        {APPS.filter((a) => a.glyph).map((a) => (
          <button key={a.id} className={'dicon ' + (selIcon === a.id ? 'is-sel' : '')} aria-label={'Open ' + a.name}
            onClick={() => onSelect(a.id)} onDoubleClick={() => onOpen(a.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onOpen(a.id); } }}>
            <AppGlyph glyph={a.glyph!} big />
            <span className="lbl">{a.name}</span>
          </button>
        ))}
      </div>

      {/* pinned note: the next lesson on the learner's chart */}
      <div className="note">
        <span className="tape" aria-hidden="true"></span>
        <p className="mono" style={{ margin: '0 0 6px', fontSize: '11.5px', color: '#8a6000' }}>Next on your chart</p>
        <p className="disp" style={{ margin: '0 0 4px', fontSize: '21px', lineHeight: 1.15 }}>{note.title}</p>
        <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#63685c' }}>{note.sub}</p>
        <button className="btn moss" style={{ width: '100%' }} onClick={note.go}>{note.btn}</button>
      </div>
    </div>
  );
}
