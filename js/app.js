/* ============================================
   ESTADIA EXPRESS - APP.JS
   Bootstrap: injeta e inicializa o Footer
   (#ee-custom-footer) e o Modal de Filtros da
   busca. Migrado do head_section para arquivo
   externo. Logica funcional identica a original;
   unica mudanca e que o HTML (antes embutido
   diretamente na pagina) agora e injetado via JS
   no carregamento, pois passou a viver em
   variaveis de string neste arquivo.
   ============================================ */
(function(){
'use strict';

/* AT-QA-038: <html lang="pt"> vem nativo do template da Stays. Corrigimos
   para pt-BR aqui, no boot do overlay, antes de qualquer outra coisa - varios
   modulos (cards.js, search.js) ja leem esse atributo para logica de i18n. */
document.documentElement.setAttribute('lang', 'pt-BR');

var FOOTER_HTML = "<div id=\"ee-custom-footer\">\n\t<div class=\"ee-footer-inner\">\n\t\t<div class=\"ee-foot-col\">\n\t\t\t<div class=\"ee-foot-logo-text\">Estadia Express</div>\n\t\t\t<p class=\"ee-foot-tagline\">Lofts e apartamentos mobiliados em Goiânia.<br>Conforto, localização e atendimento de qualidade.</p>\n\t\t\t<p class=\"ee-foot-section-title\">Contato</p>\n\t\t\t<ul class=\"ee-foot-contact-list\">\n\t\t\t\t<li>\n\t\t\t\t\t<span class=\"ee-foot-icon\">📱</span>\n\t\t\t\t\t<span class=\"ee-foot-text\">\n\t\t\t\t\t\t<span>WhatsApp</span>\n\t\t\t\t\t\t<a href=\"https://wa.me/5562996959797\" target=\"_blank\" rel=\"noopener\">+55 (62) 99695-9797</a>\n\t\t\t\t\t</span>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<span class=\"ee-foot-icon\">✉️</span>\n\t\t\t\t\t<span class=\"ee-foot-text\">\n\t\t\t\t\t\t<span>E-mail</span>\n\t\t\t\t\t\t<a href=\"mailto:residencialcarajasgo@gmail.com\">residencialcarajasgo@gmail.com</a>\n\t\t\t\t\t</span>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<span class=\"ee-foot-icon\">📍</span>\n\t\t\t\t\t<span class=\"ee-foot-text\">\n\t\t\t\t\t\t<span>Endereço</span>\n\t\t\t\t\t\t<span>Rua 200, 531 - Qd. 23-A - Lt.06<br>Setor Leste Vila Nova, Goiânia - GO</span>\n\t\t\t\t\t</span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<div class=\"ee-foot-col\">\n\t\t\t<p class=\"ee-foot-section-title\">Informações Gerais</p>\n\t\t\t<ul class=\"ee-foot-nav-list\">\n\t\t\t\t<li><a href=\"/pt/residencial-carajas\">🌍 Sobre nós</a></li>\n\t\t\t\t<li><a href=\"/pt/search\">🏠 Imóveis Disponíveis</a></li>\n\t\t\t\t<li><a href=\"/pt/contact\">📞 Contato</a></li>\n\t\t\t\t<li><a href=\"/pt/terms_and_conditions\">📑 Termos e Condições</a></li>\n\t\t\t\t<li><a href=\"/pt/page/60345845008db5a7fb540671\">🔒 Política de Privacidade</a></li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<div class=\"ee-foot-col\">\n\t\t\t<p class=\"ee-foot-section-title\">Nos siga nas redes sociais</p>\n\t\t\t<div class=\"ee-foot-socials\">\n\t\t\t\t<a class=\"ee-foot-social-btn\" href=\"https://www.instagram.com/estadiaexpress?igsh=MXRmenAxZGw0bmtweg==\" target=\"_blank\" rel=\"noopener\" title=\"Instagram\" aria-label=\"Instagram\">\n\t\t\t\t\t<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/><line x1=\"17.5\" y1=\"6.5\" x2=\"17.51\" y2=\"6.5\"/></svg>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t<p class=\"ee-foot-section-title\" style=\"margin-top:32px;\">Formas de pagamento</p>\n\t\t\t<div class=\"ee-foot-payment-icons\">\n\t\t\t\t<span title=\"Pix\" style=\"display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.15);border-radius:4px;padding:2px 6px;font-size:11px;font-weight:700;color:#fff;letter-spacing:0.03em;vertical-align:middle;\">PIX</span>\n\t\t\t\t<i class=\"fa fa-money fa-lg\" aria-hidden=\"true\" title=\"Cash\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-barcode fa-lg\" aria-hidden=\"true\" title=\"Boleto\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-bank fa-lg\" aria-hidden=\"true\" title=\"Transferência\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-cc-visa fa-lg\" aria-hidden=\"true\" title=\"Visa\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-cc-mastercard fa-lg\" aria-hidden=\"true\" title=\"Mastercard\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-cc-amex fa-lg\" aria-hidden=\"true\" title=\"Amex\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t\t<i class=\"fa fa-cc-diners-club fa-lg\" aria-hidden=\"true\" title=\"Diners\" style=\"color:rgba(255,255,255,0.75);font-size:18px;vertical-align:middle;\"></i>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"ee-foot-bottom\">\n\t\t<span class=\"ee-foot-copyright\">© 2025 Estadia Express. Todos os direitos reservados.</span>\n\t\t<div class=\"ee-foot-legal-links\">\n\t\t\t<a href=\"/pt/terms_and_conditions\">Termos de uso</a>\n\t\t\t<a href=\"/pt/page/60345845008db5a7fb540671\">Política de privacidade</a>\n\t\t</div>\n\t</div>\n</div>\n";

var FILTER_MODAL_HTML = "<div id=\"ee-filter-overlay\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Filtros\">\n\t<div id=\"ee-filter-modal\">\n\t\t<div class=\"fmod-header\">\n\t\t\t<h3>Filtros</h3>\n\t\t\t<button class=\"fmod-close\" id=\"ee-filter-close\" aria-label=\"Fechar\">×</button>\n\t\t</div>\n\t\t<div class=\"fmod-body\">\n\n\t\t\t<div class=\"fmod-section\">\n\t\t\t\t<p class=\"fmod-section-title\">Faixa de preço</p>\n\t\t\t\t<div class=\"ee-price-inputs\">\n\t\t\t\t\t<div class=\"ee-price-field\">\n\t\t\t\t\t\t<label>Mínimo</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"ee-price-min\" placeholder=\"R$ 0\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<span class=\"ee-price-divider\">—</span>\n\t\t\t\t\t<div class=\"ee-price-field\">\n\t\t\t\t\t\t<label>Máximo</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"ee-price-max\" placeholder=\"R$ 10.000\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"fmod-section\">\n\t\t\t\t<p class=\"fmod-section-title\">Quartos, camas e banheiros</p>\n\t\t\t\t<div class=\"ee-counter-row\">\n\t\t\t\t\t<span class=\"ee-counter-label\">Quartos</span>\n\t\t\t\t\t<div class=\"ee-counter-ctrl\">\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"rooms\" data-dir=\"-1\" disabled>−</button>\n\t\t\t\t\t\t<span class=\"ee-counter-val\" id=\"ee-val-rooms\">1</span>\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"rooms\" data-dir=\"1\">+</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"ee-counter-row\">\n\t\t\t\t\t<span class=\"ee-counter-label\">Camas</span>\n\t\t\t\t\t<div class=\"ee-counter-ctrl\">\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"beds\" data-dir=\"-1\" disabled>−</button>\n\t\t\t\t\t\t<span class=\"ee-counter-val\" id=\"ee-val-beds\">1</span>\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"beds\" data-dir=\"1\">+</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"ee-counter-row\">\n\t\t\t\t\t<span class=\"ee-counter-label\">Banheiros</span>\n\t\t\t\t\t<div class=\"ee-counter-ctrl\">\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"baths\" data-dir=\"-1\" disabled>−</button>\n\t\t\t\t\t\t<span class=\"ee-counter-val\" id=\"ee-val-baths\">1</span>\n\t\t\t\t\t\t<button class=\"ee-counter-btn\" data-counter=\"baths\" data-dir=\"1\">+</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"fmod-section\">\n\t\t\t\t<p class=\"fmod-section-title\">Comodidades</p>\n\t\t\t\t<div class=\"ee-amenity-grid\" id=\"ee-amenity-grid\">\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"internet\">📶 Wi-Fi</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"ar condicionado\">❄️ Ar condicionado</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"vaga de garagem\">🚗 Garagem</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"varanda/terraço\">🏠 Varanda</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"maquina de lavar\">👕 Máquina de lavar</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"ar condicionado split\">🌬️ Ar split</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"hidro/banheira\">🛁 Hidro/Banheira</div>\n\t\t\t\t\t<div class=\"ee-amenity-chip\" data-amenity=\"cobertura\">⭐ Cobertura</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"fmod-footer\">\n\t\t\t<button class=\"fmod-btn-clear\" id=\"ee-filter-clear\">Limpar filtros</button>\n\t\t\t<button class=\"fmod-btn-apply\" id=\"ee-filter-apply\">Mostrar resultados</button>\n\t\t</div>\n\t</div>\n</div>\n";

function eeCreateFromHTML(html) {
	var wrap = document.createElement("div");
	wrap.innerHTML = html;
	return wrap.firstElementChild;
}
function initEEFooter() {
	if (document.getElementById("ee-custom-footer")) return;
	var mainFooter = document.getElementById("mainfooter");
	if (!mainFooter) return;
	var footerDiv = eeCreateFromHTML(FOOTER_HTML);
	footerDiv._eeFooterPlaced = true;
	mainFooter.parentElement.insertBefore(footerDiv, mainFooter);
	footerDiv.style.display = "block";
	mainFooter.style.display = "none";
}
function tryFooterInit() {
	if (document.body && document.getElementById("mainfooter")) {
		initEEFooter();
		return !!document.getElementById("ee-custom-footer");
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

(function() {
		function interceptContactLink() {
			var navLinks = document.querySelectorAll('nav.main-nav-menu a, .main-nav-menu a, nav a');
			var found = false;
			navLinks.forEach(function(a) {
				if (a.textContent.trim() === 'Contato' && a.href.indexOf('/contact') !== -1) {
					a.href = 'javascript:void(0)';
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
					a.href = 'javascript:void(0)';
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

(function() {
		if (window._maisFiltrosGlobalFix) return;
		window._maisFiltrosGlobalFix = true;
		function eeCloseModal() {
			var ov = document.getElementById('ee-filter-overlay');
			if (ov) { ov.style.display = 'none'; document.body.style.overflow = ''; }
		}
		function eeBindClose() {
			var ov = document.getElementById('ee-filter-overlay');
			var closeBtn = document.getElementById('ee-filter-close');
			if (ov && !ov._eeBound) {
				ov._eeBound = true;
				ov.addEventListener('click', function(e) { if (e.target === ov) eeCloseModal(); });
			}
			if (closeBtn && !closeBtn._eeBound) {
				closeBtn._eeBound = true;
				closeBtn.addEventListener('click', eeCloseModal);
			}
		}
		window.addEventListener('click', function(e) {
			var t = e.target;
			while (t && t !== document.body) {
				if (t.tagName === 'A' && t.getAttribute('href') === '#moreFilters') {
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
					var ov = document.getElementById('ee-filter-overlay');
					if (ov) {
						eeBindClose();
						ov.style.display = 'flex';
						document.body.style.overflow = 'hidden';
					}
					return;
				}
				t = t.parentElement;
			}
		}, true);
		document.addEventListener('DOMContentLoaded', eeBindClose);
		if (document.readyState !== 'loading') setTimeout(eeBindClose, 500);
	})();

function eeInjectFilterModal() {
	if (document.getElementById("ee-filter-overlay")) return;
	if (!document.body) return;
	document.body.appendChild(eeCreateFromHTML(FILTER_MODAL_HTML));
}
if (document.body) {
	eeInjectFilterModal();
} else {
	document.addEventListener("DOMContentLoaded", eeInjectFilterModal);
}

(function() {
		function bindFilterHandlers() {
			var overlay = document.getElementById('ee-filter-overlay');
			if (!overlay) return false;
			$(overlay).off('.eefilter');
			$(overlay).on('click.eefilter', '.ee-counter-btn', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var counter = $(this).data('counter');
				var dir = parseInt($(this).data('dir'), 10);
				var valSpan = $('#ee-val-' + counter);
				var current = parseInt(valSpan.text(), 10) || 1;
				var newVal = current + dir;
				if (newVal < 1) newVal = 1;
				if (newVal > 10) newVal = 10;
				valSpan.text(newVal);
				var minusBtn = $(overlay).find('.ee-counter-btn[data-counter="' + counter + '"][data-dir="-1"]');
				if (newVal <= 1) {
					minusBtn.attr('disabled', true);
				} else {
					minusBtn.removeAttr('disabled');
				}
			});
			$(overlay).on('click.eefilter', '.ee-amenity-chip', function(e) {
				e.preventDefault();
				$(this).toggleClass('active');
			});
			$(overlay).on('click.eefilter', '#ee-filter-close', function(e) {
				e.stopPropagation();
				overlay.style.display = 'none';
			});
			$(overlay).on('click.eefilter', function(e) {
				if (e.target === overlay) {
					overlay.style.display = 'none';
				}
			});
			$(overlay).on('click.eefilter', '#ee-filter-clear', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(overlay).find('.ee-amenity-chip').removeClass('active');
				$('#ee-val-rooms, #ee-val-beds, #ee-val-baths').text('1');
				$(overlay).find('.ee-counter-btn[data-dir="-1"]').attr('disabled', true);
				$('#ee-price-min').val('');
				$('#ee-price-max').val('');
			});
			$(overlay).on('click.eefilter', '#ee-filter-apply', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var params = new URLSearchParams(window.location.search);
				var rooms = parseInt($('#ee-val-rooms').text(), 10) || 1;
				var beds = parseInt($('#ee-val-beds').text(), 10) || 1;
				var baths = parseInt($('#ee-val-baths').text(), 10) || 1;
				if (rooms > 1) { params.set('minBedrooms', rooms); } else { params.delete('minBedrooms'); }
				if (beds > 1) { params.set('minBeds', beds); } else { params.delete('minBeds'); }
				if (baths > 1) { params.set('minBathrooms', baths); } else { params.delete('minBathrooms'); }
				var minPrice = $('#ee-price-min').val().replace(/[^0-9]/g, '');
				var maxPrice = $('#ee-price-max').val().replace(/[^0-9]/g, '');
				if (minPrice || maxPrice) {
					params.set('newPrice', (minPrice || '0') + ';' + (maxPrice || '10000'));
				} else {
					params.delete('newPrice');
				}
				params.delete('inventory[]');
				$(overlay).find('.ee-amenity-chip.active').each(function() {
					var amenity = $(this).data('amenity');
					if (amenity) params.append('inventory[]', amenity);
				});
				overlay.style.display = 'none';
				window.location.href = window.location.pathname + '?' + params.toString();
			});
			return true;
		}
		function eeFilterPrePopulate() {
			try {
				var overlay = document.getElementById('ee-filter-overlay');
				if (!overlay) return;
				var params = new URLSearchParams(window.location.search);
				var rooms = params.get('minBedrooms');
				var beds = params.get('minBeds');
				var baths = params.get('minBathrooms');
				if (rooms && parseInt(rooms) > 1) {
					$('#ee-val-rooms').text(rooms);
					$(overlay).find('.ee-counter-btn[data-counter="rooms"][data-dir="-1"]').removeAttr('disabled');
				}
				if (beds && parseInt(beds) > 1) {
					$('#ee-val-beds').text(beds);
					$(overlay).find('.ee-counter-btn[data-counter="beds"][data-dir="-1"]').removeAttr('disabled');
				}
				if (baths && parseInt(baths) > 1) {
					$('#ee-val-baths').text(baths);
					$(overlay).find('.ee-counter-btn[data-counter="baths"][data-dir="-1"]').removeAttr('disabled');
				}
				var inventories = params.getAll('inventory[]');
				$(overlay).find('.ee-amenity-chip').each(function() {
					var amenity = $(this).data('amenity');
					if (inventories.indexOf(amenity) >= 0) {
						$(this).addClass('active');
					}
				});
				var priceStr = params.get('newPrice');
				if (priceStr) {
					var priceParts = priceStr.split(';');
					if (priceParts[0]) $('#ee-price-min').val('R$ ' + priceParts[0]);
					if (priceParts[1]) $('#ee-price-max').val('R$ ' + priceParts[1]);
				}
			} catch(err) {}
		}
		var maxAttempts = 20;
		var attempts = 0;
		var initInterval = setInterval(function() {
			attempts++;
			var overlay = document.getElementById('ee-filter-overlay');
			if (overlay) {
				if (bindFilterHandlers()) {
					eeFilterPrePopulate();
					clearInterval(initInterval);
				}
			} else if (attempts >= maxAttempts) {
				clearInterval(initInterval);
			}
		}, 500);
		document.addEventListener('click', function(e) {
			var target = e.target;
			while (target && target !== document) {
				if (target.classList && (target.classList.contains('btn-filter') || target.classList.contains('ee-filter-trigger'))) {
					e.preventDefault();
					var overlay = document.getElementById('ee-filter-overlay');
					if (overlay) {
						overlay.style.display = 'flex';
						eeFilterPrePopulate();
					}
					break;
				}
				target = target.parentElement;
			}
		});
	})();
	(function() {
		if (window._eeMobileTouchFix) return;
		window._eeMobileTouchFix = true;
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
/* Fix: persons dropdown abrir para cima e corrigir botao Reserve ja no mobile */
	(function() {
		function fixPersonsDropup() {
			var bsCont = document.querySelector('.bs-container.persons');
			if (!bsCont) {
				document.querySelectorAll('.bs-container').forEach(function(el) {
					if (el.classList.contains('persons')) el.classList.add('dropup');
				});
			} else {
				bsCont.classList.add('dropup');
			}
		}
		function fixBookBtn() {
			var bookBtn = document.querySelector('a.bookbutton');
			if (bookBtn && !bookBtn._touchFixed) {
				bookBtn._touchFixed = true;
				bookBtn.addEventListener('touchend', function(e) {
					e.preventDefault();
					window.location.href = this.href;
				}, { passive: false });
			}
		}
		function applyFixes() {
			fixPersonsDropup();
			fixBookBtn();
		}
		var bodyObserver = new MutationObserver(function(mutations) {
			var needsFix = false;
			mutations.forEach(function(m) {
				m.addedNodes.forEach(function(node) {
					if (node.nodeType !== 1) return;
					if (node.classList && node.classList.contains('bs-container')) needsFix = true;
					if (node.querySelector && node.querySelector('.bookbutton, .bs-container')) needsFix = true;
				});
			});
			if (needsFix) applyFixes();
		});
		document.addEventListener('click', function() {
			setTimeout(fixPersonsDropup, 0);
		}, true);
		function init() {
			bodyObserver.observe(document.body, { childList: true, subtree: true });
			applyFixes();
			setTimeout(applyFixes, 500);
			setTimeout(applyFixes, 1500);
			setTimeout(applyFixes, 3000);
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', init);
		} else {
			init();
		}
	})();

})();
