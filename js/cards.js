/* =============================================================================
   estadia-express - cards.js
   Design System V3 - Fase 3: adaptador do card de imovel.

   A plataforma entrega o card como um "panel" do Bootstrap 3, cheio de
   colunas, icones do Font Awesome e um botao solido. Este modulo NAO reescreve
   o card: ele TRADUZ essa marcacao para as classes do Design System e faz tres
   ajustes estruturais que o CSS sozinho nao consegue fazer:

     1. tira a barra de acoes de dentro da ancora da foto, para que o zoom no
        hover nao arraste os botoes junto;
     2. agrupa preco e CTA numa linha de rodape (.eex-tile__foot), para que
        cards de alturas diferentes terminem alinhados;
     3. quebra o texto unico do preco ("A partir de / R$ 180,00 / por noite")
        em tres partes, para que cada uma receba seu proprio peso tipografico.

   Nenhum no e destruido: tudo e movido, nunca recriado, para preservar os
   handlers que a plataforma tenha registrado.

   Pares: assets/cards.css. Sem AMD: o bundle da plataforma usa
   RequireJS e um define anonimo aqui quebraria o carregamento.
   ============================================================================= */
(function () {
  'use strict';

  if (window.__eexCards) { return; }
  window.__eexCards = true;

  var SCOPE = '.appThumb';
  var running = false;
  var timer = null;

  /* A plataforma nao flexiona o singular ("1 Banheiros"). A correcao vale
     apenas para a quantidade exata 1 e apenas para palavras conhecidas -
     nada de heuristica em cima de texto que nao controlamos. */
  var SINGULAR = {
    pt: {
      'Quartos': 'Quarto',
      'Banheiros': 'Banheiro',
      'H\u00f3spedes': 'H\u00f3spede',
      'Camas': 'Cama',
      'Su\u00edtes': 'Su\u00edte'
    },
    en: {
      'Bedrooms': 'Bedroom',
      'Bathrooms': 'Bathroom',
      'Guests': 'Guest',
      'Beds': 'Bed',
      'Suites': 'Suite'
    },
    es: {
      'Habitaciones': 'Habitaci\u00f3n',
      'Ba\u00f1os': 'Ba\u00f1o',
      'Hu\u00e9spedes': 'Hu\u00e9sped',
      'Camas': 'Cama'
    }
  };

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.indexOf('en') === 0) { return 'en'; }
    if (l.indexOf('es') === 0) { return 'es'; }
    return 'pt';
  }

  function add(el, names) {
    if (!el || !el.classList) { return; }
    var list = names.split(' ');
    for (var i = 0; i < list.length; i++) {
      if (list[i]) { el.classList.add(list[i]); }
    }
  }

  function flatten(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ===========================================================================
     ESTRUTURA - roda uma unica vez por card
     ======================================================================== */
  function structure(card) {
    if (card.getAttribute('data-eex-tile') === '1') { return; }
    card.setAttribute('data-eex-tile', '1');

    add(card, 'eex-card eex-card--flat eex-tile');
    add(card.querySelector('.panel'), 'eex-tile__panel');

    var media = card.querySelector('a.img-cover');
    var wrap = media ? media.parentElement : card.querySelector('.panel-body.p-0');
    add(media, 'eex-tile__media');
    add(wrap, 'eex-tile__mediawrap');

    var actions = card.querySelector('.card-actions');
    if (actions && wrap && actions.parentNode !== wrap) {
      wrap.appendChild(actions);
    }
    add(actions, 'eex-tile__actions');

    var bodies = card.querySelectorAll('.panel-body');
    var body = null;
    for (var i = 0; i < bodies.length; i++) {
      if (bodies[i] !== wrap) { body = bodies[i]; break; }
    }
    add(body, 'eex-card__body eex-tile__body');

    add(card.querySelector('.card-title'), 'eex-tile__titlewrap');
    add(card.querySelector('.card-title .h4, .card-title h4, .card-title .h3, .card-title h3'),
        'eex-card__title eex-tile__title');
    add(card.querySelector('.card-details'), 'eex-card__meta eex-tile__meta');

    var marker = card.querySelector('.card-details li .fa-map-marker');
    if (marker && marker.parentNode) {
      add(marker.parentNode, 'eex-tile__place-src');
    }
    add(card.querySelector('.apt-rating'), 'eex-tile__rating');

    var priceWrap = card.querySelector('.card-price');
    var ctaWrap = card.querySelector('.cta-details');
    add(priceWrap, 'eex-tile__pricewrap');
    add(ctaWrap, 'eex-tile__ctawrap');
    if (ctaWrap) { add(ctaWrap.querySelector('a'), 'eex-tile__cta'); }

    if (priceWrap && ctaWrap && priceWrap.parentNode === ctaWrap.parentNode) {
      var foot = document.createElement('div');
      foot.className = 'eex-tile__foot';
      priceWrap.parentNode.insertBefore(foot, priceWrap);
      foot.appendChild(priceWrap);
      foot.appendChild(ctaWrap);
    }

    var href = media ? media.getAttribute('href') : null;
    if (href && !card.querySelector('.eex-tile__overlay')) {
      var overlay = document.createElement('a');
      overlay.className = 'eex-tile__overlay';
      overlay.setAttribute('href', href);
      overlay.setAttribute('tabindex', '-1');
      overlay.setAttribute('aria-hidden', 'true');
      var target = media.getAttribute('target');
      if (target) { overlay.setAttribute('target', target); }
      card.appendChild(overlay);
    }
  }

  /* ===========================================================================
     METADADOS - roda sempre; a plataforma reescreve a lista ao refazer a busca
     ======================================================================== */
  function singular(li) {
    var map = SINGULAR[lang()];
    var nodes = li.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType !== 3) { continue; }
      var raw = n.textContent;
      var m = flatten(raw).match(/^1 (.+)$/);
      if (!m) { continue; }
      var fixed = map[m[1]];
      if (!fixed) { continue; }
      n.textContent = raw.replace(m[1], fixed);
    }
  }

  /* O bairro sai da lista de metadados e vira sobrelinha acima do titulo. */
  function place(card) {
    var src = card.querySelector('.eex-tile__place-src');
    if (!src) { return; }
    var txt = flatten(src.textContent);
    var eyebrow = card.querySelector('.eex-tile__place');
    if (!txt) {
      if (eyebrow && eyebrow.parentNode) { eyebrow.parentNode.removeChild(eyebrow); }
      return;
    }
    if (!eyebrow) {
      var row = card.querySelector('.eex-tile__body > .row');
      var titleWrap = card.querySelector('.eex-tile__titlewrap');
      if (!row || !titleWrap) { return; }
      eyebrow = document.createElement('div');
      eyebrow.className = 'eex-tile__place';
      row.insertBefore(eyebrow, titleWrap);
    }
    if (eyebrow.textContent !== txt) { eyebrow.textContent = txt; }
  }

  function meta(card) {
    var items = card.querySelectorAll('.eex-tile__meta li');
    var first = true;
    for (var i = 0; i < items.length; i++) {
      var li = items[i];
      if (li.classList.contains('eex-tile__place-src')) { continue; }
      li.classList.remove('eex-first');
      if (!flatten(li.textContent)) {
        li.classList.add('eex-hide');
        continue;
      }
      li.classList.remove('eex-hide');
      singular(li);
      if (first) {
        li.classList.add('eex-first');
        first = false;
      }
    }
  }

  /* ===========================================================================
     PRECO - roda sempre; a troca de moeda reescreve o texto
     ======================================================================== */
  function price(card) {
    var host = card.querySelector('.card-price .price-night')
            || card.querySelector('.card-price .priceValue')
            || card.querySelector('.card-price .h5');
    if (!host) { return; }

    var flat = flatten(host.textContent);
    if (!flat) { return; }
    if (host.getAttribute('data-eex-price') === flat
        && host.querySelector('.eex-tile__price')) { return; }

    var parts = [];
    var chunks = host.textContent.split('\n');
    for (var i = 0; i < chunks.length; i++) {
      var c = chunks[i].trim();
      if (c) { parts.push(c); }
    }
    if (!parts.length) { return; }

    var prefix = '';
    var value = '';
    var unit = '';
    if (parts.length === 1) {
      value = parts[0];
    } else if (parts.length === 2) {
      value = parts[0];
      unit = parts[1];
    } else {
      prefix = parts[0];
      value = parts[1];
      unit = parts.slice(2).join(' ');
    }

    var html = '<span class="eex-tile__price">';
    if (prefix) {
      html += '<span class="eex-tile__price-prefix">' + esc(prefix) + '</span>';
    }
    html += '<span class="eex-tile__price-line">';
    html += '<span class="eex-tile__price-value">' + esc(value) + '</span>';
    if (unit) {
      html += '<span class="eex-tile__price-unit">' + esc(unit) + '</span>';
    }
    html += '</span></span>';

    host.innerHTML = html;
    host.setAttribute('data-eex-price', flatten(host.textContent));
  }

  /* ===========================================================================
     CARROSSEL DE DESTAQUES
     Vinha com 4 cards fixos ja a partir de 540px (esmaga o card no tablet) e
     15px de respiro. Passa a seguir o ritmo do Design System. Tudo dentro de
     try/catch: se a API do Swiper mudar, o carrossel original continua de pe.
     ======================================================================== */
  function slider() {
    var el = document.querySelector('#highlights_slider .swiper-container')
          || document.querySelector('#highlights_slider .swiper');
    if (!el || !el.swiper) { return; }
    if (el.getAttribute('data-eex-slider') === '1') { return; }

    var sw = el.swiper;
    var breakpoints = {
      540: { slidesPerView: 2, spaceBetween: 24 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 24 }
    };

    try {
      el.setAttribute('data-eex-slider', '1');
      if (sw.originalParams) {
        sw.originalParams.slidesPerView = 1.15;
        sw.originalParams.spaceBetween = 16;
        sw.originalParams.breakpoints = breakpoints;
      }
      sw.params.breakpoints = breakpoints;
      if (typeof sw.setBreakpoint === 'function') { sw.setBreakpoint(); }
      sw.update();

      /* As setas nasciam numa linha de 20px depois do carrossel, o que tornava
         impossivel alinha-las com a faixa da foto. Vao para dentro do proprio
         container (os handlers do Swiper acompanham o no). */
      var nav = [
        document.querySelector('#highlights_slider .swiper-button-prev'),
        document.querySelector('#highlights_slider .swiper-button-next')
      ];
      var host = nav[0] ? nav[0].parentNode : null;
      for (var n = 0; n < nav.length; n++) {
        if (nav[n] && nav[n].parentNode !== el) { el.appendChild(nav[n]); }
      }
      if (host && host !== el && !host.children.length) {
        host.className += ' eex-tile__navhost--empty';
      }
    } catch (e) {
      el.removeAttribute('data-eex-slider');
    }
  }

  /* ===========================================================================
     ORQUESTRACAO
     ======================================================================== */
  function run() {
    if (running) { return; }
    running = true;
    try {
      var cards = document.querySelectorAll(SCOPE);
      for (var i = 0; i < cards.length; i++) {
        structure(cards[i]);
        place(cards[i]);
        meta(cards[i]);
        price(cards[i]);
      }
      slider();
    } catch (e) {
      if (window.console && window.console.warn) {
        window.console.warn('[eex] cards.js:', e);
      }
    }
    running = false;
  }

  function schedule() {
    if (timer) { window.clearTimeout(timer); }
    timer = window.setTimeout(run, 120);
  }

  function observe() {
    if (!window.MutationObserver || !document.body) { return; }
    var obs = new window.MutationObserver(function (records) {
      if (running) { return; }
      for (var i = 0; i < records.length; i++) {
        if (records[i].addedNodes && records[i].addedNodes.length) {
          schedule();
          return;
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    run();
    observe();
    window.setTimeout(run, 400);
    window.setTimeout(run, 1200);
    window.setTimeout(run, 2500);
    window.addEventListener('load', run, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }
}());
