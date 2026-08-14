/* ==========================================================================
   ESTADIA EXPRESS - js/footer.js
   Fase 6 do Design System V3 - Footer Premium
   --------------------------------------------------------------------------
   RESPONSABILIDADES
   1. Fazer o link "Contato" (do menu e do proprio rodape) rolar suavemente
      ate o rodape em vez de navegar para /contact.
   2. Remover os emojis do markup, que vem de um template do Stays e nao pode
      ser editado por aqui.

   O bloco 1 (abaixo) e codigo migrado de js/legacy.js sem uma unica
   alteracao (bloco original linha 744). Foi recortado linha a linha do
   arquivo de origem justamente para nao haver risco de transcricao. O
   bloco 2 e novo e pertence ao redesenho.

   D-016: existia aqui um bloco adicional (o antigo "Bloco 1") que localizava
   um #ee-custom-footer ja presente no DOM e o reposicionava antes do
   #mainfooter, escondendo o rodape nativo. Removido: js/app.js
   (initEEFooter) passou a ser a unica fonte de criacao/posicionamento do
   footer, adotando-e-substituindo qualquer elemento zumbi que ja exista
   (ver comentario em app.js). Como js/footer.js carrega com defer antes de
   js/app.js, manter aquele bloco aqui so fazia um trabalho descartado a
   cada carregamento - app.js remove/recria o elemento logo em seguida.

   PAR VISUAL  assets/footer.css
   ========================================================================== */


/* --------------------------------------------------------------------------
   BLOCO 1 - COMPORTAMENTO HERDADO (identico ao legado)
   -------------------------------------------------------------------------- */

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
   BLOCO 2 - LIMPEZA TIPOGRAFICA (novo na Fase 6)
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

		/* O rodape e criado/posicionado por js/app.js (initEEFooter) e pode
		   ainda nao estar no DOM no primeiro passe deste arquivo, que carrega
		   antes. Observamos por um periodo curto, com debounce por setTimeout
		   - de proposito, e nao por requestAnimationFrame, que nao dispara
		   quando a aba esta em segundo plano. */
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
