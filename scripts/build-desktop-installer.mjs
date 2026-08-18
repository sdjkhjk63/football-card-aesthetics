import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const temporaryRoot = path.join(
  process.env.LOCALAPPDATA ?? os.tmpdir(),
  "CardAestheticsBuild",
);
mkdirSync(temporaryRoot, { recursive: true });

const pnpmScript = process.env.npm_execpath;
const command = pnpmScript
  ? process.execPath
  : process.platform === "win32"
    ? "pnpm.cmd"
    : "pnpm";
const args = pnpmScript
  ? [pnpmScript, "exec", "electron-builder", "--win", "nsis"]
  : ["exec", "electron-builder", "--win", "nsis"];

const child = spawn(command, args, {
  env: { ...process.env, TEMP: temporaryRoot, TMP: temporaryRoot },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(`Desktop installer build failed to start: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Desktop installer build stopped by ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
