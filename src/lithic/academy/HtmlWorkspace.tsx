// The HTML discipline workspace: an editor over a sandboxed live preview. Plugs into the generic Academy as a
// WorkspaceComponent.
import { SimpleEditor } from '../../editor/CodeEditor';
import { HtmlPreview } from '../runtime/HtmlPreview';
import type { WorkspaceProps } from './LithicAcademy';

export function HtmlWorkspace({ code, editable, onChange, onRun, canCheck, fileName, ariaLabel }: WorkspaceProps) {
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
      <div className="con" style={{ height: '46%' }}>
        <div className="con-bar"><span>Live preview — sandboxed</span></div>
        <div className="con-body" style={{ padding: 0, background: '#fff' }}>
          <HtmlPreview html={code} />
        </div>
      </div>
    </div>
  );
}
