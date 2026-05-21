// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Orquestador principal
// ══════════════════════════════════════════════════════════════════════════════

import { BLOQUES } from './config/feeds.js';
import { SETTINGS } from './config/settings.js';
import { fetchFeed } from './core/fetcher.js';
import { parseXml } from './core/parser.js';
import { tieneRuido, matchKeywords, dedupByUrl, sortByFecha, sortByFuente } from './core/filters.js';
import { dedupSemantico } from './core/deduper.js';
import { renderMasthead } from './ui/masthead.js';
import { renderSubnav } from './ui/subnav.js';
import { renderFilterBar } from './ui/filterbar.js';
import { renderArticleList } from './ui/articlelist.js';
import { renderAside } from './ui/aside.js';
import { updateStatusBar } from './ui/statusbar.js';

// ── Estado global ─────────────────────────────────────────────────────────────
const STATE = {
  bloqueActivo: 'argentina',
  seccionActiva: 'economia',
  sortMode: 'fecha',
  fuentesOcultas: new Set(),
  articulos: {},        // { 'argentina.economia': [...] }
  loading: new Set(),   // feeds en vuelo
  errors: new Map(),    // feedUrl → error
  totalFeeds: 0,
  feedsOk: 0,
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
export async function init() {
  renderMasthead(STATE, { onBloqueChange, onRefresh });
  renderSubnav(STATE, { onSeccionChange });
  updateFecha();
  await loadSeccion(STATE.bloqueActivo, STATE.seccionActiva);
  scheduleRefresh();
}

function updateFecha() {
  const el = document.getElementById('atlas-fecha');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── Navegación ────────────────────────────────────────────────────────────────
function onBloqueChange(bloqueId) {
  STATE.bloqueActivo = bloqueId;
  document.querySelectorAll('.bloque-section').forEach(el => {
    el.style.display = el.dataset.bloque === bloqueId ? 'block' : 'none';
  });
  document.querySelectorAll('[data-bloque-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.bloqueTab === bloqueId);
  });
  const bloque = BLOQUES[bloqueId];
  if (bloque) {
    const primeraSeccion = Object.keys(bloque.secciones)[0];
    onSeccionChange(primeraSeccion);
  }
}

function onSeccionChange(seccionId) {
  STATE.seccionActiva = seccionId;
  STATE.fuentesOcultas.clear();
  renderSubnav(STATE, { onSeccionChange });
  const key = `${STATE.bloqueActivo}.${seccionId}`;
  if (STATE.articulos[key]) {
    renderSeccion();
  } else {
    showLoading();
    loadSeccion(STATE.bloqueActivo, seccionId);
  }
}

function onRefresh() {
  loadSeccion(STATE.bloqueActivo, STATE.seccionActiva, true);
}

// ── Carga de feeds ────────────────────────────────────────────────────────────
async function loadSeccion(bloqueId, seccionId, forzar = false) {
  const bloque = BLOQUES[bloqueId];
  if (!bloque) return;
  const seccion = bloque.secciones[seccionId];
  if (!seccion) return;

  const key = `${bloqueId}.${seccionId}`;
  if (STATE.articulos[key] && !forzar) {
    renderSeccion();
    return;
  }

  showLoading();
  updateStatusBar(STATE, 'Cargando...');

  const promises = seccion.feeds.map(feedCfg =>
    loadOneFeed(feedCfg, seccion).catch(() => [])
  );

  const results = await Promise.allSettled(promises);
  let todos = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  // Dedup por URL
  todos = dedupByUrl(todos);

  // Dedup semántico
  todos = dedupSemantico(todos);

  // Ordenar
  todos = sortByFecha(todos);

  STATE.articulos[key] = todos;
  STATE.feedsOk = results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length;
  STATE.totalFeeds = seccion.feeds.length;

  renderSeccion();
  updateStatusBar(STATE, `${STATE.feedsOk}/${STATE.totalFeeds} feeds · ${todos.length} notas`);
}

async function loadOneFeed(feedCfg, seccion) {
  const url = typeof feedCfg === 'string' ? feedCfg : feedCfg.url;
  const fuente = typeof feedCfg === 'string' ? url : feedCfg.fuente;
  const necesitaFiltro = feedCfg.filtro ?? (seccion.modo === 'filtrado');
  const esProvincial = feedCfg.filtro === true;

  const { xml } = await fetchFeed(url);
  const articulos = parseXml(xml, fuente);

  return articulos.filter(a => {
    if (tieneRuido(a.titulo, a.desc, esProvincial)) return false;
    if (necesitaFiltro && seccion.keywords) {
      return matchKeywords(a.titulo, a.desc, seccion.keywords);
    }
    return true;
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
function showLoading() {
  const list = document.getElementById('atlas-article-list');
  if (list) list.innerHTML = '<div class="loading-state">Cargando<span class="loading-dots"></span></div>';
}

function renderSeccion() {
  const key = `${STATE.bloqueActivo}.${STATE.seccionActiva}`;
  let articulos = STATE.articulos[key] || [];

  // Aplicar fuentes ocultas
  const visibles = articulos.filter(a => !STATE.fuentesOcultas.has(a.fuente));

  // Aplicar orden
  const ordenados = STATE.sortMode === 'fuente'
    ? sortByFuente(visibles)
    : sortByFecha(visibles);

  // Fuentes únicas para filter bar
  const fuentes = [...new Set(articulos.map(a => a.fuente))];

  renderFilterBar(fuentes, STATE, {
    onToggleFuente: (f) => {
      if (STATE.fuentesOcultas.has(f)) STATE.fuentesOcultas.delete(f);
      else STATE.fuentesOcultas.add(f);
      renderSeccion();
    },
    onSortChange: (mode) => {
      STATE.sortMode = mode;
      renderSeccion();
    },
  });

  renderArticleList(ordenados.slice(0, SETTINGS.MAX_ARTICLES_DISPLAY));

  // Aside: otras secciones del mismo bloque
  const bloque = BLOQUES[STATE.bloqueActivo];
  const otrasSecciones = Object.values(bloque.secciones)
    .filter(s => s.id !== STATE.seccionActiva);
  renderAside(otrasSecciones, STATE.articulos, STATE.bloqueActivo, onSeccionChange);

  // Count
  const countEl = document.getElementById('atlas-seccion-count');
  if (countEl) countEl.textContent = `${ordenados.length} notas`;
}

// ── Auto-refresh ──────────────────────────────────────────────────────────────
function scheduleRefresh() {
  setInterval(() => {
    // Limpiar cache de la sección activa
    const key = `${STATE.bloqueActivo}.${STATE.seccionActiva}`;
    delete STATE.articulos[key];
    loadSeccion(STATE.bloqueActivo, STATE.seccionActiva, true);
    updateFecha();
  }, SETTINGS.REFRESH_INTERVAL_MS);
}
