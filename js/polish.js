/* ==========================================================================
   ESTADIA EXPRESS - js/polish.js
   Fase 7 do Design System V3 - Polimento global
   --------------------------------------------------------------------------
   Duas tarefas pequenas nas paginas de conteudo, ambas impossiveis de fazer
   so com CSS porque o HTML vem de um template do Stays:

   1. Tirar os emojis do indice lateral (os mesmos do rodape: mudam de
      desenho em cada sistema operacional e destoam da tipografia).
   2. Marcar no indice qual e a pagina atual, com aria-current - que serve
      tanto para leitores de tela quanto para o estilo do item ativo.

   PAR VISUAL  assets/polish.css
   ========================================================================== */

(function () {
	"use strict";

	if (window.__eexPolishV3) return;
	window.__eexPolishV3 = true;

	/* Mesmo criterio do js/footer.js: so o pictograma inicial sai. */
	var LEADING_PICTOGRAM = /^[\s\u00a0]*(?:[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0E}\u{FE0F}\u{200D}]+)[\s\u00a0]*/u;

	function stripLeadingPictogram(el) {
		for (var i = 0; i < el.childNodes.length; i++) {
			var node = el.childNodes[i];
			if (node.nodeType === 3 && LEADING_PICTOGRAM.test(node.nodeValue)) {
				node.nodeValue = node.nodeValue.replace(LEADING_PICTOGRAM, "");
				return true;
			}
		}
		return false;
	}

	function run() {
		var list = document.querySelector("#maincontent .nav.nav-stacked");
		if (!list) return false;

		var links = list.querySelectorAll("a");
		var here = location.pathname.replace(/\/+$/, "");

		for (var i = 0; i < links.length; i++) {
			stripLeadingPictogram(links[i]);

			/* Comparacao por pathname, ignorando barra final e query, para nao
			   depender de o CMS escrever o href sempre do mesmo jeito. */
			var href = links[i].getAttribute("href") || "";
			var path;
			try {
				path = new URL(href, location.origin).pathname.replace(/\/+$/, "");
			} catch (e) {
				path = "";
			}
			if (path && path === here) {
				links[i].setAttribute("aria-current", "page");
			} else {
				links[i].removeAttribute("aria-current");
			}
		}

		list.setAttribute("data-eex-polish", "v3");
		return true;
	}

	function boot() {
		run();

		/* Debounce por setTimeout, e nao por requestAnimationFrame, que nao
		   dispara com a aba em segundo plano. */
		var timer = null;
		var obs = new MutationObserver(function () {
			if (timer) return;
			timer = setTimeout(function () { timer = null; run(); }, 50);
		});
		obs.observe(document.documentElement, { childList: true, subtree: true });
		setTimeout(function () { obs.disconnect(); }, 10000);

		setTimeout(run, 300);
		setTimeout(run, 1200);
		window.addEventListener("load", run);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
