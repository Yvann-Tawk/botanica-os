// Lesson recap: what you learned, a syntax cheat sheet, common mistakes, a self-check and next steps.
import { useState } from 'react';
import { hlBlock } from '../../editor/highlight';
import type { Lesson } from '../../content/lessons/types';
import { Rich } from './rich';

interface Props {
  lesson: Lesson;
  continueLabel: string;
  onContinue: () => void;
  onMissions: () => void;
  missionsDone: number;
}

export function RecapView({ lesson, continueLabel, onContinue, onMissions, missionsDone }: Props) {
  const r = lesson.recap;
  // Self-assessment only: answers are not stored and never affect progress.
  const [picked, setPicked] = useState<Record<number, number>>({});
  return <>
    <h2 className="h2">The short version.</h2>
    <p className="lede"><b>{lesson.title}</b> is complete. Here is what to carry with you, on one page you can come back to any time.</p>

    <h3 className="h3">What you learned</h3>
    <ul className="checks rc-list" style={{ marginTop: 0 }}>
      {r.takeaways.map((t) => (
        <li key={t}><span className="ck ok"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2 L 5 8.5 L 9.5 3.5" fill="none" stroke="#f6f2e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span><Rich text={t} /></span></li>
      ))}
    </ul>

    <h3 className="h3">Syntax cheat sheet</h3>
    {r.syntaxExamples.map((ex) => (
      <figure className="rc-syntax" key={ex.label}>
        <figcaption><Rich text={ex.label} /></figcaption>
        <div className="codeblock mono">{hlBlock(ex.code.replace(/\n+$/, '')).map((ln) => <div className="ed-ln" key={ln.n}>{ln.toks.map((tk, i) => <span key={i} style={{ color: tk.c }}>{tk.t}</span>)}</div>)}</div>
      </figure>
    ))}
    <p className="ac-honest" style={{ marginTop: '4px' }}>Every snippet runs as it is: paste one into the editor on the right and press Run.</p>

    <h3 className="h3">Common mistakes</h3>
    {r.commonMistakes.map((m) => (
      <div className="qcard rc-mistake" key={m.mistake}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}><Rich text={m.mistake} /></p>
        <p style={{ margin: '6px 0 0', fontSize: '14px' }}><b>Why it happens.</b> <Rich text={m.why} /></p>
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#345a04' }}><b>How to avoid it.</b> <Rich text={m.fix} /></p>
      </div>
    ))}

    <h3 className="h3">Knowledge check <small className="rc-opt">for you only · not scored</small></h3>
    {r.knowledgeChecks.map((q, i) => {
      const sel = picked[i], answered = sel != null, right = sel === q.a;
      return (
        <div className="qcard" key={i}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }} id={`rc-${lesson.id}-${i}`}>{i + 1}. {q.q}</p>
          <div className="qopts" role="radiogroup" aria-labelledby={`rc-${lesson.id}-${i}`}>
            {q.opts.map((o, j) => (
              <button key={j} className={'qopt ' + (sel === j ? (right ? 'is-right' : 'is-wrong') : '')} role="radio" aria-checked={sel === j}
                onClick={() => setPicked((p) => ({ ...p, [i]: j }))}><span className="qdot"></span>{o}</button>
            ))}
          </div>
          {answered && <p role="status" style={{ margin: '10px 0 0', fontSize: '13.5px', color: right ? '#345a04' : '#a8423c' }}><b>{right ? 'Correct.' : 'Not quite.'}</b> {q.why}</p>}
        </div>
      );
    })}

    <h3 className="h3">Next steps</h3>
    <div className="rc-next">
      <div className="task">
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Continue learning</p>
        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#63685c' }}>{continueLabel}.</p>
        <button className="btn moss" onClick={onContinue}>Continue learning</button>
      </div>
      <div className="task">
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Explore missions <span className="rc-opt">optional</span></p>
        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#63685c' }}>Three extra challenges for this lesson. {missionsDone} of 3 completed.</p>
        <button className="btn" onClick={onMissions}>Explore missions</button>
      </div>
    </div>
  </>;
}
