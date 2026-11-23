// The Power Query M discipline workspace: an M editor over a live result from the LIMITED engine, plus the
// sample-query summary. The banner states plainly that this is a limited educational engine, not Power Query.
import { useMemo } from 'react';
import { SimpleEditor } from '../../editor/CodeEditor';
import { evaluateM } from '../runtime/m/evaluate';
import { MODEL_SUMMARY } from '../runtime/m/model';
import type { WorkspaceProps } from './LithicAcademy';

export function MWorkspace({ code, editable, onChange, onRun, canCheck, fileName, ariaLabel }: WorkspaceProps) {
  const result = useMemo(() => evaluateM(code), [code]);
  return (
    <div className="ed">
      <div className="ed-bar">
        <div className="ed-tab mono">{fileName}</div>
        <div className="ed-actions">
          {canCheck && <button className="btn-run" onClick={onRun}>Check <span className="kbd">⌘↵</span></button>}
        </div>
      </div>
      {editable
        ? <SimpleEditor value={code} onChange={onChange} onRun={onRun} ariaLabel={ariaLabel} mode="simple" />
        : <div className="ed-scroll scroll-d" style={{ padding: 0 }}><div className="ed-hl mono" style={{ padding: '14px 16px' }}>{code}</div></div>}
      <div className="con" style={{ height: '48%' }}>
        <div className="con-bar"><span>Result — limited M engine (educational, not Power Query)</span></div>
        <div className="con-body scroll-d">
          {code.trim()
            ? result.ok
              ? <div className="con-ln mono" style={{ color: '#bcd8be', fontSize: 14.5, whiteSpace: 'pre-wrap' }}>{result.display}</div>
              : <div className="con-tip">{result.error}</div>
            : <div className="con-ln" style={{ color: '#8e9584' }}>Write an expression to see its result.</div>}
          <pre className="con-ln mono" style={{ marginTop: 12, color: '#8e9584', fontSize: 11.5, whiteSpace: 'pre-wrap' }}>{MODEL_SUMMARY}</pre>
        </div>
      </div>
    </div>
  );
}
