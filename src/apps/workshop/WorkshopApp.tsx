// Workshop: the prototype's potting bench. The Origins project is the first open bench; later benches open as
// their systems are fully grown (their content arrives with those galaxies).
import { REGIONS } from '../../content/curriculum';
import { regionStatus, type Progress } from '../../progression/progress';

interface Bench { name: string; needs: string; desc: string; region: number; missionId?: string }
const BENCHES: Bench[] = [
  { name: 'The Seed Vault', needs: 'Needs · Origins lessons', desc: 'A gate program built in four milestones: input, arithmetic and a decision. Your first real project.', region: -1, missionId: 'vault' },
  { name: 'Plant-care reminder', needs: 'Needs · The Flow', desc: 'A tiny command-line tool that reads watering dates and tells you what is thirsty today.', region: 1 },
  { name: 'Seed catalogue', needs: 'Needs · The Archives', desc: 'Store every specimen in a dictionary, then search and sort them by trait.', region: 2 },
  { name: 'Weather journal', needs: 'Needs · The Network', desc: 'Fetch a real forecast from an API each morning and log it to a JSON file.', region: 5 },
];

export default function WorkshopApp({ progress, onOpenMission }: { progress: Progress; onOpenMission: (id: string) => void }) {
  const st = regionStatus(progress);
  const lessonsDone = REGIONS[0].concepts.slice(0, 5).every((c) => progress.completed[c.id]);
  return (
    <div className="wbody scroll" style={{ padding: '22px 24px' }} tabIndex={0} role="region" aria-label="Workshop benches">
      <p className="disp" style={{ margin: '0 0 4px', fontSize: '24px' }}>The potting bench</p>
      <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#63685c', maxWidth: '52ch' }}>Workshop projects turn concepts into small tools you keep. Each bench opens when the systems it needs are grown.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))', gap: '14px' }}>
        {BENCHES.map((b) => {
          const done = b.missionId === 'vault' && !!progress.completed['origins.project'];
          const open = b.region < 0 ? lessonsDone : st[b.region].mastered;
          const playable = open && !!b.missionId;
          const state = done ? 'Complete' : playable ? 'Open' : open ? 'Bench being built' : 'Sealed';
          return (
            <div key={b.name} style={{ padding: '14px', border: '1.5px solid #242820', borderRadius: '12px', background: playable || done ? '#ffffff' : '#eae4d5', display: 'flex', flexDirection: 'column' }}>
              <p className="mono" style={{ margin: '0 0 6px', fontSize: '11.5px', color: '#63685c' }}>{b.needs}</p>
              <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '15px' }}>{b.name}</p>
              <p style={{ margin: '0 0 10px', fontSize: '13px', lineHeight: 1.45, flex: 1 }}>{b.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: done || playable ? '#345a04' : '#63685c' }}>{state}</span>
                {playable && <button className="hintbtn" onClick={() => onOpenMission(b.missionId!)}>{done ? 'Revisit' : 'Open bench'}</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
