// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — UI: Masthead
// ══════════════════════════════════════════════════════════════════════════════

import { BLOQUES } from '../config/feeds.js';
import { SETTINGS } from '../config/settings.js';

export function renderMasthead(state, { onBloqueChange, onRefresh }) {
  const el = document.getElementById('atlas-masthead');
  if (!el) return;

  const tabs = Object.values(BLOQUES).map(b => `
    <button
      class="bloque-tab ${b.id === state.bloqueActivo ? 'active' : ''}"
      data-bloque-tab="${b.id}"
      onclick="window.__atlas.onBloqueChange('${b.id}')"
    >${b.label}</button>
  `).join('');

  el.innerHTML = `
    <div class="masthead-inner">
      <div class="masthead-top">
        <div class="atlas-wordmark">ATLAS<span class="wordmark-dot">.</span></div>
        <div class="masthead-meta">
          <div id="atlas-fecha"></div>
          <div class="masthead-ciudad">${SETTINGS.CIUDAD}</div>
          <button class="refresh-btn" onclick="window.__atlas.onRefresh()">
            <span class="refresh-dot" id="refresh-dot"></span>
            <span id="refresh-label">En vivo</span>
          </button>
        </div>
      </div>
      <nav class="bloque-nav">${tabs}</nav>
    </div>
  `;

  // Exponer handlers globalmente para onclick inline
  window.__atlas = window.__atlas || {};
  window.__atlas.onBloqueChange = onBloqueChange;
  window.__atlas.onRefresh = onRefresh;
}
