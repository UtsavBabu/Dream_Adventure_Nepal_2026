import "./lib/error-capture";

// Node < 22 has no global WebSocket, which makes @supabase/realtime-js throw when
// the Supabase client is constructed during SSR (e.g. routes whose loader awaits a
// query) — returning a 500. Polyfill from undici (present at runtime via fetch) so
// detail pages render on any Node version. No-op on Node 22+ where WebSocket exists.
if (typeof (globalThis as { WebSocket?: unknown }).WebSocket === "undefined") {
  try {
    const { createRequire } = await import("node:module");
    const nodeRequire = createRequire(import.meta.url);
    const undiciName = "undici"; // variable defeats bundler static resolution
    const { WebSocket } = nodeRequire(undiciName);
    if (WebSocket) (globalThis as { WebSocket?: unknown }).WebSocket = WebSocket;
  } catch {
    // undici unavailable — leave as-is; realtime is unused on public pages anyway.
  }
}

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
