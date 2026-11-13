import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { MenuKey } from './windowReducer';

export interface MenuItem { label: string; hint: string; run: () => void; sep?: boolean }

interface Props {
  focusName: string;
  menu: MenuKey | null;
  setMenu: (m: MenuKey | null) => void;
  menus: Record<MenuKey, MenuItem[]>;
  streak: string;
  xpText: string;
  xpCls?: string;
  onActivity: () => void;
}

const LEFT: Record<MenuKey, number> = { go: 100, win: 150, help: 222 };

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[now.getDay()] + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

export function MenuBar({ focusName, menu, setMenu, menus, streak, xpText, xpCls = '', onActivity }: Props) {
  const clock = useClock();
  const triggers = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const toggle = (k: MenuKey) => () => { onActivity(); setMenu(menu === k ? null : k); };
  const cls = (k: MenuKey) => 'mitem' + (menu === k ? ' is-on' : '');
  const close = (refocus: boolean) => { const k = menu; setMenu(null); if (refocus && k) triggers.current[k]?.focus(); };

  return (
    <>
      <div className="mbar">
        <button className="mitem" aria-label="Botanica menu" aria-haspopup="menu" onClick={toggle('go')}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><ellipse cx="10" cy="11" rx="9" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-18 10 11)"></ellipse><circle cx="10" cy="11" r="4.6" fill="#3e6510" stroke="currentColor" strokeWidth="1.5"></circle><path d="M10 6.4 C 10 4, 11 2.6, 13 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"></path></svg>
          <span className="disp" style={{ fontSize: '15px' }}>Botanica</span>
        </button>
        <span className="mitem app">{focusName}</span>
        {(['go', 'win', 'help'] as MenuKey[]).map((k) => (
          <button key={k} ref={(el) => { triggers.current[k] = el; }} className={cls(k)} onClick={toggle(k)} aria-haspopup="menu" aria-expanded={menu === k}>
            {k === 'go' ? 'Go' : k === 'win' ? 'Window' : 'Help'}
          </button>
        ))}
        <div className="mright">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Learning streak">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 V 8" stroke="#345a04" strokeWidth="1.6"></path><circle cx="8" cy="5" r="2.2" fill="#c95851"></circle><circle cx="11" cy="6.8" r="2.2" fill="#c95851"></circle><circle cx="5" cy="6.8" r="2.2" fill="#c95851"></circle><circle cx="8" cy="5.9" r="1.4" fill="#f3c766"></circle></svg>
            {streak}
          </span>
          <span className={'xp-pill ' + xpCls} key={xpCls}><svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true"><path d="M0 -6 L 1.4 -1.4 L 6 0 L 1.4 1.4 L 0 6 L -1.4 1.4 L -6 0 L -1.4 -1.4 Z" fill="#b47e00"></path></svg>{xpText} XP</span>
          <span className="mono" style={{ fontSize: '12.5px' }}>{clock}</span>
        </div>
      </div>
      {menu && <button className="scrim" aria-label="Close menu" tabIndex={-1} onClick={() => close(false)}></button>}
      {menu && <Menu items={menus[menu]} left={LEFT[menu]} label={menu} onClose={close} />}
    </>
  );
}

function Menu({ items, left, label, onClose }: { items: MenuItem[]; left: number; label: string; onClose: (refocus: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.querySelector<HTMLButtonElement>('button')?.focus(); }, []);
  const onKey = (e: KeyboardEvent) => {
    const btns = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); btns[(i + 1) % btns.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); btns[(i - 1 + btns.length) % btns.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); btns[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); btns[btns.length - 1]?.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(true); }
    else if (e.key === 'Tab') onClose(false);
  };
  return (
    <div className="menu" role="menu" aria-label={label} style={{ left: `${left}px` }} ref={ref} onKeyDown={onKey}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'contents' }}>
          {it.sep && <hr />}
          <button role="menuitem" onClick={it.run}><span>{it.label}</span><span className="k">{it.hint}</span></button>
        </div>
      ))}
    </div>
  );
}
