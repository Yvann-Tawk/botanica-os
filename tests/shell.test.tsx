import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { memoryKV, type KV } from '../src/storage/db';
import { DEFAULT_SETTINGS } from '../src/storage/settings';
import { initialShell } from '../src/shell/windowReducer';
import { EMPTY_PROGRESS } from '../src/progression/progress';

function setup(start: Parameters<typeof initialShell>[0] = 'desktop', kv: KV = memoryKV()) {
  const user = userEvent.setup();
  render(<App kv={kv} initialSettings={DEFAULT_SETTINGS} initialShell={initialShell(start)} initialProgress={EMPTY_PROGRESS} />);
  return { user, kv };
}
const win = (label: string) => screen.getByLabelText(`${label} window`);
const isOpen = (label: string) => win(label).classList.contains('is-open');

describe('shell', () => {
  it('double-clicking a desktop icon opens its window', async () => {
    const { user } = setup();
    expect(isOpen('Workshop')).toBe(false);
    await user.dblClick(within(document.querySelector('.dicons')!).getByLabelText('Open Workshop'));
    expect(isOpen('Workshop')).toBe(true);
    expect(await within(win('Workshop')).findByText('The potting bench')).toBeInTheDocument();
  });

  it('Enter on a focused desktop icon opens it', async () => {
    const { user } = setup();
    within(document.querySelector('.dicons')!).getByLabelText('Open Missions').focus();
    await user.keyboard('{Enter}');
    expect(isOpen('Missions')).toBe(true);
  });

  it('dock button minimizes the focused window and restores it', async () => {
    const { user } = setup('universe');
    const dock = screen.getByRole('navigation', { name: 'Seed tray' });
    await user.click(within(dock).getByLabelText('Minimize Universe'));
    expect(isOpen('Universe')).toBe(false);
    await user.click(within(dock).getByLabelText('Open Universe'));
    expect(isOpen('Universe')).toBe(true);
  });

  it('title bar buttons close and maximize', async () => {
    const { user } = setup('academy');
    await user.click(screen.getByLabelText('Maximize Academy'));
    expect(win('Academy').classList.contains('is-max')).toBe(true);
    await user.click(screen.getByLabelText('Close Academy'));
    expect(isOpen('Academy')).toBe(false);
  });

  it('menus open, move with arrow keys, and close on Escape with focus back on the trigger', async () => {
    const { user } = setup();
    const trigger = screen.getByRole('button', { name: 'Go' });
    await user.click(trigger);
    const menu = screen.getByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('Go menu opens Settings, and settings persist', async () => {
    const { user, kv } = setup();
    await user.click(screen.getByRole('button', { name: 'Go' }));
    await user.click(screen.getByRole('menuitem', { name: /Settings/ }));
    expect(isOpen('Settings')).toBe(true);
    await user.click(await screen.findByLabelText('Always reduce motion'));
    expect(document.querySelector('.os')).toHaveClass('rm');
    expect(await kv.get('settings')).toMatchObject({ motion: 'reduce' });
  });

  it('Ctrl+number opens apps', async () => {
    const { user } = setup();
    await user.keyboard('{Control>}2{/Control}');
    expect(isOpen('Academy')).toBe(true);
  });

  it('saves the window layout', async () => {
    const { user, kv } = setup();
    await user.dblClick(within(document.querySelector('.dicons')!).getByLabelText('Open Workshop'));
    await waitFor(async () => expect(await kv.get('layout')).toMatchObject({ focus: 'workshop' }));
  });

  it('shows no fake progress: 0 XP and no streak', () => {
    setup();
    expect(screen.getByText(/0 XP/)).toBeInTheDocument();
    expect(screen.getByText('0-day streak')).toBeInTheDocument();
  });

  it('Sprout answers a pet', async () => {
    const { user } = setup();
    await user.click(screen.getByLabelText('Pet Sprout, your companion'));
    expect(screen.getByRole('status')).toHaveTextContent(/Scales are one hundred percent organic/);
  });

  it('Sprout naps after 40 seconds idle', () => {
    vi.useFakeTimers();
    try {
      render(<App kv={memoryKV()} initialSettings={DEFAULT_SETTINGS} initialShell={initialShell('desktop')} initialProgress={EMPTY_PROGRESS} />);
      act(() => { vi.advanceTimersByTime(46000); });
      expect(document.querySelector('.sp-sleep')).not.toBeNull();
    } finally { vi.useRealTimers(); }
  });
});

describe('universe', () => {
  it('a planet opens its specimen sheet and routes a lesson to the Academy', async () => {
    const { user } = setup('universe');
    await user.click(await screen.findByRole('button', { name: /^Origins, Fundamentals/ }));
    const sheet = screen.getByRole('complementary', { name: 'Specimen sheet' });
    await user.click(within(sheet).getByRole('button', { name: 'Begin: Hello, Python!' }));
    expect(isOpen('Academy')).toBe(true);
    expect(await within(win('Academy')).findByText('Hello, Python!')).toBeInTheDocument();
  });

  it('Escape closes the specimen sheet', async () => {
    const { user } = setup('universe');
    await user.click(await screen.findByRole('button', { name: /^Origins, Fundamentals/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('complementary', { name: 'Specimen sheet' })).toBeNull();
  });

  it('sealed concepts are disabled', async () => {
    const { user } = setup('universe');
    await user.click(await screen.findByRole('button', { name: /^The Flow, Control flow/ }));
    expect(screen.getByRole('button', { name: /if, elif, else, sealed/ })).toBeDisabled();
  });
});

describe('terminal', () => {
  it('runs the open file through Python and shows the output', async () => {
    const { PythonRuntime, setRuntime } = await import('../src/runtime/PythonRuntime');
    const { fakeFactory } = await import('./fakeWorker');
    setRuntime(new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false }));
    try {
      const { user } = setup('terminal');
      const run = await within(win('Terminal')).findByRole('button', { name: /^Run/ });
      await user.click(run);
      const log = within(win('Terminal')).getByRole('log');
      await within(log).findByText('ok');
      expect(within(log).getByText('› finished without errors')).toBeInTheDocument();
      expect(within(win('Terminal')).getByText(/Pyodide 0\.27\.8/)).toBeInTheDocument();
    } finally { setRuntime(null); }
  });

  it('shows Sprout’s tip for an error from the >>> line', async () => {
    const { PythonRuntime, setRuntime } = await import('../src/runtime/PythonRuntime');
    const { fakeFactory } = await import('./fakeWorker');
    setRuntime(new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false }));
    try {
      const { user } = setup('terminal');
      const prompt = await within(win('Terminal')).findByLabelText('Python prompt');
      await user.type(prompt, 'boom{Enter}');
      expect(await within(win('Terminal')).findByText(/never seen that name/)).toBeInTheDocument();
    } finally { setRuntime(null); }
  });
});

describe('academy', () => {
  async function withFakePython(fn: () => Promise<void>) {
    const { PythonRuntime, setRuntime } = await import('../src/runtime/PythonRuntime');
    const { fakeFactory } = await import('./fakeWorker');
    setRuntime(new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false }));
    try { await fn(); } finally { setRuntime(null); }
  }

  it('opening and reading a lesson does not complete it', async () => withFakePython(async () => {
    const { user, kv } = setup('academy');
    const w = win('Academy');
    expect(await within(w).findByRole('heading', { name: 'Hello, Python!' })).toBeInTheDocument();
    for (let i = 0; i < 4; i++) await user.click(within(w).getByRole('button', { name: /^Next:/ }));
    expect(within(w).getByRole('button', { name: /Finish the checks/ })).toBeDisabled();
    expect(await kv.get('progress')).toBeUndefined();
  }));

  it('passing practice, challenge and the quiz completes the lesson, celebrates, and saves progress', async () => withFakePython(async () => {
    const { user, kv } = setup('academy');
    const w = win('Academy');
    await within(w).findByRole('heading', { name: 'Hello, Python!' });
    const editor = () => within(w).getByLabelText(/Python code editor for the lesson/);

    await user.click(within(w).getByRole('button', { name: /Stage 3: Practice/ }));
    await user.click(within(w).getByRole('button', { name: 'Check my work' }));
    expect(await within(w).findAllByText('(not yet)')).toHaveLength(2);
    fireEvent.change(editor(), { target: { value: 'print("PASS")' } });
    await user.click(within(w).getByRole('button', { name: 'Check my work' }));
    expect(await within(w).findByText('Logged')).toBeInTheDocument();

    await user.click(within(w).getByRole('button', { name: /Stage 4: Challenge/ }));
    fireEvent.change(editor(), { target: { value: '# PASS' } });
    await user.click(within(w).getByRole('button', { name: 'Check my fix' }));
    expect(await within(w).findByText('Repaired')).toBeInTheDocument();

    await user.click(within(w).getByRole('button', { name: /Stage 5: Master/ }));
    await user.click(within(w).getByRole('radio', { name: '2 + 3' }));
    await user.click(within(w).getByRole('radio', { name: '# check the fuel' }));
    await user.click(within(w).getByRole('radio', { name: /case-sensitive/ }));
    await user.click(within(w).getByRole('button', { name: 'Submit to the archive' }));

    expect(await screen.findByRole('dialog', { name: 'Origins stirs.' })).toBeInTheDocument();
    expect(await kv.get('progress')).toMatchObject({ completed: { 'origins.hello': expect.any(String) } });
    // practice 40 + challenge 60 + quiz 30 + lesson 100 + first run 10
    expect(screen.getByText(/240 XP/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Keep exploring' }));
    expect(within(w).getByRole('button', { name: 'Next lesson: Variables' })).toBeEnabled();
  }));

  it('hints are revealed one at a time', async () => withFakePython(async () => {
    const { user } = setup('academy');
    const w = win('Academy');
    await within(w).findByRole('heading', { name: 'Hello, Python!' });
    await user.click(within(w).getByRole('button', { name: /Stage 3: Practice/ }));
    await user.click(within(w).getByRole('button', { name: 'Show a hint' }));
    expect(within(w).getByText('Hint 1.')).toBeInTheDocument();
    expect(within(w).queryByText('Hint 2.')).toBeNull();
    expect(within(w).getByRole('button', { name: 'Show hint 2 of 3' })).toBeInTheDocument();
  }));
});

describe('missions and logbook', () => {
  async function withFakePython(fn: () => Promise<void>) {
    const { PythonRuntime, setRuntime } = await import('../src/runtime/PythonRuntime');
    const { fakeFactory } = await import('./fakeWorker');
    setRuntime(new PythonRuntime({ createWorker: fakeFactory, indexURL: '/py/', isolated: false }));
    try { await fn(); } finally { setRuntime(null); }
  }
  const render2 = (progress = EMPTY_PROGRESS, start: Parameters<typeof initialShell>[0] = 'missions') => {
    const user = userEvent.setup(), kv = memoryKV();
    render(<App kv={kv} initialSettings={DEFAULT_SETTINGS} initialShell={initialShell(start)} initialProgress={progress} />);
    return { user, kv };
  };

  it('a locked mission says what is missing and links to the lesson', async () => withFakePython(async () => {
    const { user } = render2();
    const w = win('Missions');
    await user.click(await within(w).findByRole('button', { name: /Label the Specimen/ }));
    expect(within(w).getByText(/Still to do: Data types/)).toBeInTheDocument();
    await user.click(within(w).getByRole('button', { name: 'Open Data types' }));
    expect(isOpen('Academy')).toBe(true);
  }));

  it('completing a mission pays XP once and earns its patch', async () => withFakePython(async () => {
    const { user, kv } = render2({ v: 1, completed: { 'origins.hello': '2026-01-01T00:00:00Z' } });
    const w = win('Missions');
    await within(w).findByRole('heading', { name: 'Hello, Hortensia' });
    fireEvent.change(within(w).getByLabelText(/code editor for the mission/), { target: { value: 'print("PASS")' } });
    await user.click(within(w).getByRole('button', { name: 'Run archive checks' }));
    expect(await screen.findByText(/Patch earned: Specimen Clerk/)).toBeInTheDocument();
    expect(screen.getByText(/290 XP/)).toBeInTheDocument(); // 50 mission + 10 first run + 230 backfilled for Lesson 1
    await user.click(within(w).getByRole('button', { name: 'Run archive checks' }));
    await waitFor(async () => expect(((await kv.get('progression')) as { events: { type: string }[] }).events.filter((e) => e.type === 'mission')).toHaveLength(1));
    expect(screen.getByText(/290 XP/)).toBeInTheDocument();
  }));

  it('the logbook shows real data and the pilot can be named', async () => {
    const { user, kv } = render2(EMPTY_PROGRESS, 'profile');
    const w = win('Pilot logbook');
    expect(await within(w).findByText('0 of 48 complete · 0 mastered')).toBeInTheDocument();
    expect(within(w).getByText('0 of 8')).toBeInTheDocument();
    await user.click(within(w).getByRole('button', { name: /Pilot name: not set/ }));
    await user.type(within(w).getByLabelText('Pilot name'), 'Ada Lovelace{Enter}');
    expect(within(w).getByText('AL')).toBeInTheDocument();
    await waitFor(async () => expect(await kv.get('progression')).toMatchObject({ pilotName: 'Ada Lovelace' }));
  });
});
