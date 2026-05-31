import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const cmd = "mermaidgenieViewer.openPanel";

  const openPanel = () => {
    const settings = getSettings();

    let column: vscode.ViewColumn;
    switch (settings.viewColumn) {
      case 1:
        column = vscode.ViewColumn.One;
        break;
      case 2:
        column = vscode.ViewColumn.Two;
        break;
      case 3:
        column = vscode.ViewColumn.Three;
        break;
      default:
        column = vscode.ViewColumn.Active;
    }

    const panel = vscode.window.createWebviewPanel(
      "mermaidgenieViewer",
      settings.panelTitle,
      column,
      {
        enableScripts: settings.enableScripts,
        retainContextWhenHidden: settings.retainContext,
      },
    );

    panel.webview.html = getHtml(settings.iframeWidth, settings.iframeHeight);
  };

  const sidebar = new MermaidGenieSidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.commands.registerCommand(cmd, openPanel),
    vscode.window.registerWebviewViewProvider(
      MermaidGenieSidebarProvider.viewType,
      sidebar,
      { webviewOptions: { retainContextWhenHidden: true } },
    ),
  );

  if (
    vscode.workspace
      .getConfiguration("mermaidgenieViewer")
      .get<boolean>("openOnStartup", false)
  ) {
    openPanel();
  }
}

export function deactivate() {}

interface MermaidGenieSettings {
  panelTitle: string;
  viewColumn: number;
  retainContext: boolean;
  enableScripts: boolean;
  iframeWidth: string;
  iframeHeight: string;
}

// Sidebar rendered as a Webview view so it can be fully styled with the
// editor's theme tokens (real button, brand header, feature list) instead of
// the limited markdown the tree `viewsWelcome` API supports.
class MermaidGenieSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "mermaidgenieViewer.sidebar";

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(view: vscode.WebviewView): void {
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    view.webview.html = getSidebarHtml(view.webview);

    view.webview.onDidReceiveMessage((msg: { type?: string }) => {
      if (msg && msg.type === "open") {
        vscode.commands.executeCommand("mermaidgenieViewer.openPanel");
      }
    });
  }
}

function getSettings(): MermaidGenieSettings {
  const cfg = vscode.workspace.getConfiguration("mermaidgenieViewer");

  return {
    panelTitle: cfg.get<string>("panelTitle", "MermaidGenie"),
    viewColumn: cfg.get<number>("viewColumn", 1),
    retainContext: cfg.get<boolean>("retainContext", true),
    enableScripts: cfg.get<boolean>("enableScripts", true),
    iframeWidth: cfg.get<string>("iframeWidth", "100%"),
    iframeHeight: cfg.get<string>("iframeHeight", "100%"),
  };
}

function getNonce(): string {
  let text = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function getSidebarHtml(webview: vscode.Webview): string {
  const nonce = getNonce();
  const isMac = process.platform === "darwin";
  const shortcut = isMac ? "⌘ ⌥ M" : "Ctrl Alt M";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MermaidGenie</title>
  <style>
    :root {
      --mg-grad-a: #14b8a6;
      --mg-grad-b: #6366f1;
      --mg-radius: 10px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 14px 12px 18px;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size, 13px);
      color: var(--vscode-foreground);
      -webkit-font-smoothing: antialiased;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .logo {
      flex: 0 0 auto;
      width: 36px;
      height: 36px;
      border-radius: var(--mg-radius);
      display: grid;
      place-items: center;
      color: #fff;
      background: linear-gradient(135deg, var(--mg-grad-a), var(--mg-grad-b));
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.35);
    }
    .logo svg { width: 22px; height: 22px; display: block; }
    .brand-text { display: flex; flex-direction: column; line-height: 1.2; }
    .brand-title {
      font-size: 14px;
      font-weight: 650;
      letter-spacing: 0.2px;
    }
    .brand-sub {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
    }

    .lead {
      margin: 0 0 14px;
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--vscode-descriptionForeground);
    }
    .lead b { color: var(--vscode-foreground); font-weight: 600; }

    .btn {
      width: 100%;
      border: none;
      cursor: pointer;
      padding: 9px 12px;
      border-radius: var(--mg-radius);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      color: var(--vscode-button-foreground, #fff);
      background: linear-gradient(135deg, var(--mg-grad-a), var(--mg-grad-b));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.06s ease, filter 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.28);
    }
    .btn:hover { filter: brightness(1.07); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.42); }
    .btn:active { transform: translateY(1px); }
    .btn:focus-visible { outline: 2px solid var(--vscode-focusBorder); outline-offset: 2px; }
    .btn svg { width: 15px; height: 15px; }

    .features {
      list-style: none;
      margin: 16px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .features li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      line-height: 1.4;
      color: var(--vscode-foreground);
    }
    .features .dot {
      flex: 0 0 auto;
      margin-top: 5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--mg-grad-a), var(--mg-grad-b));
    }
    .features span.muted { color: var(--vscode-descriptionForeground); }

    .divider {
      height: 1px;
      margin: 16px 0 12px;
      background: var(--vscode-widget-border, rgba(128,128,128,0.18));
    }

    .hint {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 11.5px;
      color: var(--vscode-descriptionForeground);
    }
    .kbd {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 5px;
      color: var(--vscode-foreground);
      background: var(--vscode-keybindingLabel-background, rgba(128,128,128,0.17));
      border: 1px solid var(--vscode-keybindingLabel-border, rgba(128,128,128,0.22));
      border-bottom-width: 2px;
      white-space: nowrap;
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 12px;
      font-size: 12px;
      color: var(--vscode-textLink-foreground);
      text-decoration: none;
      cursor: pointer;
    }
    .link:hover { color: var(--vscode-textLink-activeForeground); text-decoration: underline; }
  </style>
</head>
<body>
  <div class="brand">
    <div class="logo">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 8.25V11.75M12 11.75L6 15.25M12 11.75L18 15.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="8" y="2.75" width="8" height="5.5" rx="1.75" stroke="currentColor" stroke-width="1.6"/>
        <rect x="2.5" y="15.25" width="7" height="6" rx="1.75" stroke="currentColor" stroke-width="1.6"/>
        <rect x="14.5" y="15.25" width="7" height="6" rx="1.75" stroke="currentColor" stroke-width="1.6"/>
      </svg>
    </div>
    <div class="brand-text">
      <div class="brand-title">MermaidGenie</div>
      <div class="brand-sub">AI diagram &amp; UML editor</div>
    </div>
  </div>

  <p class="lead">Design, edit, and live‑preview <b>Mermaid &amp; UML</b> diagrams with AI — without leaving your editor.</p>

  <button class="btn" id="open" type="button">
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 1.5c2.2 1 3.6 3.1 3.6 5.6 0 1-.3 2-.8 2.8H5.2c-.5-.8-.8-1.8-.8-2.8C4.4 4.6 5.8 2.5 8 1.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      <circle cx="8" cy="6.2" r="1.2" stroke="currentColor" stroke-width="1.3"/>
      <path d="M5.2 9.9 4 11.2l1.6.5M10.8 9.9 12 11.2l-1.6.5M6.6 12.4c.3 1 .7 1.6 1.4 2.1.7-.5 1.1-1.1 1.4-2.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Open Diagram Editor
  </button>

  <ul class="features">
    <li><span class="dot"></span><span>Generate diagrams from a <b>plain‑English prompt</b></span></li>
    <li><span class="dot"></span><span>Flowcharts, sequence, class, ER &amp; <span class="muted">more</span></span></li>
    <li><span class="dot"></span><span>Live preview, then <b>export</b> or share</span></li>
  </ul>

  <div class="divider"></div>

  <div class="hint">
    <span>Shortcut</span>
    <span class="kbd">${shortcut}</span>
  </div>

  <a class="link" id="browser">Open MermaidGenie in browser ↗</a>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.getElementById("open").addEventListener("click", () => {
      vscode.postMessage({ type: "open" });
    });
    document.getElementById("browser").addEventListener("click", () => {
      vscode.postMessage({ type: "open" });
    });
  </script>
</body>
</html>`;
}

function getHtml(width: string, height: string): string {
  const url = "https://mermaidgenie.vercel.app/charts";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; frame-src ${url}; style-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MermaidGenie</title>
  <style>
    html, body {
      margin: 0; padding: 0;
      width: 100%; height: 100%; overflow: hidden;
    }
    iframe {
      border: none;
      width: ${width};
      height: ${height};
    }
  </style>
</head>
<body>
  <iframe src="${url}"></iframe>
</body>
</html>`;
}
