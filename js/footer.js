/* ==========================================================================
   ESTADIA EXPRESS - js/footer.js
   Fase 6 do Design System V3 - Footer Premium
   --------------------------------------------------------------------------
   RESPONSABILIDADES
   1. Reposicionar o #ee-custom-footer logo acima do #mainfooter e revela-lo,
      escondendo o rodape nativo da plataforma.
   2. Fazer o link "Contato" (do menu e do proprio rodape) rolar suavemente
      ate o rodape em vez de navegar para /contact.
   3. Remover os emojis do markup, que vem de um template do Stays e nao pode
      ser editado por aqui.

   Os blocos 1 e 2 sao codigo migrado de js/legacy.js sem uma unica alteracao
   (bloco original linha 744). Foram recortados linha a linha do arquivo de
   origem justamente para nao haver risco de transcricao. O bloco 3 e novo e
   pertence ao redesenho.

   PAR VISUAL  assets/footer.css
   ========================================================================== */


/* --------------------------------------------------------------------------
   BLOCOS 1 e 2 - COMPORTAMENTO HERDADO (identico ao legado)
   -------------------------------------------------------------------------- */

(function() {
		function initEEFooter() {
			var footerDiv = document.getElementById('ee-custom-footer');
			var mainFooter = document.getElementById('mainfooter');
			if (!footerDiv || !mainFooter) return;
			if (footerDiv._eeFooterPlaced) return;
			footerDiv._eeFooterPlaced = true;
			mainFooter.parentElement.insertBefore(footerDiv, mainFooter);
			footerDiv.style.display = 'block';
			mainFooter.style.display = 'none';
		}
		function tryFooterInit() {
			if (document.body && document.getElementById('mainfooter')) {
				initEEFooter();
				return true;
			}
			return false;
		}
		if (!tryFooterInit()) {
			var _eeFootObs = new MutationObserver(function() {
				if (tryFooterInit()) _eeFootObs.disconnect();
			});
			_eeFootObs.observe(document.documentElement, { childList: true, subtree: true });
			setTimeout(function() { _eeFootObs.disconnect(); }, 15000);
			setTimeout(tryFooterInit, 100);
			setTimeout(tryFooterInit, 500);
			setTimeout(tryFooterInit, 1500);
		}
	})();
	(function() {
		function interceptContactLink() {
			var navLinks = document.querySelectorAll('nav.main-nav-menu a, .main-nav-menu a, nav a');
			var found = false;
			navLinks.forEach(function(a) {
				if (a.textContent.trim() === 'Contato' && a.href.indexOf('/contact') !== -1) {
					a.href = '#ee-custom-footer';
					a.setAttribute('data-ee-scroll-contact', '1');
					if (!a._eeContactBound) {
						a._eeContactBound = true;
						a.addEventListener('click', function(e) {
							e.preventDefault();
							var footer = document.getElementById('ee-custom-footer');
							if (footer) {
								footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
							}
						});
					}
					found = true;
				}
			});
			return found;
		}
		function interceptFooterContactLink() {
			var footerLinks = document.querySelectorAll('#ee-custom-footer a');
			footerLinks.forEach(function(a) {
				if (a.textContent.trim().indexOf('Contato') !== -1 && a.href.indexOf('/contact') !== -1) {
					a.href = '#ee-custom-footer';
					if (!a._eeFootContactBound) {
						a._eeFootContactBound = true;
						a.addEventListener('click', function(e) {
							e.preventDefault();
							var footer = document.getElementById('ee-custom-footer');
							if (footer) {
								footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
							}
						});
					}
				}
			});
		}
		function tryIntercept() {
			interceptContactLink();
			interceptFooterContactLink();
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', tryIntercept);
		} else {
			tryIntercept();
		}
		setTimeout(tryIntercept, 500);
		setTimeout(tryIntercept, 1500);
		var _eeNavObs = new MutationObserver(function() { tryIntercept(); });
		_eeNavObs.observe(document.documentElement, { childList: true, subtree: true });
		setTimeout(function() { _eeNavObs.disconnect(); }, 30000);
	})();

/* --------------------------------------------------------------------------
   BLOCO 3 - LIMPEZA TIPOGRAFICA (novo na Fase 6)
   -------------------------------------------------------------------------- */

(function () {
	"use strict";

	if (window.__eexFooterV3) return;
	window.__eexFooterV3 = true;

	/* Emojis sao o detalhe mais "template" do rodape: mudam de desenho em cada
	   sistema operacional e destoam por completo da tipografia do projeto.
	   Como o HTML do rodape mora num template do Stays, a limpeza precisa
	   acontecer no cliente. Só o pictograma inicial sai; o texto util fica. */
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

	function clean() {
		var footer = document.getElementById("ee-custom-footer");
		if (!footer) return false;

		var links = footer.querySelectorAll(".ee-foot-nav-list li a, .ee-foot-legal-links a");
		for (var i = 0; i < links.length; i++) stripLeadingPictogram(links[i]);

		/* Os tres quadrados de 36x36 com emoji viram um tique de acento
		   desenhado inteiramente em CSS. Aqui apenas esvaziamos o conteudo e
		   tiramos o elemento da arvore de acessibilidade: quem carrega o
		   significado e o rotulo ao lado (WHATSAPP, E-MAIL, ENDERECO). */
		var icons = footer.querySelectorAll(".ee-foot-icon");
		for (var j = 0; j < icons.length; j++) {
			if (icons[j].textContent !== "") icons[j].textContent = "";
			icons[j].setAttribute("aria-hidden", "true");
		}

		footer.setAttribute("data-eex-footer", "v3");
		return true;
	}

	function boot() {
		clean();

		/* O rodape e movido de lugar pelo bloco 1 e pode ainda nao estar no
		   DOM no primeiro passe. Observamos por um periodo curto, com debounce
		   por setTimeout - de proposito, e nao por requestAnimationFrame, que
		   nao dispara quando a aba esta em segundo plano. */
		var timer = null;
		var obs = new MutationObserver(function () {
			if (timer) return;
			timer = setTimeout(function () { timer = null; clean(); }, 50);
		});
		obs.observe(document.documentElement, { childList: true, subtree: true });
		setTimeout(function () { obs.disconnect(); }, 15000);

		/* Rede de seguranca para o caso de o rodape chegar fora de qualquer
		   mutacao observada (render tardio da plataforma). */
		setTimeout(clean, 300);
		setTimeout(clean, 1200);
		setTimeout(clean, 3000);
		window.addEventListener("load", clean);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
