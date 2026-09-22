import { createRequestHandler } from "react-router";
import api, { RunCoordinator, runScheduledOfficeChecks } from "./api";

export { RunCoordinator };

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname.startsWith("/api/")) {
      return api.fetch(request, env as any);
    }
    return requestHandler(request);
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runScheduledOfficeChecks(env));
  },
} satisfies ExportedHandler<Env>;
