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
      --vl-ios-safe-top: env(safe-area-inset-top, 0px);
      --vl-ios-safe-right: env(safe-area-inset-right, 0px);
      --vl-ios-safe-bottom: env(safe-area-inset-bottom, 0px);
      --vl-ios-safe-left: env(safe-area-inset-left, 0px);
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

  function install() {
    const root = document.documentElement;
    if (!root) return;

    root.classList.add('vl-ios-app');

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
      style.textContent = styles;
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
