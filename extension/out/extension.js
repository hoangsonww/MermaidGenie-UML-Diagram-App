"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const cmd = "mermaidgenieViewer.openPanel";
    const openPanel = () => {
        const cfg = vscode.workspace.getConfiguration("mermaidgenieViewer");
        const title = cfg.get("panelTitle", "MermaidGenie");
        const colNum = cfg.get("viewColumn", 1);
        const keep = cfg.get("retainContext", true);
        const script = cfg.get("enableScripts", true);
        const w = cfg.get("iframeWidth", "100%");
        const h = cfg.get("iframeHeight", "100%");
        let column;
        switch (colNum) {
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
        const panel = vscode.window.createWebviewPanel("mermaidgenieViewer", title, column, { enableScripts: script, retainContextWhenHidden: keep });
        panel.webview.html = getHtml(w, h);
    };
    context.subscriptions.push(vscode.commands.registerCommand(cmd, openPanel));
    if (vscode.workspace
        .getConfiguration("mermaidgenieViewer")
        .get("openOnStartup", false)) {
        openPanel();
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getHtml(width, height) {
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
//# sourceMappingURL=extension.js.map