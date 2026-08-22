# AI Context: Presentation Controller UI

## Workspace
- Repository: `present`
- Workspace path: `C:\Workspaces\present`
- Active UI file: `UI/index2.html`
- Main legacy controller: `index.html`
- Current branch: `main`

## Task Scope
The work in this conversation is limited to the standalone page `UI/index2.html`.
Prefer HTML/CSS and small inline browser behavior only when needed for UI positioning or transformation. Do not modify the main controller unless explicitly requested.

## Current UI Structure
`UI/index2.html` contains:
- A live preview box.
- A PowerPoint-style text formatting toolbar with native `<details>/<summary>` dropdowns.
- A presentation input box with tabs:
  - TEXT
  - VERSE
  - TIMER
  - LYRICS
  - MEDIA
- Shared Presentation Controls positioned between the toolbar and `presentationInputBox`.

## Shared Presentation Controls
The `.ib-common-actions` row is outside `#presentationInputBox` and contains, in this order:
1. Play/Pause toggle: `#playPresentation`
2. Seek bar: `.ib-duration-bar`
3. Display duration input: `.ib-duration-input`
4. Hide button: `.ib-x-btn`

CSS currently aligns the row with the other page surfaces:
```css
.ib-common-actions{
  max-width:760px; margin:0 auto;
  display:flex; align-items:center; justify-content:flex-end; gap:8px;
  padding:10px 14px; border-top:1px solid var(--ib-border); background:#f8fafb;
}
```
The seek bar is flexible and sits between Play/Pause and duration:
```css
.ib-common-actions > .ib-duration-bar{
  display:block; flex:1; width:auto; min-width:80px; margin:0 4px;
}
```

## Toolbar
The toolbar is `#textFormatToolbar` with `flex-wrap: wrap` and no scroll clipping:
```css
.pc-toolbar{
  display:flex; align-items:stretch; flex-wrap:wrap; gap:4px 2px;
  max-width:760px; margin:0 auto;
  overflow:visible;
}
```
Dropdown menus are viewport-positioned:
```css
.tb-menu{
  position:fixed; top:0; left:0; z-index:50;
  width:max-content; min-width:0;
  max-width:calc(100vw - 16px);
  overflow-x:hidden;
}
```
An inline script at the end of the page finds all open toolbar dropdowns and dynamically positions their menus below the trigger while clamping left/right/top/bottom to the viewport. It listens for native `toggle`, resize, and scroll events.

## Toolbar Dropdowns
Existing dropdowns include:
- Character Spacing
- Change Case
- Text Highlight Color
- Font Color
- Rotate
- Text Fill
- Text Outline
- Text Effects
- Background
- Entry
- Exit

Dropdown widths are content-driven rather than fixed. Color panels are also viewport constrained.

### Background Dropdown
The Background dropdown contains only:
- Picture
- Video
- Solid Color with a color input `#toolbarBackgroundColor`

The old panel-level background rows were removed.

### Entry Animation Dropdown
Values mirror `index.html`:
- `none`
- `fade-in`
- `slide-in-top`
- `slide-in-bottom`
- `slide-in-left`
- `slide-in-right`
- `zoom-in`
- `expand-horizontally`
- `expand-vertically`
- `expand-left`
- `expand-right`

### Exit Animation Dropdown
Values mirror `index.html`:
- `none`
- `fade-out`
- `slide-out-top`
- `slide-out-bottom`
- `slide-out-left`
- `slide-out-right`
- `zoom-out`
- `contract-horizontally`
- `contract-vertically`
- `contract-left`
- `contract-right`

## Verse Picker
The VERSE tab uses CSS radio/checkbox controls and includes:
- QUOTE and REFER modes.
- 66 Bible book radio controls.
- John chapter radio controls, currently a static example for chapters 1-5.
- John 3 verse checkbox controls 1-36.
- Static Quote results and Reference preview examples.

Important limitation: true Fetch behavior, dynamic chapter/verse generation for every book, drag-selecting a checkbox range, and presenting selected content require a fuller JavaScript behavior pass. The current page mainly provides the static UI model.

### Bible Book Display
Visible book labels are transformed by the inline script at runtime:
- Full names become abbreviations, e.g. `Genesis` -> `Gen`, `1 Corinthians` -> `1 Cor`.
- Full names remain in `title` and `aria-label`.
- Books are assigned category classes and moved into separate horizontal subgrids, but category names and divider lines are intentionally hidden.

Categories and classes:
- `category-law`
- `category-history`
- `category-poetry`
- `category-major-prophets`
- `category-minor-prophets`
- `category-gospels`
- `category-acts`
- `category-pauline`
- `category-general`
- `category-prophecy`

Each category has a distinct text color. The book grid and chapter/verse grids are compact, fully expanded, and have no internal scrollbars.

## Recent Validations
- `get_errors` reports no errors for `UI/index2.html`.
- Toolbar dropdowns have been tested in the integrated browser.
- Viewport width checks confirmed dropdowns do not create document-level horizontal overflow.
- Static checks confirmed shared control order and Bible category grouping.

## Editing Guidance
- Preserve the existing single-file structure and CSS-only tab/radio interactions.
- Keep changes scoped to `UI/index2.html` unless asked otherwise.
- Use `apply_patch` for edits.
- Validate with `get_errors` and a focused browser or PowerShell check after edits.
- Do not reintroduce per-tab Play/Pause, duration, Hide, or Background controls.
- Do not restore visible Bible category headings or horizontal divider lines unless explicitly requested.
