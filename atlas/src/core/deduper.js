// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Deduper: agrupa artículos del mismo tema
// Implementación liviana de TF-IDF cosine similarity en JS puro
// ══════════════════════════════════════════════════════════════════════════════

import { SETTINGS } from '../config/settings.js';

const STOPWORDS = new Set([
  'el','la','los','las','un','una','unos','unas','de','del','al','en','con',
  'por','para','que','se','su','sus','es','son','fue','y','o','a','e','si',
  'no','ni','lo','le','les','ya','más','pero','como','este','esta','hay',
  'ser','tiene','han','sobre','entre','tras','ante','bajo','desde','hasta',
  'también','así','según','puede','nuevo','nueva','tras','ante','sin','ni',
  'muy','bien','gran','solo','cada','otro','otra','todo','toda','todos',
]);

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function tfidf(docs) {
  const N = docs.length;
  const df = {};
  const tfs = docs.map(words => {
    const tf = {};
    words.forEach(w => { tf[w] = (tf[w] || 0) + 1; });
    Object.keys(tf).forEach(w => {
      tf[w] /= words.length;
      df[w] = (df[w] || 0) + 1;
    });
    return tf;
  });
  return tfs.map(tf => {
    const vec = {};
    Object.keys(tf).forEach(w => {
      vec[w] = tf[w] * Math.log(N / (df[w] || 1));
    });
    return vec;
  });
}

function cosine(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, normA = 0, normB = 0;
  keys.forEach(k => {
    const va = a[k] || 0, vb = b[k] || 0;
    dot += va * vb;
    normA += va * va;
    normB += vb * vb;
  });
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function dedupSemantico(articles) {
  if (articles.length < 2) return articles;

  const docs = articles.map(a => normalizar(a.titulo + ' ' + (a.desc || '')));
  const vecs = tfidf(docs);
  const n = articles.length;
  const asignado = new Array(n).fill(false);
  const grupos = [];

  for (let i = 0; i < n; i++) {
    if (asignado[i]) continue;
    const grupo = [i];
    asignado[i] = true;
    for (let j = i + 1; j < n; j++) {
      if (!asignado[j] && cosine(vecs[i], vecs[j]) >= SETTINGS.DEDUP_THRESHOLD) {
        grupo.push(j);
        asignado[j] = true;
      }
    }
    grupos.push(grupo);
  }

  return grupos.map(grupo => {
    const notas = grupo.map(i => articles[i]);
    // Principal: la de mayor descripción (más completa)
    const principal = notas.reduce((best, a) =>
      (a.desc?.length || 0) > (best.desc?.length || 0) ? a : best
    , notas[0]);
    principal.tambien = notas
      .filter(a => a.link !== principal.link)
      .map(a => ({ fuente: a.fuente, link: a.link }));
    return principal;
  });
}
