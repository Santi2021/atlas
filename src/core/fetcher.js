// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Fetcher: trae feeds RSS via proxy CORS con retry y cache
// ══════════════════════════════════════════════════════════════════════════════

import { SETTINGS } from '../config/settings.js';
import { cache } from './cache.js';

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRaw(feedUrl, useProxy) {
  const url = useProxy
    ? SETTINGS.PROXY + encodeURIComponent(feedUrl)
    : feedUrl;
  const res = await fetchWithTimeout(url, SETTINGS.FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function fetchFeed(feedUrl) {
  const cacheKey = cache.keyFor(feedUrl);

  // 1. Intentar cache válido
  const cached = cache.get(cacheKey, SETTINGS.CACHE_TTL_MS);
  if (cached) return { xml: cached, fromCache: true };

  // 2. Intentar proxy principal con reintentos
  let lastError;
  for (let i = 0; i <= SETTINGS.FETCH_RETRIES; i++) {
    try {
      const xml = await fetchRaw(feedUrl, true);
      cache.set(cacheKey, xml);
      return { xml, fromCache: false };
    } catch (e) {
      lastError = e;
      if (i < SETTINGS.FETCH_RETRIES) {
        await new Promise(r => setTimeout(r, 800 * (i + 1)));
      }
    }
  }

  // 3. Intentar proxy fallback
  try {
    const url = SETTINGS.PROXY_FALLBACK + encodeURIComponent(feedUrl);
    const res = await fetchWithTimeout(url, SETTINGS.FETCH_TIMEOUT_MS);
    if (res.ok) {
      const xml = await res.text();
      cache.set(cacheKey, xml);
      return { xml, fromCache: false };
    }
  } catch {}

  // 4. Cache expirado como último recurso
  const stale = cache.get(cacheKey, Infinity);
  if (stale) return { xml: stale, fromCache: true, stale: true };

  throw lastError || new Error('Feed no disponible');
}
