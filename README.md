# excalidraw — agent skill

Create and edit Excalidraw diagrams from Claude Code, Codex, or any agent
harness — flowcharts, architecture diagrams, sequence diagrams, UML, Gantt
charts, mind maps, wireframes, slide decks, roadmaps, personas,
brainstorming boards, Lean Canvas, SWOT and competitor analyses, and
game-design boards, aligned with the official
[Excalidraw use cases](https://plus.excalidraw.com/use-cases).

Backed by the official Excalidraw+ MCP server
(`https://api.excalidraw.com/api/v1/mcp`) — scenes are created in your
Excalidraw+ workspace, verified by screenshot, and returned as links.

## Install

```bash
npx skills add NicholasSpisak/excalidraw
```

Works with the [Vercel skills framework](https://github.com/vercel-labs/skills);
installs for Claude Code, Codex, and other supported agents.

## Credentials

You need an Excalidraw+ API key (Excalidraw+ → Settings → API keys).
**Never commit it.** Provide it one of two ways:

```bash
# environment variable (works for the bundled CLI and Codex MCP config)
export EXCALIDRAW_API_KEY=sk-...

# or a key file the bundled CLI falls back to
mkdir -p ~/.config/excalidraw
printf '%s\n' 'sk-...' > ~/.config/excalidraw/api_key
chmod 600 ~/.config/excalidraw/api_key
```

## Native MCP setup (optional, recommended)

The skill works out of the box through its bundled CLI. For native MCP tool
calling, add the official server config:

**Claude Code** (`~/.claude.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "excalidraw": {
      "type": "http",
      "url": "https://api.excalidraw.com/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer <API_KEY>"
      }
    }
  }
}
```

**Codex** (`~/.codex/config.toml`):

```toml
[mcp_servers.excalidraw]
url = "https://api.excalidraw.com/api/v1/mcp"
env_http_headers = { Authorization = "EXCALIDRAW_API_KEY" }
```

With `env_http_headers`, the env var's value is injected verbatim as the
header — set `EXCALIDRAW_API_KEY="Bearer sk-..."`. (Codex's
`bearer_token_env_var` alternative takes the raw key and adds `Bearer`
itself. The bundled CLI accepts either form.)

## Bundled CLI

```bash
node scripts/excal.mjs tools                    # list available tools
node scripts/excal.mjs help create_diagram      # print a tool's input schema
node scripts/excal.mjs call create_diagram --json '{"sceneId":"...","nodes":[...],"edges":[...]}'
```

Zero dependencies; Node ≥ 18.

## What's inside

```
SKILL.md                 the skill: transport choice, workflow, rules
scripts/excal.mjs        MCP-over-HTTP CLI (auth via env var or key file)
references/use-cases.md  layout playbook per Excalidraw use case
references/api.md        tool catalog notes and sharp edges
```

## License

MIT

---

*Enjoy putting AI to work like this? It's what we teach business owners every
day inside [AI Operator Academy](https://www.skool.com/aioperatoracademy/about)
— practical AI systems, no engineering degree required.*
