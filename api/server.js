// api/server.js - Vercel serverless function for TanStack Start SSR

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

let _nodeHandler;
let _initError;

async function getNodeHandler() {
    if (_nodeHandler) return _nodeHandler;
    if (_initError) throw _initError;

    try {
        console.log("[TSS] projectRoot:", projectRoot);
        console.log("[TSS] loading srvx/node...");
        const { toNodeHandler } = await import("srvx/node");

        console.log("[TSS] loading dist/server/server.js...");
        const serverPath = path.join(projectRoot, "dist/server/server.js");
        console.log("[TSS] serverPath:", serverPath);
        const { default: serverModule } = await import(serverPath);

        console.log("[TSS] serverModule keys:", Object.keys(serverModule ?? {}));
        console.log("[TSS] typeof serverModule.fetch:", typeof serverModule?.fetch);

        _nodeHandler = toNodeHandler(serverModule.fetch.bind(serverModule));
        console.log("[TSS] handler ready");
        return _nodeHandler;
    } catch (err) {
        _initError = err;
        throw err;
    }
}

export default async function handler(req, res) {
    try {
        const h = await getNodeHandler();
        return h(req, res);
    } catch (err) {
        console.error("[TSS] FATAL:", err?.message);
        console.error("[TSS] STACK:", err?.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error\n\n" + (err?.message ?? String(err)));
    }
}
