import { BLOQUES } from './config/feeds.js';
import { SETTINGS } from './config/settings.js';
import { fetchFeed } from './core/fetcher.js';
import { parseXml } from './core/parser.js';
import { tieneRuido, matchKeywords, dedupByUrl, sortByFecha, sortByFuente } from './core/filters.js';
import { dedupSemantico } from './core/deduper.js';
import { renderMasthead } from './ui/masthead.js';
import { renderSubnav, renderFilterBar, renderArticleList, renderAside, updateStatusBar } from './ui/components.js';

const STATE = {
  bloqueActivo: 'argentina',
  seccionActiva: 'economia',
  sortMode: 'fecha',
  fuentesOcultas: new Set(),
  articulos: {},
  totalFeeds: 0,
  feedsOk: 0,
};

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

function onBloqueChange(bloqueId) {
  STATE.bloqueActivo = bloqueId;
  document.querySelectorAll('[data-bloque-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.bloqueTab === bloqueId);
  });
  const bloque = BLOQUES[bloqueId];
  if (bloque) {
    const primera = Object.keys(bloque.secciones)[0];
    onSeccionChange(primera);
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
  const key = `${STATE.bloqueActivo}.${STATE.seccionActiva}`;
  delete STATE.articulos[key];
  loadSeccion(STATE.bloqueActivo, STATE.seccionActiva, true);
}

async function loadSeccion(bloqueId, seccionId) {
  const bloque = BLOQUES[bloqueId];
  if (!bloque) return;
  const seccion = bloque.secciones[seccionId];
  if (!seccion) return;

  const key = `${bloqueId}.${seccionId}`;
  showLoading();
  updateStatusBar(STATE, 'Cargando...');

  const promises = seccion.feeds.map(feedCfg =>
    loadOneFeed(feedCfg, seccion).catch(() => [])
  );

  const results = await Promise.allSettled(promises);
  let todos = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  todos = dedupByUrl(todos);
  todos = dedupSemantico(todos);
  todos = sortByFecha(todos);

  STATE.articulos[key] = todos;
  STATE.feedsOk = results.filter(r => r.status === 'fulfilled' && r.value.length > 0).length;
  STATE.totalFeeds = seccion.feeds.length;

  renderSeccion();
  updateStatusBar(STATE, `${STATE.feedsOk}/${STATE.totalFeeds} feeds · ${todos.length} notas`);
}

async function loadOneFeed(feedCfg, seccion) {
  const url = feedCfg.url;
  const fuente = feedCfg.fuente;
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

function showLoading() {
  const list = document.getElementById('atlas-article-list');
  if (list) list.innerHTML = '<div class="loading-state">Cargando<span class="loading-dots"></span></div>';
}

function renderSeccion() {
  const key = `${STATE.bloqueActivo}.${STATE.seccionActiva}`;
  let articulos = STATE.articulos[key] || [];
  const visibles = articulos.filter(a => !STATE.fuentesOcultas.has(a.fuente));
  const ordenados = STATE.sortMode === 'fuente' ? sortByFuente(visibles) : sortByFecha(visibles);
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

  const bloque = BLOQUES[STATE.bloqueActivo];
  const otras = Object.values(bloque.secciones).filter(s => s.id !== STATE.seccionActiva);
  renderAside(otras, STATE.articulos, STATE.bloqueActivo, onSeccionChange);

  const countEl = document.getElementById('atlas-seccion-count');
  if (countEl) countEl.textContent = `${ordenados.length} notas`;
}

function scheduleRefresh() {
  setInterval(() => {
    const key = `${STATE.bloqueActivo}.${STATE.seccionActiva}`;
    delete STATE.articulos[key];
    loadSeccion(STATE.bloqueActivo, STATE.seccionActiva);
    updateFecha();
  }, SETTINGS.REFRESH_INTERVAL_MS);
}