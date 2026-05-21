# Atlas

Agregador de noticias editorial curado para Argentina y el mundo.

## Stack

- HTML + CSS + JavaScript ES Modules (vanilla, sin framework)
- Deploy: Vercel (conectado a este repo)
- Feeds: RSS via proxy CORS (`allorigins.win`)

## Estructura

```
atlas/
├── index.html              Entry point
├── src/
│   ├── config/
│   │   ├── feeds.js        Configuración de todas las fuentes
│   │   └── settings.js     Constantes globales
│   ├── core/
│   │   ├── fetcher.js      Fetch RSS con proxy, retry, cache
│   │   ├── parser.js       XML → objetos Article
│   │   ├── filters.js      Filtros de ruido y keywords
│   │   ├── deduper.js      Deduplicación semántica TF-IDF
│   │   └── cache.js        Cache localStorage con TTL
│   ├── ui/
│   │   ├── masthead.js     Header y navegación de bloques
│   │   └── components.js   Subnav, filterbar, articles, aside, status
│   ├── styles/
│   │   ├── base.css        Variables, reset, tipografía
│   │   └── main.css        Layout y componentes
│   └── app.js              Orquestador principal
└── assets/
    └── favicon.svg
```

## Agregar una fuente

En `src/config/feeds.js`, dentro de la sección correspondiente:

```js
{ fuente: 'Nombre del medio', url: 'https://medio.com/feed/' }
```

Si el medio es generalista y necesita filtro temático:

```js
{ fuente: 'Nombre del medio', url: 'https://medio.com/feed/', filtro: true }
```

## Agregar una sección

En `src/config/feeds.js`, dentro del bloque correspondiente, sumá una entrada al objeto `secciones`.

## Agregar un bloque

En `src/config/feeds.js`, sumá una entrada al objeto `BLOQUES`.

## Deploy en Vercel

1. Importar este repo en Vercel
2. Framework preset: **Other**
3. Build command: (vacío)
4. Output directory: `.` (raíz)
5. Deploy

## Refresh

Las noticias se actualizan automáticamente cada 15 minutos.
El cache localStorage evita re-fetches innecesarios.

## Secciones

### Argentina
- Economía & Mercados
- Energía & Minería
- Política
- Empresas & Ejecutivos
- Judiciales
- Agro & Commodities

### El Mundo *(próximamente)*
- Macro & Bancos Centrales
- Geopolítica & Comercio
- Commodities
- Latinoamérica

### Think *(próximamente)*
- Papers & Research
- Research Institucional
- Think Tanks
