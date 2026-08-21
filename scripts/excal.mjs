#!/usr/bin/env node
/**
 * excal — zero-dependency CLI for the Excalidraw+ MCP server.
 *
 * Speaks MCP (JSON-RPC over streamable HTTP) directly to
 * https://api.excalidraw.com/api/v1/mcp so any agent harness (Claude Code,
 * Codex, or a plain shell) can use the same tools without native MCP support.
 *
 * Auth (first match wins):
 *   1. EXCALIDRAW_API_KEY env var  — raw "sk-..." or full "Bearer sk-..."
 *   2. ~/.config/excalidraw/api_key file (chmod 600 recommended)
 *
 * Usage:
 *   excal.mjs tools                       list available tools (name + description)
 *   excal.mjs help <tool>                 print a tool's input schema
 *   excal.mjs call <tool> [--json '{}']   call a tool with JSON arguments
 *   excal.mjs call <tool> key=value ...   simple string args without JSON quoting
 *
 * Node >= 18 required (built-in fetch). No dependencies.
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ENDPOINT =
  process.env.EXCALIDRAW_MCP_URL || "https://api.excalidraw.com/api/v1/mcp";
const PROTOCOL_VERSION = "2025-06-18";

function apiKey() {
  let key = process.env.EXCALIDRAW_API_KEY;
  if (!key) {
    try {
      key = readFileSync(join(homedir(), ".config", "excalidraw", "api_key"), "utf8").trim();
    } catch {
      /* fall through */
    }
  }
  if (!key) {
    console.error(
      [
        "No Excalidraw API key found.",
        "",
        "Set one of:",
        "  export EXCALIDRAW_API_KEY=sk-...        (raw key or 'Bearer sk-...')",
        "  ~/.config/excalidraw/api_key            (file containing the key)",
        "",
        "Create a key in Excalidraw+ at app.excalidraw.com — Settings → API keys.",
      ].join("\n"),
    );
    process.exit(2);
  }
  return key.startsWith("Bearer ") ? key : `Bearer ${key}`;
}

let sessionId = null;
let nextId = 1;

async function rpc(method, params, { notification = false } = {}) {
  const body = { jsonrpc: "2.0", method };
  if (params !== undefined) body.params = params;
  if (!notification) body.id = nextId++;

  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    authorization: apiKey(),
    "mcp-protocol-version": PROTOCOL_VERSION,
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;

  if (notification) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} from ${ENDPOINT}\n${text.slice(0, 500)}`);
  }

  const contentType = res.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("text/event-stream")) {
    // Parse SSE: the JSON-RPC response arrives as one or more `data:` lines.
    const raw = await res.text();
    for (const line of raw.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data) continue;
      const msg = JSON.parse(data);
      if (msg.id !== undefined) payload = msg;
    }
    if (!payload) throw new Error(`No JSON-RPC response in SSE stream:\n${raw.slice(0, 500)}`);
  } else {
    payload = await res.json();
  }

  if (payload.error) {
    throw new Error(`RPC error ${payload.error.code}: ${payload.error.message}`);
  }
  return payload.result;
}

async function connect() {
  await rpc("initialize", {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: { name: "excal-cli", version: "1.0.0" },
  });
  await rpc("notifications/initialized", undefined, { notification: true });
}

async function listTools() {
  const tools = [];
  let cursor;
  do {
    const result = await rpc("tools/list", cursor ? { cursor } : {});
    tools.push(...(result.tools || []));
    cursor = result.nextCursor;
  } while (cursor);
  return tools;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--json") {
      Object.assign(args, JSON.parse(argv[++i]));
    } else {
      const eq = argv[i].indexOf("=");
      if (eq === -1) {
        console.error(`Unrecognized argument: ${argv[i]} (use key=value or --json '{...}')`);
        process.exit(2);
      }
      const key = argv[i].slice(0, eq);
      const value = argv[i].slice(eq + 1);
      // Best-effort typing: numbers, booleans, and JSON literals pass through.
      try {
        args[key] = JSON.parse(value);
      } catch {
        args[key] = value;
      }
    }
  }
  return args;
}

function printContent(result) {
  const items = result.content || [];
  if (items.length) {
    for (const item of items) {
      if (item.type === "text") console.log(item.text);
      else console.log(JSON.stringify(item, null, 2));
    }
  } else if (result.structuredContent) {
    console.log(JSON.stringify(result.structuredContent, null, 2));
  }
  if (result.isError) process.exit(1);
}

const [, , command, ...rest] = process.argv;

try {
  switch (command) {
    case "tools": {
      await connect();
      for (const t of await listTools()) {
        const desc = (t.description || "").split("\n")[0].slice(0, 100);
        console.log(`${t.name}\t${desc}`);
      }
      break;
    }
    case "help": {
      if (!rest[0]) {
        console.error("Usage: excal.mjs help <tool>");
        process.exit(2);
      }
      await connect();
      const tool = (await listTools()).find((t) => t.name === rest[0]);
      if (!tool) {
        console.error(`Unknown tool: ${rest[0]} (run 'excal.mjs tools' for the list)`);
        process.exit(2);
      }
      console.log(JSON.stringify(tool, null, 2));
      break;
    }
    case "call": {
      if (!rest[0]) {
        console.error("Usage: excal.mjs call <tool> [--json '{...}' | key=value ...]");
        process.exit(2);
      }
      await connect();
      const result = await rpc("tools/call", {
        name: rest[0],
        arguments: parseArgs(rest.slice(1)),
      });
      printContent(result);
      break;
    }
    default:
      console.error(
        "Usage: excal.mjs <tools | help <tool> | call <tool> [--json '{...}' | key=value ...]>",
      );
      process.exit(2);
  }
} catch (err) {
  console.error(String(err.message || err));
  process.exit(1);
}
