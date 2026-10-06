# Slide standard

The default look for presentations built with this skill: flat 1600x900
cards, a black number badge and all-caps title, one orange focal accent, and
a black takeaway bar. Use it for every slide deck unless the user asks for a
different style. It applies with `read_presentation_format`; where they differ
(font family, roughness), this standard wins for decks.

## Canvas

- One slide = one frame from `create_slide`, 1600x900.
- Background card: white, `#d0d0d0` stroke, rounded, same bounds as the frame.
- All elements `roughness: 0`, `fontFamily: 2` (Helvetica). No hand-drawn
  font, no emoji.

## Header (same position on every slide)

- Black badge 110x64 with the white slide number (`01`, `02`, ...), 36px.
- Title in ALL CAPS, 56px, `#1e1e1e`, to the right of the badge.
- Subtitle, one sentence, 32px, `#6b6b6b`, under the title.
- Progress dots at the top right: slide N shows N orange dots (22px,
  `#F06000`, 32px apart). The rightmost dot stays fixed and new dots extend
  left, so viewers can see how far into the deck they are. A header logo sits
  24px left of the leftmost dot.

## Body: one visual per slide

- Palette: black `#1e1e1e`, white, grays (`#6b6b6b`, `#adb5bd`, `#f1f3f5`),
  and orange `#F06000` for the single thing the slide is about.
- Flow row: equal white boxes with black strokes, joined by short black arrows;
  the focal step is filled orange with white text. Labels 28-32px.
- Context strip: full-width gray bar (`#f1f3f5` fill, `#adb5bd` stroke) for a
  framing line above the row.
- Screenshot cards: equal-width images in a row, thin black border (orange for
  the focal card), 28px caption title, 22-24px gray two-line description.
- Optional bullets: at most three, 30px, prefixed with "•".

## Footer

- Full-width black bar, 70px tall, one white takeaway sentence, 28-30px.

## Build notes

- Layering: the server can slot new elements below existing ones. `add_image`
  puts images at the back, and elements added to an existing slide can land
  under its background card. After every image or late addition, read the
  scene's highest `index` and patch the new elements with `edit_scene_content`
  `update` to a larger index (fractional indices compare as strings, so append
  to the max, e.g. `b0p` -> `b0pVa`). Then confirm with `take_screenshot`.
- Upload screenshots with the skill CLI (`scripts/excal.mjs call add_image`)
  so base64 data never enters the chat.
- Never delete an image element once uploaded: the scene then rejects new
  image writes until the deleted element's `fileId` is patched to `null`.
- Capture site screenshots at 1440x900 with headless Chrome over CDP;
  scroll-animated pages need the target text scrolled into view first.
- Verify every slide with `take_screenshot` before handing back the link.
