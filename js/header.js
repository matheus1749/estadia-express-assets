/* =============================================================================
   ESTADIA EXPRESS - HEADER PREMIUM (comportamento)
   -----------------------------------------------------------------------------
   Responsabilidades, e nada alem disso:
     1. marcar o header com .eex-header;
     2. alternar .eex-header--scrolled conforme a rolagem;
     3. publicar a altura real do header em --eex-header-h;
     4. marcar o item de navegacao correspondente a pagina atual.

   Nao usa define() nem requirejs: o AMD da plataforma ja acusa
   "Mismatched anonymous define()" por causa do bundle do Meta Pixel, e este
   modulo nao deve participar desse carregador.
   ============================================================================= */
(function () {
  'use strict';

  if (window.__eexHeader) { return; }
  window.__eexHeader = true;

  var SCROLLED = 'eex-header--scrolled';
  var THRESHOLD = 8;

  function init() {
    var header = document.getElementById('header');
    if (!header || header.tagName !== 'HEADER') {
      header = document.querySelector('header#header');
    }
    if (!header) { return; }

    header.classList.add('eex-header');

    /* AT-QA-026: tres controles do header nativo sao icone puro, sem nome
       acessivel. mylist-btn e os dois toggles do menu mobile sao <a>/<div>
       cujo unico conteudo visivel e um icone (ou, no caso do mylist, so o
       contador "0") - nada ali diz "favoritos" ou "menu" para quem usa
       leitor de tela. Roda a cada init() porque a plataforma reconstroi
       parte do menu de forma assincrona (mesmo motivo do publishHeight
       abaixo), entao os elementos podem nao existir ainda na primeira
       passada.

       Mesmos dicionarios pt/en/es de cards.js/search.js (mesma correcao,
       mesmo padrao) - strings fixas em portugues aqui deixariam usuarios
       de /en/ e /es/ ouvindo rotulo no idioma errado. */
    var ICON_LABELS = {
      pt: { wish: 'Minha lista de favoritos', open: 'Abrir menu', close: 'Fechar menu' },
      en: { wish: 'My wishlist', open: 'Open menu', close: 'Close menu' },
      es: { wish: 'Mi lista de favoritos', open: 'Abrir menú', close: 'Cerrar menú' }
    };

    function iconLang() {
      var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (l.indexOf('en') === 0) { return 'en'; }
      if (l.indexOf('es') === 0) { return 'es'; }
      return 'pt';
    }

    /* Mesma ressalva de cards.js: role="button"+tabindex nao fazem o
       navegador converter Enter/Espaço em clique - sem esse bridge, quem
       usa teclado nunca conseguiria abrir/fechar o menu mobile. */
    function bridgeKeyboard(el) {
      if (el._eexKbBridged) { return; }
      el._eexKbBridged = true;
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    }

    function labelIcons() {
      var t = ICON_LABELS[iconLang()] || ICON_LABELS.pt;
      var wish = header.querySelector('.mylist-btn');
      if (wish && !wish.getAttribute('aria-label')) {
        wish.setAttribute('aria-label', t.wish);
      }
      var open = header.querySelector('.mobile-menu-toggle');
      if (open) {
        if (!open.getAttribute('aria-label')) { open.setAttribute('aria-label', t.open); }
        if (!open.hasAttribute('role')) { open.setAttribute('role', 'button'); }
        if (!open.hasAttribute('tabindex')) { open.setAttribute('tabindex', '0'); }
        bridgeKeyboard(open);
      }
      var close = document.querySelector('.mobile-menu-toggle-close');
      if (close) {
        if (!close.getAttribute('aria-label')) { close.setAttribute('aria-label', t.close); }
        if (!close.hasAttribute('role')) { close.setAttribute('role', 'button'); }
        if (!close.hasAttribute('tabindex')) { close.setAttribute('tabindex', '0'); }
        bridgeKeyboard(close);
      }
    }
    labelIcons();

    /* --- altura real, para quem precisar compensar o sticky ---------------- */
    var publishHeight = function () {
      var h = Math.round(header.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty('--eex-header-h', h + 'px');
      }
    };

    /* --- estado rolado ----------------------------------------------------- */
    var ticking = false;
    var last = null;

    var apply = function () {
      ticking = false;
      var scrolled = (window.pageYOffset || document.documentElement.scrollTop || 0) > THRESHOLD;
      if (scrolled === last) { return; }
      last = scrolled;
      header.classList.toggle(SCROLLED, scrolled);
    };

    var onScroll = function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      publishHeight();
      onScroll();
    }, { passive: true });

    /* --- item ativo -------------------------------------------------------- */
    try {
      var here = window.location.pathname.replace(/\/+$/, '');
      var links = header.querySelectorAll('nav.main-nav-menu .navbar-nav > li > a[href]');
      for (var i = 0; i < links.length; i++) {
        var raw = links[i].getAttribute('href') || '';
        if (!raw || raw.charAt(0) === '#') { continue; }
        var path;
        try { path = new URL(raw, window.location.origin).pathname.replace(/\/+$/, ''); }
        catch (e) { continue; }
        if (path && path === here) {
          links[i].parentNode.classList.add('active');
        }
      }
    } catch (e) { /* navegacao ativa e cosmetica: nunca deve quebrar o header */ }

    publishHeight();
    apply();

    /* A plataforma injeta parte do menu de forma assincrona (views/topmenu).
       Republicamos a altura depois que isso assenta - e reaplicamos os
       aria-label dos icones pelo mesmo motivo (mobile-menu-toggle-close em
       particular so existe depois que o drawer e montado). */
    setTimeout(function () { publishHeight(); labelIcons(); }, 400);
    setTimeout(function () { publishHeight(); labelIcons(); }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
