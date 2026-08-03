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
       Republicamos a altura depois que isso assenta. */
    setTimeout(publishHeight, 400);
    setTimeout(publishHeight, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
