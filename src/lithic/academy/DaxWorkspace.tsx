// The DAX discipline workspace: a formula editor over a live result from the LIMITED DAX engine, plus the
// sample-model summary so learners know the data. The banner states plainly that this is a limited educational
// engine, not Power BI. Plugs into the generic Academy as a WorkspaceComponent.
import { useMemo } from 'react';
import { SimpleEditor } from '../../editor/CodeEditor';
import { evaluateDax } from '../runtime/dax/evaluate';
import { SALES_MODEL, MODEL_SUMMARY, type Cell } from '../runtime/dax/model';
import type { WorkspaceProps } from './LithicAcademy';

const fmt = (v: Cell | undefined) => typeof v === 'number' ? (Math.round(v * 10000) / 10000).toLocaleString('en') : JSON.stringify(v);

export function DaxWorkspace({ code, editable, onChange, onRun, canCheck, fileName, ariaLabel }: WorkspaceProps) {
  const result = useMemo(() => evaluateDax(code, SALES_MODEL), [code]);
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
        <div className="con-bar"><span>Result — limited DAX engine (educational, not Power BI)</span></div>
        <div className="con-body scroll-d">
          {code.trim()
            ? result.ok
              ? <div className="con-ln mono" style={{ color: '#bcd8be', fontSize: 15 }}>= {fmt(result.value)}</div>
              : <div className="con-tip">{result.error}</div>
            : <div className="con-ln" style={{ color: '#8e9584' }}>Write a measure to see its value.</div>}
          <pre className="con-ln mono" style={{ marginTop: 12, color: '#8e9584', fontSize: 11.5, whiteSpace: 'pre-wrap' }}>{MODEL_SUMMARY}</pre>
        </div>
      </div>
    </div>
  );
}
