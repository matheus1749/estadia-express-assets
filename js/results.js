/* ============================================================================
   estadia-express - results.js
   Design System V3 - Fase 4: Pagina de resultados

   Este modulo tem dois papeis.

   1) Estrangulamento do legacy.js
      O bloco "correcoes de toque no mobile" saiu do legacy.js e veio para ca
      SEM UMA LINHA DE DIFERENCA. Ele cuida do overlay de <select> nativo em
      telas pequenas, do filtro que esconde cartoes e do respiro dos botoes
      sociais. Continua sem guarda de pagina, exatamente como estava, para que
      o comportamento em todas as paginas siga identico.

      Outros tres blocos do legacy.js foram apenas apagados, nao movidos:
      eles eram copias byte a byte de codigo que ja vive no app.js
      (bindFilterHandlers, _maisFiltrosGlobalFix e fixPersonsDropup). Como o
      legacy.js carrega primeiro, era a copia dele que registrava a guarda e
      a do app.js ficava morta. Removendo as do legacy, as do app.js assumem
      o mesmo papel na mesma ordem.

   2) Acabamento da pagina de resultados
      Apenas o que nao da para resolver com CSS. Hoje: limpar o rotulo orfao
      no contador de resultados.

   Ordem de carregamento: depois do legacy.js e ANTES do app.js.
   ============================================================================ */

/* ----------------------------------------------------------------------------
   1. MOVIDO DO LEGACY.JS - correcoes de toque no mobile
   Origem: legacy.js linhas 866-1002 (bloco original do head_section: 901).
   Copia literal. Nao refatorar aqui: a refatoracao fica para depois que o
   legacy.js estiver vazio.
   ---------------------------------------------------------------------------- */
	(function() {
		if (window._eeMobileTouchFix) return;
		window._eeMobileTouchFix = true;
		var cssRules = [
			"html, body { cursor: pointer }",
			".appThumb.ee-hidden-by-filter { display:none !important }",
			"@media (max-width: 767px) {",
			"  .apt-social { z-index: 20 !important; pointer-events: auto !important; }",
			"}"
		];
		var st = document.createElement("style");
		st.id = "ee-mobile-fix-css";
		st.textContent = cssRules.join("\n");
		document.head.appendChild(st);
		function isMobile() { return window.innerWidth <= 767 || ("ontouchstart" in window && window.innerWidth <= 1024); }
		function addNativeOverlay(bsDiv) {
			if (bsDiv.querySelector(".ee-native-sel")) return;
			var origSel = bsDiv.querySelector("select");
			if (!origSel) return;
			var overlay = document.createElement("select");
			overlay.className = "ee-native-sel";
			overlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;z-index:50;cursor:pointer;font-size:16px;-webkit-appearance:menulist-button;";
			Array.from(origSel.options).forEach(function(o) {
				var opt = document.createElement("option");
				opt.value = o.value; opt.text = o.text; opt.selected = o.selected;
				overlay.appendChild(opt);
			});
			overlay.addEventListener("change", function() {
				origSel.value = this.value;
				var jq = window.$ || window.jQuery;
				if (jq) { jq(origSel).val(this.value).trigger("change"); }
				try { jq(origSel).selectpicker("refresh"); } catch(e) {}
				var innerEl = bsDiv.querySelector(".filter-option-inner-inner, .filter-option");
				if (innerEl) innerEl.textContent = this.options[this.selectedIndex].text;
			});
			var toggle = bsDiv.querySelector("button.dropdown-toggle");
			if (toggle) {
				if (!toggle.style.position || toggle.style.position === "static") toggle.style.position = "relative";
				toggle.appendChild(overlay);
			}
		}
		function initMobileOverlays() {
			if (!isMobile()) return;
			var sel = ".bootstrap-select.persons, .bootstrap-select.person";
			document.querySelectorAll(sel).forEach(addNativeOverlay);
		}
		function closeOverlay() {
			var ov = document.getElementById("ee-filter-overlay");
			var dim = document.querySelector(".ee-filter-dim");
			if (ov) ov.classList.remove("active");
			if (dim) dim.classList.remove("active");
			document.body.style.overflow = "";
		}
		var _fv = { rooms: 1, beds: 1, baths: 1 };
		function parseCard(card) {
			var text = card.textContent || "";
			var mR = text.match(/(\d+)\s*Quarto/i);
			var mB = text.match(/(\d+)\s*Cama/i);
			var mBa = text.match(/(\d+)\s*Banheiro/i);
			return {
				rooms: mR ? parseInt(mR[1]) : 1,
				beds: mB ? parseInt(mB[1]) : 1,
				baths: mBa ? parseInt(mBa[1]) : 1
			};
		}
		function applyFilter() {
			var r = _fv.rooms, b = _fv.beds, ba = _fv.baths;
			document.querySelectorAll(".appThumb").forEach(function(card) {
				var v = parseCard(card);
				var show = true;
				if (r > 1 && v.rooms < r) show = false;
				if (b > 1 && v.beds < b) show = false;
				if (ba > 1 && v.baths < ba) show = false;
				card.classList.toggle("ee-hidden-by-filter", !show);
			});
		}
		function watchResults() {
			var list = document.getElementById("resultlist");
			if (!list) { setTimeout(watchResults, 500); return; }
			var pending;
			new MutationObserver(function() {
				clearTimeout(pending);
				pending = setTimeout(applyFilter, 500);
			})
				.observe(list, { childList: true });
		}
		function prePopulate() {
			var p = new URLSearchParams(window.location.search);
			var r = parseInt(p.get("minBedrooms")) || 1;
			var b = parseInt(p.get("minBeds")) || 1;
			var ba = parseInt(p.get("minBathrooms")) || 1;
			_fv = { rooms: r, beds: b, baths: ba };
			var eR = document.getElementById("ee-val-rooms");
			var eB = document.getElementById("ee-val-beds");
			var eBa = document.getElementById("ee-val-baths");
			if (eR && r > 1) { eR.textContent = r; var mR = document.querySelector("[data-counter=\"rooms\"][data-dir=\"-1\"]"); if(mR) mR.disabled = false; }
			if (eB && b > 1) { eB.textContent = b; var mB = document.querySelector("[data-counter=\"beds\"][data-dir=\"-1\"]"); if(mB) mB.disabled = false; }
			if (eBa && ba > 1) { eBa.textContent = ba; var mBa = document.querySelector("[data-counter=\"baths\"][data-dir=\"-1\"]"); if(mBa) mBa.disabled = false; }
		}
		function bindTouch() {
			document.addEventListener("touchend", function(e) {
				var t = e.target, cls = t.classList;
				if (cls.contains("fmod-close") || cls.contains("fmod-btn-clear")) { e.preventDefault(); closeOverlay(); return; }
				if (cls.contains("fmod-btn-apply")) {
					e.preventDefault();
					var vR = document.getElementById("ee-val-rooms");
					var vB = document.getElementById("ee-val-beds");
					var vBa = document.getElementById("ee-val-baths");
					_fv = { rooms: vR ? (parseInt(vR.textContent)||1) : 1, beds: vB ? (parseInt(vB.textContent)||1) : 1, baths: vBa ? (parseInt(vBa.textContent)||1) : 1 };
					(function(b){setTimeout(function(){$(b).trigger("click");},0);})(t); return;
				}
				var counterBtn = t.closest ? t.closest(".ee-counter-btn") : (cls.contains("ee-counter-btn") ? t : null);
				if (counterBtn) {
					t = counterBtn; cls = t.classList;
					var now = Date.now();
					if (now - (t._lastTap||0) < 600) return;
					t._lastTap = now;
					e.preventDefault();
					(function(b){setTimeout(function(){$(b).trigger("click");},0);})(t);
					return;
				}
				if (cls.contains("ee-amenity-chip")) { e.preventDefault(); (function(b){setTimeout(function(){$(b).trigger("click");},0);})(t); return; }
			}, { passive: false });
			document.addEventListener("click", function(e) {
				var t = e.target;
				if (t.classList && t.classList.contains("ee-counter-btn") && t._lastTap && Date.now()-t._lastTap<600) e.stopImmediatePropagation();
			}, true);
		}
		function init() {
			bindTouch();
			initMobileOverlays();
			prePopulate();
			watchResults();
			setTimeout(applyFilter, 3000);
		}
		setTimeout(init, 500);
	})();

/* ----------------------------------------------------------------------------
   2. O CONTADOR DE RESULTADOS
   A plataforma imprime "38 Imoveis disponiveis - Filtros" e o "- Filtros"
   nunca recebe nada depois: os filtros aplicados aparecem como chips logo
   acima, no #tagplace. Sobra um separador pendurado no fim de um titulo que
   e o maior elemento tipografico da pagina.

   Cortamos so o rabo: se o texto termina em separador (com ou sem a palavra
   que o segue vazia), ele sai. Se um dia a plataforma passar a listar algo
   depois do separador, a regra nao casa e o texto fica intacto.
   ---------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (window.__eexResultCount) { return; }
  window.__eexResultCount = true;

  /* Separador seguido de "Filtros" e nada mais, no fim da string. */
  var ORPHAN = /\s*[-\u2013\u2014]\s*Filtros\s*$/i;

  /* AT-QA-023: mesmo estilo visualmente-oculto que a Hero ja usa para o H2 do
     console de busca (hero.css, .eex-hero__sr) - copiado aqui em vez de
     referenciar a classe porque este modulo nao carrega hero.css. */
  var SR_ONLY = 'position:absolute!important;width:1px;height:1px;padding:0;' +
    'margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';

  function clean() {
    var box = document.querySelector('.result-counts-container');
    if (!box) { return; }

    /* Percorre apenas os nos de texto diretos: o <span> do numero fica de fora. */
    var nodes = box.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.nodeType !== 3) { continue; }
      if (!ORPHAN.test(n.nodeValue)) { continue; }
      n.nodeValue = n.nodeValue.replace(ORPHAN, '');
    }
  }

  /* AT-QA-023: a pagina de busca (/pt/search) nao tem nenhum <h1> nativo -
     confirmado ao vivo (home e imovel ja tem: hero.js injeta o da home,
     o de imovel e nativo da propria plataforma). O contador de resultados
     e o maior elemento tipografico real da pagina (comentario da secao
     acima), entao vira a fonte do H1: injetamos um <h1> visualmente oculto
     com o mesmo texto ja limpo por clean(), sincronizado pelo mesmo
     observer que ja cuida do rotulo orfao - nao criamos um segundo
     observer para o mesmo elemento. */
  function syncH1() {
    var box = document.querySelector('.result-counts-container');
    if (!box) { return; }
    var text = box.textContent.replace(/\s+/g, ' ').trim();
    if (!text) { return; }
    var h1 = document.getElementById('ee-results-h1');
    if (!h1) {
      h1 = document.createElement('h1');
      h1.id = 'ee-results-h1';
      h1.style.cssText = SR_ONLY;
      box.parentNode.insertBefore(h1, box);
    }
    if (h1.textContent !== text) { h1.textContent = text; }
  }

  function sync() {
    clean();
    syncH1();
  }

  /* A lista chega por AJAX em lotes e a plataforma reescreve o contador a
     cada lote, entao nao basta rodar uma vez. */
  function watch() {
    var box = document.querySelector('.result-counts-container');
    if (!box || typeof MutationObserver !== 'function') { return; }

    var pending = null;
    var obs = new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(sync, 60);
    });
    obs.observe(box, { childList: true, characterData: true, subtree: true });
  }

  function run() {
    sync();
    watch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
