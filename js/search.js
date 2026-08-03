/* =============================================================================
   ESTADIA EXPRESS - SEARCH CONSOLE (comportamento)
   -----------------------------------------------------------------------------
   A plataforma entrega a busca como um .input-group do Bootstrap 3: icone
   colorido em caixa, campo sem rotulo e botao primario. Nao ha nenhum gancho
   estavel de classe e os IDs de bloco do hotsite sao gerados (#C321f17), logo
   nao servem de seletor.

   Este modulo nao redesenha nada. Ele apenas:
     1. marca os containers com ganchos estaveis (.eex-console, .eex-searchband);
     2. injeta o rotulo micro em caixa alta de cada campo, do mesmo jeito que a
        Hero faz, para que assets/search.css possa reproduzir a mesma linguagem;
     3. reaplica os ganchos quando a plataforma reconstroi o formulario.

   Todo o visual vive em assets/search.css. Nada aqui define estilo.
   Nao usa define() nem requirejs.
   ============================================================================= */
(function () {
  'use strict';

  if (window.__eexSearch) { return; }
  window.__eexSearch = true;

  /* Rotulos fixos, exatamente os mesmos da Hero, para que os dois consoles se
     leiam como o mesmo objeto. Nao reaproveitamos o placeholder do campo: ele
     continua no lugar, dizendo "Check-in e checkout" abaixo do rotulo "Datas",
     que e a hierarquia que a Hero estabeleceu. */
  var LABELS = {
    'pt': { dates: 'Datas', guests: 'Hóspedes' },
    'en': { dates: 'Dates', guests: 'Guests' },
    'es': { dates: 'Fechas', guests: 'Huéspedes' }
  };

  function readLabels() {
    var lang = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
    if (!LABELS[lang]) {
      lang = (window.location.pathname.split('/')[1] || 'pt').toLowerCase();
    }
    return LABELS[lang] || LABELS.pt;
  }

  function label(text) {
    var s = document.createElement('span');
    s.className = 'eex-console__label';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = text;
    return s;
  }

  function decorate(form) {
    var row = form.querySelector(':scope > .row, :scope > div > .row');
    if (!row) { return false; }

    var dateInput = form.querySelector('input#datesRange, input[name="dates"]');
    var guestSel = form.querySelector('select.persons, select.selectpicker');
    var cta = form.querySelector('button[type="submit"], button.btn-primary, .btn-primary');

    /* Sem os tres elementos nao e o console de busca: nao tocamos. */
    if (!dateInput && !guestSel) { return false; }

    form.classList.add('eex-console');
    row.classList.add('eex-console__row');

    var texts = readLabels();
    var cells = row.children;

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.nodeType !== 1) { continue; }
      cell.classList.add('eex-console__cell');

      var kind = null;
      if (dateInput && cell.contains(dateInput)) { kind = 'dates'; }
      else if (guestSel && cell.contains(guestSel)) { kind = 'guests'; }
      else if (cta && cell.contains(cta)) { kind = 'cta'; }

      if (kind === 'cta') {
        cell.classList.add('eex-console__cell--cta');
        continue;
      }
      if (!kind) {
        cell.classList.add('eex-console__cell--other');
        continue;
      }

      cell.classList.add('eex-console__cell--' + kind);
      if (!cell.querySelector(':scope > .eex-console__label')) {
        cell.insertBefore(label(texts[kind]), cell.firstChild);
      }
    }

    if (cta) { cta.classList.add('eex-console__cta'); }

    return true;
  }

  /* A faixa colorida que envolve a busca no hotsite e um bloco gerado. Subimos
     do #block-simple-search ate o primeiro ancestral que realmente pinta fundo. */
  function markBand(form) {
    var box = form.closest('#block-simple-search, .search-box');
    if (!box) { return; }
    box.classList.add('eex-console__box');
    var band = box.parentElement;
    for (var i = 0; band && i < 3; i++) {
      var bg = window.getComputedStyle(band).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        band.classList.add('eex-searchband');
        return;
      }
      band = band.parentElement;
    }
  }

  function run() {
    var forms = document.querySelectorAll('form.ajax_form, form.filterSearchBox');
    var touched = 0;
    for (var i = 0; i < forms.length; i++) {
      if (decorate(forms[i])) { markBand(forms[i]); touched++; }
    }
    if (document.getElementById('advancedSearch')) {
      document.getElementById('advancedSearch').classList.add('eex-console__box', 'eex-console__box--page');
    }
    return touched;
  }

  function init() {
    run();

    /* A plataforma reconstroi o bootstrap-select e, na pagina de busca, troca o
       bloco de resultados por ajax. Um observer curto e barato garante que os
       ganchos voltem sem precisarmos de polling. */
    var pending = false;
    var obs = new MutationObserver(function () {
      if (pending) { return; }
      pending = true;
      window.requestAnimationFrame(function () { pending = false; run(); });
    });
    var root = document.getElementById('maincontent') || document.body;
    obs.observe(root, { childList: true, subtree: true });

    /* Redes lentas: a busca as vezes so aparece depois do primeiro paint. */
    setTimeout(run, 600);
    setTimeout(run, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
