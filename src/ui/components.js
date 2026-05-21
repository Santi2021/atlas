// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — UI Components: subnav, filterbar, articlelist, aside, statusbar
// ══════════════════════════════════════════════════════════════════════════════

import { BLOQUES } from '../config/feeds.js';

// ── SUBNAV ────────────────────────────────────────────────────────────────────
export function renderSubnav(state, { onSeccionChange }) {
  const el = document.getElementById('atlas-subnav');
  if (!el) return;

  const bloque = BLOQUES[state.bloqueActivo];
  if (!bloque) return;

  window.__atlas = window.__atlas || {};
  window.__atlas.onSeccionChange = onSeccionChange;

  el.innerHTML = Object.values(bloque.secciones).map(s => `
    <button
      class="sub-tab ${s.id === state.seccionActiva ? 'active' : ''}"
      onclick="window.__atlas.onSeccionChange('${s.id}')"
    >${s.label}</button>
  `).join('');

  // Nombre de la sección activa
  const nombreEl = document.getElementById('atlas-seccion-nombre');
  if (nombreEl) {
    const seccion = bloque.secciones[state.seccionActiva];
    if (seccion) nombreEl.textContent = seccion.label;
  }
}

// ── FILTER BAR ────────────────────────────────────────────────────────────────
export function renderFilterBar(fuentes, state, { onToggleFuente, onSortChange }) {
  const el = document.getElementById('atlas-filterbar');
  if (!el) return;

  window.__atlas.onToggleFuente = onToggleFuente;
  window.__atlas.onSortChange = onSortChange;

  const pills = fuentes.map(f => `
    <button
      class="source-pill ${state.fuentesOcultas.has(f) ? 'off' : ''}"
      onclick="window.__atlas.onToggleFuente('${f.replace(/'/g, "\\'")}')"
      title="${state.fuentesOcultas.has(f) ? 'Clic para mostrar' : 'Clic para ocultar'}"
    >${f}</button>
  `).join('');

  el.innerHTML = `
    <div class="source-filters">${pills}</div>
    <div class="sort-control">
      <span>Ordenar:</span>
      <select onchange="window.__atlas.onSortChange(this.value)">
        <option value="fecha" ${state.sortMode === 'fecha' ? 'selected' : ''}>Más reciente</option>
        <option value="fuente" ${state.sortMode === 'fuente' ? 'selected' : ''}>Fuente</option>
      </select>
    </div>
  `;
}

// ── ARTICLE LIST ──────────────────────────────────────────────────────────────
export function renderArticleList(articulos) {
  const el = document.getElementById('atlas-article-list');
  if (!el) return;

  if (!articulos.length) {
    el.innerHTML = '<div class="empty-state">No hay notas disponibles en este momento.</div>';
    return;
  }

  el.innerHTML = articulos.map(a => {
    const tambienHtml = a.tambien?.length
      ? `<div class="tambien">También: ${
          a.tambien.map(t =>
            `<a href="${t.link}" target="_blank" rel="noopener">${t.fuente}</a>`
          ).join(' · ')
        }</div>`
      : '';

    const descHtml = a.desc
      ? `<div class="article-desc">${a.desc.slice(0, 220)}${a.desc.length > 220 ? '…' : ''}</div>`
      : '';

    return `
      <article class="article-item">
        <div class="article-source-line">
          <span>${a.fuente}</span>
        </div>
        <a class="article-title" href="${a.link}" target="_blank" rel="noopener">
          ${a.titulo}
        </a>
        ${descHtml}
        <div class="article-footer">
          <div class="article-meta">
            <span>${a.fechaStr || ''}</span>
          </div>
          ${tambienHtml}
        </div>
      </article>
    `;
  }).join('');
}

// ── ASIDE ─────────────────────────────────────────────────────────────────────
export function renderAside(otrasSecciones, articulosCache, bloqueId, onSeccionChange) {
  const el = document.getElementById('atlas-aside');
  if (!el) return;

  window.__atlas.onSeccionChange = onSeccionChange;

  el.innerHTML = otrasSecciones.slice(0, 4).map(seccion => {
    const key = `${bloqueId}.${seccion.id}`;
    const arts = (articulosCache[key] || []).slice(0, 4);

    const itemsHtml = arts.length
      ? arts.map(a => `
          <div class="aside-item">
            <a class="aside-item-title" href="${a.link}" target="_blank" rel="noopener">
              ${a.titulo}
            </a>
            <div class="aside-item-meta">${a.fuente} · ${a.fechaStr}</div>
          </div>
        `).join('')
      : `<div class="aside-empty" onclick="window.__atlas.onSeccionChange('${seccion.id}')">
           Ver ${seccion.label} →
         </div>`;

    return `
      <div class="aside-block">
        <div class="aside-label">
          <span>${seccion.label}</span>
          <span class="see-all" onclick="window.__atlas.onSeccionChange('${seccion.id}')">Ver todo →</span>
        </div>
        ${itemsHtml}
      </div>
    `;
  }).join('');
}

// ── STATUS BAR ────────────────────────────────────────────────────────────────
export function updateStatusBar(state, mensaje) {
  const el = document.getElementById('atlas-status');
  if (el) el.textContent = mensaje;

  const ts = document.getElementById('atlas-status-ts');
  if (ts) {
    ts.textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit', minute: '2-digit'
    });
  }
}
