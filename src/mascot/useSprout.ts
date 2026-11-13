import { useCallback, useEffect, useRef, useState } from 'react';
import type { Mood } from './sproutSprite';

export const PETS = ['Hehe. Scales are one hundred percent organic.', 'That tickles. Run some code, I dare you.', 'Mrrp. That is the snake version of purring.', 'Okay, okay. I am fully petted. Go learn something.'];
export const IDLE_SLEEP_MS = 40000;

/** Sprout's mood + speech bubble, with the prototype's timings (bubble ≥4.5s, nap after 40s idle). */
export function useSprout(initialBubble: string | null, chatty: boolean) {
  const [mood, setMood] = useState<Mood>('idle');
  const [bubble, setBubble] = useState<string | null>(chatty ? initialBubble : null);
  const pets = useRef(0);
  const lastAct = useRef(Date.now());
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const moodRef = useRef(mood);
  moodRef.current = mood;

  const later = useCallback((key: string, fn: () => void, ms: number) => {
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(fn, ms);
  }, []);

  /** force: speak even when Sprout is set to quiet (direct interactions). */
  const say = useCallback((text: string, m?: Mood, ms = 0, force = false) => {
    if (!chatty && !force) return;
    setBubble(text);
    if (m) setMood(m);
    later('bubble', () => setBubble(null), Math.max(4500, ms + 1500));
    if (m && m !== 'idle') later('mood', () => setMood('idle'), ms || 2400);
  }, [chatty, later]);

  const poke = useCallback(() => {
    lastAct.current = Date.now();
    if (moodRef.current === 'sleeping') setMood('idle');
  }, []);

  const pet = useCallback(() => {
    pets.current += 1;
    lastAct.current = Date.now();
    say(PETS[Math.min(pets.current - 1, PETS.length - 1)], 'petted', 1800, true);
  }, [say]);

  useEffect(() => {
    const t = timers.current;
    if (initialBubble && chatty) later('bubble', () => setBubble(null), 7000);
    const idle = setInterval(() => {
      if (Date.now() - lastAct.current > IDLE_SLEEP_MS && moodRef.current === 'idle') { setMood('sleeping'); setBubble(null); }
    }, 5000);
    return () => { clearInterval(idle); Object.values(t).forEach(clearTimeout); };
  }, []);

  return { mood, bubble, say, poke, pet };
}
