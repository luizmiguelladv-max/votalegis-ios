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

  function install() {
    const root = document.documentElement;
    if (!root) return;

    root.classList.add('vl-ios-app');
    root.dataset.vlIosUi = '2';

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
      style.textContent = `${styles}\n${experienceStyles}`;
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
