# API notes (Excalidraw+ MCP server)

Run `node scripts/excal.mjs tools` for the live catalog — it is authoritative
and may have grown since this file was written. `node scripts/excal.mjs help
<tool>` prints any tool's exact input schema. Notes below cover the core
authoring surface and its sharp edges.

## Scenes

| Tool | Notes |
|---|---|
| `list_scenes` | Paginated (`limit`, `offset`, `hasNextPage`). Scene id is at `data[i].metadata.id`, name at `data[i].metadata.name`. |
| `create_scene` | Requires `name`, `pinned` (boolean), and `collectionId`. Get a collection id from `list_collections` (`isDefault: true` is the default collection). |
| `get_scene` / `get_scene_content` | Metadata vs full element content. Prefer `search_scene_content` over full content loads for large scenes. |
| `edit_scene_content` | Add/update/delete elements. **Call the matching `read_*_format` guide first** — elements must be valid Excalidraw format. |
| `delete_scene` | Permanent — only when explicitly asked. |

## Authoring

| Tool | Notes |
|---|---|
| `read_diagram_format` / `read_presentation_format` / `read_freeform_format` | Required reading before the first content write of each kind, once per session. |
| `create_diagram` | Requires `sceneId`, `nodes`, `edges`. Optional: `title`, `direction`, `groups` (containers/boundaries), spacing controls, `clearExisting`. Handles layout + elbow arrows + edge labels automatically. |
| `create_slide` / `update_slide` / `list_slides` | One frame = one slide. Fill frames via `edit_scene_content` using the returned frameId + safe content area. |
| `add_image` | Public URL or base64 data URL. |
| `take_screenshot` | PNG of a scene or a single frame — use to verify every deliverable. |

## Workspace (use sparingly; not the skill's focus)

`list_collections`, `create_collection`, `list_collection_scenes`,
`get_workspace`, plus user/invite/log admin tools. Don't touch admin tools
(invites, member removal, workspace settings) unless the user explicitly
asks.

## Scene URLs

`https://app.excalidraw.com/s/<workspace>/<sceneId>` — both ids appear in
scene metadata (`workspace`, `id`).

## Pagination & output

- List endpoints default to small pages (often 5). Pass `limit`/`offset` and
  check `hasNextPage`.
- CLI output is the tool's text content (usually JSON) — pipe to `python3`
  or `jq` for extraction.
