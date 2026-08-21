# Use-case playbook

Maps every use case Excalidraw promotes (plus.excalidraw.com/use-cases) to
the right authoring tool and layout conventions. Always read the named format
guide before writing content.

Legend — **Tool**: primary authoring tool · **Guide**: required format guide.

## Node/edge diagrams (`create_diagram` · `read_diagram_format`)

### Flowchart
- **Tool:** `create_diagram` with `direction: "down"` (or "right" for wide
  processes).
- Conventions: rectangles for steps, diamonds for decisions (label the yes/no
  edges), rounded start/end nodes. One decision per diamond. Keep it under
  ~15 nodes per diagram; split larger processes into linked scenes.

### Software architecture diagram
- **Tool:** `create_diagram`; use `groups` for system boundaries (services,
  VPCs, tiers).
- Conventions: components as rectangles, datastores as cylinders (if the
  format guide provides them) or labeled rectangles, arrows labeled with the
  protocol/payload ("HTTPS", "events", "SQL"). Group by deployment boundary,
  flow left→right from client to data.

### Sequence diagram
- **Tool:** `edit_scene_content` (lifelines are a custom composition) after
  `read_diagram_format`.
- Conventions: actors/participants across the top, vertical dashed lifelines,
  horizontal solid arrows for calls (label with the message), dashed arrows
  for returns, time flows downward. Keep equal horizontal spacing between
  lifelines.

### Data-flow diagram
- **Tool:** `create_diagram`.
- Conventions: processes as rounded rectangles, external entities as sharp
  rectangles, datastores as open-ended rectangles, labeled arrows for every
  flow. Number processes (1.0, 2.0) when depicting a leveled DFD.

### UML diagram (class)
- **Tool:** `edit_scene_content` (three-compartment class boxes are custom).
- Conventions: class boxes with name / attributes / methods compartments,
  hollow-triangle arrows for inheritance, diamonds for composition. Prefer
  fewer classes with clear relationships over exhaustive models.

### Mind map
- **Tool:** `create_diagram` with a radial feel: central topic node, one hue
  per major branch.
- Conventions: single-word or short-phrase nodes, 3–7 main branches, curved
  or elbow edges, no arrowheads (mind maps are non-directional).

### Roadmap
- **Tool:** `edit_scene_content` (timeline composition).
- Conventions: horizontal time axis (quarters/months), swimlanes per team or
  theme, rounded rectangles for initiatives sized roughly to duration,
  "now" marker line. Color by status (planned/in-progress/done).

### Gantt chart
- **Tool:** `edit_scene_content`.
- Conventions: task list down the left, time axis across the top, horizontal
  bars aligned to the grid, milestone diamonds, today-line. Keep row height
  and bar heights uniform; use one accent color for the critical path.

## Presentations (`create_slide` · `read_presentation_format`)

### Presentations / slide decks
- **Tool:** `create_slide` for every new slide (one frame = one slide), fill
  via `edit_scene_content` inside the returned safe area, `add_image` for
  images, `list_slides` to review order, `update_slide` for renames/reorders.
- Conventions: title slide → agenda → one idea per slide → closing CTA.
  Large text (slides are read from a distance), max ~5 bullets, consistent
  title position across slides. Screenshot each frame to verify nothing
  overflows the safe area.

## Freeform (`edit_scene_content` · `read_freeform_format`)

### Wireframes & mockups
- Conventions: grayscale boxes only (no visual design), real label text
  ("Sign up", not lorem), squiggle lines for body copy, annotation callouts
  in a single accent color outside the frame. One screen per frame; name
  frames after the screen ("Onboarding — step 2").

### User personas
- Conventions: card layout per persona — photo placeholder circle, name +
  role header, then labeled sections (Goals, Pains, Behaviors, Quote).
  Two-column grid inside the card; one card per persona, side by side for
  comparison.

### Visual brainstorming
- Conventions: sticky-note rectangles in 3–4 colors (one color = one theme
  or voter), clustered spatially with a labeled region per cluster; dot-vote
  circles if asked. Don't over-arrange — brainstorms should look organic.

### Lean Canvas
- Conventions: the standard 9-box grid — Problem, Solution, Key Metrics,
  Unique Value Proposition (center, visually dominant), Unfair Advantage,
  Channels, Customer Segments across the top two rows; Cost Structure and
  Revenue Streams as two wide boxes along the bottom. Uniform box borders,
  section titles as small uppercase labels, content as short sticky-note
  phrases (not sentences). Leave room in every box — the canvas is meant to
  be iterated.

### SWOT analysis
- Conventions: 2×2 quadrant grid with a bold cross divider — Strengths
  (top-left), Weaknesses (top-right), Opportunities (bottom-left), Threats
  (bottom-right). One color per quadrant (e.g. green/red/blue/orange, muted),
  3–6 sticky notes per quadrant, axis labels "Helpful/Harmful" (columns) and
  "Internal/External" (rows) if the user wants the classic framing.

### Competitor analysis
- Conventions: pick per request — (a) 2×2 positioning matrix: labeled X/Y
  axes (e.g. price vs. quality), competitor names as dots or small logo
  boxes, your own position highlighted in the accent color; or (b) comparison
  grid: competitors as columns, criteria as rows, ✓/✗/notes in cells. Add a
  short takeaway box ("where we win") — the analysis should end in a claim,
  not just a map.

### Game design
- Conventions: mixed-mode board by request — mechanics as a flowchart
  (states/actions/outcomes via `create_diagram`), level maps as freeform
  spatial sketches, idea collection as sticky-note clusters, screen/UI
  prototypes using the wireframe conventions above. Organize regions with
  labeled frames (Ideas · Mechanics · Levels · UI) so one scene can hold the
  whole design conversation.

### Whiteboarding / system-design interviews
- Conventions: leave generous empty space (the canvas is for the candidate),
  seed only the prompt box (requirements list, top-left) and a legend.
  For practice canvases: requirements → API sketch → high-level boxes →
  scale notes, arranged left to right.

### Education / teaching canvases
- Conventions: large title, numbered step-by-step visual sequence, one
  concept per region, arrows guiding reading order, and a "try it" area with
  a prompt. Favor bigger text and fewer elements than a normal diagram.

## Shared style rules (all use cases)

- Keep Excalidraw's hand-drawn character: default roughness/fonts; don't
  fight the aesthetic with pixel-perfect alignment obsessions.
- Restrained palette: ink + 2–3 hues max, consistent meaning per color.
- Whitespace is structure: pack nothing; related items closer, unrelated
  farther.
- Label every arrow whose meaning isn't obvious.
- Always `take_screenshot` and look before declaring the scene done.
