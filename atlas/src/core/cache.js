// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Cache con TTL en localStorage
// ══════════════════════════════════════════════════════════════════════════════

const PREFIX = 'atlas_cache_';

export const cache = {
  set(key, data) {
    try {
      const entry = { data, ts: Date.now() };
      localStorage.setItem(PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // localStorage lleno — ignorar silenciosamente
    }
  },

  get(key, ttlMs) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.ts > ttlMs) {
        localStorage.removeItem(PREFIX + key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },

  // Clave única por URL de feed
  keyFor(url) {
    return url.replace(/[^a-z0-9]/gi, '_').slice(0, 80);
  },
};
