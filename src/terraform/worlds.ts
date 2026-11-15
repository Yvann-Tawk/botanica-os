// The world registry: every learning world Terraform OS knows about. Orbis renders this table; nothing
// else in the hub hard-codes a world. To open a world, give it status 'available' and an `entry` the shell
// knows how to launch (see TerraformOS.tsx), then build its learning environment beside src/apps/.

export type WorldId = 'botanica' | 'lithic' | 'aether' | 'ironworks';

export interface WorldLanguage {
  name: string;
  /** Terraform OS release that ships the language. Versions only, never dates. */
  version: string;
}

export interface World {
  id: WorldId;
  name: string;
  langs: WorldLanguage[];
  status: 'available' | 'soon';
  /** How the shell launches the world. Only set for available worlds. */
  entry?: 'botanica';
  /** Halo colour behind the catalog planet. */
  color: string;
  theme: string;
  sub: string;
  figName: string;
  blurb: string;
}

export const WORLDS: World[] = [
  { id: 'botanica', name: 'Botanica', langs: [{ name: 'Python', version: 'v1.0' }], status: 'available', entry: 'botanica', color: '#3e6510',
    theme: 'Botanical', sub: 'Organic · living · grown', figName: 'HORTUS',
    blurb: 'A living world where Python is cultivated, not just typed — lessons, missions and a companion, grown from seed to specimen. The first and only open world.' },
  { id: 'lithic', name: 'Lithic', langs: [{ name: 'HTML', version: 'v2.0' }, { name: 'DAX', version: 'v3.0' }, { name: 'Power Query M', version: 'v4.0' }], status: 'soon', color: '#b47e00',
    theme: 'Geological', sub: 'Minerals · crystal · strata', figName: 'LITHOS',
    blurb: 'A world of lattices and veins, where markup and query languages are cut and faceted like gemstones — structure you can see straight through.' },
  { id: 'aether', name: 'Aether', langs: [{ name: 'JavaScript', version: 'v5.0' }, { name: 'CSS', version: 'v6.0' }], status: 'soon', color: '#7fa6b8',
    theme: 'Ethereal', sub: 'Floating isles · sky', figName: 'NUBES',
    blurb: 'Floating islands and sky-civilisations, where behaviour and style lift static pages up into the air and set them moving.' },
  { id: 'ironworks', name: 'Ironworks', langs: [{ name: 'C#', version: 'v7.0' }, { name: 'SQL', version: 'v8.0' }], status: 'soon', color: '#8a7a66',
    theme: 'Industrial', sub: 'Mechanical · forged', figName: 'FABRICA',
    blurb: 'A forged world of gears, furnaces and rails, where typed languages and databases drive the great machines that keep the realm turning.' },
];

/** Short language line for the catalog, e.g. "HTML · DAX · M". */
const SHORT: Record<string, string> = { JavaScript: 'JS', 'Power Query M': 'M' };
export const langLine = (w: World) => w.langs.map((l) => SHORT[l.name] ?? l.name).join(' · ');

/** The dossier's release line: "v1.0 · open now", or each planned language with its version. */
export const versionLine = (w: World) => w.status === 'available'
  ? `${w.langs.map((l) => l.version).join(' · ')} · open now`
  : 'planned · ' + w.langs.map((l) => `${l.name} ${l.version}`).join(' · ');

export const worldById = (id: WorldId) => WORLDS.find((w) => w.id === id)!;
export const isWorldId = (v: unknown): v is WorldId => typeof v === 'string' && WORLDS.some((w) => w.id === v);
export const openWorlds = () => WORLDS.filter((w) => w.status === 'available');
