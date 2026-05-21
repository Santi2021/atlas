// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Filters: ruido, keywords temáticas, deduplicación por URL
// ══════════════════════════════════════════════════════════════════════════════

const RUIDO_GENERAL = [
  'dólar hoy', 'blue hoy', 'cotización de hoy', 'precio del dólar',
  'cerró este', 'en vivo', 'minuto a minuto', 'cuánto está',
  'a cuánto', 'cuánto vale hoy', 'cotiza hoy',
  'fútbol', 'gol ', ' gol', 'deportes', 'espectáculo',
  'farándula', 'horóscopo', 'colapinto', 'messi', 'selección argentina',
  'receta', 'turismo', 'clima hoy', 'cumpleaños',
  'serie ', 'película ', 'canción ', 'álbum ',
];

const RUIDO_PROVINCIAL = [
  'policiales', 'crimen', 'homicidio', 'robo ', 'femicidio',
  'violencia de género', 'accidente vial', 'choque', 'colisión',
  'salud pública', 'hospital', 'vacuna', 'dengue',
  'elecciones municipales', 'intendente', 'concejo deliberante',
  'educación escolar', 'docentes paro', 'foro de seguridad', 'policía municipal',
];

export function tieneRuido(titulo, desc, esProvincial = false) {
  const texto = (titulo + ' ' + desc).toLowerCase();
  if (RUIDO_GENERAL.some(k => texto.includes(k))) return true;
  if (esProvincial && RUIDO_PROVINCIAL.some(k => texto.includes(k))) return true;
  return false;
}

export function matchKeywords(titulo, desc, keywords) {
  const texto = (titulo + ' ' + desc).toLowerCase();
  return keywords.some(k => texto.includes(k));
}

export function dedupByUrl(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = a.link.split('?')[0].replace(/\/$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function sortByFecha(articles) {
  return [...articles].sort((a, b) => b.fechaTs - a.fechaTs);
}

export function sortByFuente(articles) {
  return [...articles].sort((a, b) => a.fuente.localeCompare(b.fuente));
}
