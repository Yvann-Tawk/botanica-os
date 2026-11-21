import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TerraformOS from '../src/terraform/TerraformOS';
import { buildJournal } from '../src/terraform/journal';
import { hubShell } from '../src/terraform/Orbis';
import { DEFAULT_ORBIS, normalizeOrbis, resolvePlace } from '../src/terraform/prefs';
import { langLine, versionLine, WORLDS, worldById } from '../src/terraform/worlds';
import { memoryKV, type KV } from '../src/storage/db';
import { DEFAULT_SETTINGS, type Settings } from '../src/storage/settings';
import { initialShell } from '../src/shell/windowReducer';
import { EMPTY_PROGRESS, type Progress } from '../src/progression/progress';
import { EMPTY_PROGRESSION, type Progression } from '../src/progression/engine';
import { LESSONS } from '../src/content/curriculum';

describe('world registry', () => {
  it('opens Botanica and Lithic; the rest are previews with planned versions, never dates', () => {
    expect(WORLDS.map((w) => [w.id, w.status])).toEqual([['botanica', 'available'], ['lithic', 'available'], ['aether', 'soon'], ['ironworks', 'soon']]);
    expect(WORLDS.filter((w) => w.entry).map((w) => w.id)).toEqual(['botanica', 'lithic']);
    const versions = WORLDS.flatMap((w) => w.langs.map((l) => `${l.name} ${l.version}`));
    expect(versions).toEqual(['Python v1.0', 'HTML v2.0', 'DAX v3.0', 'Power Query M v4.0', 'JavaScript v5.0', 'CSS v6.0', 'C# v7.0', 'SQL v8.0']);
    for (const w of WORLDS) expect(versionLine(w)).not.toMatch(/20\d\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i);
  });

  it('formats the catalog and dossier lines', () => {
    expect(langLine(worldById('lithic'))).toBe('HTML · DAX · M');
    expect(langLine(worldById('aether'))).toBe('JS · CSS');
    expect(versionLine(worldById('botanica'))).toBe('v1.0 · open now');
    expect(versionLine(worldById('lithic'))).toBe('v2.0 · v3.0 · open now · M to follow');
    expect(versionLine(worldById('ironworks'))).toBe('planned · C# v7.0 · SQL v8.0');
  });
});

describe('launch place and Orbis preferences', () => {
  it('opens Orbis by default and Botanica for Botanica deep links', () => {
    expect(resolvePlace('', '')).toBe('orbis');
    expect(resolvePlace('', '#/botanica')).toBe('botanica');
    expect(resolvePlace('?start=terminal', '')).toBe('botanica');
    expect(resolvePlace('?demo=midway', '')).toBe('botanica');
  });

  it('fills defaults and drops invalid values', () => {
    expect(normalizeOrbis(undefined)).toEqual(DEFAULT_ORBIS);
    expect(normalizeOrbis({ showComp: 'no', world: 'mars', sway: false })).toEqual({ ...DEFAULT_ORBIS, sway: false });
    expect(normalizeOrbis({ world: 'aether' }).world).toBe('aether');
  });

  it('the hub shares the window manager, with its own app table', () => {
    let s = hubShell.initialShell('orbis');
    expect(s.focus).toBe('orbis');
    s = hubShell.shellReducer(s, { type: 'open', id: 'journal' });
    expect(s.focus).toBe('journal');
    s = hubShell.shellReducer(s, { type: 'resize', id: 'settings', w: 10, h: 10 });
    expect(s.wins.settings.w).toBe(420);
    expect(hubShell.fromLayout(hubShell.toLayout(s), hubShell.initialShell('desktop')).wins.journal.open).toBe(true);
  });
});

describe('journal', () => {
  it('starts empty for a new learner', () => {
    const j = buildJournal(EMPTY_PROGRESS, EMPTY_PROGRESSION);
    expect(j).toMatchObject({ xp: 0, lessonsDone: 0, lessonsTotal: LESSONS.length, missionsDone: 0, streak: 0, worldsOpen: 2, worldsTotal: 4, marks: [] });
    expect(j.level).toMatchObject({ n: 1, name: 'Spore Cadet' });
    expect(j.next.lessonId).toBe(LESSONS[0].id);
  });

  it('summarises real progress records', () => {
    const now = Date.parse('2026-11-15T12:00:00Z');
    const first = LESSONS[0];
    const p: Progress = { v: 1, completed: { [first.conceptId]: '2026-11-15T10:00:00Z' } };
    const g: Progression = { v: 1, pilotName: 'Ada', events: [
      { type: 'lesson', ref: first.id, at: '2026-11-15T10:00:00Z', xp: 150 },
      { type: 'lmission', ref: 'g01-l01-m1', at: '2026-11-15T10:10:00Z', xp: 15 },
      { type: 'lmission', ref: 'g01-l01-m1', at: '2026-11-15T10:11:00Z', xp: 0 },
      { type: 'achievement', ref: 'first-light', at: '2026-11-15T10:00:00Z', xp: 0 },
    ] };
    const j = buildJournal(p, g, now);
    expect(j).toMatchObject({ pilotName: 'Ada', xp: 165, lessonsDone: 1, missionsDone: 1, streak: 1 });
    expect(j.level).toMatchObject({ n: 2, toNext: 450 - 165 });
    expect(j.next).toMatchObject({ lessonId: LESSONS[1].id, done: 1 });
    expect(j.marks).toHaveLength(1);
    expect(j.marks[0].when).toBe('Botanica · 2 h ago');
  });
});

describe('Terraform OS shell', () => {
  beforeEach(() => history.replaceState(null, '', '/'));

  function setup(o: { settings?: Settings; kv?: KV; place?: 'orbis' | 'botanica' } = {}) {
    const user = userEvent.setup();
    const kv = o.kv ?? memoryKV();
    render(<TerraformOS kv={kv} place={o.place ?? 'orbis'} settings={o.settings ?? { ...DEFAULT_SETTINGS, motion: 'reduce' }} orbis={DEFAULT_ORBIS}
      botanica={{ shell: initialShell('desktop'), progress: EMPTY_PROGRESS, progression: EMPTY_PROGRESSION, demo: null }} />);
    return { user, kv };
  }

  it('launches into Orbis; sealed worlds never launch', async () => {
    const { user } = setup();
    const explorer = screen.getByLabelText('Orbis Explorer window');
    expect(explorer).toHaveClass('is-open');
    expect(screen.queryByRole('navigation', { name: 'Seed tray' })).toBeNull(); // Botanica is not even mounted yet
    await user.click(within(explorer).getByRole('button', { name: /Aether/ }));
    expect(within(explorer).getByRole('heading', { name: 'Aether' })).toBeInTheDocument();
    expect(within(explorer).getByRole('button', { name: 'Coming soon' })).toBeDisabled();
    expect(within(explorer).queryByRole('button', { name: /^Enter/ })).toBeNull();
    expect(within(explorer).getByText('planned · JavaScript v5.0 · CSS v6.0')).toBeInTheDocument();
  });

  it('Lithic is open: its dossier offers Enter, with HTML open and DAX/M to follow', async () => {
    const { user } = setup();
    const explorer = screen.getByLabelText('Orbis Explorer window');
    await user.click(within(explorer).getByRole('button', { name: /Lithic/ }));
    expect(within(explorer).getByRole('heading', { name: 'Lithic' })).toBeInTheDocument();
    expect(within(explorer).getByRole('button', { name: 'Enter Lithic' })).toBeEnabled();
    expect(within(explorer).getByText('v2.0 · v3.0 · open now · M to follow')).toBeInTheDocument();
  });

  it('enters the Lithic world (its Survey) and returns to Orbis', async () => {
    const { user } = setup();
    const explorer = screen.getByLabelText('Orbis Explorer window');
    await user.click(within(explorer).getByRole('button', { name: /Lithic/ }));
    await user.click(within(explorer).getByRole('button', { name: 'Enter Lithic' }));
    await screen.findByLabelText('Survey window');
    expect(location.hash).toBe('#/lithic');
    expect(screen.getByLabelText('Orbis Explorer window').closest('[hidden]')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Return to Orbis' }));
    await waitFor(() => expect(screen.getByLabelText('Orbis Explorer window').closest('[hidden]')).toBeNull());
    expect(location.hash).toBe('');
  });

  it('enters the real Botanica and returns to Orbis without losing anything', async () => {
    const { user } = setup();
    await user.click(within(screen.getByLabelText('Orbis Explorer window')).getByRole('button', { name: 'Enter Botanica' }));
    const tray = await screen.findByRole('navigation', { name: 'Seed tray' });
    expect(location.hash).toBe('#/botanica');
    expect(screen.getByLabelText('Orbis Explorer window').closest('[hidden]')).not.toBeNull(); // hidden while in Botanica
    await user.click(within(tray).getByLabelText('Open Missions'));
    await user.click(screen.getByRole('button', { name: 'Go' }));
    await user.click(screen.getByRole('menuitem', { name: /Return to Orbis/ }));
    await waitFor(() => expect(screen.getByLabelText('Orbis Explorer window').closest('[hidden]')).toBeNull());
    expect(location.hash).toBe('');
    expect(screen.getByLabelText('Missions window').closest('[hidden]')).not.toBeNull();
    // Botanica stayed mounted with its windows as they were
    await user.click(within(screen.getByRole('navigation', { name: 'Terraform dock' })).getByRole('button', { name: 'Open Botanica' }));
    await waitFor(() => expect(screen.getByLabelText('Missions window')).toHaveClass('is-open'));
  });

  it('settings are shared: Reduce motion in Orbis is the setting Botanica reads, and it is saved', async () => {
    const { user, kv } = setup({ settings: DEFAULT_SETTINGS });
    await user.click(screen.getByRole('button', { name: 'Go' }));
    await user.click(screen.getByRole('menuitem', { name: /Settings/ }));
    const toggle = within(screen.getByLabelText('Settings window')).getByRole('switch', { name: 'Reduce motion' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(document.querySelector('.orbis')).toHaveClass('rm');
    await waitFor(async () => expect((await kv.get<Settings>('settings'))?.motion).toBe('reduce'));
  });

  it('Orbis shortcuts only work in Orbis; Botanica keeps its own', async () => {
    const { user } = setup({ place: 'botanica' });
    await screen.findByRole('navigation', { name: 'Seed tray' });
    await user.keyboard('{Control>}3{/Control}'); // Botanica's ⌘3 = Terminal, not the Orbis Journal
    await waitFor(() => expect(screen.getByLabelText('Terminal window')).toHaveClass('is-open'));
    expect(screen.queryByLabelText('Journal window')).toBeNull(); // the hub is not even mounted on a Botanica deep link
  });

  it('Sprout says nothing unprompted', async () => {
    setup({ place: 'botanica' });
    const tray = await screen.findByRole('navigation', { name: 'Seed tray' });
    expect(within(tray).queryByRole('status')).toBeNull();
  });
});
