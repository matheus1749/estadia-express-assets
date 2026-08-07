/* legacy.js - Estadia Express
   Extraido literalmente dos blocos <script> inline do template head_section (Stays).
   Nenhuma alteracao de logica: apenas mudanca de local.
   Origem: 14 blocos, nas linhas 62, 137, 297, 423, 480, 744, 1227, 1229, 1445,
   1508, 1588, 1644, 1672 (a numeracao e a do head_section original).

   Estrangulamento em andamento. Ja saiu daqui:
   - bloco 635 (_maisFiltrosGlobalFix)  -> copia identica ja vivia no app.js
   - bloco 901, parte 1 (bindFilterHandlers) -> copia identica ja vivia no app.js
   - bloco 901, parte 2 (fix de toque mobile) -> movido para results.js
   - bloco 1175 (fixPersonsDropup)      -> copia identica ja vivia no app.js
   - bloco 744  (rodape completo)     -> js/footer.js (Fase 6)
   Nos tres casos de copia identica o legacy carregava primeiro e registrava a
   guarda, deixando a versao do app.js morta. Removendo daqui, a do app.js
   assume o mesmo papel na mesma ordem.
   Blocos separados por ; para evitar ASI na concatenacao.
*/

;
/* ===== bloco original: linha 62 ===== */
	(function() {
		function applyCheckoutImprovements() {
			if (!document.body.classList.contains('__page_booking')) return;
			// ---- B) MELHORAR VISUAL CARDS DE PAGAMENTO (remover PagarmeV5 badge) ----
			var pagarmeLabels = document.querySelectorAll('.payment-item .label.label-default.text-capitalize');
			pagarmeLabels.forEach(function(lbl) {
				if (lbl.textContent.trim().toLowerCase() === 'pagarmev5' ||
					lbl.textContent.trim().toLowerCase() === 'pagarmev5') {
					lbl.style.display = 'none';
				}
			});
			// ---- C) RENOMEAR "Pagamento Pagar.me" para texto mais limpo ----
			// Find the payment item titles
			var paymentItems = document.querySelectorAll('.payment-item .col-md-12');
			paymentItems.forEach(function(col) {
				// The first text node / first child div is the "Pagamento Pagar.me" text
				var firstChild = col.firstElementChild;
				if (firstChild && firstChild.textContent.includes('Pagamento Pagar.me')) {
					firstChild.style.display = 'none';
				}
			});
			// ---- D) MELHORAR visual dos cards de pagamento - adicionar ícones ----
			var payItems = document.querySelectorAll('.payment-item');
			payItems.forEach(function(item) {
				var labelEl = item.querySelector('.label.label-default.mr-2');
				if (!labelEl) return;
				var methodName = labelEl.textContent.trim();
				// Adicionar ícone baseado no método
				if (!item.querySelector('.custom-pay-icon')) {
					var iconSpan = document.createElement('span');
					iconSpan.className = 'custom-pay-icon';
					iconSpan.style.cssText = 'margin-right: 8px; font-size: 18px;';
					if (methodName.toLowerCase().includes('cart')) {
						iconSpan.textContent = '💳';
					} else if (methodName.toLowerCase() === 'pix') {
						iconSpan.textContent = '⚡';
					} else {
						iconSpan.textContent = '💰';
					}
					labelEl.parentNode.insertBefore(iconSpan, labelEl);
				}
			});
			// ---- E) REMOVER background verde do payment-card-info ----
			var payCardInfo = document.querySelector('.payment-card-info');
			if (payCardInfo) {
				payCardInfo.style.background = '#ffffff';
				payCardInfo.style.border = 'none';
			}
			// ---- F) injectBuyerSection() cuida da seção de dados do comprador ----
		}
		// Run on load and watch for dynamic changes
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', applyCheckoutImprovements);
		} else {
			applyCheckoutImprovements();
		}
		// MutationObserver to handle dynamic content
		var observer = new MutationObserver(function(mutations) {
			var hasRelevantChanges = mutations.some(function(m) {
				return m.addedNodes.length > 0;
			});
			if (hasRelevantChanges) {
				applyCheckoutImprovements();
			}
		});
		document.addEventListener('DOMContentLoaded', function() {
			observer.observe(document.body, { childList: true, subtree: true });
			applyCheckoutImprovements();
		});
		// Also run after short delays to catch async-rendered content
		setTimeout(applyCheckoutImprovements, 500);
		setTimeout(applyCheckoutImprovements, 1500);
	})();

;
/* ===== bloco original: linha 137 ===== */
(function() {
		function injectBuyerSection() {
			if (!document.body.classList.contains('__page_booking')) return;
			if (document.getElementById('buyer-data-injected')) return;
			var paymentForm = document.getElementById('payment-form');
			if (!paymentForm) return;
			var firstnameEl    = document.getElementById('antif_firstname');
			var lastnameEl     = document.getElementById('antif_lastname');
			var emailEl        = document.getElementById('antif_email');
			var docNumEl       = document.getElementById('antif_document_number');
			var phoneEl        = document.querySelector('input[name="antif_phone"]') || document.querySelector('.iti input[type="tel"]');
			var isLoggedIn     = !firstnameEl;
			var greetingName   = '';
			var greetingEl     = document.querySelector('#reserve-info .break-word, #reserve-info h4');
			if (greetingEl) {
				var m = greetingEl.textContent.match(/Olá,\s*([^!\n]+)!/);
				if (m) greetingName = m[1].trim();
			}
			var section = document.createElement('div');
			section.id = 'buyer-data-injected';
			section.style.cssText = 'background:#fff;border-radius:12px;border:1.5px solid #e5e7eb;padding:24px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);';
			var titleEl = document.createElement('h4');
			titleEl.textContent = 'Dados de quem está comprando';
			titleEl.style.cssText = 'font-size:17px;font-weight:700;color:#1a1a2e;margin:0 0 20px 0;';
			section.appendChild(titleEl);
			var grid = document.createElement('div');
			grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;';
			section.appendChild(grid);
			function styleInput(inp) {
				inp.style.cssText = 'border:1.5px solid #e5e7eb;border-radius:8px;padding:10px 14px;font-size:14px;height:44px;width:100%;box-sizing:border-box;background:#fff;outline:none;';
				inp.addEventListener('focus', function() { this.style.borderColor='#1a1a2e'; });
				inp.addEventListener('blur',  function() { this.style.borderColor='#e5e7eb'; });
			}
			function makeLabel(txt) {
				var lbl = document.createElement('label');
				lbl.textContent = txt;
				lbl.style.cssText = 'font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;display:block;';
				return lbl;
			}
			function makeWrap(labelTxt, inputEl) {
				var w = document.createElement('div');
				w.style.cssText = 'display:flex;flex-direction:column;';
				w.appendChild(makeLabel(labelTxt));
				styleInput(inputEl);
				w.appendChild(inputEl);
				return w;
			}
			if (isLoggedIn) {
				var realFirstname = document.getElementById('antif_firstname');
				var realLastname  = document.getElementById('antif_lastname');
				var realEmail     = document.getElementById('antif_email');
				var realDocNum    = document.getElementById('antif_document_number');
				var realPhone     = document.querySelector('input[name="antif_phone"]');
				function makeSyncedInput(type, placeholder, realField, prefillVal) {
					var inp = document.createElement('input');
					inp.type = type;
					inp.placeholder = placeholder;
					if (prefillVal) inp.value = prefillVal;
					else if (realField && realField.value) inp.value = realField.value;
					inp.addEventListener('input', function() {
						if (realField) {
							realField.value = this.value;
							realField.dispatchEvent(new Event('input', {bubbles:true}));
							realField.dispatchEvent(new Event('change', {bubbles:true}));
						}
					});
					return inp;
				}
				var combinedName = ((realFirstname ? realFirstname.value : '') + ' ' + (realLastname ? realLastname.value : '')).trim() || greetingName;
				var nameInput = makeSyncedInput('text', 'Nome completo', null, combinedName);
				nameInput.addEventListener('input', function() {
					var parts = this.value.trim().split(' ');
					var first = parts[0] || '';
					var last  = parts.slice(1).join(' ') || '';
					if (realFirstname) { realFirstname.value = first; realFirstname.dispatchEvent(new Event('input', {bubbles:true})); }
					if (realLastname)  { realLastname.value  = last;  realLastname.dispatchEvent(new Event('input', {bubbles:true})); }
				});
				grid.appendChild(makeWrap('Nome completo *', nameInput));
				var docInput = makeSyncedInput('text', 'Digite seu CPF, CNPJ ou Passaporte', realDocNum, '');
				grid.appendChild(makeWrap('CPF / CNPJ / Passaporte *', docInput));
				var emailInput = makeSyncedInput('email', 'seu@email.com', realEmail, realEmail ? realEmail.value : '');
				grid.appendChild(makeWrap('E-mail *', emailInput));
				var phoneInput = makeSyncedInput('tel', '(00) 00000-0000', realPhone, realPhone ? realPhone.value : '');
				grid.appendChild(makeWrap('WhatsApp *', phoneInput));
			} else {
				if (firstnameEl && lastnameEl) {
					grid.appendChild(makeWrap('Nome *', firstnameEl));
					grid.appendChild(makeWrap('Sobrenome *', lastnameEl));
				} else if (firstnameEl) {
					var w = makeWrap('Nome completo *', firstnameEl);
					w.style.gridColumn = '1 / -1';
					grid.appendChild(w);
				}
				if (docNumEl) {
					grid.appendChild(makeWrap('CPF / CNPJ / Passaporte *', docNumEl));
				}
				if (emailEl) {
					grid.appendChild(makeWrap('E-mail *', emailEl));
				}
				if (phoneEl) {
					var phoneWrap = phoneEl.closest('.iti') || phoneEl.parentElement;
					var pWrap = document.createElement('div');
					pWrap.style.cssText = 'display:flex;flex-direction:column;';
					pWrap.appendChild(makeLabel('WhatsApp *'));
					pWrap.appendChild(phoneWrap);
					grid.appendChild(pWrap);
				}
				var guestForm = document.getElementById('guest-form');
				if (guestForm) {
					guestForm.style.cssText = 'height:0;overflow:hidden;padding:0;margin:0;border:none;opacity:0;pointer-events:none;';
					var hiddenFields = guestForm.querySelectorAll('[required]');
					hiddenFields.forEach(function(f) {
						f.removeAttribute('required');
						f.setAttribute('data-was-required', '1');
					});
				}
			}
			var checkRow = document.createElement('div');
			checkRow.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px;margin-top:8px;';
			checkRow.innerHTML = '<input type="checkbox" id="reserving-for-other-chk" style="width:16px;height:16px;cursor:pointer;accent-color:#1a1a2e;"><label for="reserving-for-other-chk" style="font-size:14px;color:#374151;cursor:pointer;font-weight:400;margin:0;">Reservando para outra pessoa</label>';
			grid.appendChild(checkRow);
			paymentForm.parentNode.insertBefore(section, paymentForm);
		}
		function improvePaymentLayout() {
			if (!document.body.classList.contains('__page_booking')) return;
			var cardPanel = document.querySelector('.card-panel');
			if (cardPanel) {
				var panelBody = cardPanel.querySelector('.panel-body');
				if (panelBody && panelBody.textContent.trim() === 'Escolha uma forma de pagamento.') {
					panelBody.innerHTML = '<p style="color:#9ca3af;font-size:14px;text-align:center;margin:0;padding:20px 0;">👈 Selecione uma forma de pagamento</p>';
				}
			}
			var payItems = document.querySelectorAll('.payment-item');
			payItems.forEach(function(item) {
				item.style.cursor = 'pointer';
				item.addEventListener('mouseenter', function() {
					if (!this.classList.contains('selected')) {
						this.style.borderColor = '#1a1a2e';
					}
				});
				item.addEventListener('mouseleave', function() {
					if (!this.classList.contains('selected')) {
						this.style.borderColor = '#e5e7eb';
					}
				});
			});
		}
		function run() {
			injectBuyerSection();
			improvePaymentLayout();
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', run);
		} else {
			run();
		}
		setTimeout(run, 800);
		setTimeout(run, 2000);
	})();

;
/* ===== bloco original: linha 297 ===== */
(function() {
		if (!window.__seazoneCardFormInit) {
			window.__seazoneCardFormInit = true;
		} else {
			return;
		}
		function transformCardForm() {
			if (!document.body.classList.contains('__page_booking')) return;
			var cardInfo = document.getElementById('cardInfo');
			if (!cardInfo) return;
			if (cardInfo.getAttribute('data-sz-done')) return;
			var selMonth = cardInfo.querySelector('select[name="cc_month"]');
			var selYear  = cardInfo.querySelector('select[name="cc_year"]');
			var cvvInput = cardInfo.querySelector('#cc_cvv');
			if (!selMonth || !selYear || !cvvInput) return;
			cardInfo.setAttribute('data-sz-done', '1');
			var cols = cardInfo.querySelectorAll('[data-hidden-if="card-token-selected"]');
			cols.forEach(function(col) {
				if (col.classList.contains('col-sm-6')) {
					col.style.display = 'none';
					col.style.visibility = 'hidden';
					col.style.height = '0';
					col.style.overflow = 'hidden';
					col.style.margin = '0';
					col.style.padding = '0';
				}
			});
			var expiryRow = document.createElement('div');
			expiryRow.className = 'cc-expiry-row';
			expiryRow.innerHTML =
				'<div class="cc-field-group">' +
				'<label>Mês</label>' +
				'<input type="text" class="cc-mm-input" placeholder="MM" maxlength="2" inputmode="numeric" autocomplete="cc-exp-month">' +
				'</div>' +
				'<div class="cc-separator">/</div>' +
				'<div class="cc-field-group">' +
				'<label>Ano</label>' +
				'<input type="text" class="cc-aa-input" placeholder="AA" maxlength="2" inputmode="numeric" autocomplete="cc-exp-year">' +
				'</div>' +
				'<div class="cc-cvv-group">' +
				'<label>CVV <span style="font-size:10px;color:#9ca3af;font-weight:400;text-transform:none;">(Código de segurança)</span></label>' +
				'<input type="password" class="cc-cvv-proxy" placeholder="CVV" maxlength="4" inputmode="numeric" autocomplete="cc-csc">' +
				'</div>';
			var numberCol = cardInfo.querySelector('.col-sm-12[data-hidden-if="card-token-selected"]');
			if (numberCol && numberCol.nextSibling) {
				cardInfo.insertBefore(expiryRow, numberCol.nextSibling);
			} else if (numberCol) {
				numberCol.insertAdjacentElement('afterend', expiryRow);
			} else {
				cardInfo.appendChild(expiryRow);
			}
			var mmInput  = expiryRow.querySelector('.cc-mm-input');
			var aaInput  = expiryRow.querySelector('.cc-aa-input');
			var cvvProxy = expiryRow.querySelector('.cc-cvv-proxy');
			var curMonth = selMonth.value;
			var curYear  = selYear.value;
			if (curMonth) mmInput.value = (curMonth < 10 ? '0' : '') + parseInt(curMonth);
			if (curYear)  aaInput.value = curYear.toString().slice(-2);
			mmInput.addEventListener('input', function() {
				var val = this.value.replace(/D/g, '');
				this.value = val;
				var num = parseInt(val, 10);
				if (num >= 1 && num <= 12) {
					selMonth.value = num;
					try { jQuery(selMonth).selectpicker('val', num).trigger('change'); } catch(e) {}
				}
				if (val.length === 2) aaInput.focus();
			});
			mmInput.addEventListener('blur', function() {
				var val = this.value.replace(/D/g, '');
				var num = parseInt(val, 10);
				if (num >= 1 && num <= 9) this.value = '0' + num;
			});
			aaInput.addEventListener('input', function() {
				var val = this.value.replace(/D/g, '');
				this.value = val;
				if (val.length === 2) {
					var fullYear = 2000 + parseInt(val, 10);
					selYear.value = fullYear;
					try { jQuery(selYear).selectpicker('val', fullYear).trigger('change'); } catch(e) {}
					cvvProxy.focus();
				}
			});
			cvvProxy.addEventListener('input', function() {
				var val = this.value.replace(/D/g, '');
				this.value = val;
				cvvInput.value = val;
				cvvInput.dispatchEvent(new Event('input', {bubbles: true}));
				cvvInput.dispatchEvent(new Event('change', {bubbles: true}));
			});
			var numLabel = cardInfo.querySelector('#cc_number') && cardInfo.querySelector('#cc_number').closest('.form-group') ? cardInfo.querySelector('#cc_number').closest('.form-group').querySelector('label small') : null;
			if (numLabel) numLabel.textContent = 'Número do Cartão';
			var nameLabel = cardInfo.querySelector('#cc_name') && cardInfo.querySelector('#cc_name').closest('.form-group') ? cardInfo.querySelector('#cc_name').closest('.form-group').querySelector('label small') : null;
			if (nameLabel) nameLabel.textContent = 'Titular do Cartão';
			console.log('[SeazoneCardForm] OK');
		}
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(m) {
				if (m.type === 'childList') {
					var cardInfo = document.getElementById('cardInfo');
					if (cardInfo && !cardInfo.getAttribute('data-sz-done')) {
						transformCardForm();
					}
				}
				if (m.type === 'attributes' && m.target.id === 'cardInfo' && !m.target.getAttribute('data-sz-done')) {
					transformCardForm();
				}
			});
		});
		function startObserver() {
			observer.observe(document.body, {childList: true, subtree: true});
		}
		function run() {
			transformCardForm();
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function() { startObserver(); run(); });
		} else {
			startObserver();
			run();
		}
		setTimeout(run, 300);
		setTimeout(run, 800);
		setTimeout(run, 2000);
		setTimeout(run, 4000);
	})();

;
/* ===== bloco original: linha 423 ===== */
(function() {
		var ANTIF_NAMES = ['dbirth','mbirth','ybirth','antif_firstname','antif_lastname',
						   'antif_email','antif_phone','antif_document_type','antif_document_number',
						   'antif_company','antif_country_customer','antif_street','antif_street_num',
						   'antif_country','antif_state','antif_state_code','antif_city','antif_region','antif_zip'];
		function isAntifName(name) {
			if (!name) return false;
			return name.indexOf('antif_') === 0 || ANTIF_NAMES.indexOf(name) !== -1;
		}
		var origSetAttr = Element.prototype.setAttribute;
		Element.prototype.setAttribute = function(attrName, value) {
			if (attrName === 'required' && isAntifName(this.name)) return;
			return origSetAttr.call(this, attrName, value);
		};
		var inputDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'required');
		if (inputDesc) {
			Object.defineProperty(HTMLInputElement.prototype, 'required', {
				get: inputDesc.get,
				set: function(val) {
					if (val && isAntifName(this.name)) return;
					if (inputDesc.set) inputDesc.set.call(this, val);
				},
				configurable: true
			});
		}
		var selDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'required');
		if (selDesc) {
			Object.defineProperty(HTMLSelectElement.prototype, 'required', {
				get: selDesc.get,
				set: function(val) {
					if (val && isAntifName(this.name)) return;
					if (selDesc.set) selDesc.set.call(this, val);
				},
				configurable: true
			});
		}
		function nukeRequired() {
			if (!document.body) return;
			document.querySelectorAll('[name^="antif_"],[name="dbirth"],[name="mbirth"],[name="ybirth"]').forEach(function(f) {
				if (f.hasAttribute('required')) origSetAttr.call(f, 'data-was-required','1');
				f.removeAttribute('required');
			});
		}
		document.addEventListener('DOMContentLoaded', function() {
			nukeRequired();
			var obs = new MutationObserver(nukeRequired);
			obs.observe(document.body, {childList: true, subtree: true});
			setInterval(nukeRequired, 500);
		});
		document.addEventListener('submit', function() { nukeRequired(); }, true);
		document.addEventListener('click', function(e) {
			var btn = e.target.closest('button,.btn');
			if (btn && btn.textContent.indexOf('Fazer Pagamento') !== -1) {
				nukeRequired();
			}
		}, true);
	})();

;
/* ===== bloco original: linha 480 ===== */
(function() {
		function szInit() {
			if (!document.body || !document.body.classList.contains('__page_booking')) return;
			function szLoadPay(payUrl) {
				var mc = document.getElementById('maincontent');
				if (!mc) { window.location.href = payUrl; return; }
				var ld = document.createElement('div');
				ld.id = 'sz-ld';
				ld.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.93);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;';
				ld.innerHTML = '<div style="width:44px;height:44px;border:5px solid #f0e0d6;border-top-color:#e8956d;border-radius:50%;animation:szSpin 0.7s linear infinite;"></div><p style="color:#e8956d;font-weight:600;font-size:14px;margin:0;">Carregando pagamento...</p><style>@keyframes szSpin{to{transform:rotate(360deg)}}</style>';
				document.body.appendChild(ld);
				fetch(payUrl, {credentials:'include',headers:{'Accept':'text/html,*/*'}})
					.then(function(r){return r.text();})
					.then(function(html){
					var doc = new DOMParser().parseFromString(html,'text/html');
					var newMC = doc.getElementById('maincontent');
					if (!newMC) { if(document.getElementById('sz-ld'))document.body.removeChild(ld); window.location.href = payUrl; return; }
					var scripts = Array.from(newMC.querySelectorAll('script'));
					scripts.forEach(function(s){s.parentNode.removeChild(s);});
					mc.innerHTML = newMC.innerHTML;
					history.pushState({szPay:1},'',payUrl);
					if(document.getElementById('sz-ld'))document.body.removeChild(ld);
					scripts.forEach(function(s){
						var ns = document.createElement('script');
						if(s.src){ns.src=s.src;ns.async=false;}
						else ns.textContent=s.textContent;
						document.body.appendChild(ns);
					});
				})
					.catch(function(){if(document.getElementById('sz-ld'))document.body.removeChild(ld);window.location.href=payUrl;});
			}
			function szIsRes(url) {
				if(typeof url!=='string') return null;
				var m = url.match(/reservation\/([A-Z0-9]+)/);
				if(!m||url.indexOf('/pay')>=0||url.indexOf('/edit')>=0||url.indexOf('/cancel')>=0) return null;
				return m[1];
			}
			function szPayUrl(url, id) {
				var lang = window.__defaultLangShort||'pt';
				var ch = (url.split('idchannel=')[1]||'no').split('&')[0];
				return window.location.origin+'/customer/'+lang+'/reservation/'+id+'/pay?idchannel='+ch;
			}
			function szWrap(fn) {
				function szW(t,url,cb){
					var id=szIsRes(url);
					if(id){szLoadPay(szPayUrl(url,id));return Promise.resolve();}
					return fn.call(this,t,url,cb);
				}
				szW._sz=1;
				return szW;
			}
			function szCheck() {
				var pr = window.pageReload;
				if(typeof pr==='function'&&!pr._sz){
					window.pageReload = szWrap(pr);
				}
			}
			szCheck();
			window.addEventListener('load', szCheck);
			var _szTimer = setInterval(function(){
				var pr = window.pageReload;
				if(typeof pr==='function'&&!pr._sz){
					window.pageReload = szWrap(pr);
				}
			}, 200);
			setTimeout(function(){ clearInterval(_szTimer); }, 30000);
			window.addEventListener('popstate',function(e){
				if(e.state&&e.state.szPay) window.location.reload();
			});
		}
		if (document.body) {
			szInit();
		} else {
			document.addEventListener('DOMContentLoaded', szInit);
		}
	})();

;
/* ===== bloco original: linha 556 ===== */
/* Fase 5: o bypass do "Reserve ja" que ficava aqui foi movido, sem alteracao, para js/property.js. */

	function restructurePaymentCards() {
		var form = document.getElementById("payment-form");
		if (!form) return;
		var items = form.querySelectorAll(".payment-item");
		if (!items.length) return;
		items.forEach(function(item, idx) {
			var colDiv = item.querySelector(".col-md-12");
			if (!colDiv || colDiv.querySelector(".pay-content")) return;
			var label = colDiv.querySelector(".label.label-default.mr-2");
			var brands = colDiv.querySelector(".d-flex.my-2");
			var content = document.createElement("div");
			content.className = "pay-content";
			if (label) content.appendChild(label.cloneNode(true));
			if (brands) content.appendChild(brands.cloneNode(true));
			var iconBox = document.createElement("div");
			iconBox.className = "pay-icon-box " + (idx === 0 ? "pay-icon-box-card" : "pay-icon-box-pix");
			iconBox.innerHTML = idx === 0
				? "<i class='fa fa-credit-card'></i>"
			: "<span class='pix-text'>PIX</span>";
			colDiv.innerHTML = "";
			colDiv.appendChild(iconBox);
			colDiv.appendChild(content);
		});
		var selecionePEl = document.querySelector(".payment-card-info .card-panel .panel-body p");
		if (selecionePEl) selecionePEl.textContent = "Selecione uma forma de pagamento";
	}
	setTimeout(restructurePaymentCards, 500);
	setTimeout(restructurePaymentCards, 1500);
	setTimeout(restructurePaymentCards, 3000);



;
/* Rodape migrado para js/footer.js na Fase 6 do Design System V3. Era o bloco original linha 744 (posicionamento do #ee-custom-footer + scroll do link Contato). */

;
/* ===== bloco original: linha 1227 ===== */
/*Sync Dados pessoais->Cobranca. Sem setTimeout/polling. Checkbox mesmos-dados nunca auto-marcado.*/(function(){if(!/\/customer\/[a-z]{2}\/booking/i.test(location.pathname))return;if(window.__billingSyncActive)return;window.__billingSyncActive=true;var FM={'CEP':'zip','Endereço':'street','Número':'street_num','Complemento':'additional','Bairro':'region','Cidade':'city'};var S=null;function jq(){return window.jQuery;}function tD(){if(S){(S.o||[]).forEach(function(o){try{o.disconnect();}catch(e){}});}S={dirty:{},prog:{},lp:{},cp:false,o:[]};}function rR(){var out={};document.querySelectorAll('#personal-details-resume .resume-subtitle').forEach(function(s){var k=s.textContent.trim();var v=s.nextElementSibling?s.nextElementSibling.textContent.trim():'';out[k]=v;});return out;}function aD(el,k){if(!el||el.__d)return;el.__d=true;el.addEventListener('input',function(){if(!S.prog[k])S.dirty[k]=true;});}function sV(el,k,v){if(el.value===v)return;S.prog[k]=true;el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));S.prog[k]=false;}function sSF(r){Object.keys(FM).forEach(function(l){var id=FM[l];var el=document.getElementById(id);if(!el)return;aD(el,id);if(S.dirty[id])return;var v=r[l];if(v===undefined)return;if(el.value===v)return;sV(el,id,v);});}function fCC(name){var sel=document.getElementById('country');if(!sel||!name)return null;var c=name.replace(/\s*\([^)]*\)\s*$/,'').trim().toLowerCase();var f=Array.from(sel.options).find(function(o){return o.text.replace(/\s*\([^)]*\)\s*$/,'').trim().toLowerCase()===c;});return f?f.value:null;}function wCOR(){var cS=document.getElementById('country');if(!cS||cS.__w)return;cS.__w=true;var obs=new MutationObserver(function(){if(cS.options.length>=2){obs.disconnect();S.o=S.o.filter(function(o){return o!==obs;});cS.__w=false;rS();}});obs.observe(cS,{childList:true});S.o.push(obs);}function sCS(r){var cS=document.getElementById('country');var sS=document.getElementById('state');if(!cS||!sS)return;aD(cS,'country');aD(sS,'state');if(cS.options.length<2){wCOR();return;}if(S.lp.country!==undefined&&cS.value!==S.lp.country){S.dirty.country=true;S.dirty.state=true;}if(S.lp.state!==undefined&&sS.value!==S.lp.state){S.dirty.country=true;S.dirty.state=true;}if(S.dirty.country||S.dirty.state)return;var pN=r['País'];var uC=r['UF'];if(!pN||!uC)return;var tC=fCC(pN);if(!tC)return;var $=jq();if(cS.value===tC){if(sS.value!==uC){if($){$(sS).selectpicker('val',uC);}else{sS.value=uC;}S.lp.state=uC;}}else{if(S.cp)return;S.cp=true;if($){$(sS).data('statecode',uC);}S.lp.country=tC;S.lp.state=uC;var obs=new MutationObserver(function(){obs.disconnect();S.o=S.o.filter(function(o){return o!==obs;});S.cp=false;});obs.observe(sS,{childList:true});S.o.push(obs);if($){$(cS).selectpicker('val',tC);}else{cS.value=tC;}}}function rS(){var r=rR();sSF(r);sCS(r);}function wR(){var rE=document.getElementById('personal-details-resume');if(!rE)return;var obs=new MutationObserver(function(){rS();});obs.observe(rE,{childList:true,subtree:true,characterData:true});S.o.push(obs);}function wB(){tD();function st(){wR();rS();}if(document.getElementById('zip')){st();}else{var obs=new MutationObserver(function(){if(document.getElementById('zip')){obs.disconnect();S.o=S.o.filter(function(o){return o!==obs;});st();}});obs.observe(document.body,{childList:true,subtree:true});S.o.push(obs);}}tD();document.addEventListener('change',function(e){var t=e.target;if(t&&t.name==='payment_option'){if(/credit_card_cielo/i.test(t.id)){wB();}else{tD();}}},true);})();

;
/* ===== bloco original: linha 1229 ===== */

	(function(){
		if (window.__checkoutFase2A) return;
		window.__checkoutFase2A = true;

		var C = window.__checkoutComplementary = window.__checkoutComplementary || {};

		C.closestByClass = C.closestByClass || function(el, cls){
			while(el){
				if (el.classList && el.classList.contains(cls)) return el;
				el = el.parentElement;
			}
			return null;
		};

		C.openAccordion = C.openAccordion || function(collapseEl){
			if (!collapseEl) return;
			if (window.jQuery && jQuery.fn.collapse){
				jQuery(collapseEl).collapse('show');
			} else if (!collapseEl.classList.contains('in')){
				collapseEl.classList.add('in');
			}
		};

		C.ensureAccordion = C.ensureAccordion || function(panelBody){
			if (C._accordion && document.body.contains(C._accordion.container)){
				return C._accordion;
			}

			var container = panelBody.querySelector('[data-ee-complementary="1"]');
			if (container){
				var foundCollapse = container.querySelector('.panel-collapse');
				var foundBody = foundCollapse ? foundCollapse.querySelector('.panel-body') : null;
				var foundToggle = container.querySelector('[data-ee-complementary-toggle="1"]');
				if (foundCollapse && foundBody && foundToggle){
					C._accordion = { container: container, body: foundBody, collapse: foundCollapse, toggle: foundToggle };
					return C._accordion;
				}
			}

			var wrapperRow = document.createElement('div');
			wrapperRow.className = 'row';
			wrapperRow.setAttribute('data-ee-complementary','1');

			var col = document.createElement('div');
			col.className = 'col-sm-12';

			var panelGroup = document.createElement('div');
			panelGroup.className = 'panel-group';
			panelGroup.setAttribute('role','tablist');

			var panel = document.createElement('div');
			panel.className = 'panel panel-default';

			var heading = document.createElement('div');
			heading.className = 'panel-heading';
			heading.setAttribute('role','tab');

			var title = document.createElement('h4');
			title.className = 'panel-title';

			var toggle = document.createElement('a');
			toggle.href = '#';
			toggle.setAttribute('role','button');
			toggle.setAttribute('tabindex','0');
			toggle.setAttribute('aria-expanded','false');
			toggle.setAttribute('data-ee-complementary-toggle','1');
			toggle.textContent = 'Dados complementares da hospedagem';

			title.appendChild(toggle);
			heading.appendChild(title);

			var collapse = document.createElement('div');
			collapse.className = 'panel-collapse collapse';
			collapse.setAttribute('role','tabpanel');

			var body = document.createElement('div');
			body.className = 'panel-body';

			collapse.appendChild(body);
			panel.appendChild(heading);
			panel.appendChild(collapse);
			panelGroup.appendChild(panel);
			col.appendChild(panelGroup);
			wrapperRow.appendChild(col);
			panelBody.appendChild(wrapperRow);

			if (window.jQuery){
				jQuery(toggle).on('click', function(e){
					e.preventDefault();
					jQuery(collapse).collapse('toggle');
				});
				jQuery(collapse).on('shown.bs.collapse', function(){ toggle.setAttribute('aria-expanded','true'); });
				jQuery(collapse).on('hidden.bs.collapse', function(){ toggle.setAttribute('aria-expanded','false'); });
			}

			body.addEventListener('focusin', function(){ C.openAccordion(collapse); }, true);

			C._accordion = { container: wrapperRow, body: body, collapse: collapse, toggle: toggle };
			return C._accordion;
		};

		function locateBirthWrapper(panelBody){
			var dbirth = panelBody.querySelector('[name="dbirth"]');
			var mbirth = panelBody.querySelector('[name="mbirth"]');
			var ybirth = panelBody.querySelector('[name="ybirth"]');
			if (!dbirth || !mbirth || !ybirth){
				console.warn('[CheckoutFase2A] Campos dbirth/mbirth/ybirth não encontrados. Abortando.');
				return null;
			}

			var group = C.closestByClass(dbirth, 'form-group');
			if (!group || !group.contains(mbirth) || !group.contains(ybirth)){
				console.warn('[CheckoutFase2A] dbirth/mbirth/ybirth não pertencem ao mesmo form-group. Abortando.');
				return null;
			}

			var row = C.closestByClass(group, 'row');
			if (!row){
				console.warn('[CheckoutFase2A] form-group de nascimento sem row ancestral. Abortando.');
				return null;
			}
			if (row.parentElement !== panelBody){
				console.warn('[CheckoutFase2A] row de nascimento não é filho direto do panel-body. Abortando.');
				return null;
			}

			return row;
		}

		function runFase2A(){
			var guestBlock = document.getElementById('guest-information-block');
			if (!guestBlock){
				console.warn('[CheckoutFase2A] #guest-information-block não encontrado. Abortando.');
				return false;
			}

			var panelBody = guestBlock.querySelector('.panel-body');
			if (!panelBody){
				console.warn('[CheckoutFase2A] .panel-body não encontrado. Abortando.');
				return false;
			}

			var birthRow = locateBirthWrapper(panelBody);
			if (!birthRow) return false;

			if (birthRow.getAttribute('data-fase2-moved') === 'true') return true;

			var accordion = C.ensureAccordion(panelBody);
			if (!accordion || !accordion.body){
				console.warn('[CheckoutFase2A] Falha ao preparar o acordeão. Abortando.');
				return false;
			}

			birthRow.setAttribute('data-fase2-moved','true');
			accordion.body.appendChild(birthRow);

			console.info('[CheckoutFase2A] Bloco de nascimento movido para o acordeão.');
			return true;
		}

		C._observerPhase = C._observerPhase || 'waiting-guest-block';

		function advance(){
			var progressed = true;
			while (progressed){
				progressed = false;
				if (C._observerPhase === 'waiting-guest-block'){
					if (document.getElementById('guest-information-block')){
						C._observerPhase = 'waiting-fields';
						progressed = true;
					}
				} else if (C._observerPhase === 'waiting-fields'){
					if (runFase2A()){
						C._observerPhase = 'watching-errors';
						progressed = true;
					}
				}
			}
		}

		function attachObserverForCurrentPhase(){
			C._observer.disconnect();
			if (C._observerPhase === 'waiting-guest-block'){
				C._observer.observe(document.body, { childList:true, subtree:true });
			} else if (C._observerPhase === 'waiting-fields'){
				var guestBlock = document.getElementById('guest-information-block');
				if (guestBlock) C._observer.observe(guestBlock, { childList:true, subtree:true });
			} else if (C._observerPhase === 'watching-errors'){
				if (C._accordion && C._accordion.body){
					C._observer.observe(C._accordion.body, { attributes:true, attributeFilter:['class','aria-invalid'], subtree:true });
				}
			}
		}

		function onMutations(mutations){
			if (C._observerPhase === 'watching-errors'){
				for (var i=0; i<mutations.length; i++){
					var t = mutations[i].target;
					if (t.classList && (t.classList.contains('has-error') || t.getAttribute('aria-invalid') === 'true')){
						C.openAccordion(C._accordion && C._accordion.collapse);
						return;
					}
				}
				return;
			}
			advance();
			attachObserverForCurrentPhase();
		}

		C._observer = C._observer || new MutationObserver(onMutations);

		advance();
		attachObserverForCurrentPhase();
	})();


;
/* ===== bloco original: linha 1445 ===== */

	(function(){
		if (window.__checkoutFase2B) return;
		window.__checkoutFase2B = true;

		function locateDocumentWrapper(C, panelBody){
			if (!panelBody) return null;
			var typeField = panelBody.querySelector('[name="documentType"]');
			var numberField = panelBody.querySelector('[name="documentNumber"]');
			if (!typeField || !numberField) return null;
			var groupType = C.closestByClass(typeField, "form-group");
			var groupNumber = C.closestByClass(numberField, "form-group");
			if (!groupType || !groupNumber || groupType === groupNumber) return null;
			var rowType = C.closestByClass(groupType, "row");
			var rowNumber = C.closestByClass(groupNumber, "row");
			if (!rowType || !rowNumber || rowType !== rowNumber) return null;
			if (rowType.parentElement !== panelBody) return null;
			return rowType;
		}

		function runFase2B(C, panelBody){
			if (!panelBody || !document.body.contains(panelBody)) return;
			var guestBlock = document.querySelector("#guest-information-block");
			if (!guestBlock || !guestBlock.contains(panelBody)) {
				console.warn("[CheckoutFase2B] guest-information-block ausente ou inconsistente. Abortando.");
				return;
			}
			var accordion = C._accordion;
			if (!accordion || !accordion.body || !document.body.contains(accordion.body)) {
				return;
			}
			var row = locateDocumentWrapper(C, panelBody);
			if (!row) return;
			if (row.getAttribute("data-fase2b-moved") === "true") return;
			row.setAttribute("data-fase2b-moved", "true");
			accordion.body.appendChild(row);
			console.log("[CheckoutFase2B] Bloco de Documento movido para o acordeao.");
		}

		function tryInit(){
			var C = window.__checkoutComplementary;
			if (!C || typeof C.closestByClass !== "function" || typeof C.ensureAccordion !== "function") {
				console.warn("[CheckoutFase2B] Infraestrutura da Etapa 2A nao encontrada. Abortando.");
				return;
			}

			var panelBody = document.querySelector("#guest-information-block .panel-body");
			if (panelBody && C._accordion) runFase2B(C, panelBody);

			if (!C.__fase2BHooked) {
				C.__fase2BHooked = true;
				var originalEnsureAccordion = C.ensureAccordion;
				C.ensureAccordion = function(pb){
					var accordion = originalEnsureAccordion.call(C, pb);
					try { runFase2B(C, pb); } catch(e) { console.warn("[CheckoutFase2B] Erro:", e); }
					return accordion;
				};
			}
		}

		tryInit();
	})();


;
/* ===== bloco original: linha 1508 ===== */

	(function(){
		if (window.__checkoutFase2C) return;
		window.__checkoutFase2C = true;

		var ADDRESS_FIELD_NAMES = [
			"adrbilling.zip",
			"adrbilling.street",
			"adrbilling.number",
			"adrbilling.additional",
			"adrbilling.country",
			"adrbilling.state",
			"adrbilling.stateCode",
			"adrbilling.city",
			"adrbilling.region"
		];

		function locateAddressRows(C, panelBody){
			var rows = [];
			for (var i = 0; i < ADDRESS_FIELD_NAMES.length; i++) {
				var field = panelBody.querySelector('[name="' + ADDRESS_FIELD_NAMES[i] + '"]');
				if (!field) return null;
				var group = C.closestByClass(field, "form-group");
				if (!group) return null;
				var row = C.closestByClass(group, "row");
				if (!row) return null;
				if (row.parentElement !== panelBody) return null;
				if (rows.indexOf(row) === -1) rows.push(row);
			}
			return rows;
		}

		function runFase2C(C, panelBody){
			if (!panelBody || !document.body.contains(panelBody)) return;
			var guestBlock = document.querySelector("#guest-information-block");
			if (!guestBlock || !guestBlock.contains(panelBody)) {
				console.warn("[CheckoutFase2C] guest-information-block ausente ou inconsistente. Abortando.");
				return;
			}
			var accordion = C._accordion;
			if (!accordion || !accordion.body || !document.body.contains(accordion.body)) {
				return;
			}
			var rows = locateAddressRows(C, panelBody);
			if (!rows || !rows.length) return;
			var pending = [];
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].getAttribute("data-fase2c-moved") !== "true") pending.push(rows[i]);
			}
			if (!pending.length) return;
			for (var j = 0; j < pending.length; j++) {
				pending[j].setAttribute("data-fase2c-moved", "true");
				accordion.body.appendChild(pending[j]);
			}
			console.log("[CheckoutFase2C] Blocos de endereco do hospede movidos para o acordeao.");
		}

		function tryInit(){
			var C = window.__checkoutComplementary;
			if (!C || typeof C.closestByClass !== "function" || typeof C.ensureAccordion !== "function") {
				console.warn("[CheckoutFase2C] Infraestrutura das Etapas 2A/2B nao encontrada. Abortando.");
				return;
			}

			var panelBody = document.querySelector("#guest-information-block .panel-body");
			if (panelBody && C._accordion) runFase2C(C, panelBody);

			if (!C.__fase2CHooked) {
				C.__fase2CHooked = true;
				var previousEnsureAccordion = C.ensureAccordion;
				C.ensureAccordion = function(pb){
					var accordion = previousEnsureAccordion.call(C, pb);
					try { runFase2C(C, pb); } catch(e) { console.warn("[CheckoutFase2C] Erro:", e); }
					return accordion;
				};
			}
		}

		tryInit();
	})();


;
/* ===== bloco original: linha 1588 ===== */

	(function(){
		if(window.__checkoutFase2D)return;
		window.__checkoutFase2D=true;
		function locateGuestRow(C,pb){
			var gb=document.querySelector("#guest-information-block");
			if(!gb)return null;
			var gc=gb.querySelector("#guest-content");
			if(!gc)return null;
			var pb2=gc.querySelector(".panel-body");
			if(!pb2)return null;
			var fn=pb2.querySelector('[name="main_guest_firstname"]');
			var ln=pb2.querySelector('[name="main_guest_lastname"]');
			if(!fn||!ln)return null;
			var row=C.closestByClass(fn,"row");
			if(!row||row.parentElement!==pb2||!row.contains(ln))return null;
			return {row:row,panel:gc};
		}
		function runFase2D(C,panelBody){
			if(!panelBody||!document.body.contains(panelBody))return;
			var guestBlock=document.querySelector("#guest-information-block");
			if(!guestBlock||!guestBlock.contains(panelBody)){
				console.warn("[CheckoutFase2D] guest-information-block ausente ou inconsistente. Abortando.");
				return;
			}
			var accordion=C._accordion;
			if(!accordion||!accordion.body||!document.body.contains(accordion.body))return;
			var found=locateGuestRow(C,panelBody);
			if(!found)return;
			if(found.row.getAttribute("data-fase2d-moved")==="true")return;
			found.row.setAttribute("data-fase2d-moved","true");
			accordion.body.appendChild(found.row);
			found.panel.style.display="none";
			console.log("[CheckoutFase2D] Bloco Hospedes movido para o acordeao.");
		}
		function tryInit(){
			var C=window.__checkoutComplementary;
			if(!C||typeof C.closestByClass!=="function"||typeof C.ensureAccordion!=="function"){
				console.warn("[CheckoutFase2D] Infraestrutura das Etapas 2A/2B/2C nao encontrada. Abortando.");
				return;
			}
			var panelBody=document.querySelector("#guest-information-block .panel-body");
			if(panelBody&&C._accordion)runFase2D(C,panelBody);
			if(!C.__fase2DHooked){
				C.__fase2DHooked=true;
				var previousEnsureAccordion=C.ensureAccordion;
				C.ensureAccordion=function(pb){
					var accordion=previousEnsureAccordion.call(C,pb);
					try{runFase2D(C,pb);}catch(e){console.warn("[CheckoutFase2D] Erro:",e);}
					return accordion;
				};
			}
		}
		tryInit();
	})();


;
/* ===== bloco original: linha 1644 ===== */
(function(){function f(){var r=document.getElementById('payment_credit_card_cielo_6a61334181efb5464ac2e348'),c=r&&r.closest('.payment-option'),b=c&&c.querySelector('.label.label-default');if(b&&b.textContent.trim()==='Cartão de crédito')b.textContent='Cartão de débito';}new MutationObserver(f).observe(document.documentElement,{childList:true,subtree:true});})();

;
/* ===== bloco original: linha 1672 ===== */

	(function initHero(){if(document.getElementById('ee-hero'))return;const $main=document.querySelector('main');if(!$main)return;const $hero=document.createElement('section');$hero.id='ee-hero';$hero.innerHTML='<div class="ee-hero-content"><h1 class="ee-hero-title">Estadia Express</h1><p class="ee-hero-subtitle">Hospedagem premium em Goiânia</p><p class="ee-hero-description">Lofts e apartamentos mobiliados.\nConforto, localização e qualidade.</p></div>';$main.insertBefore($hero,$main.firstChild);})();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initHero)}else{initHero()}

