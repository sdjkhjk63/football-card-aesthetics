import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

export function resolveStaticFile(root, requestPath) {
  const rootPath = path.resolve(root);
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath.split("?", 1)[0]);
  } catch {
    return null;
  }
  if (decoded.includes("\0") || decoded.includes("\\")) return null;

  const relative = decoded.replace(/^\/+/, "").split("/").join(path.sep);
  let candidate = path.resolve(rootPath, relative);
  if (candidate !== rootPath && !candidate.startsWith(`${rootPath}${path.sep}`)) {
    return null;
  }
  if (decoded.endsWith("/") || path.extname(decoded) === "") {
    candidate = path.join(candidate, "index.html");
  }
  return candidate;
}

async function sendFile(filePath, response, method) {
  const metadata = await stat(filePath);
  response.writeHead(200, {
    "Cache-Control": filePath.endsWith(".html") ? "no-cache" : "public, max-age=31536000, immutable",
    "Content-Length": metadata.size,
    "Content-Type": MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  if (method === "HEAD") response.end();
  else createReadStream(filePath).pipe(response);
}

export function createStaticServer(root) {
  const exportRoot = path.resolve(root);
  const notFound = path.join(exportRoot, "404.html");
  const server = createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
      }
      const filePath = resolveStaticFile(exportRoot, request.url ?? "/");
      if (!filePath || !existsSync(filePath)) {
        if (existsSync(notFound)) {
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          createReadStream(notFound).pipe(response);
        } else {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Not found");
        }
        return;
      }
      await sendFile(filePath, response, request.method);
    } catch (error) {
      console.error("Desktop static server error:", error);
      if (!response.headersSent) response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Local application error");
    }
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not determine the desktop server port."));
        return;
      }
      resolve({
        server,
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done, fail) => server.close((error) => error ? fail(error) : done())),
      });
    });
  });
}
