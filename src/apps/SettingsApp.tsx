import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { cachePython, pythonCached } from '../pwa';
import { APPS } from '../content/apps';
import type { Settings } from '../storage/settings';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  storageKind: string;
  onResetLayout: () => void;
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
}

const STORAGE_LABEL: Record<string, string> = {
  indexeddb: 'Saved on this device (IndexedDB).',
  localstorage: 'Saved on this device (local storage fallback).',
  memory: 'Your browser blocked storage. Changes last until you close this tab.',
};

export default function SettingsApp({ settings, onChange, storageKind, onResetLayout, onExport, onImport }: Props) {
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [pyOffline, setPyOffline] = useState<'unknown' | 'yes' | 'no' | 'busy'>('unknown');
  useEffect(() => { pythonCached().then((ok) => setPyOffline(ok ? 'yes' : 'no')); }, []);
  const makeOffline = async () => {
    setPyOffline('busy');
    try { await cachePython(); setPyOffline('yes'); } catch (e) { setPyOffline('no'); setMsg((e as Error).message); }
  };
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => onChange({ ...settings, [k]: v });
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    try { await onImport(f); setMsg('Backup restored.'); } catch (err) { setMsg((err as Error).message); }
  };

  return (
    <div className="wbody scroll settings" style={{ padding: '22px 24px' }} tabIndex={0} role="region" aria-label="Settings">
      <p className="disp" style={{ margin: '0 0 4px', fontSize: '24px' }}>Ship systems</p>
      <p style={{ margin: '0 0 6px', fontSize: '14px', color: '#63685c' }}>{STORAGE_LABEL[storageKind]}</p>

      <fieldset className="set-group">
        <legend className="h3">Motion</legend>
        <label className="set-row"><input type="radio" name="motion" checked={settings.motion === 'system'} onChange={() => set('motion', 'system')} /> Follow my system setting</label>
        <label className="set-row"><input type="radio" name="motion" checked={settings.motion === 'reduce'} onChange={() => set('motion', 'reduce')} /> Always reduce motion</label>
      </fieldset>

      <fieldset className="set-group">
        <legend className="h3">On launch</legend>
        <label className="set-row" htmlFor="set-start">Open</label>
        <select id="set-start" className="set-select" value={settings.openOnStart}
          onChange={(e) => set('openOnStart', e.target.value as Settings['openOnStart'])}>
          <option value="restore">Where I left off</option>
          <option value="desktop">Just the desktop</option>
          {APPS.filter((a) => a.id !== 'settings').map((a) => <option key={a.id} value={a.id}>{a.longName}</option>)}
        </select>
      </fieldset>

      <fieldset className="set-group">
        <legend className="h3">Sprout</legend>
        <label className="set-row"><input type="checkbox" checked={settings.sproutChatty} onChange={(e) => set('sproutChatty', e.target.checked)} /> Let Sprout react to milestones (lessons, level-ups) on its own</label>
      </fieldset>

      <fieldset className="set-group">
        <legend className="h3">Code editor</legend>
        <label className="set-row"><input type="radio" name="editor" checked={settings.editor === 'auto'} onChange={() => set('editor', 'auto')} /> Full editor on wide screens (Monaco)</label>
        <label className="set-row"><input type="radio" name="editor" checked={settings.editor === 'simple'} onChange={() => set('editor', 'simple')} /> Simple editor everywhere (lighter, plain text area)</label>
      </fieldset>

      <fieldset className="set-group">
        <legend className="h3">Offline</legend>
        <p className="set-row" style={{ cursor: 'default' }}>
          {pyOffline === 'yes' ? 'Python is stored on this device. Lessons, missions and the Terminal work offline.'
            : pyOffline === 'busy' ? 'Downloading Python (about 10 MB)…'
            : 'The app itself opens offline. Python (about 10 MB) is stored the first time it runs, or now:'}
        </p>
        {pyOffline !== 'yes' && <button className="btn" onClick={makeOffline} disabled={pyOffline === 'busy'}>Make Python available offline</button>}
      </fieldset>

      <fieldset className="set-group">
        <legend className="h3">Windows &amp; data</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button className="btn" onClick={onResetLayout}>Reset window layout</button>
          <button className="btn" onClick={() => { onExport().catch((e) => setMsg((e as Error).message)); }}>Download backup</button>
          <button className="btn" onClick={() => file.current?.click()}>Restore backup…</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={pick} aria-label="Backup file" />
        </div>
        {msg && <p role="status" style={{ margin: '10px 0 0', fontSize: '13.5px' }}>{msg}</p>}
      </fieldset>
    </div>
  );
}
