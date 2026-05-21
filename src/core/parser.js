// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Parser: XML RSS/Atom → objetos Article normalizados
// ══════════════════════════════════════════════════════════════════════════════

const domParser = new DOMParser();

function getText(el, ...tags) {
  for (const tag of tags) {
    const node = el.querySelector(tag);
    if (node?.textContent?.trim()) return node.textContent.trim();
  }
  return '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
            .replace(/\s+/g, ' ').trim();
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatFecha(date) {
  if (!date) return '';
  const hoy = new Date();
  const diff = hoy - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins}m`;
  const hs = Math.floor(mins / 60);
  if (hs < 24) return `Hace ${hs}h`;
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
       + ' ' + date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export function parseXml(xml, fuente) {
  let doc;
  try {
    doc = domParser.parseFromString(xml, 'application/xml');
  } catch {
    return [];
  }

  const isAtom = !!doc.querySelector('feed');
  const items = isAtom
    ? [...doc.querySelectorAll('entry')]
    : [...doc.querySelectorAll('item')];

  return items.slice(0, 30).map(item => {
    const titulo = stripHtml(
      isAtom ? getText(item, 'title') : getText(item, 'title')
    );
    const link = isAtom
      ? (item.querySelector('link[rel="alternate"]')?.getAttribute('href')
         || item.querySelector('link')?.getAttribute('href')
         || getText(item, 'id'))
      : getText(item, 'link', 'guid');
    const desc = stripHtml(
      isAtom
        ? getText(item, 'summary', 'content')
        : getText(item, 'description', 'summary')
    ).slice(0, 280);
    const fechaRaw = isAtom
      ? getText(item, 'updated', 'published')
      : getText(item, 'pubDate', 'dc\\:date', 'date');
    const fecha = parseDate(fechaRaw);

    if (!titulo || !link) return null;

    return {
      titulo,
      link,
      desc,
      fecha,
      fechaStr: formatFecha(fecha),
      fechaTs: fecha ? fecha.getTime() : 0,
      fuente,
      tambien: [], // se llena en deduper
    };
  }).filter(Boolean);
}
