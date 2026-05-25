// api/server.js - Vercel serverless function for TanStack Start SSR

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve to project root (api/ is one level below root)
const projectRoot = path.resolve(__dirname, "..");

let _nodeHandler;

async function getNodeHandler() {
    if (_nodeHandler) return _nodeHandler;

    const [{ toNodeHandler }, { default: serverModule }] = await Promise.all([
        import("srvx/node"),
        import(path.join(projectRoot, "dist/server/server.js")),
    ]);

    _nodeHandler = toNodeHandler(serverModule.fetch.bind(serverModule));
    return _nodeHandler;
}

export default async function handler(req, res) {
    try {
        const h = await getNodeHandler();
        return h(req, res);
    } catch (err) {
        console.error("[TanStack Start] Handler init failed:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
}
