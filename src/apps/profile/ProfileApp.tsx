import { useMemo, useState } from 'react';
import type { Learning } from '../../progression/useLearning';
import { buildProfile } from './model';
import { ProfileView } from './ProfileView';

export default function ProfileApp({ learning }: { learning: Pick<Learning, 'progress' | 'progression' | 'setPilotName'> }) {
  const vals = useMemo(() => buildProfile(learning.progress, learning.progression), [learning.progress, learning.progression]);
  const name = learning.progression.pilotName;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const initials = (name || 'Pilot').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
  const save = () => { learning.setPilotName(draft); setEditing(false); };

  const nameSlot = editing ? (
    <form onSubmit={(e) => { e.preventDefault(); save(); }} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <label className="vh" htmlFor="pilot-name">Pilot name</label>
      <input id="pilot-name" className="pf-name-in disp" value={draft} maxLength={40} autoFocus onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setDraft(name); setEditing(false); } }} />
      <button className="btn moss" type="submit">Save name</button>
    </form>
  ) : (
    <button className="pf-name disp" onClick={() => { setDraft(name); setEditing(true); }} aria-label={`Pilot name: ${name || 'not set'}. Edit`}>
      {name || 'Name your pilot'}<span className="pf-edit" aria-hidden="true">✎</span>
    </button>
  );
  return <ProfileView {...vals} initials={initials} nameSlot={nameSlot} />;
}
