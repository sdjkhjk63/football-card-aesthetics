import { spawn } from "node:child_process";

const pnpmScript = process.env.npm_execpath;
const command = pnpmScript ? process.execPath : process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const args = pnpmScript
  ? [pnpmScript, "exec", "next", "build"]
  : ["exec", "next", "build"];

const child = spawn(command, args, {
  env: { ...process.env, DESKTOP_BUILD: "1", NEXT_PUBLIC_AUTHOR_MODE: "1" },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(`Desktop build failed to start: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Desktop build stopped by ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
