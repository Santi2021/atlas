// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Configuración global
// ══════════════════════════════════════════════════════════════════════════════

export const SETTINGS = {
  // Proxy CORS para RSS (allorigins es gratuito y sin límite razonable)
  PROXY: 'https://api.allorigins.win/raw?url=',

  // Proxy alternativo si el principal falla
  PROXY_FALLBACK: 'https://corsproxy.io/?',

  // Refresh automático cada 15 minutos
  REFRESH_INTERVAL_MS: 15 * 60 * 1000,

  // Cache TTL en localStorage
  CACHE_TTL_MS: 15 * 60 * 1000,

  // Máximo de items a procesar por feed
  MAX_ITEMS_PER_FEED: 30,

  // Máximo de artículos a mostrar por sección
  MAX_ARTICLES_DISPLAY: 60,

  // Umbral de similitud para deduplicación semántica (0-1)
  DEDUP_THRESHOLD: 0.55,

  // Timeout por request de feed (ms)
  FETCH_TIMEOUT_MS: 10000,

  // Reintentos ante fallo
  FETCH_RETRIES: 2,

  // Nombre del diario
  NOMBRE: 'Atlas',

  // Ciudad base
  CIUDAD: 'Buenos Aires',
};
