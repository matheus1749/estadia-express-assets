/* ============================================================================
   estadia-express - property.js
   Design System V3 - Fase 5: Pagina do imovel

   Faz duas coisas que o CSS nao alcanca e hospeda o bloco de comportamento
   da pagina do imovel que saiu do legacy.js nesta fase.
   ============================================================================ */
(function () {
  "use strict";

  if (window.__eexPropertyBound) return;
  window.__eexPropertyBound = true;

  var PAGE = "__page_apartment";

  function onPage() {
    return !!(document.body && document.body.classList.contains(PAGE));
  }

  /* --------------------------------------------------------------------------
     1. O TOPO DO PAINEL DE RESERVA
     A plataforma escreve, direto no elemento,
     style="position:sticky!important;top:110px!important".
     Declaracao inline com !important nao perde para folha de estilo nenhuma -
     nem com !important do nosso lado. Ou seja: o property.css sozinho nao
     consegue corrigir isso, quem limpa e daqui.

     Removemos apenas a declaracao "top" e preservamos o resto do style inline
     (inclusive o position:sticky, que esta correto). A partir dai o
     property.css assume com calc(--eex-header-h + --eex-s5): o painel passa a
     respeitar a altura real do header em vez dos 110px chutados.
     -------------------------------------------------------------------------- */
  function freeStickyTop() {
    var panels = document.querySelectorAll(".sticky-panel");
    for (var i = 0; i < panels.length; i++) {
      var el = panels[i];
      var style = el.getAttribute("style");
      if (!style || !/(^|;)\s*top\s*:/i.test(style)) continue;
      el.setAttribute("style", style.replace(/(^|;)\s*top\s*:[^;]*(;|$)/gi, "$1"));
    }
  }

  /* --------------------------------------------------------------------------
     2. A VIRGULA ORFA DA LOCALIZACAO
     A linha de local e montada como "bairro, cidade". Quando o imovel nao tem
     bairro cadastrado - o caso deste inventario - sobra ", Goiania", comecando
     com virgula. Nao da para consertar no CSS porque e conteudo, nao forma.
     Tiramos so a pontuacao inicial, sem tocar no resto do texto.
     -------------------------------------------------------------------------- */
  function fixLocationLine() {
    var head = document.querySelector("#buildingDesc h4");
    if (!head) return;
    var items = head.querySelectorAll("li");
    for (var i = 0; i < items.length; i++) {
      var walker = document.createTreeWalker(items[i], NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue.replace(/[\s\u00a0]/g, "")) continue;
        var fixed = node.nodeValue.replace(/^[\s\u00a0]*,[\s\u00a0]*/, "");
        if (fixed !== node.nodeValue) node.nodeValue = fixed;
        break;
      }
    }
  }

  function run() {
    if (!onPage()) return;
    freeStickyTop();
    fixLocationLine();
  }

  function boot() {
    if (!onPage()) return;
    run();

    /* O painel e a ficha sao montados pelo JS da plataforma depois do
       DOMContentLoaded, e o "top" inline as vezes so aparece nesse momento.
       Observamos o documento e reaplicamos, com uma folga curta por timer.
       Nao usamos requestAnimationFrame aqui: em aba em segundo plano o rAF
       fica parado e a correcao nunca aconteceria. */
    var timer = null;
    var mo = new MutationObserver(function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; run(); }, 50);
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"]
    });
    /* Passados 20s a pagina ja estabilizou; soltamos o observador e ficamos
       so com o resize, que e quando a plataforma poderia reescrever o topo. */
    setTimeout(function () { mo.disconnect(); }, 20000);

    /* Rede de seguranca: se o observador for desligado antes de a plataforma
       escrever o topo, estes disparos cobrem a janela. */
    setTimeout(run, 500);
    setTimeout(run, 1500);
    setTimeout(run, 3000);
    window.addEventListener("load", run);
    window.addEventListener("resize", run);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* ----------------------------------------------------------------------------
   MOVIDO DO legacy.js (bloco original 556), Fase 5.
   O bypass do botao "Reserve ja" e o atalho de checkout para usuarios
   anonimos. Transplantado sem uma unica alteracao - o codigo abaixo e
   exatamente o que rodava no legacy.js, so mudou de arquivo.
   ---------------------------------------------------------------------------- */
(function() {
		function applyBookingBypass() {
			if (typeof requirejs === "undefined") return;
			requirejs(["jquery"], function($) {
				$(document).off("click", ".bookbutton");
				$(document).on("click.bypassed", ".bookbutton", function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					var bookBtn = $("#panelBook .bookbutton");
					if (bookBtn.length) {
						var href = bookBtn.attr("href");
						if (href) {
							window.location.href = href;
							return false;
						}
					}
				});
			});
		}
		setTimeout(applyBookingBypass, 1500);
		setTimeout(applyBookingBypass, 3000);
		setTimeout(applyBookingBypass, 5000);
	})();
	(function(){
		// FIX: bypass do modal quebrado no botao "Reserve ja" (usuarios anonimos).
		// A Stays ja gera, oculto, um link nativo ".bookbutton" dentro de "#panelBook"
		// com o href correto do checkout (id/datas/hospedes ja inclusos).
		// Interceptamos o clique em FASE DE CAPTURA (antes do handler nativo da Stays)
		// e navegamos direto para esse href - sem montar URL manualmente, sem alterar
		// codigo da plataforma, sem setTimeout/polling. Se nao houver ".bookbutton"
		// com href valido dentro do mesmo "#panelBook", o clique segue o fluxo nativo
		// normalmente (fallback seguro). Escopo restrito ao botao de reserva do imovel.
		if (window.__directCheckoutBypassBound) return;
		window.__directCheckoutBypassBound = true;
		document.addEventListener("click", function(e){
			var btn = e.target && e.target.closest && e.target.closest("#panelBook .btn-create-user");
			if (!btn) return;
			var panel = btn.closest("#panelBook");
			var bookBtn = panel ? panel.querySelector(".bookbutton") : null;
			var href = bookBtn ? bookBtn.getAttribute("href") : null;
			if (!href) return;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			window.location.href = href;
		}, true);
	})();
