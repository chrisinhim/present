# Presentation Controller — Feature Documentation

**What it is:** A single-file, self-contained HTML/CSS/JS web app that lets you type text (e.g. Bible verses, announcements, song lyrics) or a live timer and display it, fully styled, in a separate output window — typically projected on a second screen. It has no server or backend; everything runs and is stored in your browser.

---

## 1. Presentation Window (the actual display output)

- **Open Presentation Window** / **Close Presentation Window** toggle button opens a separate popup window — this is what you project/share on a second screen.
- Window **remembers its size and position** between sessions.
- **Double-click inside the presentation window** toggles fullscreen on/off.
- Status indicator next to the button shows **Open / Closed / Blocked** (detects if the browser blocked the popup and tells you).
- If the window isn't open yet, hitting **Present** opens it automatically and then shows the content.

## 2. Main Tab — Presenting Text

- **Text box** for whatever you want to display (placeholder suggests Bible references like "John 3:16", but any text works).
- **Live preview panel** at the top of the controller mirrors font, color, background, and effects exactly as they'll appear on screen (alignment and fine position nudges are intentionally left out of the mini-preview).
- **Single smart button** that changes behavior based on state:
  - Idle → **PRESENT** (shows the text)
  - Playing → **PAUSE ||**
  - Paused → **RESUME ▶**
- **HIDE** button — instantly clears the screen (plays your configured exit animation first, if set).
- **Duration field** (seconds) — leave at `0` to stay on screen until you hide it manually, or set a number of seconds for it to auto-hide.
- **Seek bar** shows progress toward auto-hide when a duration is set.
- **Bible-book autocomplete** while typing: matches against all 66 books of the Bible, supports multiple references separated by commas, and lets you navigate suggestions with ↑ / ↓ and accept with Enter or Tab (Escape or clicking elsewhere dismisses it). *Note: this only autocompletes book names — it doesn't fetch verse text for you.*
- **Presentation History** — automatically logs every unique thing you've presented (up to the last 50):
  - One-click **re-present** any past item
  - **Delete** individual entries
  - **Clear All** (with a confirmation prompt)

## 3. Timer Tab

Pick one of three timer types. Whichever one is active **inherits all of your font, color, background, position, and animation settings** from the other tabs when presented.

| Mode | What it does | Options |
|---|---|---|
| **1. Current Time** | Shows a live clock | 12-hour or 24-hour format; toggle seconds on/off |
| **2. Countdown Timer** | Counts down to a specific clock time today | Set target hour (0–23) and minute (0–59); shows 00:00 once the target has passed |
| **3. Period/Duration Timer** | A stopwatch-style timer for a set length | Count Up or Count Down; set target minutes/seconds |

- Controls: **Present Timer**, **Pause/Resume Timer**, **Reset Timer**, **Hide Timer**.
- For countdown/period timers, the configured exit animation automatically plays just before the timer hits zero.
- Updates live every 200ms, both in the mini-preview and on the actual presentation screen.

## 4. Style Tab

**Font & Text Style**
- 4 built-in fonts (Arial, Georgia, Courier New, Trebuchet MS)
- **Add any Google Font by name** — loads it live from Google Fonts, applies it to both the controller and the presentation window, and remembers it in your saved settings
- Font size (in `vw` units, so it scales with screen width)
- Bold, Italic, Underline toggles
- UPPERCASE / lowercase text-transform toggles

**Color**
- Solid text color picker
- Two-color **gradient text fill** with 4 direction options (left, right, up, down)

**Entry / Exit Animations**
- Entry: Fade In · Slide In (top/bottom/left/right) · Zoom In · Expand (horizontal/vertical/left/right/up/down)
- Exit: matching mirrored set — Fade Out · Slide Out · Zoom Out · Contract variants
- Independent duration (ms) for entry and exit

**Effects**
- Text **outline** (color + width)
- **Glow** (color + size)
- **Drop shadow** (color, blur, distance, and a 0–360° angle slider) — combinable with glow at the same time

## 5. Background Tab

**Presentation Window Background** (behind everything, full screen)
- Solid color
- Uploaded image file
- Uploaded **looping, muted, auto-playing video** file

**Text Content Background** (a background specifically around/behind the text itself)
- Type: None / Box / Text Line
- Fill: solid color or a picture (GIFs supported)
- **Box** mode: adjustable width %, height %, corner radius, and text alignment inside the box (left/center/right)
- **Text Line** mode: background hugs just the line of text, with adjustable width % and corner radius

## 6. Position Tab

- **Main alignment** — 3×3-style buttons for horizontal (left/center/right) and vertical (top/middle/bottom) placement of the text block
- **Fine position adjustment** — separate horizontal and vertical sliders (–50 to +50) to nudge the text off its aligned position, calculated as a percentage of the actual presentation screen size (so it stays consistent across different display resolutions)

## 7. File Tab — Design Management

- **Save Design** — exports all your current settings (fonts, colors, animations, backgrounds, position, etc.) as a downloadable `.json` file
- **Load Design** — re-imports a previously saved `.json` file and applies it instantly
- ⚠️ **Note:** the exported file saves your *settings*, not your uploaded media itself — background images/videos you've uploaded stay in this browser's local storage and won't travel with the JSON file to another device/browser.

## 8. Persistence & Local Storage

- Every setting **auto-saves** as you change it (via `localStorage`) — closing and reopening the page restores your last look, tab, and mode.
- Uploaded images/videos are stored in the browser's **IndexedDB**, so they persist across reloads without re-uploading.
- Presentation history (last 50 items) is saved the same way.
- The app remembers which **tab** you were on and whether you were last in **text mode or timer mode**.

## 9. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **Enter** (in text box) | Present / Pause / Resume |
| **Shift + Enter** | New line in the text box |
| **Spacebar** (focus not in an input) | Pause / Resume |
| **Escape** | Hide the presentation |
| **↑ / ↓** (autocomplete open) | Navigate book-name suggestions |
| **Enter / Tab** (autocomplete open) | Accept the highlighted suggestion |
| **Escape** (autocomplete open) | Dismiss suggestions |

## 10. Technical Notes

- Single HTML file — no build tools, no server, no framework dependencies (only reaches out to Google Fonts' CDN when you add a custom font).
- The "second screen" is a real browser popup window (`window.open`), so **popups must be allowed** for the site.
- All data (settings, history, uploaded media) lives **only in this browser on this device** — nothing is sent to a server. Use Save/Load Design to move your look between devices (excluding media files).
- Not built for multi-operator/multi-device sync — it's a single-controller tool.

---

*Generated from a review of `index.html`'s markup, styles, and script logic.*
