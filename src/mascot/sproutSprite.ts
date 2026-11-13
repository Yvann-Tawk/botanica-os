// Sprout's visual flags per mood and evolution stage (port of the prototype's snake()).

export type Mood = 'idle' | 'happy' | 'confused' | 'celebrating' | 'error' | 'petted' | 'sleeping';
export type Stage = 'hatchling' | 'sprout' | 'vine' | 'canopy';

export interface SproutSprite {
  anim: string; headCls: string; blink: string; bodyC: string; snoutC: string;
  dEgg: string; dVine: string; dCrown: string; dOpen: string; dClosed: string; dHappy: string; dWide: string; dConf: string;
  dSmile: string; dMOpen: string; dWavy: string; dBlush: string; dZ: string; dQ: string; dSweat: string; dSpark: string; dLeaf: string; dTongue: string;
}

export function stageForLevel(level: number): Stage {
  return level <= 3 ? 'hatchling' : level <= 6 ? 'sprout' : level <= 9 ? 'vine' : 'canopy';
}

export function spriteFlags(mood: Mood, stage: Stage, live: boolean): SproutSprite {
  const D = (b: boolean | number) => (b ? 'inline' : 'none');
  let anim = '', headCls = '', blink = '';
  const f = { open: 0, closed: 0, happy: 0, wide: 0, conf: 0, smile: 0, mopen: 0, wavy: 0, blush: 0, z: 0, q: 0, sweat: 0, spark: 0, leaf: 0, tongue: 0 };
  if (mood === 'sleeping') { f.closed = f.smile = f.z = 1; anim = live ? 'sp-sleep' : ''; }
  else if (mood === 'happy') { f.happy = f.mopen = f.blush = 1; anim = live ? 'sp-hop' : ''; }
  else if (mood === 'confused') { f.conf = f.wavy = f.q = 1; headCls = 'sp-tilt'; }
  else if (mood === 'celebrating') { f.happy = f.mopen = f.spark = f.blush = 1; anim = live ? 'sp-bounce' : ''; }
  else if (mood === 'error') { f.wide = f.wavy = f.sweat = 1; anim = live ? 'sp-shake' : ''; }
  else if (mood === 'petted') { f.happy = f.smile = f.blush = f.leaf = 1; anim = live ? 'sp-wiggle' : ''; }
  else { f.open = f.smile = 1; f.tongue = live ? 1 : 0; anim = live ? 'sp-sway' : ''; blink = live ? 'sp-blink' : ''; }
  const body = ({ hatchling: ['#6f9a3a', '#a9c97a'], sprout: ['#4f7a1c', '#8fb356'], vine: ['#3e6510', '#7da34a'], canopy: ['#345a04', '#6f9a3a'] } as const)[stage];
  return {
    anim, headCls, blink, bodyC: body[0], snoutC: body[1],
    dEgg: D(stage === 'hatchling'), dVine: D(stage === 'vine' || stage === 'canopy'), dCrown: D(stage === 'canopy'),
    dOpen: D(f.open), dClosed: D(f.closed), dHappy: D(f.happy), dWide: D(f.wide), dConf: D(f.conf),
    dSmile: D(f.smile), dMOpen: D(f.mopen), dWavy: D(f.wavy), dBlush: D(f.blush),
    dZ: D(f.z), dQ: D(f.q), dSweat: D(f.sweat), dSpark: D(f.spark), dLeaf: D(f.leaf), dTongue: D(f.tongue),
  };
}
