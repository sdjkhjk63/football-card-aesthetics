import type { Server } from "node:http";

export function resolveStaticFile(root: string, requestPath: string): string | null;

export function createStaticServer(root: string): Promise<{
  server: Server;
  origin: string;
  close: () => Promise<void>;
}>;
