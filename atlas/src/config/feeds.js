// ══════════════════════════════════════════════════════════════════════════════
// ATLAS — Configuración de feeds
// Para agregar una fuente: sumá un objeto al array feeds de la sección.
// Para agregar una sección: sumá una entrada al bloque correspondiente.
// Para agregar un bloque: sumá una entrada a BLOQUES.
// ══════════════════════════════════════════════════════════════════════════════

export const BLOQUES = {

  // ══ ARGENTINA ══════════════════════════════════════════════════════════════
  argentina: {
    id: 'argentina',
    label: 'Argentina',
    secciones: {

      economia: {
        id: 'economia',
        label: 'Economía & Mercados',
        modo: 'directo', // 'directo' = todos los items | 'filtrado' = solo keywords
        feeds: [
          { fuente: 'Ámbito',           url: 'https://www.ambito.com/rss/pages/economia.xml' },
          { fuente: 'Ámbito Negocios',  url: 'https://www.ambito.com/rss/pages/negocios.xml' },
          { fuente: 'Ámbito Opinión',   url: 'https://www.ambito.com/rss/pages/opinion.xml' },
          { fuente: 'iProfesional',     url: 'https://www.iprofesional.com/rss/economia' },
          { fuente: 'iProfesional Neg.',url: 'https://www.iprofesional.com/rss/negocios' },
          { fuente: 'Fortuna / Perfil', url: 'https://fortuna.perfil.com/feed/' },
          { fuente: 'El Cronista',      url: 'https://www.cronista.com/files/rss/news.xml' },
        ],
      },

      energia: {
        id: 'energia',
        label: 'Energía & Minería',
        modo: 'mixto', // feeds nativos directo + provinciales filtrado
        feeds: [
          // Especializados nacionales — directo
          { fuente: 'EconoJournal',       url: 'https://econojournal.com.ar/feed/',                  filtro: false },
          { fuente: 'Inv. Energético',    url: 'https://elinversorenergetico.com/feed/',              filtro: false },
          { fuente: 'Energía Online',     url: 'https://energiaonline.com.ar/feed/',                  filtro: false },
          { fuente: 'Sector Energético',  url: 'https://sectorenergetico.ar/feed/',                   filtro: false },
          { fuente: 'Surtidores',         url: 'https://www.surtidores.com.ar/feed/',                 filtro: false },
          { fuente: 'Ámbito Energía',     url: 'https://www.ambito.com/rss/pages/energia.xml',        filtro: false },
          { fuente: 'iProfesional',       url: 'https://www.iprofesional.com/rss/energia',            filtro: false },
          { fuente: 'En. Estratégica',    url: 'https://www.energiaestrategica.com/feed/',            filtro: false },
          { fuente: 'PV Magazine',        url: 'https://www.pv-magazine-latam.com/feed/',             filtro: false },
          { fuente: 'Energías Renov.',    url: 'https://energiasrenovables.com.ar/feed/',             filtro: false },
          { fuente: 'Minería Argentina',  url: 'https://mineriaargentina.com.ar/feed/',              filtro: false },
          { fuente: 'Noticias Minería',   url: 'https://noticiasdemineria.com.ar/feed/',              filtro: false },
          { fuente: 'Diario Minero',      url: 'https://diariominero.com.ar/feed/',                   filtro: false },
          { fuente: 'Extremo Minero',     url: 'https://extremominero.com.ar/feed/',                  filtro: false },
          // Provinciales — requieren filtro temático
          { fuente: 'Río Negro',          url: 'https://www.rionegro.com.ar/feed/',                   filtro: true },
          { fuente: 'El Chubut',          url: 'https://www.elchubut.com.ar/rss/',                    filtro: true },
          { fuente: 'Tiempo Sur',         url: 'https://www.tiemposur.com.ar/feed/',                  filtro: true },
        ],
        keywords: [
          'petróleo','gas','energía','vaca muerta','hidrocarburo','shale','fracking',
          'upstream','downstream','refinería','oleoducto','gasoducto','ypf',
          'vista energy','pampa energía','tecpetrol','pan american energy',
          'electricidad','tarifa eléctrica','cammesa','enre','transener',
          'renovable','solar','eólico','fotovoltaic','mater','bess','hidrógeno',
          'minería','litio','cobre','oro','plata','yacimiento','rigi',
          'no convencional','glp','gnl','nuclear','atucha',
        ],
      },

      politica: {
        id: 'politica',
        label: 'Política',
        modo: 'directo',
        feeds: [
          { fuente: 'Ámbito',         url: 'https://www.ambito.com/rss/pages/politica.xml' },
          { fuente: 'Ámbito Opinión', url: 'https://www.ambito.com/rss/pages/opinion.xml' },
          { fuente: 'iProfesional',   url: 'https://www.iprofesional.com/rss/politica' },
          { fuente: 'Perfil',         url: 'https://www.perfil.com/feed/politica' },
          { fuente: 'Perfil Opinión', url: 'https://www.perfil.com/feed/opinion' },
          { fuente: 'Clarín',         url: 'https://www.clarin.com/rss/politica/' },
          { fuente: 'El Economista',  url: 'https://eleconomista.com.ar/politica/feed/' },
          { fuente: 'Chequeado',      url: 'https://chequeado.com/feed/' },
          { fuente: 'El Cohete',      url: 'https://www.elcohetealaluna.com/feed/' },
          { fuente: 'Cenital',        url: 'https://cenital.com/feed/' },
          { fuente: 'BA Herald',      url: 'https://www.batimes.com.ar/feed/' },
          { fuente: 'Parlamentario',  url: 'https://www.parlamentario.com/feed/' },
          { fuente: 'El Diario AR',   url: 'https://www.eldiarioar.com/rss/' },
          { fuente: 'Infobae',        url: 'https://www.infobae.com/arc/outboundfeeds/rss/category/politica/' },
          { fuente: 'Política AR',    url: 'https://www.politicargentina.com/feed/ultimasnoticias.xml' },
        ],
      },

      empresas: {
        id: 'empresas',
        label: 'Empresas & Ejecutivos',
        modo: 'mixto',
        feeds: [
          { fuente: 'Revista Mercado',  url: 'https://mercado.com.ar/feed.xml',                                          filtro: false },
          { fuente: 'Fortuna / Perfil', url: 'https://fortuna.perfil.com/feed/',                                         filtro: false },
          { fuente: 'El Economista',    url: 'https://eleconomista.com.ar/negocios/feed/',                               filtro: false },
          { fuente: 'iProfesional',     url: 'https://www.iprofesional.com/rss/negocios',                                filtro: false },
          { fuente: 'iProfesional Mg.', url: 'https://www.iprofesional.com/rss/management',                             filtro: false },
          { fuente: 'Ámbito Negocios',  url: 'https://www.ambito.com/rss/pages/negocios.xml',                           filtro: false },
          { fuente: 'El Cronista',      url: 'https://www.cronista.com/files/rss/news.xml',                              filtro: false },
          { fuente: 'El Diario AR',     url: 'https://www.eldiarioar.com/rss/economia/',                                 filtro: true },
          { fuente: 'Infobae',          url: 'https://www.infobae.com/arc/outboundfeeds/rss/category/economia/',         filtro: true },
        ],
        keywords: [
          'ceo','director','gerente','empresa','compañía','fusión','adquisición',
          'inversión','negocio','acuerdo','contrato','expansión','lanzamiento',
          'estrategia','management','liderazgo','startup','fintech','innovación',
          'bolsa','acciones','obligación negociable','exportación','industria',
          'resultado','balance','ganancias','facturación','ipo','oferta pública',
          'manufactura','producción','crecimiento empresarial',
        ],
      },

      judiciales: {
        id: 'judiciales',
        label: 'Judiciales',
        modo: 'filtrado',
        feeds: [
          { fuente: 'Infobae',        url: 'https://www.infobae.com/arc/outboundfeeds/rss/category/politica/' },
          { fuente: 'El Diario AR',   url: 'https://www.eldiarioar.com/rss/' },
          { fuente: 'Clarín',         url: 'https://www.clarin.com/rss/' },
          { fuente: 'Perfil',         url: 'https://www.perfil.com/feed/' },
          { fuente: 'Ámbito',         url: 'https://www.ambito.com/rss/pages/politica.xml' },
          { fuente: 'iProfesional',   url: 'https://www.iprofesional.com/rss/legales' },
          { fuente: 'Parlamentario',  url: 'https://www.parlamentario.com/feed/' },
          { fuente: 'El Cronista',    url: 'https://www.cronista.com/files/rss/news.xml' },
          { fuente: 'BA Herald',      url: 'https://www.batimes.com.ar/feed/' },
          { fuente: 'El Economista',  url: 'https://eleconomista.com.ar/politica/feed/' },
          { fuente: 'El Diario AR',   url: 'https://www.eldiarioar.com/rss/economia/' },
        ],
        keywords: [
          // Términos procesales duros
          'fallo','sentencia','condena','absolvió','procesado','imputado',
          'juicio oral','tribunal oral','cámara federal','corte suprema',
          'indagatoria','prisión preventiva','arresto domiciliario',
          'medida cautelar','habeas corpus','fiscalía','procurador',
          'fiscal federal','juez federal','allanamiento','embargo judicial',
          'extradición','sobreseído','sobreseimiento','casación','juzgado',
          'causa penal','instrucción penal','querella',
          // Causas conocidas
          'burford','causa vialidad','cuadernos','lesa humanidad',
          'memorándum irán','ciccone','vicentin','comodoro py',
          'tribunales federales','csjn','ministerio público',
          'lavado de dinero','evasión impositiva',
        ],
      },

      agro: {
        id: 'agro',
        label: 'Agro & Commodities',
        modo: 'mixto',
        feeds: [
          // Nativos — directo
          { fuente: 'Bichos de Campo',  url: 'https://bichosdecampo.com/feed/',                 filtro: false },
          { fuente: 'Infocampo',        url: 'https://www.infocampo.com.ar/feed/',               filtro: false },
          { fuente: 'Horizonte A',      url: 'https://www.horizontea.com/feed/',                 filtro: false },
          { fuente: 'AgroVoz',          url: 'https://www.agrovoz.com.ar/feed/',                 filtro: false },
          { fuente: 'Todo Agro',        url: 'https://www.todoagro.com.ar/feed/',                filtro: false },
          { fuente: 'Agroempresario',   url: 'https://www.agroempresario.com.ar/feed/',          filtro: false },
          { fuente: 'El Agrario',       url: 'https://www.elagrario.com/feed/',                  filtro: false },
          // Secciones agro de grandes medios — directo
          { fuente: 'Ámbito Campo',     url: 'https://www.ambito.com/rss/pages/campo.xml',       filtro: false },
          { fuente: 'iProfesional',     url: 'https://www.iprofesional.com/rss/comex',           filtro: false },
          // Generales — requieren filtro
          { fuente: 'Ámbito',           url: 'https://www.ambito.com/rss/pages/economia.xml',    filtro: true },
          { fuente: 'El Cronista',      url: 'https://www.cronista.com/files/rss/news.xml',      filtro: true },
          { fuente: 'iProfesional Ec.', url: 'https://www.iprofesional.com/rss/economia',        filtro: true },
          { fuente: 'Infobae',          url: 'https://www.infobae.com/arc/outboundfeeds/rss/category/economia/', filtro: true },
          { fuente: 'El Diario AR',     url: 'https://www.eldiarioar.com/rss/',                  filtro: true },
          { fuente: 'El Economista',    url: 'https://eleconomista.com.ar/feed/',                filtro: true },
          { fuente: 'Fortuna / Perfil', url: 'https://fortuna.perfil.com/feed/',                 filtro: true },
          { fuente: 'Río Negro',        url: 'https://www.rionegro.com.ar/feed/',                filtro: true },
          { fuente: 'EconoJournal',     url: 'https://econojournal.com.ar/feed/',                filtro: true },
        ],
        keywords: [
          'soja','maíz','trigo','girasol','sorgo','cebada','oleaginosa','cereal',
          'cosecha','siembra','campaña agrícola','retenciones','derechos de exportación',
          'bcr','bolsa de cereales','bolsa de comercio rosario','matba','rofex',
          'mercado de granos','coninagro','sociedad rural','carbap',
          'exportación granos','liquidación divisas','chicago','cbot',
          'precio soja','precio maíz','precio trigo','campaña gruesa','campaña fina',
          'rindes','acopio','silobolsa','aceitera','dólar soja','dólar agro',
          'ganadería','hacienda','feedlot','faena','novillo','ternero',
          'exportación carne','cuota hilton','lechería','tambero',
          'campo argentino','sector agropecuario','agro argentino',
          'productor agropecuario','senasa','secretaría de agricultura',
          'vino','bodega','citrus','arándano','caña de azúcar','bioetanol',
          'balanza agroexportadora','exportaciones agroindustriales','ciara',
          'commodities','commodity',
        ],
      },

    },
  },

  // ══ EL MUNDO ═══════════════════════════════════════════════════════════════
  elmundo: {
    id: 'elmundo',
    label: 'El Mundo',
    proximamente: true,
    secciones: {

      macro: {
        id: 'macro',
        label: 'Macro & Bancos Centrales',
        modo: 'directo',
        feeds: [
          { fuente: 'BIS — Speeches',   url: 'https://www.bis.org/doclist/cbspeeches.rss' },
          { fuente: 'BIS — Research',   url: 'https://www.bis.org/doclist/bis_fsi_publs.rss' },
          { fuente: 'Reuters',          url: 'https://feeds.reuters.com/reuters/businessNews' },
          { fuente: 'Project Syndicate',url: 'https://www.project-syndicate.org/rss' },
        ],
      },

      geopolitica: {
        id: 'geopolitica',
        label: 'Geopolítica & Comercio',
        modo: 'directo',
        feeds: [
          { fuente: 'Project Syndicate',url: 'https://www.project-syndicate.org/rss' },
          { fuente: 'Al Jazeera',       url: 'https://www.aljazeera.com/xml/rss/all.xml' },
          { fuente: 'Reuters World',    url: 'https://feeds.reuters.com/Reuters/worldNews' },
        ],
      },

      commodities: {
        id: 'commodities',
        label: 'Commodities',
        modo: 'filtrado',
        feeds: [
          { fuente: 'Reuters',          url: 'https://feeds.reuters.com/reuters/businessNews' },
        ],
        keywords: [
          'oil','crude','brent','wti','natural gas','gold','copper','lithium',
          'commodity','commodities','grain','soybean','wheat','corn',
          'opec','energy prices','raw materials',
        ],
      },

      latam: {
        id: 'latam',
        label: 'Latinoamérica',
        modo: 'filtrado',
        feeds: [
          { fuente: 'Reuters',          url: 'https://feeds.reuters.com/Reuters/worldNews' },
          { fuente: 'El Economista',    url: 'https://eleconomista.com.ar/internacional/feed/' },
          { fuente: 'BA Herald',        url: 'https://www.batimes.com.ar/feed/' },
        ],
        keywords: [
          'brasil','brazil','chile','colombia','perú','peru','mexico','méxico',
          'venezuela','ecuador','bolivia','paraguay','uruguay','latinoamérica',
          'latin america','banco central','inflación latam','mercados emergentes',
          'emerging markets','fed rate latam',
        ],
      },

    },
  },

  // ══ THINK ══════════════════════════════════════════════════════════════════
  think: {
    id: 'think',
    label: 'Think',
    proximamente: true,
    secciones: {

      papers: {
        id: 'papers',
        label: 'Papers & Research',
        modo: 'directo',
        feeds: [
          { fuente: 'NBER',             url: 'https://www.nber.org/papers.rss' },
          { fuente: 'NBER — Int. Fin.', url: 'https://www.nber.org/programs/ifm/papers.rss' },
          { fuente: 'BIS — Working P.', url: 'https://www.bis.org/doclist/bis_fsi_publs.rss' },
          { fuente: 'BIS — CB Hub',     url: 'https://www.bis.org/doclist/reshub_papers.rss' },
          { fuente: 'FMI Blog',         url: 'https://www.imf.org/en/News/rss' },
          { fuente: 'CEPAL',            url: 'https://www.cepal.org/es/rss' },
        ],
      },

      research: {
        id: 'research',
        label: 'Research Institucional',
        modo: 'directo',
        feeds: [
          { fuente: 'BIS — Speeches',   url: 'https://www.bis.org/doclist/cbspeeches.rss' },
          { fuente: 'BIS — ES',         url: 'https://www.bis.org/doclist/rss_translations_es.rss' },
          { fuente: 'FMI',              url: 'https://www.imf.org/en/News/rss' },
        ],
      },

      thinktanks: {
        id: 'thinktanks',
        label: 'Think Tanks',
        modo: 'directo',
        feeds: [
          { fuente: 'Brookings',        url: 'https://www.brookings.edu/feed/' },
          { fuente: 'Peterson (PIIE)',   url: 'https://www.piie.com/rss/all' },
          { fuente: 'CFR',              url: 'https://www.cfr.org/rss/cfr_all' },
          { fuente: 'Project Syndicate',url: 'https://www.project-syndicate.org/rss' },
        ],
      },

    },
  },

};
