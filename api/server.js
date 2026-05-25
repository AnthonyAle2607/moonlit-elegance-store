import { toNodeHandler } from "srvx/adapters/node";
import handler from "../dist/server/server.js";

export default toNodeHandler(handler.fetch.bind(handler));
