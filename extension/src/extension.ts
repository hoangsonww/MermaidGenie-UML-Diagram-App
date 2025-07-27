import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const cmd = "mermaidgenieViewer.openPanel";

  const openPanel = () => {
    const cfg = vscode.workspace.getConfiguration("mermaidgenieViewer");
    const title = cfg.get<string>("panelTitle", "MermaidGenie");
    const colNum = cfg.get<number>("viewColumn", 1);
    const keep = cfg.get<boolean>("retainContext", true);
    const script = cfg.get<boolean>("enableScripts", true);
    const w = cfg.get<string>("iframeWidth", "100%");
    const h = cfg.get<string>("iframeHeight", "100%");

    let column: vscode.ViewColumn;
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

    const panel = vscode.window.createWebviewPanel(
      "mermaidgenieViewer",
      title,
      column,
      { enableScripts: script, retainContextWhenHidden: keep },
    );

    panel.webview.html = getHtml(w, h);
  };

  context.subscriptions.push(vscode.commands.registerCommand(cmd, openPanel));

  if (
    vscode.workspace
      .getConfiguration("mermaidgenieViewer")
      .get<boolean>("openOnStartup", false)
  ) {
    openPanel();
  }
}

export function deactivate() {}

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
