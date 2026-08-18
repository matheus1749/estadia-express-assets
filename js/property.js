/* ============================================================================
   estadia-express - property.js
   Design System V3 - Fase 5: Pagina do imovel

   Faz o que o CSS nao alcanca (corrige o topo sticky, a virgula orfa da
   localizacao, injeta o CTA de WhatsApp - DESIGN.md 4.4) e hospeda o
   bloco de comportamento da pagina do imovel que saiu do legacy.js
   nesta fase.
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

  /* --------------------------------------------------------------------------
     3. CTA SECUNDARIO "RESERVAR PELO WHATSAPP"
     Feature nova, nao redesign (DESIGN.md 4.4/5.6). Mesmo numero do
     rodape (#ee-custom-footer, +55 62 99695-9797). Mensagem com
     imovel+datas+hospedes reaproveitando o mesmo dado que o bypass de
     clique (secao abaixo) ja le do ".bookbutton" nativo: id/from/to/
     persons vem da query string do proprio href que a Stays gera - nao
     e uma fonte de dado nova. So aparece quando o CTA primario tambem
     aparece (".bookbutton" presente = reserva instantanea disponivel
     para o periodo escolhido); some junto se as datas mudarem para um
     periodo sem disponibilidade.
     -------------------------------------------------------------------------- */
  var WA_NUMBER = "5562996959797";
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 6.3A8.9 8.9 0 0 0 3.3 16.8L2 22l5.4-1.4A8.9 8.9 0 0 0 12 21.9a8.9 8.9 0 0 0 8.9-8.9 8.9 8.9 0 0 0-3.3-6.7ZM12 20.2a7.3 7.3 0 0 1-3.7-1l-.3-.2-2.8.7.7-2.7-.2-.3a7.3 7.3 0 1 1 6.3 3.5Zm4-5.5c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.8-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4L9 8.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.4.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1Z"/></svg>';

  function formatDateBR(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    return m ? (m[3] + "/" + m[2] + "/" + m[1]) : iso;
  }

  function parseQuery(href) {
    var qs = (href.split("?")[1] || "").split("&");
    var out = {};
    for (var i = 0; i < qs.length; i++) {
      var kv = qs[i].split("=");
      if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    }
    return out;
  }

  function buildWhatsappLink() {
    var bookBtn = document.querySelector("#panelBook .bookbutton");
    var href = bookBtn ? bookBtn.getAttribute("href") : null;
    if (!href) return null;
    var params = parseQuery(href);
    var titleEl = document.querySelector("#buildingDesc h1");
    var title = titleEl ? titleEl.textContent.trim() : "";
    if (!title || !params.from || !params.to || !params.persons) return null;
    var persons = parseInt(params.persons, 10);
    if (!persons) return null;
    var guestWord = persons === 1 ? "hóspede" : "hóspedes";
    var msg = "Olá! Tenho interesse em reservar o " + title + ", de " +
      formatDateBR(params.from) + " a " + formatDateBR(params.to) +
      ", para " + persons + " " + guestWord + ".";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  function ensureWhatsappCta() {
    var panel = document.querySelector("#panelBook");
    if (!panel) return;
    /* O href do .bookbutton vem da Stays, nao de input do usuario, mas
       parseQuery() faz decodeURIComponent duas vezes por par - um "%"
       fora de um escape valido de 2 digitos hex lanca URIError. Sem
       este guard, uma excecao aqui interromperia run() antes de
       watchPanelBook() rodar (Code Review, 2026-08-17). */
    var link;
    try {
      link = buildWhatsappLink();
    } catch (e) {
      link = null;
    }
    var existing = panel.querySelector(".eex-whatsapp-cta");
    if (!link) {
      if (existing) existing.parentNode.removeChild(existing);
      return;
    }
    if (existing) {
      if (existing.getAttribute("href") !== link) existing.setAttribute("href", link);
      return;
    }
    var primary = panel.querySelector(".btn-create-user");
    if (!primary || !primary.parentNode) return;
    var a = document.createElement("a");
    a.className = "eex-whatsapp-cta";
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    a.innerHTML = WA_ICON + "<span>Reservar pelo WhatsApp</span>";
    primary.parentNode.insertBefore(a, primary.nextSibling);
  }

  /* O painel tem seu proprio datepicker/seletor de hospedes (o mesmo
     console reaproveitado da busca) -- o usuario pode trocar as datas
     sem sair da pagina, bem depois dos 20s em que o observer de boot()
     (freeStickyTop/fixLocationLine) ja se desligou. Este observer
     separado, escopado a #panelBook e sem prazo, garante que o CTA do
     WhatsApp continua sincronizado depois desse desligamento. (Nos
     primeiros 20s os dois observers acabam rodando em paralelo -- a
     insercao do CTA tambem e uma mutacao childList que o observer maior
     nao filtra, so o attributeFilter:"style" dele filtra. Redundante
     mas inofensivo: ensureWhatsappCta() e idempotente, ver acima.
     Code Review, 2026-08-17.) */
  function watchPanelBook() {
    var panel = document.querySelector("#panelBook");
    if (!panel || panel.__eexWaWatched) return;
    panel.__eexWaWatched = true;
    var timer = null;
    var mo = new MutationObserver(function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; ensureWhatsappCta(); }, 50);
    });
    mo.observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "style"] });
  }

  /* --------------------------------------------------------------------------
     4. GALERIA DE FOTOS (grade "1 grande + 4 pequenas" + lightbox)
     DESIGN.md secao 12, D-037/D-038. Le o DOM do Swiper nativo diretamente
     (nao a API/instancia do Swiper - mesma categoria de risco ja registrada
     para window.pageReload/szLoadPay, R-03 em RISKS.md). O Swiper nunca e
     removido/destruido - so escondido via classe condicional que este
     script adiciona ao body depois de montar a grade com sucesso (mesmo
     fallback seguro que ensureWhatsappCta() ja usa: se a extracao falhar,
     nada muda, o Swiper nativo continua visivel).

     Verificado ao vivo antes de escrever este bloco (3 imoveis reais,
     PH01I/TP01H/TP08H): container e ".swiper-container" dentro de
     ".appDetails > .container-fluid"; nenhum tinha ".swiper-slide-duplicate"
     (loop desligado); img.src vem sempre populado, sem lazy. Mesmo assim
     o filtro de duplicadas e o fallback de data-src ficam no codigo, por
     seguranca - nao custam nada e cobrem outra unidade/conta que divirja.
     -------------------------------------------------------------------------- */
  var GALLERY_ROOT_SELECTOR = ".appDetails > .container-fluid";
  var galleryPhotos = [];
  var galleryIndex = 0;
  var galleryLastFocus = null;

  function extractGalleryPhotos() {
    var root = document.querySelector(GALLERY_ROOT_SELECTOR);
    if (!root) return [];
    var slides = root.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)");
    var photos = [];
    for (var i = 0; i < slides.length; i++) {
      var img = slides[i].querySelector("img");
      if (!img) continue;
      var src = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
      if (!src) {
        var srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset");
        if (srcset) src = srcset.split(",")[0].trim().split(/\s+/)[0];
      }
      if (!src) continue;
      var alt = img.getAttribute("alt");
      photos.push({
        src: src,
        alt: alt && alt.trim() ? alt.trim() : ("Foto " + (photos.length + 1) + " do imóvel")
      });
    }
    return photos;
  }

  function galleryKeydown(e) {
    if (e.key === "Escape") { closeGallery(); return; }
    if (e.key === "ArrowLeft") { galleryStep(-1); return; }
    if (e.key === "ArrowRight") { galleryStep(1); return; }
    if (e.key === "Tab") {
      var modal = document.getElementById("eex-gallery-modal");
      if (!modal) return;
      /* Com 1 so foto (tabela 12.6, caso comum, nao de borda), prev/next
         ficam display:none e nao sao focaveis -- querySelectorAll("button")
         sozinho devolveria os 3 mesmo assim, e o segundo Tab escaparia do
         modal (Code Review, 2026-08-17). offsetParent!==null exclui os
         ocultos: com 1 foto so o botao fechar fica na lista, e o ciclo
         Tab/Shift+Tab passa a sempre voltar para ele mesmo. */
      var focusable = Array.prototype.filter.call(
        modal.querySelectorAll("button"),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function ensureGalleryModal() {
    var modal = document.getElementById("eex-gallery-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "eex-gallery-modal";
    modal.className = "eex-gallery-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Galeria de fotos do imóvel");
    modal.setAttribute("tabindex", "-1");

    var img = document.createElement("img");
    img.className = "eex-gallery-modal__img";
    modal.appendChild(img);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "eex-gallery-modal__close";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", closeGallery);
    modal.appendChild(closeBtn);

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "eex-gallery-modal__prev";
    prevBtn.setAttribute("aria-label", "Foto anterior");
    prevBtn.innerHTML = "&lsaquo;";
    prevBtn.addEventListener("click", function () { galleryStep(-1); });
    modal.appendChild(prevBtn);

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "eex-gallery-modal__next";
    nextBtn.setAttribute("aria-label", "Próxima foto");
    nextBtn.innerHTML = "&rsaquo;";
    nextBtn.addEventListener("click", function () { galleryStep(1); });
    modal.appendChild(nextBtn);

    var counter = document.createElement("div");
    counter.className = "eex-gallery-modal__counter";
    modal.appendChild(counter);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeGallery();
    });

    document.body.appendChild(modal);
    return modal;
  }

  function renderGalleryModal() {
    var modal = document.getElementById("eex-gallery-modal");
    if (!modal || !galleryPhotos.length) return;
    /* Defensivo: se a grade for reconstruida com o modal aberto num indice
       que nao existe mais no novo array (Code Review, 2026-08-17). */
    if (galleryIndex >= galleryPhotos.length) galleryIndex = galleryPhotos.length - 1;
    var photo = galleryPhotos[galleryIndex];
    var img = modal.querySelector(".eex-gallery-modal__img");
    img.setAttribute("src", photo.src);
    img.setAttribute("alt", photo.alt);
    var counter = modal.querySelector(".eex-gallery-modal__counter");
    counter.textContent = (galleryIndex + 1) + " de " + galleryPhotos.length;
    var multi = galleryPhotos.length > 1;
    modal.querySelector(".eex-gallery-modal__prev").style.display = multi ? "" : "none";
    modal.querySelector(".eex-gallery-modal__next").style.display = multi ? "" : "none";
  }

  function galleryStep(delta) {
    if (!galleryPhotos.length) return;
    galleryIndex = (galleryIndex + delta + galleryPhotos.length) % galleryPhotos.length;
    renderGalleryModal();
  }

  function openGallery(index) {
    if (!galleryPhotos.length) return;
    galleryIndex = index;
    galleryLastFocus = document.activeElement;
    var modal = ensureGalleryModal();
    renderGalleryModal();
    modal.classList.add("is-open");
    document.addEventListener("keydown", galleryKeydown);
    modal.focus();
  }

  function closeGallery() {
    var modal = document.getElementById("eex-gallery-modal");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.removeEventListener("keydown", galleryKeydown);
    if (galleryLastFocus && typeof galleryLastFocus.focus === "function") galleryLastFocus.focus();
    galleryLastFocus = null;
  }

  function buildGalleryCell(photo, index, total, isMain, isMoreBadge, moreCount) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "eex-gallery-cell" + (isMain ? " eex-gallery-cell--main" : "");
    btn.setAttribute(
      "aria-label",
      isMoreBadge ? ("Ver todas as " + total + " fotos") : ("Ampliar foto " + (index + 1) + " de " + total)
    );
    var img = document.createElement("img");
    img.setAttribute("src", photo.src);
    img.setAttribute("alt", photo.alt);
    img.setAttribute("loading", "lazy");
    btn.appendChild(img);
    if (isMoreBadge) {
      var badge = document.createElement("span");
      badge.className = "eex-gallery-more-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = "+" + moreCount;
      btn.appendChild(badge);
    }
    btn.addEventListener("click", function () { openGallery(index); });
    return btn;
  }

  function buildGalleryGrid(photos) {
    var grid = document.createElement("div");
    grid.id = "eex-gallery-grid";
    grid.className = "eex-gallery-grid" + (photos.length > 1 ? " eex-gallery-grid--multi" : "");
    grid.setAttribute("data-eex-photo-count", String(photos.length));
    var visibleCount = photos.length >= 5 ? 5 : photos.length;
    for (var i = 0; i < visibleCount; i++) {
      var isMain = i === 0;
      var isMoreBadge = photos.length > 5 && i === 4;
      grid.appendChild(buildGalleryCell(photos[i], i, photos.length, isMain, isMoreBadge, photos.length - 5));
    }
    return grid;
  }

  function ensureGallery() {
    var root = document.querySelector(GALLERY_ROOT_SELECTOR);
    var existing = document.getElementById("eex-gallery-grid");

    /* O container inteiro sumiu do DOM (nao so os slides de dentro) --
       nao ha onde reconstruir a partir daqui. Limpa o que sobrou em vez
       de deixar uma grade orfa mostrando fotos antigas para sempre
       (achado do Code Review, 2026-08-17). */
    if (!root) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove("eex-gallery-ready");
      return;
    }

    var photos;
    try {
      photos = extractGalleryPhotos();
    } catch (e) {
      photos = [];
    }

    if (!photos.length) {
      if (!existing) {
        /* Nunca teve grade: imovel genuinamente sem fotos extraiveis,
           Swiper nativo permanece visivel (12.3). */
        document.body.classList.remove("eex-gallery-ready");
        return;
      }
      /* Ja existia grade: mais provavel a Stays estar no meio de uma
         reconstrucao momentanea dos slides (remove e ainda nao repos) do
         que o imovel ter perdido fotos de verdade. Mantem a grade atual
         em vez de piscar o Swiper de volta -- o proximo disparo de run()
         reconstroi quando os slides voltarem (Code Review, 2026-08-17). */
      return;
    }

    galleryPhotos = photos;
    var currentCount = existing ? parseInt(existing.getAttribute("data-eex-photo-count"), 10) : -1;
    if (existing && existing.isConnected && currentCount === photos.length) {
      return;
    }

    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    var grid = buildGalleryGrid(photos);
    root.insertAdjacentElement("afterend", grid);
    document.body.classList.add("eex-gallery-ready");
  }

  function run() {
    if (!onPage()) return;
    freeStickyTop();
    fixLocationLine();
    ensureWhatsappCta();
    watchPanelBook();
    ensureGallery();
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
