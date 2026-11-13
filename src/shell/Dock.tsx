import { AppGlyph } from '../art/AppGlyph';
import { APPS, type AppId } from '../content/apps';
import { SproutArt } from '../mascot/SproutArt';
import type { SproutSprite } from '../mascot/sproutSprite';
import type { WinState } from './windowReducer';

interface Props {
  wins: Record<AppId, WinState>;
  focus: AppId | null;
  onIcon: (id: AppId) => void;
  sprite: SproutSprite;
  bubble: string | null;
  onPet: () => void;
  z: number;
}

export function Dock({ wins, focus, onIcon, sprite, bubble, onPet, z }: Props) {
  return (
    <nav className="dock" aria-label="Seed tray" style={{ zIndex: z }}>
      {APPS.filter((a) => a.glyph).map((a) => (
        <button key={a.id} className="dk" data-dock={a.id} onClick={() => onIcon(a.id)}
          aria-label={(wins[a.id].open && !wins[a.id].min && focus === a.id ? 'Minimize ' : 'Open ') + a.name}>
          <AppGlyph glyph={a.glyph!} big={false} />
          <span className="tip">{a.longName}</span>
          {wins[a.id].open && <span className="run"></span>}
        </button>
      ))}
      <span className="dsep" aria-hidden="true"></span>
      <div className="pot">
        <button className="sprout-btn" onClick={onPet} aria-label="Pet Sprout, your companion">
          <SproutArt s={sprite} />
        </button>
        {bubble && <div className="bubble" role="status"><span className="who">Sprout</span>{bubble}</div>}
      </div>
    </nav>
  );
}
