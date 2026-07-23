(() => {
  'use strict';

  const viewportContent = [
    'width=device-width',
    'initial-scale=1.0',
    'maximum-scale=1.0',
    'user-scalable=no',
    'viewport-fit=cover',
  ].join(', ');

  const removeAutofocus = (scope) => {
    if (scope?.matches?.('[autofocus]')) scope.removeAttribute('autofocus');
    scope?.querySelectorAll?.('[autofocus]').forEach((element) => {
      element.removeAttribute('autofocus');
    });
  };

  // Começa antes do parser terminar para impedir que o WKWebView role a
  // página até o campo assim que encontrar o atributo autofocus.
  const autofocusObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(removeAutofocus);
    }
  });
  if (document.documentElement) {
    autofocusObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  const styles = String.raw`
    :root.vl-ios-app {
      width: 100%;
      max-width: 100%;
      overflow-x: clip;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
      --vl-ios-safe-top:
        var(--vl-ios-native-safe-top, env(safe-area-inset-top, 0px));
      --vl-ios-safe-right:
        var(--vl-ios-native-safe-right, env(safe-area-inset-right, 0px));
      --vl-ios-safe-bottom:
        var(--vl-ios-native-safe-bottom, env(safe-area-inset-bottom, 0px));
      --vl-ios-safe-left:
        var(--vl-ios-native-safe-left, env(safe-area-inset-left, 0px));
    }

    html.vl-ios-app body {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      overflow-x: hidden !important;
      overscroll-behavior-x: none;
    }

    html.vl-ios-app img,
    html.vl-ios-app video,
    html.vl-ios-app canvas,
    html.vl-ios-app svg {
      max-width: 100%;
    }

    html.vl-ios-app button,
    html.vl-ios-app a,
    html.vl-ios-app [role="button"],
    html.vl-ios-app input,
    html.vl-ios-app select,
    html.vl-ios-app textarea {
      touch-action: manipulation;
    }

    /* Evita o zoom automático do Safari/WKWebView ao focar formulários. */
    html.vl-ios-app input,
    html.vl-ios-app select,
    html.vl-ios-app textarea {
      font-size: max(16px, 1em);
    }

    /* Diálogos também precisam respeitar notch e indicador inferior. */
    html.vl-ios-app .swal2-container {
      padding:
        calc(8px + var(--vl-ios-safe-top))
        calc(8px + var(--vl-ios-safe-right))
        calc(8px + var(--vl-ios-safe-bottom))
        calc(8px + var(--vl-ios-safe-left)) !important;
    }

    @media (max-width: 767px) {
      /* Cabeçalho: padding dentro de height fixo esmagava os controles sob a
         Dynamic Island. A altura agora cresce junto com a safe area. */
      html.vl-ios-app .app-header {
        box-sizing: border-box !important;
        height: calc(60px + var(--vl-ios-safe-top)) !important;
        min-height: calc(60px + var(--vl-ios-safe-top)) !important;
        padding-top: var(--vl-ios-safe-top) !important;
        padding-right: calc(18px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(18px + var(--vl-ios-safe-left)) !important;
        flex: 0 0 auto !important;
      }

      html.vl-ios-app .app-body {
        display: flex !important;
        flex: 1 1 auto !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }

      html.vl-ios-app .app-main {
        display: block !important;
        flex: 1 1 auto !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        min-height: 0 !important;
        padding-right: calc(12px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(92px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(12px + var(--vl-ios-safe-left)) !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
      }

      /* Todos os cards permanecem no fluxo normal. As duas regras sticky do
         site eram empilhadas no topo do scroll interno em telas menores. */
      html.vl-ios-app .app-area.votando .placar-pres-top,
      html.vl-ios-app .inc-presidencia.visible {
        position: relative !important;
        top: auto !important;
      }

      html.vl-ios-app .app-sessao-banner,
      html.vl-ios-app .app-area,
      html.vl-ios-app .plenario-voz-card,
      html.vl-ios-app .outro-falando-card,
      html.vl-ios-app .inc-meu-card,
      html.vl-ios-app .inc-outro-card,
      html.vl-ios-app .inc-presidencia,
      html.vl-ios-app .ordens-section,
      html.vl-ios-app .ordens-accordion,
      html.vl-ios-app .ordem-card,
      html.vl-ios-app .votacao-materia,
      html.vl-ios-app .leitura-inner,
      html.vl-ios-app .lt-meta,
      html.vl-ios-app .lt-ementa-box {
        box-sizing: border-box !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      html.vl-ios-app .app-main > .app-sessao-banner,
      html.vl-ios-app .app-main > .plenario-voz-card,
      html.vl-ios-app .app-main > .inc-meu-card,
      html.vl-ios-app .app-main > .inc-outro-card,
      html.vl-ios-app .app-main > .inc-presidencia,
      html.vl-ios-app .app-main > .app-area,
      html.vl-ios-app .app-main > .ordens-section {
        clear: both;
        float: none !important;
      }

      html.vl-ios-app .lt-top,
      html.vl-ios-app .app-sessao-meta,
      html.vl-ios-app .voto-ok,
      html.vl-ios-app .vot-grupo-linha {
        min-width: 0 !important;
        max-width: 100% !important;
        flex-wrap: wrap;
      }

      html.vl-ios-app .lt-numero,
      html.vl-ios-app .lt-subtitulo,
      html.vl-ios-app .mat-ementa-text,
      html.vl-ios-app .ordem-ementa,
      html.vl-ios-app .vot-bloco-ementa,
      html.vl-ios-app .vot-grupo-nome {
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      html.vl-ios-app .vote-grid,
      html.vl-ios-app .app-qm-stats {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      html.vl-ios-app .vote-grid {
        grid-template-columns: minmax(0, 1fr) !important;
      }

      html.vl-ios-app .vote-btn {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      html.vl-ios-app .app-sidebar {
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        padding-right: calc(7px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(7px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(7px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .sb-nav {
        width: min(320px, calc(100vw - var(--vl-ios-safe-right))) !important;
        padding-left: var(--vl-ios-safe-left);
      }

      html.vl-ios-app .sb-nav-head {
        padding-top: calc(24px + var(--vl-ios-safe-top)) !important;
      }

      html.vl-ios-app .app-painel-bar {
        box-sizing: border-box;
        height: calc(52px + var(--vl-ios-safe-top)) !important;
        padding-top: var(--vl-ios-safe-top) !important;
        padding-right: calc(12px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(12px + var(--vl-ios-safe-left)) !important;
      }

      /* Login e seleção de câmara usam layouts próprios. */
      html.vl-ios-app .story-panel {
        padding-top: calc(20px + var(--vl-ios-safe-top)) !important;
        padding-right: calc(17px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(17px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .auth-panel {
        padding-right: calc(16px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(26px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(16px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .layout {
        padding-top: calc(14px + var(--vl-ios-safe-top)) !important;
        padding-right: calc(16px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(16px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(16px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .sel-wrap,
      html.vl-ios-app .glass-card,
      html.vl-ios-app .mun-list,
      html.vl-ios-app .mun-item {
        box-sizing: border-box !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }

      html.vl-ios-app .sel-actions {
        padding-bottom: calc(14px + var(--vl-ios-safe-bottom)) !important;
      }
    }

    @media (max-width: 480px) {
      html.vl-ios-app .app-header {
        height: calc(52px + var(--vl-ios-safe-top)) !important;
        min-height: calc(52px + var(--vl-ios-safe-top)) !important;
        padding-right: calc(12px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(12px + var(--vl-ios-safe-left)) !important;
      }
    }

    @media (max-width: 380px) {
      html.vl-ios-app .app-main {
        padding-right: calc(10px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(10px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .layout {
        padding-right: calc(10px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(10px + var(--vl-ios-safe-left)) !important;
      }
    }

    /* Em paisagem a largura passa do breakpoint móvel, mas o recorte físico
       continua nas laterais. O layout desktop precisa absorver esses insets. */
    @media (orientation: landscape) and (max-height: 500px) {
      html.vl-ios-app .app-header {
        padding-right: calc(18px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(18px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .app-main {
        min-width: 0 !important;
        padding-right: 20px !important;
        padding-bottom: calc(24px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(20px + var(--vl-ios-safe-left)) !important;
        overflow-x: hidden !important;
      }

      html.vl-ios-app .app-sidebar {
        box-sizing: border-box !important;
        padding-right: calc(10px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(10px + var(--vl-ios-safe-bottom)) !important;
      }

      html.vl-ios-app .story-panel {
        padding-left: calc(28px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .auth-panel {
        padding-right: calc(22px + var(--vl-ios-safe-right)) !important;
      }

      html.vl-ios-app .layout {
        padding-right: calc(24px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(18px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(24px + var(--vl-ios-safe-left)) !important;
      }
    }
  `;

  /*
   * Segunda camada: composição móvel do aplicativo.
   *
   * A primeira correção protegia os limites da viewport, mas ainda deixava o
   * layout depender de duas folhas remotas com breakpoints e rolagens
   * concorrentes. Aqui o app iOS ganha uma composição única: o documento rola
   * naturalmente, cards nunca saem do fluxo e somente o dock permanece fixo.
   */
  const experienceStyles = String.raw`
    :root.vl-ios-app {
      --vl-ios-page-x: 14px;
      --vl-ios-card-gap: 12px;
      --vl-ios-dock-base: 72px;
      --vl-ios-header-base: 58px;
      --vl-ios-bg: #07111f;
      --vl-ios-surface: #111c2f;
      --vl-ios-surface-raised: #17243a;
      --vl-ios-line: rgba(148, 163, 184, 0.17);
      --vl-ios-text: #f4f7fb;
      --vl-ios-muted: #9aa9bd;
      color-scheme: dark;
    }

    html.vl-ios-app,
    html.vl-ios-app body {
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      overflow-x: hidden !important;
    }

    html.vl-ios-app body {
      min-height: 100vh !important;
      min-height: 100dvh !important;
      -webkit-font-smoothing: antialiased;
      -webkit-overflow-scrolling: touch;
    }

    html.vl-ios-app *,
    html.vl-ios-app *::before,
    html.vl-ios-app *::after {
      box-sizing: border-box;
    }

    html.vl-ios-app :is(
      .app-main,
      .app-area,
      .app-sessao-banner,
      .app-quorum-panel,
      .app-qm-stats,
      .leitura-inner,
      .lt-top,
      .lt-meta,
      .lt-ementa-block,
      .lt-ementa-box,
      .lt-authors-row,
      .ordens-section,
      .ordens-accordion,
      .ordem-card,
      .votacao-materia,
      .vot-bloco-list,
      .vot-bloco-item,
      .vot-grupo-box,
      .vot-grupo-linha,
      .placar-pres,
      .placar-pres-grid,
      .voto-ok,
      .plenario-voz-card,
      .pres-proximo-voz,
      .inc-meu-card,
      .inc-outro-card,
      .inc-presidencia,
      .inc-pres-item,
      .sessao-block,
      .sessao-header,
      .mat-list,
      .mat-card,
      .mat-body,
      .uc,
      .uc-info,
      .bio,
      .bio-body,
      .sec,
      .wrap
    ) {
      min-width: 0 !important;
      max-width: 100% !important;
    }

    html.vl-ios-app :is(
      .app-sessao-name,
      .app-sessao-meta,
      .mat-ementa-text,
      .vot-bloco-ementa,
      .vot-grupo-nome,
      .lt-numero,
      .lt-subtitulo,
      .lt-ementa-box,
      .ordem-ementa,
      .sessao-nome,
      .mat-ementa,
      .uc-name,
      .bio-desc
    ) {
      overflow-wrap: anywhere !important;
      word-break: normal !important;
    }

    html.vl-ios-app :is(
      .quorum-overlay,
      .app-painel-overlay,
      #modal-pdf,
      .swal2-container
    ) {
      padding:
        calc(12px + var(--vl-ios-safe-top))
        calc(12px + var(--vl-ios-safe-right))
        calc(12px + var(--vl-ios-safe-bottom))
        calc(12px + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app .quorum-card {
      width: min(100%, 380px) !important;
      max-height: calc(
        100dvh - var(--vl-ios-safe-top) - var(--vl-ios-safe-bottom) - 24px
      );
      padding: 26px 20px !important;
      overflow-y: auto;
    }

    html.vl-ios-app .sb-nav {
      left: 0 !important;
      width: min(86vw, 340px) !important;
      max-width: calc(
        100vw - var(--vl-ios-safe-left) - var(--vl-ios-safe-right) - 24px
      ) !important;
      padding-left: var(--vl-ios-safe-left) !important;
      transform: translateX(-105%) !important;
    }

    html.vl-ios-app .sb-nav.open {
      left: 0 !important;
      transform: translateX(0) !important;
    }

    html.vl-ios-app .sb-nav-head {
      padding-top: calc(20px + var(--vl-ios-safe-top)) !important;
    }

    html.vl-ios-app .sb-nav-foot {
      padding-bottom: calc(14px + var(--vl-ios-safe-bottom)) !important;
    }

    html.vl-ios-app .app-painel-bar {
      height: calc(54px + var(--vl-ios-safe-top)) !important;
      min-height: calc(54px + var(--vl-ios-safe-top)) !important;
      padding-top: var(--vl-ios-safe-top) !important;
      padding-right: calc(12px + var(--vl-ios-safe-right)) !important;
      padding-left: calc(12px + var(--vl-ios-safe-left)) !important;
    }

    /* Perfil: a tela não compartilha o header do plenário. */
    html.vl-ios-app.vl-ios-profile .tb {
      position: sticky !important;
      top: 0 !important;
      z-index: 100 !important;
      min-height: calc(58px + var(--vl-ios-safe-top)) !important;
      padding:
        calc(9px + var(--vl-ios-safe-top))
        calc(14px + var(--vl-ios-safe-right))
        9px
        calc(14px + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app.vl-ios-profile .wrap {
      width: min(100%, 560px) !important;
      padding:
        16px
        calc(var(--vl-ios-page-x) + var(--vl-ios-safe-right))
        calc(32px + var(--vl-ios-safe-bottom))
        calc(var(--vl-ios-page-x) + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app.vl-ios-profile .uc,
    html.vl-ios-app.vl-ios-profile .bio,
    html.vl-ios-app.vl-ios-profile .sec {
      width: 100% !important;
      border-radius: 16px !important;
    }

    html.vl-ios-app.vl-ios-profile .fi {
      min-height: 48px;
      font-size: 16px !important;
    }

    /* Login e seleção continuam com sua identidade, agora com recorte físico. */
    html.vl-ios-app .story-panel {
      padding-top: calc(20px + var(--vl-ios-safe-top)) !important;
      padding-right: calc(18px + var(--vl-ios-safe-right)) !important;
      padding-left: calc(18px + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app .auth-panel {
      padding-right: calc(16px + var(--vl-ios-safe-right)) !important;
      padding-bottom: calc(26px + var(--vl-ios-safe-bottom)) !important;
      padding-left: calc(16px + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app .layout {
      padding-top: calc(14px + var(--vl-ios-safe-top)) !important;
      padding-right: calc(16px + var(--vl-ios-safe-right)) !important;
      padding-bottom: calc(16px + var(--vl-ios-safe-bottom)) !important;
      padding-left: calc(16px + var(--vl-ios-safe-left)) !important;
    }

    html.vl-ios-app :is(.sel-wrap, .glass-card, .mun-list, .mun-item) {
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }

    @media (max-width: 767px) and (orientation: portrait) {
      /*
       * No login remoto o painel usa align-items:center. Em iPhones altos isso
       * empurrava o formulário centenas de pixels para baixo e criava um vazio
       * artificial. O conteúdo agora começa logo após a dobra visual.
       */
      html.vl-ios-app .auth-panel {
        align-items: flex-start !important;
        min-height: calc(100dvh - 178px) !important;
        padding-top: clamp(34px, 6dvh, 50px) !important;
      }

      html.vl-ios-app .auth-wrap {
        width: min(100%, 500px) !important;
        margin: 0 auto !important;
      }
    }

    @media (max-width: 767px), (orientation: landscape) and (max-height: 500px) {
      :root.vl-ios-app {
        --vl-ios-page-x: 14px;
      }

      html.vl-ios-app.vl-ios-session body {
        display: block !important;
        height: auto !important;
        min-height: 100dvh !important;
        padding: 0 !important;
        background: var(--vl-ios-bg) !important;
        overflow-y: auto !important;
      }

      html.vl-ios-app.vl-ios-session .app-header {
        position: sticky !important;
        top: 0 !important;
        z-index: 190 !important;
        display: flex !important;
        width: 100% !important;
        height: calc(var(--vl-ios-header-base) + var(--vl-ios-safe-top)) !important;
        min-height: calc(var(--vl-ios-header-base) + var(--vl-ios-safe-top)) !important;
        padding-top: var(--vl-ios-safe-top) !important;
        padding-right: calc(12px + var(--vl-ios-safe-right)) !important;
        padding-bottom: 0 !important;
        padding-left: calc(12px + var(--vl-ios-safe-left)) !important;
        gap: 9px !important;
        flex: none !important;
        background: rgba(4, 12, 25, 0.96) !important;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12) !important;
        box-shadow: 0 8px 26px rgba(2, 6, 23, 0.32) !important;
        -webkit-backdrop-filter: blur(20px) saturate(1.25);
        backdrop-filter: blur(20px) saturate(1.25);
      }

      html.vl-ios-app.vl-ios-session .btn-hb {
        width: 42px !important;
        height: 42px !important;
        min-width: 42px !important;
        min-height: 42px !important;
        border-radius: 13px !important;
        background: rgba(255, 255, 255, 0.07) !important;
      }

      html.vl-ios-app.vl-ios-session .app-brand {
        gap: 9px !important;
      }

      html.vl-ios-app.vl-ios-session :is(.app-brasao, .app-brasao-fallback) {
        width: 34px !important;
        height: 34px !important;
        border-radius: 10px !important;
      }

      html.vl-ios-app.vl-ios-session .app-name {
        font-size: 13px !important;
        line-height: 1.15 !important;
      }

      html.vl-ios-app.vl-ios-session .app-name-sub {
        font-size: 9px !important;
        line-height: 1.2 !important;
      }

      html.vl-ios-app.vl-ios-session .app-user-info {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        padding: 3px !important;
        border-radius: 50% !important;
      }

      html.vl-ios-app.vl-ios-session .app-user-info > :is(img, .app-user-av) {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
      }

      html.vl-ios-app.vl-ios-session .app-user-name {
        display: none !important;
      }

      /*
       * Ponto central da correção: não existe mais scroll flex aninhado.
       * app-main participa do documento e todo card dinâmico entra depois do
       * anterior, inclusive após atualizações do WebSocket.
       */
      html.vl-ios-app.vl-ios-session .app-body {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
      }

      html.vl-ios-app.vl-ios-session .app-main {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding-top: 12px !important;
        padding-right: calc(var(--vl-ios-page-x) + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(
          var(--vl-ios-dock-base) + var(--vl-ios-safe-bottom) + 22px
        ) !important;
        padding-left: calc(var(--vl-ios-page-x) + var(--vl-ios-safe-left)) !important;
        overflow: visible !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-main {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: var(--vl-ios-card-gap) !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-main > :is(
        .app-sessao-banner,
        .pres-proximo-voz,
        .plenario-voz-card,
        .inc-meu-card,
        .inc-outro-card,
        .inc-presidencia,
        .app-area,
        .ordens-section
      ) {
        position: relative !important;
        inset: auto !important;
        float: none !important;
        clear: both !important;
        flex: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        transform: none;
      }

      html.vl-ios-app.vl-ios-plenary .app-main > :is(
        .app-sessao-banner,
        .pres-proximo-voz,
        .plenario-voz-card,
        .inc-meu-card,
        .inc-outro-card,
        .inc-presidencia,
        .app-area
      ) {
        border-radius: 16px !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-sessao-banner {
        padding: 15px 16px !important;
        background:
          linear-gradient(135deg, rgba(30, 64, 175, 0.98), rgba(37, 99, 235, 0.91))
          !important;
        border: 1px solid rgba(147, 197, 253, 0.28) !important;
        box-shadow: 0 12px 30px rgba(30, 64, 175, 0.22) !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-sessao-name {
        font-size: clamp(15px, 4.2vw, 17px) !important;
        line-height: 1.28 !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-sessao-meta {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 7px 12px !important;
        margin-top: 8px !important;
        font-size: 11px !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-area {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
        width: 100% !important;
        min-height: 0 !important;
        padding: 18px 14px !important;
        gap: 10px !important;
        text-align: left !important;
        background: var(--vl-ios-surface) !important;
        border: 1px solid var(--vl-ios-line) !important;
        box-shadow: 0 12px 34px rgba(2, 6, 23, 0.22) !important;
        overflow: visible !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-area.votando {
        padding: 18px 14px !important;
        border-color: rgba(96, 165, 250, 0.28) !important;
        background:
          linear-gradient(180deg, rgba(23, 36, 58, 0.98), rgba(10, 20, 36, 0.99))
          !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-area.leitura-mode {
        padding: 0 !important;
        overflow: hidden !important;
      }

      html.vl-ios-app.vl-ios-plenary .leitura-inner {
        width: 100% !important;
        padding: 18px 14px 16px !important;
        gap: 16px !important;
      }

      html.vl-ios-app.vl-ios-plenary :is(
        .mat-ementa-text,
        .lt-ementa-box,
        .ordens-section
      ) {
        max-height: none !important;
        overflow: visible !important;
      }

      html.vl-ios-app.vl-ios-plenary .mat-ementa-text {
        margin: 0 0 4px !important;
        font-size: clamp(15px, 4vw, 17px) !important;
        line-height: 1.5 !important;
      }

      html.vl-ios-app.vl-ios-plenary .votacao-acao-label {
        margin: 5px 0 0 !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-grid {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        gap: 9px !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-btn {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        width: 100% !important;
        min-height: 58px !important;
        max-height: none !important;
        padding: 12px 16px !important;
        gap: 13px !important;
        border-radius: 14px !important;
        font-size: 15px !important;
        line-height: 1.2 !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-btn i {
        width: 28px !important;
        font-size: 25px !important;
        flex: 0 0 28px !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-btn.selecionado::after {
        top: 50% !important;
        right: 15px !important;
        transform: translateY(-50%) !important;
      }

      html.vl-ios-app.vl-ios-plenary .voto-ok {
        display: grid !important;
        grid-template-columns: auto minmax(0, 1fr) !important;
        align-items: center !important;
        gap: 8px 10px !important;
        width: 100% !important;
        padding: 13px !important;
      }

      html.vl-ios-app.vl-ios-plenary .voto-ok .btn-desfazer {
        grid-column: 1 / -1;
        width: 100% !important;
        min-height: 42px !important;
        margin: 0 !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres-top,
      html.vl-ios-app.vl-ios-plenary .inc-presidencia.visible {
        position: relative !important;
        top: auto !important;
        z-index: auto !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres {
        width: 100% !important;
        margin: 2px 0 0 !important;
        padding: 13px !important;
        border-radius: 14px !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres-grid,
      html.vl-ios-app.vl-ios-plenary .app-qm-stats {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        width: 100% !important;
        gap: 7px !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres-item,
      html.vl-ios-app.vl-ios-plenary .app-qm-stat {
        min-width: 0 !important;
        padding: 11px 3px !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres-num {
        font-size: clamp(23px, 7vw, 30px) !important;
      }

      html.vl-ios-app.vl-ios-plenary .placar-pres-lbl,
      html.vl-ios-app.vl-ios-plenary .app-qm-stat-l {
        font-size: clamp(8px, 2.5vw, 10px) !important;
        white-space: normal !important;
      }

      html.vl-ios-app.vl-ios-plenary .lt-top {
        display: grid !important;
        grid-template-columns: 44px minmax(0, 1fr) !important;
        align-items: start !important;
        gap: 11px !important;
      }

      html.vl-ios-app.vl-ios-plenary .lt-icon {
        width: 44px !important;
        height: 44px !important;
      }

      html.vl-ios-app.vl-ios-plenary .lt-badges {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
      }

      html.vl-ios-app.vl-ios-plenary .lt-authors-row {
        display: flex !important;
        flex-wrap: wrap !important;
      }

      html.vl-ios-app.vl-ios-plenary .lt-actions {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px !important;
      }

      html.vl-ios-app.vl-ios-plenary :is(.lt-pdf-btn, .lt-doc-btn) {
        width: 100% !important;
        min-height: 48px !important;
        margin: 0 !important;
      }

      html.vl-ios-app.vl-ios-plenary .vot-grupo-linha {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        align-items: start !important;
        gap: 8px !important;
      }

      html.vl-ios-app.vl-ios-plenary .vot-grupo-nome {
        white-space: normal !important;
        text-overflow: clip !important;
        overflow: visible !important;
      }

      html.vl-ios-app.vl-ios-plenary .inc-pres-acoes {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px !important;
      }

      html.vl-ios-app.vl-ios-plenary .inc-pres-btn {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 46px !important;
      }

      html.vl-ios-app.vl-ios-plenary .ordens-section {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Dock nativo: somente este elemento fica fora do fluxo. */
      html.vl-ios-app.vl-ios-session .app-sidebar {
        position: fixed !important;
        z-index: 205 !important;
        top: auto !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: stretch !important;
        width: 100% !important;
        height: auto !important;
        min-height: calc(var(--vl-ios-dock-base) + var(--vl-ios-safe-bottom)) !important;
        padding-top: 7px !important;
        padding-right: calc(7px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(7px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(7px + var(--vl-ios-safe-left)) !important;
        gap: 4px !important;
        justify-content: center !important;
        overflow: visible !important;
        background: rgba(9, 18, 33, 0.97) !important;
        border: 0 !important;
        border-top: 1px solid rgba(148, 163, 184, 0.16) !important;
        box-shadow: 0 -10px 30px rgba(2, 6, 23, 0.4) !important;
        -webkit-backdrop-filter: blur(22px) saturate(1.3) !important;
        backdrop-filter: blur(22px) saturate(1.3) !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-dock-main,
        .sb-dock-mais
      ) {
        display: flex !important;
        flex: 1 1 0 !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 0 !important;
        max-width: 170px !important;
        min-height: 54px !important;
        padding: 6px 3px !important;
        gap: 3px !important;
        border: 0 !important;
        border-radius: 12px !important;
        font-size: 9.5px !important;
        line-height: 1.1 !important;
        text-align: center !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-dock-main,
        .sb-dock-mais
      ) i {
        width: auto !important;
        font-size: 20px !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-dock-main,
        .sb-dock-mais
      ) .sb-lbl-full {
        display: none !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-dock-main,
        .sb-dock-mais
      ) .sb-lbl-short {
        display: inline !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-mobile-hide,
        .sb-pres-ind
      ) {
        display: none !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-dock-secondary {
        position: fixed !important;
        z-index: 207 !important;
        top: auto !important;
        right: calc(8px + var(--vl-ios-safe-right)) !important;
        bottom: calc(
          var(--vl-ios-dock-base) + var(--vl-ios-safe-bottom) + 8px
        ) !important;
        left: calc(8px + var(--vl-ios-safe-left)) !important;
        display: flex !important;
        flex-direction: column !important;
        width: auto !important;
        max-height: min(
          66dvh,
          calc(100dvh - var(--vl-ios-safe-top) - var(--vl-ios-dock-base) - 40px)
        ) !important;
        padding: 0 !important;
        overflow: hidden !important;
        border: 1px solid var(--vl-ios-line) !important;
        border-radius: 18px !important;
        background: rgba(17, 28, 47, 0.99) !important;
        box-shadow: 0 -16px 45px rgba(2, 6, 23, 0.55) !important;
        transform: translateY(calc(100% + 120px)) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-dock-secondary.open {
        transform: translateY(0) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-more-body {
        display: flex !important;
        flex-direction: column !important;
        gap: 7px !important;
        padding: 9px !important;
        overflow-y: auto !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-more-body .sb-action {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        width: 100% !important;
        min-height: 50px !important;
        padding: 11px 13px !important;
        gap: 11px !important;
        font-size: 13px !important;
        text-align: left !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-more-body .sb-lbl-full {
        display: inline !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-more-body .sb-lbl-short {
        display: none !important;
      }

      html.vl-ios-app.vl-ios-plenary .sb-more-overlay {
        z-index: 203 !important;
      }

      /*
       * Ordens e Perfil usam menu lateral, portanto a sidebar desktop não deve
       * consumir metade da tela em iPhone ou paisagem baixa.
       */
      html.vl-ios-app.vl-ios-orders .app-sidebar {
        display: none !important;
      }

      html.vl-ios-app.vl-ios-orders .app-main {
        padding-bottom: calc(28px + var(--vl-ios-safe-bottom)) !important;
      }

      html.vl-ios-app.vl-ios-orders .page-title {
        font-size: 22px !important;
        margin: 2px 0 3px !important;
      }

      html.vl-ios-app.vl-ios-orders .page-subtitle {
        margin-bottom: 18px !important;
      }

      html.vl-ios-app.vl-ios-orders .sessao-block {
        width: 100% !important;
        margin-bottom: 22px !important;
      }

      html.vl-ios-app.vl-ios-orders .sessao-header {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        gap: 8px 10px !important;
      }

      html.vl-ios-app.vl-ios-orders .sessao-badge {
        grid-column: 1 / -1;
        width: fit-content;
      }

      html.vl-ios-app.vl-ios-orders .sessao-data {
        white-space: nowrap;
      }

      html.vl-ios-app.vl-ios-orders .mat-card {
        display: grid !important;
        grid-template-columns: 38px minmax(0, 1fr) !important;
        width: 100% !important;
        padding: 14px !important;
        gap: 11px !important;
        border-radius: 14px !important;
      }

      html.vl-ios-app.vl-ios-orders .mat-ementa {
        font-size: 13px !important;
        line-height: 1.45 !important;
      }
    }

    @media (max-width: 359px) {
      :root.vl-ios-app {
        --vl-ios-page-x: 10px;
      }

      html.vl-ios-app.vl-ios-session .app-header {
        padding-right: calc(9px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(9px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app.vl-ios-session .app-brasao,
      html.vl-ios-app.vl-ios-session .app-brasao-fallback {
        display: none !important;
      }

      html.vl-ios-app.vl-ios-profile .uc {
        padding: 18px !important;
        gap: 12px !important;
      }

      html.vl-ios-app.vl-ios-profile .uc-av {
        width: 58px !important;
        height: 58px !important;
        font-size: 22px !important;
      }

      html.vl-ios-app.vl-ios-profile .bio {
        display: grid !important;
        grid-template-columns: 44px minmax(0, 1fr) !important;
      }

      html.vl-ios-app.vl-ios-profile .bio .switch {
        grid-column: 1 / -1;
        justify-self: end;
      }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      :root.vl-ios-app {
        --vl-ios-header-base: 50px;
        --vl-ios-dock-base: 62px;
      }

      html.vl-ios-app .auth-shell {
        display: grid !important;
        grid-template-columns: minmax(280px, 0.82fr) minmax(360px, 1.18fr) !important;
        min-height: 100dvh !important;
      }

      html.vl-ios-app .story-panel {
        min-height: 100dvh !important;
        padding:
          calc(16px + var(--vl-ios-safe-top))
          24px
          calc(16px + var(--vl-ios-safe-bottom))
          calc(24px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .story-content {
        margin: auto 0 !important;
        padding: 18px 0 !important;
      }

      html.vl-ios-app .story-title {
        font-size: clamp(28px, 5vw, 40px) !important;
      }

      html.vl-ios-app .auth-panel {
        min-height: 100dvh !important;
        margin-top: 0 !important;
        padding:
          calc(18px + var(--vl-ios-safe-top))
          calc(24px + var(--vl-ios-safe-right))
          calc(18px + var(--vl-ios-safe-bottom))
          24px !important;
        border-radius: 0 !important;
      }

      html.vl-ios-app.vl-ios-plenary .app-main {
        padding-top: 9px !important;
        padding-right: calc(16px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(16px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-btn {
        justify-content: center !important;
        min-height: 52px !important;
        padding: 8px !important;
        gap: 7px !important;
        font-size: 13px !important;
      }

      html.vl-ios-app.vl-ios-plenary .vote-btn i {
        width: auto !important;
        flex: 0 0 auto !important;
        font-size: 20px !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar > :is(
        .sb-dock-main,
        .sb-dock-mais
      ) {
        min-height: 44px !important;
      }

      html.vl-ios-app.vl-ios-profile .wrap {
        width: min(100%, 760px) !important;
      }
    }

    @media (min-width: 768px) and (min-height: 501px) {
      html.vl-ios-app.vl-ios-session .app-header {
        height: calc(60px + var(--vl-ios-safe-top)) !important;
        min-height: calc(60px + var(--vl-ios-safe-top)) !important;
        padding-top: var(--vl-ios-safe-top) !important;
        padding-right: calc(18px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(18px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app.vl-ios-session .app-main {
        padding-right: calc(24px + var(--vl-ios-safe-right)) !important;
        padding-left: calc(24px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar {
        padding-right: calc(10px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(10px + var(--vl-ios-safe-bottom)) !important;
      }
    }
  `;

  /*
   * Terceira camada: identidade visual nativa.
   *
   * Esta camada não altera o fluxo de dados do plenário. Ela dá ao aplicativo
   * uma presença própria e consistente: profundidade, hierarquia, estados de
   * ação reconhecíveis e navegação flutuante, preservando todos os seletores
   * usados pelo backend e pelo WebSocket.
   */
  const redesignStyles = String.raw`
    :root.vl-ios-app {
      --vl3-ink: #f7fbff;
      --vl3-muted: #9aacc3;
      --vl3-muted-strong: #c5d1df;
      --vl3-cyan: #2dd4ff;
      --vl3-blue: #3478f6;
      --vl3-indigo: #665cf6;
      --vl3-green: #32d583;
      --vl3-red: #ff647c;
      --vl3-amber: #ffbf47;
      --vl3-page: #050c17;
      --vl3-card: rgba(18, 31, 51, 0.82);
      --vl3-card-strong: rgba(22, 38, 63, 0.94);
      --vl3-hairline: rgba(173, 199, 230, 0.14);
      --vl3-shadow: 0 22px 54px rgba(0, 4, 14, 0.34);
      --vl3-radius: 22px;
      --vl-ios-bg: var(--vl3-page);
      --vl-ios-surface: var(--vl3-card);
      --vl-ios-surface-raised: var(--vl3-card-strong);
      --vl-ios-line: var(--vl3-hairline);
      --vl-ios-text: var(--vl3-ink);
      --vl-ios-muted: var(--vl3-muted);
      color-scheme: dark;
    }

    html.vl-ios-app body {
      color: var(--vl3-ink) !important;
      background:
        radial-gradient(circle at 92% -4%, rgba(52, 120, 246, 0.24), transparent 29rem),
        radial-gradient(circle at -12% 72%, rgba(45, 212, 255, 0.10), transparent 24rem),
        linear-gradient(165deg, #050b15 0%, #081426 46%, #07101e 100%)
        fixed !important;
    }

    html.vl-ios-app body::before {
      content: '';
      position: fixed;
      z-index: -1;
      inset: 0;
      pointer-events: none;
      opacity: 0.28;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
      background-size: 38px 38px;
      -webkit-mask-image: linear-gradient(to bottom, black, transparent 78%);
      mask-image: linear-gradient(to bottom, black, transparent 78%);
    }

    html.vl-ios-app :is(button, a, input, select, textarea) {
      -webkit-tap-highlight-color: transparent;
    }

    html.vl-ios-app :is(button, a, [role='button']) {
      transition:
        transform 150ms ease,
        border-color 150ms ease,
        background-color 150ms ease,
        box-shadow 150ms ease,
        opacity 150ms ease !important;
    }

    html.vl-ios-app :is(button, a, [role='button']):active {
      transform: scale(0.975);
    }

    html.vl-ios-app :is(
      .app-area,
      .app-sessao-banner,
      .plenario-voz-card,
      .pres-proximo-voz,
      .inc-meu-card,
      .inc-outro-card,
      .inc-presidencia,
      .ordens-section,
      .ordem-card,
      .sessao-block,
      .mat-card,
      .uc,
      .bio,
      .sec
    ) {
      border-color: var(--vl3-hairline) !important;
      box-shadow: var(--vl3-shadow) !important;
      -webkit-backdrop-filter: blur(22px) saturate(1.22);
      backdrop-filter: blur(22px) saturate(1.22);
    }

    /* Cabeçalho compacto com assinatura visual própria do aplicativo. */
    html.vl-ios-app.vl-ios-session .app-header {
      background:
        linear-gradient(180deg, rgba(5, 13, 26, 0.96), rgba(7, 17, 32, 0.87))
        !important;
      border-bottom-color: rgba(138, 181, 235, 0.12) !important;
      box-shadow: 0 12px 34px rgba(0, 4, 14, 0.28) !important;
    }

    html.vl-ios-app.vl-ios-session .app-header::after {
      content: '';
      position: absolute;
      right: 18%;
      bottom: -1px;
      left: 18%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(45, 212, 255, 0.72), transparent);
    }

    html.vl-ios-app.vl-ios-session .btn-hb {
      color: #dceaff !important;
      border: 1px solid rgba(164, 196, 234, 0.15) !important;
      background:
        linear-gradient(145deg, rgba(38, 57, 84, 0.78), rgba(15, 27, 46, 0.86))
        !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 8px 20px rgba(0, 4, 14, 0.2) !important;
    }

    html.vl-ios-app.vl-ios-session .app-brand {
      min-width: 0;
    }

    html.vl-ios-app.vl-ios-session :is(.app-brasao, .app-brasao-fallback) {
      padding: 4px !important;
      background:
        linear-gradient(145deg, rgba(52, 120, 246, 0.92), rgba(38, 71, 155, 0.82))
        !important;
      border: 1px solid rgba(143, 205, 255, 0.34) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 8px 22px rgba(36, 99, 235, 0.28) !important;
    }

    html.vl-ios-app.vl-ios-session .app-name {
      color: #f8fbff !important;
      font-weight: 800 !important;
      letter-spacing: -0.025em !important;
    }

    html.vl-ios-app.vl-ios-session .app-name-sub {
      color: #7edbff !important;
      font-weight: 700 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase;
    }

    html.vl-ios-app.vl-ios-session .app-user-info {
      border: 1px solid rgba(132, 185, 255, 0.34) !important;
      background:
        linear-gradient(145deg, rgba(44, 82, 145, 0.88), rgba(21, 40, 73, 0.94))
        !important;
      box-shadow:
        0 0 0 4px rgba(52, 120, 246, 0.08),
        0 8px 24px rgba(0, 4, 14, 0.3) !important;
    }

    /* Sessão ativa: banner editorial, não apenas um retângulo azul. */
    html.vl-ios-app.vl-ios-plenary .app-sessao-banner {
      position: relative !important;
      isolation: isolate;
      padding: 18px 18px 18px 20px !important;
      overflow: hidden !important;
      background:
        radial-gradient(circle at 100% 0%, rgba(45, 212, 255, 0.24), transparent 42%),
        linear-gradient(135deg, rgba(34, 86, 192, 0.98), rgba(69, 59, 200, 0.96))
        !important;
      border: 1px solid rgba(152, 210, 255, 0.28) !important;
      border-radius: var(--vl3-radius) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.16),
        0 22px 48px rgba(28, 68, 176, 0.28) !important;
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-banner::before {
      width: 4px !important;
      top: 20px !important;
      bottom: 20px !important;
      left: 0 !important;
      border-radius: 0 4px 4px 0;
      background: linear-gradient(180deg, #91efff, #6e82ff) !important;
      box-shadow: 0 0 18px rgba(45, 212, 255, 0.72);
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-banner::after {
      content: '';
      position: absolute;
      z-index: -1;
      width: 118px;
      height: 118px;
      right: -45px;
      bottom: -58px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 50%;
      box-shadow:
        0 0 0 23px rgba(255, 255, 255, 0.025),
        0 0 0 46px rgba(255, 255, 255, 0.018);
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-label {
      color: #bbf3ff !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase;
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-label-dot {
      background: #5dffbd !important;
      box-shadow: 0 0 0 5px rgba(93, 255, 189, 0.12), 0 0 15px rgba(93, 255, 189, 0.48) !important;
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-name {
      margin-top: 7px !important;
      color: #ffffff !important;
      font-size: clamp(17px, 4.7vw, 20px) !important;
      font-weight: 800 !important;
      letter-spacing: -0.03em !important;
    }

    html.vl-ios-app.vl-ios-plenary .app-sessao-meta {
      color: rgba(235, 246, 255, 0.76) !important;
    }

    /* Card de conteúdo: borda luminosa, superfície profunda e leitura limpa. */
    html.vl-ios-app.vl-ios-session .app-main > .app-area {
      position: relative !important;
      isolation: isolate;
      border-radius: var(--vl3-radius) !important;
      background:
        radial-gradient(circle at 86% 0%, rgba(52, 120, 246, 0.13), transparent 42%),
        linear-gradient(155deg, rgba(22, 37, 61, 0.94), rgba(11, 22, 39, 0.92))
        !important;
      border: 1px solid rgba(159, 191, 229, 0.16) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.035),
        0 22px 50px rgba(0, 4, 14, 0.32) !important;
    }

    html.vl-ios-app.vl-ios-session .app-main > .app-area::before {
      content: '';
      position: absolute;
      z-index: -1;
      top: 0;
      right: 24px;
      left: 24px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(104, 195, 255, 0.54), transparent);
    }

    /* Estado sem sessão: uma tela de espera intencional e viva. */
    html.vl-ios-app.vl-ios-session:not(.vl-ios-plenary) .app-main {
      min-height: calc(
        100dvh - var(--vl-ios-header-base) - var(--vl-ios-safe-top) -
        var(--vl-ios-dock-base) - var(--vl-ios-safe-bottom)
      ) !important;
      display: flex !important;
      align-items: flex-start !important;
      padding-top: clamp(22px, 6dvh, 54px) !important;
    }

    html.vl-ios-app.vl-ios-session:not(.vl-ios-plenary) .app-main > .app-area {
      width: 100% !important;
      min-height: clamp(300px, 51dvh, 430px) !important;
      padding: 42px 22px 34px !important;
      justify-content: center !important;
      text-align: center !important;
      overflow: hidden !important;
      background:
        radial-gradient(circle at 50% 20%, rgba(47, 148, 255, 0.21), transparent 37%),
        radial-gradient(circle at 92% 92%, rgba(102, 92, 246, 0.16), transparent 36%),
        linear-gradient(160deg, rgba(20, 36, 61, 0.95), rgba(8, 18, 34, 0.96))
        !important;
    }

    html.vl-ios-app.vl-ios-session:not(.vl-ios-plenary) .app-main > .app-area::after {
      content: 'ATUALIZAÇÃO AUTOMÁTICA';
      position: absolute;
      top: 20px;
      left: 50%;
      padding: 7px 10px;
      color: #91e8ff;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.13em;
      white-space: nowrap;
      border: 1px solid rgba(87, 203, 255, 0.22);
      border-radius: 999px;
      background: rgba(35, 131, 207, 0.10);
      transform: translateX(-50%);
    }

    html.vl-ios-app.vl-ios-session .aguardando-icon {
      position: relative;
      width: 92px !important;
      height: 92px !important;
      margin: 4px auto 22px !important;
      color: #7fe8ff !important;
      font-size: 36px !important;
      border: 1px solid rgba(125, 220, 255, 0.26) !important;
      background:
        radial-gradient(circle at 34% 28%, rgba(117, 222, 255, 0.20), transparent 37%),
        linear-gradient(145deg, rgba(39, 78, 132, 0.74), rgba(15, 28, 49, 0.92))
        !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.14),
        0 0 0 10px rgba(56, 151, 255, 0.045),
        0 20px 40px rgba(0, 9, 26, 0.38) !important;
    }

    html.vl-ios-app.vl-ios-session .aguardando-icon::after {
      content: '';
      position: absolute;
      right: 7px;
      bottom: 8px;
      width: 12px;
      height: 12px;
      border: 3px solid #14243b;
      border-radius: 50%;
      background: var(--vl3-green);
      box-shadow: 0 0 13px rgba(50, 213, 131, 0.72);
    }

    html.vl-ios-app.vl-ios-session .aguardando-text {
      color: #f5f9ff !important;
      font-size: clamp(19px, 5vw, 22px) !important;
      font-weight: 800 !important;
      letter-spacing: -0.035em !important;
    }

    html.vl-ios-app.vl-ios-session .aguardando-sub {
      max-width: 286px;
      margin: 9px auto 0 !important;
      color: var(--vl3-muted) !important;
      font-size: 12px !important;
      line-height: 1.6 !important;
    }

    html.vl-ios-app.vl-ios-session .aguardando-sync {
      min-height: 44px;
      margin-top: 20px !important;
      padding: 11px 17px !important;
      color: #c8f4ff !important;
      font-weight: 750 !important;
      border: 1px solid rgba(83, 196, 255, 0.27) !important;
      border-radius: 13px !important;
      background: rgba(37, 132, 211, 0.12) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    }

    /* Votação: três decisões visualmente inequívocas e confortáveis ao toque. */
    html.vl-ios-app.vl-ios-plenary .app-area.votando {
      border-color: rgba(78, 154, 255, 0.24) !important;
      background:
        radial-gradient(circle at 100% 0%, rgba(75, 101, 255, 0.16), transparent 38%),
        linear-gradient(155deg, rgba(21, 36, 59, 0.98), rgba(8, 18, 34, 0.98))
        !important;
    }

    html.vl-ios-app.vl-ios-plenary :is(.votacao-materia, .leitura-inner) {
      border-radius: 18px !important;
    }

    html.vl-ios-app.vl-ios-plenary .mat-ementa-text {
      color: #f1f6fd !important;
      font-weight: 680 !important;
      letter-spacing: -0.018em !important;
    }

    html.vl-ios-app.vl-ios-plenary .votacao-acao-label {
      color: #7edfff !important;
      font-size: 10px !important;
      font-weight: 850 !important;
      letter-spacing: 0.11em !important;
      text-transform: uppercase;
    }

    html.vl-ios-app.vl-ios-plenary .vote-grid {
      gap: 10px !important;
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn {
      position: relative !important;
      min-height: 64px !important;
      padding: 13px 16px !important;
      color: #eef6ff !important;
      font-weight: 800 !important;
      border-width: 1px !important;
      border-radius: 17px !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.07),
        0 10px 25px rgba(0, 4, 14, 0.18) !important;
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn i {
      display: grid !important;
      place-items: center;
      width: 36px !important;
      height: 36px !important;
      flex: 0 0 36px !important;
      font-size: 20px !important;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.sim {
      border-color: rgba(50, 213, 131, 0.32) !important;
      background: linear-gradient(135deg, rgba(22, 115, 78, 0.54), rgba(14, 58, 52, 0.68)) !important;
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.sim i {
      color: #7cf0b4 !important;
      background: rgba(50, 213, 131, 0.13);
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.nao {
      border-color: rgba(255, 100, 124, 0.31) !important;
      background: linear-gradient(135deg, rgba(130, 42, 63, 0.55), rgba(66, 25, 45, 0.7)) !important;
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.nao i {
      color: #ff9cad !important;
      background: rgba(255, 100, 124, 0.13);
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.abstencao {
      border-color: rgba(255, 191, 71, 0.30) !important;
      background: linear-gradient(135deg, rgba(120, 82, 25, 0.55), rgba(61, 45, 27, 0.70)) !important;
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.abstencao i {
      color: #ffd17a !important;
      background: rgba(255, 191, 71, 0.13);
    }

    html.vl-ios-app.vl-ios-plenary .vote-btn.selecionado {
      border-color: rgba(255, 255, 255, 0.52) !important;
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.28),
        0 0 0 4px rgba(92, 159, 255, 0.13),
        0 14px 30px rgba(0, 4, 14, 0.28) !important;
    }

    html.vl-ios-app.vl-ios-plenary :is(.placar-pres, .app-quorum-panel) {
      border: 1px solid rgba(147, 189, 236, 0.14) !important;
      background: rgba(7, 17, 31, 0.62) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
    }

    html.vl-ios-app.vl-ios-plenary :is(.placar-pres-item, .app-qm-stat) {
      border: 1px solid rgba(158, 190, 228, 0.11) !important;
      border-radius: 13px !important;
      background: rgba(31, 49, 76, 0.48) !important;
    }

    /* Leitura, voz e ocorrências compartilham a mesma gramática de superfície. */
    html.vl-ios-app.vl-ios-plenary :is(
      .lt-meta,
      .lt-ementa-box,
      .pres-proximo-voz,
      .plenario-voz-card,
      .inc-meu-card,
      .inc-outro-card,
      .inc-presidencia
    ) {
      border-color: rgba(153, 193, 235, 0.15) !important;
      background:
        linear-gradient(150deg, rgba(25, 42, 68, 0.89), rgba(10, 21, 38, 0.92))
        !important;
    }

    html.vl-ios-app.vl-ios-plenary :is(.lt-icon, .plenario-voz-icon, .inc-meu-icon) {
      color: #85e4ff !important;
      border: 1px solid rgba(90, 194, 255, 0.22) !important;
      background: rgba(40, 126, 206, 0.13) !important;
    }

    /* Dock flutuante: uma barra nativa reconhecível, longe do home indicator. */
    html.vl-ios-app.vl-ios-session .app-sidebar {
      right: calc(10px + var(--vl-ios-safe-right)) !important;
      bottom: calc(9px + var(--vl-ios-safe-bottom)) !important;
      left: calc(10px + var(--vl-ios-safe-left)) !important;
      width: auto !important;
      height: 68px !important;
      min-height: 68px !important;
      max-height: 68px !important;
      padding: 6px !important;
      gap: 4px !important;
      overflow: visible !important;
      border: 1px solid rgba(160, 194, 235, 0.17) !important;
      border-radius: 23px !important;
      background:
        linear-gradient(180deg, rgba(22, 37, 59, 0.93), rgba(7, 16, 30, 0.95))
        !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 18px 45px rgba(0, 3, 12, 0.5) !important;
      -webkit-backdrop-filter: blur(26px) saturate(1.35);
      backdrop-filter: blur(26px) saturate(1.35);
    }

    html.vl-ios-app.vl-ios-session .app-sidebar > :is(.sb-dock-main, .sb-dock-mais) {
      height: 54px !important;
      min-height: 55px !important;
      max-height: 55px !important;
      padding: 7px 4px !important;
      gap: 4px !important;
      color: #91a5be !important;
      font-size: 9px !important;
      font-weight: 750 !important;
      border: 1px solid transparent !important;
      border-radius: 17px !important;
      background: transparent !important;
    }

    html.vl-ios-app.vl-ios-session .app-sidebar > :is(.sb-dock-main, .sb-dock-mais) i {
      color: #a9bbd0 !important;
      font-size: 20px !important;
    }

    html.vl-ios-app.vl-ios-session .app-sidebar > :is(.sb-dock-main, .sb-dock-mais).ativo {
      color: #dff7ff !important;
      border-color: rgba(76, 181, 255, 0.20) !important;
      background:
        linear-gradient(145deg, rgba(41, 122, 235, 0.28), rgba(47, 80, 177, 0.22))
        !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
    }

    html.vl-ios-app.vl-ios-session .app-sidebar > :is(.sb-dock-main, .sb-dock-mais).ativo i {
      color: #6edcff !important;
    }

    html.vl-ios-app.vl-ios-session .sb-dock-secondary {
      right: 0 !important;
      bottom: calc(74px + var(--vl-ios-safe-bottom)) !important;
      left: 0 !important;
      margin: 0 2px !important;
      padding: 10px !important;
      border: 1px solid rgba(160, 194, 235, 0.16) !important;
      border-radius: 22px !important;
      background: rgba(10, 21, 38, 0.97) !important;
      box-shadow: 0 22px 55px rgba(0, 3, 12, 0.52) !important;
    }

    /* Login mobile: hero integrado e cartão de acesso realmente nativo. */
    html.vl-ios-app .auth-shell {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 82% 2%, rgba(58, 120, 255, 0.36), transparent 36%),
        radial-gradient(circle at -8% 86%, rgba(45, 212, 255, 0.15), transparent 35%),
        linear-gradient(160deg, #050c18 0%, #0a1930 51%, #07111f 100%)
        !important;
    }

    html.vl-ios-app .story-panel {
      background: transparent !important;
    }

    html.vl-ios-app .story-panel::before {
      opacity: 0.48 !important;
      background-size: 34px 34px !important;
    }

    html.vl-ios-app .story-panel::after {
      width: 280px !important;
      height: 280px !important;
      top: 40px !important;
      right: -155px !important;
      border-color: rgba(93, 175, 255, 0.24) !important;
      box-shadow:
        0 0 0 44px rgba(80, 151, 255, 0.025),
        0 0 0 88px rgba(80, 151, 255, 0.016) !important;
    }

    html.vl-ios-app .brand {
      color: #f7fbff !important;
      letter-spacing: -0.045em !important;
    }

    html.vl-ios-app .brand img {
      padding: 6px !important;
      border: 1px solid rgba(127, 209, 255, 0.33) !important;
      border-radius: 12px !important;
      background: linear-gradient(145deg, rgba(52, 120, 246, 0.8), rgba(71, 71, 190, 0.7)) !important;
      box-shadow: 0 10px 25px rgba(31, 89, 205, 0.25) !important;
    }

    html.vl-ios-app .back-home {
      color: #c5ddf6 !important;
      border: 1px solid rgba(147, 193, 239, 0.15) !important;
      border-radius: 12px !important;
      background: rgba(16, 36, 64, 0.48) !important;
      -webkit-backdrop-filter: blur(14px);
      backdrop-filter: blur(14px);
    }

    html.vl-ios-app .story-title {
      color: #f8fbff !important;
      text-wrap: balance;
      letter-spacing: -0.055em !important;
    }

    html.vl-ios-app .story-title span {
      color: transparent !important;
      background: linear-gradient(90deg, #49dbff, #5f8bff 58%, #9976ff);
      -webkit-background-clip: text;
      background-clip: text;
    }

    html.vl-ios-app .auth-panel {
      background:
        radial-gradient(circle at 100% 0%, rgba(70, 136, 255, 0.10), transparent 34%),
        linear-gradient(155deg, rgba(22, 39, 64, 0.88), rgba(10, 21, 38, 0.94))
        !important;
      border: 1px solid rgba(168, 199, 233, 0.15) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 -18px 55px rgba(0, 4, 14, 0.28) !important;
      -webkit-backdrop-filter: blur(28px) saturate(1.2);
      backdrop-filter: blur(28px) saturate(1.2);
    }

    html.vl-ios-app .auth-kicker {
      color: #72ddff !important;
      font-weight: 850 !important;
      letter-spacing: 0.12em !important;
    }

    html.vl-ios-app .auth-kicker::before {
      background: linear-gradient(90deg, #34c8ff, #6e78ff) !important;
      box-shadow: 0 0 12px rgba(52, 200, 255, 0.48);
    }

    html.vl-ios-app .form-title {
      color: #f7fbff !important;
      letter-spacing: -0.05em !important;
    }

    html.vl-ios-app .form-subtitle {
      color: #9eafc4 !important;
    }

    html.vl-ios-app .auth-card {
      border: 1px solid rgba(164, 196, 231, 0.14) !important;
      border-radius: 22px !important;
      background: rgba(7, 17, 31, 0.42) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
    }

    html.vl-ios-app .session-user {
      position: relative;
      margin-bottom: 14px !important;
      padding: 16px 15px 16px 45px !important;
      color: #d8eaff !important;
      border: 1px solid rgba(75, 158, 255, 0.22) !important;
      border-radius: 16px !important;
      background:
        linear-gradient(135deg, rgba(42, 101, 201, 0.20), rgba(33, 55, 100, 0.18))
        !important;
    }

    html.vl-ios-app .session-user i {
      position: absolute;
      top: 50%;
      left: 15px;
      color: #6de0ff !important;
      font-size: 19px !important;
      transform: translateY(-50%);
    }

    html.vl-ios-app .session-user strong {
      color: #ffffff !important;
    }

    html.vl-ios-app :is(.btn-primary, .btn-secondary, .btn-biometric) {
      min-height: 54px !important;
      border-radius: 16px !important;
      font-weight: 800 !important;
    }

    html.vl-ios-app .btn-primary {
      color: #ffffff !important;
      border: 1px solid rgba(125, 188, 255, 0.26) !important;
      background:
        linear-gradient(135deg, #2d8cff 0%, #365fe9 62%, #5a4fd5 100%)
        !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        0 14px 30px rgba(34, 91, 223, 0.32) !important;
    }

    html.vl-ios-app .btn-secondary,
    html.vl-ios-app .btn-biometric {
      color: #c8d8ea !important;
      border: 1px solid rgba(164, 194, 229, 0.16) !important;
      background-color: rgba(23, 40, 64, 0.92) !important;
      background-image: none !important;
    }

    html.vl-ios-app .session-actions .btn-secondary {
      color: #d9e6f4 !important;
      background-color: #172840 !important;
      background-image: linear-gradient(
        145deg,
        rgba(31, 52, 82, 0.98),
        rgba(18, 34, 56, 0.98)
      ) !important;
    }

    html.vl-ios-app .form-label,
    html.vl-ios-app .checkbox-wrap {
      color: #c7d5e5 !important;
    }

    html.vl-ios-app .form-input {
      color: #f3f8ff !important;
      border-color: rgba(153, 188, 229, 0.18) !important;
      background: rgba(7, 17, 31, 0.62) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
    }

    html.vl-ios-app .form-input:focus {
      border-color: rgba(81, 177, 255, 0.64) !important;
      box-shadow: 0 0 0 4px rgba(52, 120, 246, 0.13) !important;
    }

    html.vl-ios-app .auth-help {
      color: rgba(198, 216, 237, 0.57) !important;
    }

    /* Ordens e perfil: mesmas superfícies, sem telas que pareçam outro site. */
    html.vl-ios-app.vl-ios-orders :is(.ordens-section, .ordem-card, .sessao-block, .mat-card),
    html.vl-ios-app.vl-ios-profile :is(.uc, .bio, .sec) {
      color: var(--vl3-ink) !important;
      border-radius: 20px !important;
      background:
        linear-gradient(150deg, rgba(23, 39, 63, 0.92), rgba(10, 21, 38, 0.94))
        !important;
    }

    html.vl-ios-app.vl-ios-orders :is(.page-title, .sessao-nome, .mat-ementa),
    html.vl-ios-app.vl-ios-profile :is(.uc-name, .sec-title, .bio-name) {
      color: #f4f8ff !important;
    }

    html.vl-ios-app.vl-ios-profile .tb {
      color: #f3f8ff !important;
      border-bottom: 1px solid rgba(148, 187, 232, 0.12) !important;
      background: rgba(5, 13, 26, 0.91) !important;
      box-shadow: 0 10px 32px rgba(0, 4, 14, 0.28) !important;
      -webkit-backdrop-filter: blur(22px);
      backdrop-filter: blur(22px);
    }

    html.vl-ios-app.vl-ios-profile .fi {
      color: #eef6ff !important;
      border-color: rgba(151, 187, 228, 0.16) !important;
      border-radius: 14px !important;
      background: rgba(7, 17, 31, 0.58) !important;
    }

    @media (max-width: 767px) and (orientation: portrait) {
      :root.vl-ios-app {
        --vl-ios-card-gap: 14px;
        --vl-ios-dock-base: 80px;
      }

      html.vl-ios-app.vl-ios-session .app-main {
        padding-top: 16px !important;
        padding-right: calc(13px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(96px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(13px + var(--vl-ios-safe-left)) !important;
      }

      html.vl-ios-app .story-panel {
        min-height: 232px !important;
        padding-bottom: 74px !important;
      }

      html.vl-ios-app .story-content {
        margin-top: 33px !important;
      }

      html.vl-ios-app .story-title {
        max-width: 340px;
        margin-inline: auto;
        font-size: clamp(29px, 8.5vw, 36px) !important;
        line-height: 0.99 !important;
      }

      html.vl-ios-app .auth-panel {
        min-height: calc(100dvh - 202px) !important;
        margin: -30px 10px 10px !important;
        padding-top: 34px !important;
        padding-right: calc(15px + var(--vl-ios-safe-right)) !important;
        padding-bottom: calc(22px + var(--vl-ios-safe-bottom)) !important;
        padding-left: calc(15px + var(--vl-ios-safe-left)) !important;
        border-radius: 28px !important;
      }

      html.vl-ios-app .auth-heading {
        margin-bottom: 22px !important;
      }

      html.vl-ios-app .form-title {
        font-size: clamp(28px, 8vw, 34px) !important;
      }

      html.vl-ios-app .auth-card {
        padding: 16px !important;
      }
    }

    @media (max-width: 350px) {
      html.vl-ios-app .story-panel {
        min-height: 205px !important;
      }

      html.vl-ios-app .story-content {
        margin-top: 24px !important;
      }

      html.vl-ios-app .auth-panel {
        min-height: calc(100dvh - 178px) !important;
        padding-top: 25px !important;
      }

      html.vl-ios-app .auth-heading {
        margin-bottom: 16px !important;
      }

      html.vl-ios-app .auth-card {
        padding: 12px !important;
      }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      html.vl-ios-app .story-panel {
        background:
          radial-gradient(circle at 100% 50%, rgba(52, 120, 246, 0.17), transparent 46%)
          !important;
      }

      html.vl-ios-app .auth-panel {
        margin: 8px calc(8px + var(--vl-ios-safe-right)) 8px 0 !important;
        min-height: calc(100dvh - 16px) !important;
        border-radius: 28px !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar {
        right: calc(9px + var(--vl-ios-safe-right)) !important;
        bottom: calc(8px + var(--vl-ios-safe-bottom)) !important;
        left: auto !important;
        width: min(360px, calc(100vw - var(--vl-ios-safe-left) - var(--vl-ios-safe-right) - 18px)) !important;
      }
    }

    @media (min-width: 768px) and (min-height: 501px) {
      html.vl-ios-app.vl-ios-session .app-main {
        width: min(100%, 920px) !important;
        margin-inline: auto !important;
      }

      html.vl-ios-app.vl-ios-session .app-sidebar {
        right: calc(14px + var(--vl-ios-safe-right)) !important;
        bottom: calc(14px + var(--vl-ios-safe-bottom)) !important;
        left: auto !important;
        width: min(460px, calc(100vw - 28px)) !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html.vl-ios-app *,
      html.vl-ios-app *::before,
      html.vl-ios-app *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

  function install() {
    const root = document.documentElement;
    if (!root) return;

    root.classList.add('vl-ios-app');
    root.dataset.vlIosUi = '3';

    const hasSessionShell = Boolean(document.querySelector('.app-header, .app-body'));
    root.classList.toggle('vl-ios-session', hasSessionShell);
    root.classList.toggle('vl-ios-plenary', Boolean(document.querySelector('.app-sessao-banner, #app-area-default, .app-area.votando')));
    root.classList.toggle('vl-ios-orders', Boolean(document.querySelector('.page-title, .mat-list')));
    root.classList.toggle('vl-ios-profile', Boolean(document.querySelector('.tb, main.wrap')));

    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport && document.head) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    if (viewport) viewport.setAttribute('content', viewportContent);

    if (!document.getElementById('vl-ios-native-style')) {
      const style = document.createElement('style');
      style.id = 'vl-ios-native-style';
      style.textContent = `${styles}\n${experienceStyles}\n${redesignStyles}`;
      (document.head || root).appendChild(style);
    }

    // Autofocus no login fazia o WKWebView abrir já deslocado/zoomado para o
    // formulário, escondendo cabeçalho e contexto. O teclado passa a abrir
    // somente depois de um toque real do usuário.
    const autoFocused = document.querySelector('[autofocus]');
    removeAutofocus(root);
    if (autoFocused && document.activeElement === autoFocused) autoFocused.blur();
  }

  function resetInitialFocus() {
    const active = document.activeElement;
    if (active?.matches?.('#loginInput, #senhaInput')) active.blur();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  install();
  document.addEventListener('DOMContentLoaded', () => {
    install();
    resetInitialFocus();
    requestAnimationFrame(() => requestAnimationFrame(resetInitialFocus));
    setTimeout(resetInitialFocus, 120);
  }, { once: true });
  window.addEventListener('load', () => {
    autofocusObserver.disconnect();
    resetInitialFocus();
  }, { once: true });
  window.addEventListener('pageshow', install);

  for (const eventName of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(eventName, (event) => event.preventDefault(), {
      passive: false,
    });
  }
})();
