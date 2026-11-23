import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/young-serif/400.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import './styles/prototype.css';
import './styles/additions.css';
import './styles/orbis.css';
import './styles/lithic.css';
import TerraformOS from './terraform/TerraformOS';
import { boot } from './boot';
import { openKV } from './storage/db';
import { registerSW } from 'virtual:pwa-register';
import { setPwa } from './pwa';

// Service worker: offline shell and update prompts. Skipped in dev so hot reload stays simple.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const update = registerSW({
    onNeedRefresh: () => setPwa({ needRefresh: true, update: () => { void update(true); } }),
    onOfflineReady: () => setPwa({ offlineReady: true }),
  });
}

const kv = await openKV();
const { place, orbis, settings, shell, progress, progression, demo } = await boot(kv, window.location.search, window.location.hash);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TerraformOS kv={kv} place={place} settings={settings} orbis={orbis} botanica={{ shell, progress, progression, demo }} />
  </StrictMode>,
);
