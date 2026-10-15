import { createRequestHandler } from "react-router";
import { handleAuth } from "./auth";
import { handleBilling, handleStripeWebhook } from "./billing";
import { handleRooms } from "./rooms";
import { scheduledChecks } from "./schedule";
import type { AppEnv } from "./types";
import { error, sameOrigin } from "./types";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

function failureCode(cause: unknown): string {
  if (cause && typeof cause === "object" && "code" in cause) {
    const code = (cause as { code?: unknown }).code;
    if (typeof code === "string" && /^[A-Z0-9_-]{1,40}$/.test(code)) return code;
  }
  return cause instanceof Error ? cause.name.slice(0, 40) : "unknown";
}

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (path === "/api/stripe/webhook" && request.method === "POST") return handleStripeWebhook(request, env);
    if (path.startsWith("/assets/")) {
      const name = path.slice("/assets/".length);
      if (request.method !== "GET" || !/^[a-z0-9_-]+\.(glb|png)$/.test(name)) return error("Asset not found.", 404);
      const object = await env.ASSETS.get(name);
      if (!object) return error("Asset not found.", 404);
      return new Response(object.body, { headers: { "content-type": name.endsWith(".glb") ? "model/gltf-binary" : "image/png", "cache-control": "public, max-age=86400", "x-content-type-options": "nosniff" } });
    }
    if (path.startsWith("/api/")) {
      if (request.method !== "GET" && !sameOrigin(request)) return error("Request origin is not allowed.", 403);
      try {
        if (path.startsWith("/api/auth/")) return await handleAuth(request, path, env);
        if (path.startsWith("/api/billing/")) return await handleBilling(request, path, env);
        if (path.startsWith("/api/rooms") || path.startsWith("/api/share")) return await handleRooms(request, path, env);
      } catch (cause) {
        if (path === "/api/auth/signup" && request.method === "POST") {
          console.error("meida_signup_unhandled", { stage: "request_dispatch", code: failureCode(cause) });
        }
        return error("Service temporarily unavailable.", 503);
      }
      return error("Not found.", 404);
    }
    return requestHandler(request);
  },
  async scheduled(event, env) {
    await scheduledChecks(env, event.scheduledTime);
  },
} satisfies ExportedHandler<AppEnv>;
