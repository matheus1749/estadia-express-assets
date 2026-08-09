/* =============================================================================
   ESTADIA EXPRESS - js/hero.js
   Fase 2 - Hero Premium. Implementacao nova. Nada foi reaproveitado da
   initHero anterior, que era codigo morto comprovado (named function
   expression cujo nome nunca era vinculado ao escopo externo).

   Responsabilidades
     1. Montar a hero editorial no topo da home.
     2. Re-parentear o widget de busca nativo da Stays para dentro da hero.
        O no do DOM e MOVIDO, nunca recriado: listeners, hotel-datepicker e
        bootstrap-select continuam intactos.

   Garantias
     - Idempotente: montar duas vezes e impossivel.
     - Escopado: exige o widget de busca E a grade de imoveis (assinatura da
       home). Em qualquer outra pagina o modulo simplesmente nao faz nada.
     - Reversivel em runtime: a ancora original do widget e guardada antes do
       move; em qualquer excecao ele volta ao lugar exato e a hero e removida.
     - Nao escreve em legacy.js, legacy.css nem app.js.

   2.1.0 - Remocao do rail de credenciais
     O bloco lateral da hero (38 / IMOVEIS DISPONIVEIS, R$ 180 / A PARTIR DE
     NOITE, Goiania / GOIAS - BRASIL) foi removido a pedido. Saiu a marcacao
     (ul.eex-hero__rail), a hidratacao progressiva (hydrateRail), as strings
     de conteudo (CONTENT.facts e CONTENT.emptyValue) e o helper formatBRL,
     que existia apenas para formatar o preco do rail.
     readInventory() foi mantido: e superficie publica de QA (window.EEXHero)
     e nao dependia do rail.
     A coluna da direita continua declarada nas grid-areas do hero.css de
     proposito. Assim nada na hero se desloca; a area apenas fica livre.
   ============================================================================= */
(function () {
  'use strict';

  if (window.__EEX_HERO_MOUNTED) { return; }

  var VERSION = '2.1.0';

  /* ---------------------------------------------------------------------------
     CONTEUDO EDITORIAL
     Unico bloco a editar para trocar a copy da hero.
     --------------------------------------------------------------------------- */
  var CONTENT = {
    eyebrow:     'Goi\u00e2nia \u00b7 Goi\u00e1s',
    titleTop:    'Estadias curtas,',
    titleBottom: 'padr\u00e3o impec\u00e1vel.',
    lede:        'Lofts mobiliados no cora\u00e7\u00e3o de Goi\u00e2nia, prontos para ' +
                 'viver por alguns dias. Reserva direta, com atendimento local.',
    linkLabel:   'Ver todos os im\u00f3veis',
    note:        '',
    consoleLabel:'Buscar disponibilidade',
    fieldLabels: {
      dates:  'Datas',
      guests: 'H\u00f3spedes'
    }
  };

  /* ---------------------------------------------------------------------------
     UTILITARIOS
     --------------------------------------------------------------------------- */
  var D = document;

  function q(sel, root) { return (root || D).querySelector(sel); }
  function qa(sel, root) {
    return Array.prototype.slice.call((root || D).querySelectorAll(sel));
  }
  function make(tag, cls) {
    var el = D.createElement(tag);
    if (cls) { el.className = cls; }
    return el;
  }
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function warn(msg, err) {
    if (window.console && console.warn) { console.warn('[eex-hero] ' + msg, err || ''); }
  }

  /* ---------------------------------------------------------------------------
     CONTEXTO
     A home e identificada por assinatura de DOM, nao por URL: o mesmo hotsite
     responde em /pt/ e em /pt/hotsite/<id>, e a assinatura cobre os dois.
     --------------------------------------------------------------------------- */
  function context() {
    return {
      host:   q('#maincontent > div'),
      widget: q('#basic_availability_search'),
      grid:   q('#anuncio_grid')
    };
  }
  function isHome(ctx) {
    return !!(ctx.host && ctx.widget && ctx.grid);
  }

  /* ---------------------------------------------------------------------------
     DADOS REAIS DA PAGINA
     A grade de imoveis e populada de forma assincrona, por isso a leitura e
     repetida em intervalos curtos e limitados.
     --------------------------------------------------------------------------- */
  function readInventory() {
    var out = { count: 0, min: null };
    var grid = q('#anuncio_grid');
    if (!grid) { return out; }

    var slugs = Object.create(null);
    qa('a[href]', grid).forEach(function (a) {
      var m = (a.getAttribute('href') || '').match(/\/apartment\/([^\/?#]+)/);
      if (m) { slugs[m[1]] = 1; }
    });
    out.count = Object.keys(slugs).length;

    var min = null;
    (grid.textContent || '').replace(/R\$\s*([\d.]+),(\d{2})/g, function (all, intPart) {
      var v = parseInt(String(intPart).replace(/\./g, ''), 10);
      if (!isNaN(v) && v > 0 && (min === null || v < min)) { min = v; }
      return '';
    });
    out.min = min;
    return out;
  }

  /* ---------------------------------------------------------------------------
     MARCACAO
     --------------------------------------------------------------------------- */

  function buildShell() {
    /* 'is-ready' ja nasce na classe: a animacao de entrada comeca na primeira
       resolucao de estilo, sem depender de requestAnimationFrame (que fica
       congelado em abas de fundo) e sem nenhum frame de flicker. */
    var hero = make('section', 'eex-hero is-ready');
    hero.id = 'eex-hero';
    hero.setAttribute('aria-labelledby', 'eex-hero-title');
    hero.setAttribute('data-eex-version', VERSION);

    hero.innerHTML =
      '<div class="eex-hero__bg" aria-hidden="true"></div>' +
      /* Ordem do DOM = ordem do mobile: titulo, console, rodape. As grid-areas
         do hero.css desacoplam a composicao desta ordem, sem mexer neste HTML. */
      '<div class="eex-hero__inner">' +
        '<div class="eex-hero__copy">' +
          '<p class="eex-hero__eyebrow" data-eex-reveal style="--eex-i:0">' +
            '<span class="eex-hero__dot" aria-hidden="true"></span>' +
            esc(CONTENT.eyebrow) +
          '</p>' +
          '<h1 class="eex-hero__title" id="eex-hero-title">' +
            '<span class="eex-hero__title-line" data-eex-reveal style="--eex-i:1">' +
              esc(CONTENT.titleTop) +
            '</span>' +
            '<span class="eex-hero__title-line eex-hero__title-line--soft" data-eex-reveal style="--eex-i:2">' +
              esc(CONTENT.titleBottom) +
            '</span>' +
          '</h1>' +
          '<p class="eex-hero__lede" data-eex-reveal style="--eex-i:3">' + esc(CONTENT.lede) + '</p>' +
        '</div>' +
        '<div class="eex-hero__console" data-eex-reveal style="--eex-i:4">' +
          '<h2 class="eex-hero__sr">' + esc(CONTENT.consoleLabel) + '</h2>' +
          '<div class="eex-hero__slot"></div>' +
        '</div>' +
        '<div class="eex-hero__foot" data-eex-reveal style="--eex-i:6"></div>' +
        '<div class="eex-hero__cue" aria-hidden="true"></div>' +
      '</div>';

    return hero;
  }

  /* O link secundario aponta para a pagina real de listagem, lida do menu.
     Se o item nao existir, o rodape da hero simplesmente nao e renderizado. */
  function buildFoot(foot) {
    if (!foot) { return; }
    var nav = q('#header a[href*="imoveis"]') || q('#header a[href*="disponiveis"]');
    if (nav) {
      var link = make('a', 'eex-hero__link');
      link.setAttribute('href', nav.getAttribute('href'));
      link.appendChild(D.createTextNode(CONTENT.linkLabel));
      var arrow = make('span', 'eex-hero__link-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '\u2192';
      link.appendChild(arrow);
      foot.appendChild(link);
    }
    if (CONTENT.note) {
      var note = make('p', 'eex-hero__note');
      note.textContent = CONTENT.note;
      foot.appendChild(note);
    }
    if (!foot.childNodes.length && foot.parentNode) {
      foot.parentNode.removeChild(foot);
    }
  }

  /* ---------------------------------------------------------------------------
     PREPARO DO WIDGET NATIVO
     Apenas ADICIONA classes de gancho e rotulos. Nenhuma classe, atributo ou
     no original e removido, e a estrutura interna nao e alterada.
     --------------------------------------------------------------------------- */
  function firstChildDiv(el) {
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].tagName === 'DIV') { return el.children[i]; }
    }
    return null;
  }

  function tagCell(node, variant, label) {
    if (!node) { return null; }
    var cell = node.closest ? node.closest('.form-group') : null;
    if (!cell) { return null; }
    cell.classList.add('eex-cell');
    if (variant) { cell.classList.add(variant); }
    if (label) {
      /* A Hero e a referencia visual do projeto: quando ela rotula um campo, o
         rotulo do Search Console sai de cena. Os dois modulos decoram o mesmo
         formulario na home, e o hero.js carrega depois do search.js - por isso a
         limpeza precisa acontecer aqui. O guarda equivalente no search.js nunca
         dispararia sozinho, porque no instante em que ele roda este rotulo da
         Hero ainda nao existe. Os dois juntos deixam o resultado independente
         da ordem de carregamento. */
      var stale = cell.querySelectorAll('.eex-console__label');
      for (var si = 0; si < stale.length; si++) {
        if (stale[si].parentNode) { stale[si].parentNode.removeChild(stale[si]); }
      }
      if (!q('.eex-hero__field-label', cell)) {
        var tag = make('span', 'eex-hero__field-label');
        tag.textContent = label;
        cell.insertBefore(tag, cell.firstChild);
      }
    }
    return cell;
  }

  function tagWidget(widget) {
    widget.classList.add('eex-w');

    var wrap = firstChildDiv(widget);
    if (wrap) { wrap.classList.add('eex-wrap'); }

    var box = q('.search-box', widget) || (wrap ? firstChildDiv(wrap) : null);
    if (box) { box.classList.add('eex-box'); }

    var form = q('form', widget);
    if (form) { form.classList.add('eex-form'); }

    var row = form ? q('.row', form) : null;
    if (row) { row.classList.add('eex-row'); }

    tagCell(q('#datesRange', widget), 'eex-cell--dates', CONTENT.fieldLabels.dates);
    tagCell(q('select.selectpicker, select.persons', widget), 'eex-cell--guests', CONTENT.fieldLabels.guests);
    tagCell(q('.btn-primary, form button.btn', widget), 'eex-cell--cta', null);
  }

  /* ---------------------------------------------------------------------------
     MOVE E ROLLBACK
     --------------------------------------------------------------------------- */
  var anchor = null;

  function captureAnchor(widget) {
    anchor = { parent: widget.parentNode, next: widget.nextSibling };
  }
  function restoreWidget(widget) {
    if (!anchor || !anchor.parent) { return; }
    if (anchor.next && anchor.next.parentNode === anchor.parent) {
      anchor.parent.insertBefore(widget, anchor.next);
    } else {
      anchor.parent.appendChild(widget);
    }
  }

  /* ---------------------------------------------------------------------------
     MONTAGEM
     --------------------------------------------------------------------------- */
  function mount() {
    var ctx = context();
    if (!isHome(ctx)) { return; }
    if (q('#eex-hero')) { return; }

    var hero = null;
    var widget = ctx.widget;

    try {
      hero = buildShell();
      buildFoot(q('.eex-hero__foot', hero));

      ctx.host.insertBefore(hero, ctx.host.firstChild);

      tagWidget(widget);
      captureAnchor(widget);
      q('.eex-hero__slot', hero).appendChild(widget);

      D.documentElement.classList.add('eex-hero-active');
      window.__EEX_HERO_MOUNTED = true;

      /* Libera memoria de composicao ao fim de cada revelacao. */
      hero.addEventListener('animationend', function (ev) {
        var t = ev.target;
        if (t && t.hasAttribute && t.hasAttribute('data-eex-reveal')) {
          t.style.willChange = 'auto';
        }
      });
    } catch (err) {
      /* Rollback total: o site volta exatamente ao estado anterior. */
      try { restoreWidget(widget); } catch (e) { warn('rollback do widget falhou', e); }
      if (hero && hero.parentNode) { hero.parentNode.removeChild(hero); }
      D.documentElement.classList.remove('eex-hero-active');
      window.__EEX_HERO_MOUNTED = false;
      warn('montagem abortada, estado original restaurado', err);
    }
  }

  /* ---------------------------------------------------------------------------
     BOOT
     O script e carregado com defer, portanto o HTML da home ja esta parseado
     na primeira tentativa. O retry limitado cobre renderizacoes tardias.
     --------------------------------------------------------------------------- */
  var attempts = 0;
  function boot() {
    var ctx = context();
    if (ctx.host && ctx.widget && ctx.grid) { mount(); return; }
    if (attempts++ < 20) { setTimeout(boot, 250); }
  }

  if (D.readyState === 'loading') {
    D.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  /* ---------------------------------------------------------------------------
     RESTAURACAO PELO HISTORICO (bfcache / back-forward)
     Numa restauracao de historico o documento nao e reexecutado: nenhum script
     roda de novo e o boot() acima nunca dispara. Se o DOM restaurado voltar sem
     a hero montada (aba congelada antes da montagem, rollback ou restauracao
     parcial), a home reapareceria com a capa nativa antiga.
     Este handler apenas revalida o estado restaurado e, se a hero faltar,
     remonta chamando exatamente o mesmo mount() do carregamento normal - mesmo
     HTML, mesmo CSS, mesmo comportamento. Quando a hero volta integra ele nao
     faz nada, e fora da home ele nem chega a tentar.
     --------------------------------------------------------------------------- */
  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted) { return; }
    if (!isHome(context())) { return; }
    if (q('#eex-hero')) {
      D.documentElement.classList.add('eex-hero-active');
      return;
    }
    window.__EEX_HERO_MOUNTED = false;
    attempts = 0;
    boot();
  });

  /* Superficie minima de QA. */
  window.EEXHero = {
    version: VERSION,
    content: CONTENT,
    isMounted: function () { return !!q('#eex-hero'); },
    readInventory: readInventory
  };
})();
