import { existsSync } from "node:fs";
import path from "node:path";
import { app, BrowserWindow, dialog, shell } from "electron";
import { createStaticServer } from "./staticServer.mjs";

const hasLock = app.requestSingleInstanceLock();
let mainWindow;
let splashWindow;
let localServer;
let splashOpenedAt = 0;
const MINIMUM_SPLASH_TIME = 1_300;

if (!hasLock) app.quit();

function createSplash() {
  const splashPath = path.join(app.getAppPath(), "desktop", "splash.html");
  if (!existsSync(splashPath)) return;
  splashWindow = new BrowserWindow({
    width: 760,
    height: 475,
    frame: false,
    resizable: false,
    show: false,
    backgroundColor: "#07070a",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  splashOpenedAt = Date.now();
  splashWindow.loadFile(splashPath);
  splashWindow.once("ready-to-show", () => splashWindow?.show());
}

async function createMainWindow() {
  const exportRoot = path.join(app.getAppPath(), "out");
  if (!existsSync(path.join(exportRoot, "index.html"))) {
    throw new Error("The offline application payload is missing. Run pnpm desktop:build first.");
  }

  localServer = await createStaticServer(exportRoot);
  const iconPath = path.join(app.getAppPath(), "desktop", "assets", "icon-512.png");
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    show: false,
    backgroundColor: "#07070a",
    autoHideMenuBar: true,
    ...(existsSync(iconPath) ? { icon: iconPath } : {}),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url).catch(() => undefined);
    return { action: "deny" };
  });
  mainWindow.webContents.on("page-title-updated", (event) => {
    event.preventDefault();
    mainWindow?.setTitle("Card Aesthetics");
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(localServer.origin)) {
      event.preventDefault();
      if (url.startsWith("https://")) shell.openExternal(url).catch(() => undefined);
    }
  });
  mainWindow.once("ready-to-show", () => {
    const remaining = splashWindow
      ? Math.max(0, MINIMUM_SPLASH_TIME - (Date.now() - splashOpenedAt))
      : 0;
    setTimeout(() => {
      splashWindow?.close();
      splashWindow = undefined;
      mainWindow?.show();
    }, remaining);
  });
  await mainWindow.webContents.session.clearCache();
  await mainWindow.loadURL(localServer.origin);
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  try {
    createSplash();
    await createMainWindow();
  } catch (error) {
    splashWindow?.close();
    dialog.showErrorBox("Card Aesthetics", error instanceof Error ? error.message : String(error));
    app.quit();
  }
});

app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => {
  if (localServer?.server?.listening) localServer.server.close();
});
