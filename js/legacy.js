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
   - blocos 62, 137, 297, 423, 480, 556, 1227, 1229, 1445, 1508, 1588 e 1644
     (todo o fluxo de reserva e pagamento) -> js/checkout.js (Fase 7)

   Com a saida do checkout este arquivo nao contem mais nenhuma linha
   executavel: restam apenas comentarios. O estrangulamento terminou sem
   nenhuma migracao unica de alto risco, como era o objetivo.
*/

;

;
/* ===== blocos 62, 137, 297, 423, 480, 556, 1227, 1229, 1445, 1508, 1588 e 1644
   - MIGRADOS na Fase 7 =====
   Eram todo o JavaScript do fluxo de reserva e pagamento. Foram para
   js/checkout.js por fatiamento programatico, sem uma unica linha reescrita,
   e o loader passou a carregar checkout.js na mesma posicao (sem defer,
   imediatamente depois deste arquivo), para preservar a ordem de execucao.
   A migracao foi validada em uma reserva de teste real, na tela de pagamento,
   com os dois arquivos ativos ao mesmo tempo antes desta remocao. ===== */

/* ===== bloco original: linha 1672 - REMOVIDO na Fase 7 =====
   Era a Hero V1, declarada obsoleta na Fase 2 e substituida por js/hero.js.
   Alem de morta, estava quebrada: o bloco terminava com
       (function initHero(){ ... })();  if (...) { initHero() }
   e o nome de uma funcao-expressao nao existe fora dela, entao a ultima
   linha lancava ReferenceError: initHero is not defined a cada carregamento
   de pagina. O #ee-hero tambem nunca chegava a ser criado, porque o legacy.js
   roda antes do <main> ser lido e a funcao desistia logo no inicio. ===== */
