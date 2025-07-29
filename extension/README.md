# MermaidGenie Viewer – VS Code Extension

Embed **MermaidGenie** - the AI‑powered Mermaid diagram editor - directly into VS Code. Upload prompts, generate diagrams, edit, version and share - all from your editor.

---

## 🚀 Features

- **Instant Diagram Editor**  
  Open MermaidGenie in a side panel via Command Palette (`MermaidGenie: Open Diagram Editor`).

- **Secure, Sandboxed iframe**  
  Loads `https://mermaidgenie.vercel.app` under a strict Content‑Security‑Policy. No local backend required.

- **Persistent Sessions**  
  Your work (AI‑generated diagrams, edits, history) stays alive when you switch files or hide the panel.

- **Configurable Panel**  
  Customize via Settings:
  - **Title** of the Webview panel
  - **Editor column** to open in (active, 1–3)
  - **iframe width & height** (CSS values)
  - **Script permissions**
  - **Auto‑open on startup**

- **Zero Setup**  
  Simply install - MermaidGenie’s own infrastructure handles the AI, storage, and collaboration.

---

## 📖 Live VS Code Extension

To easily try it out, install the extension directly from the VS Code Marketplace: [https://marketplace.visualstudio.com/items?itemName=hoangsonw.mermaidgenie-viewer](https://marketplace.visualstudio.com/items?itemName=hoangsonw.mermaidgenie-viewer). Simply click **Install** and it will be ready to use in your VS Code!

Please give it a try and share your feedback!

---

## 🛠️ Launch with VS Code

We also provide a `launch.json` file to quickly start the extension in a development environment. This allows you to test changes live:

1. Open this folder in VS Code.
2. Press `F5` to launch the Extension Development Host. Alternatively, go to the **Run and Debug** view and select **Run Extension**.
3. The MermaidGenie Viewer panel will open automatically.
4. You can now test the extension, make changes, and see them live in the side panel.
5. To stop debugging, close the Extension Development Host window or press `Shift+F5`.

To customize the launch configuration, edit the `launch.json` file in the `.vscode` folder. You can change settings like the panel title, view column, and whether to retain context when switching files.

---

## 📦 VSIX Installation

1. **Clone & navigate** into the extension folder:

   ```bash
   git clone https://github.com/hoangsonww/MermaidGenie-UML-Diagram-App.git
   cd MermaidGenie-UML-Diagram-App/extension
   ```

2. **Install dependencies & compile**:

   ```bash
   npm install
   npm run compile
   ```

3. **Package as a VSIX**:

   ```bash
   vsce package
   ```

   This creates `mermaidgenie-viewer-0.0.1.vsix`.

4. **Install the VSIX**:
   - **CLI**:

     ```bash
     code --install-extension mermaidgenie-viewer-0.0.1.vsix
     ```

   - **VS Code UI**:
     Open Extensions view → “...” → **Install from VSIX...** → select the file.

---

## 🎯 Usage

1. Open the **Command Palette** (`Ctrl+Shift+P` / `⌘+Shift+P`).
2. Run **MermaidGenie Viewer: Open Diagram Editor**.
3. The MermaidGenie app loads in a side panel - enter prompts, generate or edit diagrams, and share as usual.

---

## ⚙️ Configuration

Open **Settings** → **Extensions** → **MermaidGenie Viewer** (or search `@ext:hoangsonw.mermaidgenie-viewer`):

| Setting                            | Default          | Description                                            |
| ---------------------------------- | ---------------- | ------------------------------------------------------ |
| `mermaidgenieViewer.panelTitle`    | `"MermaidGenie"` | Title of the Webview panel.                            |
| `mermaidgenieViewer.viewColumn`    | `1`              | Editor column to open in (0=active, 1–3).              |
| `mermaidgenieViewer.retainContext` | `true`           | Preserve panel state when hidden or switching files.   |
| `mermaidgenieViewer.enableScripts` | `true`           | Allow scripts to run inside the iframe.                |
| `mermaidgenieViewer.iframeWidth`   | `"100%"`         | CSS width for the iframe (e.g. `"80%"` or `"600px"`).  |
| `mermaidgenieViewer.iframeHeight`  | `"100%"`         | CSS height for the iframe (e.g. `"80%"` or `"500px"`). |
| `mermaidgenieViewer.openOnStartup` | `false`          | Automatically open the panel when VS Code starts.      |

---

## 🛠 Development

- **Watch & rebuild**

  ```bash
  npm run watch
  ```

- **Debug**
  Press F5 in this folder to launch an Extension Development Host.
- **Re‑package**

  ```bash
  npm run package
  ```

---

## 🐞 Troubleshooting

- **Blank panel**
  Ensure `https://mermaidgenie.vercel.app` is reachable from your network.

- **CSP or load errors**
  Confirm the iframe `src` URL exactly matches the `frame-src` directive in `getHtml()`.

- **Settings not visible**
  Reload window (Cmd+Shift+P → **Developer: Reload Window**) after installing/updating the VSIX.

---

## 📄 License

MIT © 2025 Son Nguyen
See [LICENSE](LICENSE.md) for details.

---

## ℹ️ About MermaidGenie

MermaidGenie transforms text prompts into editable Mermaid diagrams powered by AI. Sketch flowcharts, UML, ERDs, mind‑maps and share with your team in a PWA‑ready workspace.

Live app & source code:
👉 [mermaidgenie.vercel.app](https://mermaidgenie.vercel.app)
👉 [hoangsonww/mermaidgenie](https://github.com/hoangsonww/mermaidgenie)

---
