# Heuristic Evaluation — Presentation Controller
**URL:** https://chrisinhim.github.io/present
**Method:** Nielsen's 10 Usability Heuristics
**Basis:** DOM/content structure (no rendered screenshot available — visual-only issues like contrast and spacing are flagged as "needs visual review" rather than rated)
**Severity scale:** 0 = not a problem · 1 = cosmetic · 2 = minor · 3 = major · 4 = catastrophic

---

## Summary Table

| # | Heuristic | Severity | Core Issue |
|---|-----------|----------|------------|
| 1 | Visibility of system status | 2 | Ambiguous controls ("‖"), unclear save/load confirmation |
| 2 | Match with real world | 3 | Raw CSS jargon exposed (`vw`, "Exp H/V/L/R", "Con H/V/L/R") |
| 3 | User control & freedom | 1 | Confirmation dialogs present; undo unclear elsewhere |
| 4 | Consistency & standards | 2 | "Solid" reused across 3 unrelated contexts |
| 5 | Error prevention | 2 | Numeric ranges stated in labels, not visibly enforced |
| 6 | Recognition vs. recall | 3 | Style tab bundles 4 unrelated concern areas |
| 7 | Flexibility & efficiency | 1 | Save/Load design is a strong power-user feature |
| 8 | Aesthetic & minimalist design | 2 *(revised)* | Cleaner in practice than text-only pass suggested — see addendum |
| 9 | Error recovery | — | Not visible in screenshots; needs live test |
| 10 | Help & documentation | 3 | One help blurb (Timer) covers none of the other 5 tabs |

*Severities above marked "(revised)" were updated after reviewing screenshots — see Visual Review Addendum below.*

---

## Detailed Findings

### 1. Visibility of System Status — Severity 2
- The "‖" symbol next to Duration is not decodable from label text alone — likely a pause icon, but nothing confirms this without hover/visual context.
- No confirmation feedback is evident for **Save Design** / **Load Design** — a user can't tell if a save succeeded without opening the file again.
- **Fix:** Add a toast/inline confirmation ("Design saved as [filename]") and label icon-only controls with `aria-label` or visible text.

### 2. Match Between System and the Real World — Severity 3
- `vw` (viewport width) is exposed directly as a font-size unit. That's a CSS internals term, not something a presenter thinks in.
- Animation labels **Exp H / Exp V / Exp L / Exp R** and **Con H / Con V / Con L / Con R** are abbreviations of "Expand Horizontal/Vertical/Left/Right" and "Contract..." — not guessable without prior knowledge of the tool.
- **Fix:** Replace `vw` with a relative label ("Text Size: Small/Medium/Large" or a slider with live preview). Spell out animation names or use icons + tooltip instead of abbreviations.

### 3. User Control and Freedom — Severity 1
- Destructive action (**Clear All** history) is gated behind an "Are you sure? Yes/No" dialog — correct pattern.
- Not clear whether style/background/position changes can be reverted once applied without reloading a saved design. If there's no undo, that's a gap, but can't confirm without visual/interactive testing.

### 4. Consistency and Standards — Severity 2
- "Solid" appears as a value in **Color** (Solid vs. Gradient), **Background Type** (Solid Color vs. Image vs. Video), and **Fill Type** (Solid Color vs. Picture). Same word, three different scopes of "solid-ness" — a user skimming can misapply a mental model from one section to another.
- **Fix:** Scope the labels — "Solid Text Color," "Solid Background," "Solid Box Fill" — so each is self-contained.

### 5. Error Prevention — Severity 2
- Countdown timer fields state constraints in the label itself ("Hour (0-23)", "Minute (0-59)") — good practice, but it only works if input is also constrained live (e.g., a number input with `min`/`max`, not free text). Can't confirm enforcement without interacting with the live app.
- File-based backgrounds (image/video) have no visible file-type or size guidance before upload.

### 6. Recognition Rather Than Recall — Severity 3
- The **Style** tab alone bundles Font, Color, Animation (In/Out), and Effects (Outline/Glow/Shadow) — four largely independent concerns in one scroll. A user adjusting glow has to recall where animation settings were, since they're not visible simultaneously.
- **Presentation History** is a good recognition aid — reusing past text avoids retyping.
- **Fix:** This is the single highest-leverage change. Splitting Style into sub-sections (Font / Color / Animation / Effects) as either nested tabs or collapsible groups would cut recall load significantly.

### 7. Flexibility and Efficiency of Use — Severity 1
- **Save Design / Load Design** to a file is a genuinely strong feature for a repeat presenter (church use case fits this well — save a design once per service type, reload instantly).
- No evidence of keyboard shortcuts for Present/Hide/Pause, which would help during a live event when reaching for a mouse is disruptive.

### 8. Aesthetic and Minimalist Design — Severity 2 (revised down from 3)
- Seeing the rendered UI, this is better than the text-only pass suggested. Sections are consistently bordered and labeled, whitespace is used deliberately, and Main/Background/Position tabs in particular are genuinely light. The tab structure is doing real work to contain the 25+ control groups across the app.
- The density concern narrows mostly to the **Style** tab, which still packs Font, Color, Animation, and Effects into one scroll (see #6) — that's the one screen where "type text → present it" gets buried under configuration.
- **Fix:** The earlier recommendation still applies, just scoped down — split Style specifically, rather than restructuring the whole app.

### 9. Help Users Recognize, Diagnose, and Recover from Errors — Not rated
- No error states appeared in the extracted content (this doesn't mean none exist — validation messages, upload failures, etc. are typically rendered dynamically via JS and wouldn't show in a static content pull).
- **Recommendation:** Manually trigger a few error conditions (bad file type, invalid countdown time, empty text + Present) and check whether the app tells you what went wrong and how to fix it.

### 10. Help and Documentation — Severity 3
- Only the **Timer** tab has explanatory copy ("Select and configure one of the 3 timer types..."). Style, Background, Position, and File have zero inline guidance despite being the most jargon-dense areas (per #2).
- **Fix:** A one-line description per tab, matching the Timer tab's pattern, would even out the learning curve.

---

## Visual Review Addendum (from screenshots)

New findings that only visual review could catch, mapped to the relevant heuristic.

**#2 Match with Real World — Severity 3 (new)**
The Position tab's Horizontal/Vertical alignment controls are icon-only buttons, and the icons are too small and ambiguous to identify at a glance — there's no way to tell which of the three horizontal options is left/center/right without clicking through them. This is the clearest usability gap found in the whole app: alignment is a core layout decision, and it's currently trial-and-error.

**#1 Visibility of System Status — additional instances (Severity 2)**
- The Fine Position Adjustment sliders (Horizontal/Vertical Adjustment) show no numeric value — only the handle position. No way to see or set an exact number.
- The Main tab's Duration field has no unit shown — seconds? milliseconds? Nothing on screen says.
- A thin unlabeled gray bar sits between the text-entry row and Presentation History on the Main tab. Its purpose (progress indicator? divider?) isn't communicated.

**#4 Consistency and Standards — additional instance (Severity 2)**
- **Save Design** is teal, **Load Design** is green — but green is used elsewhere specifically for "go" actions (Present, Present Timer) and teal for navigation actions (Open Presentation Window). Two buttons of equal weight and function get different color treatment, breaking the color logic used everywhere else in the app.
- In the Effects panel, Blur and Distance are plain number inputs while Angle is a slider — three properties of the same conceptual category (shadow geometry) use two different input patterns.

**Responsive layout (not a strict Nielsen heuristic, but worth flagging)**
On a phone-width viewport, the Style and Background tabs keep a two-column layout instead of stacking to one column. It stays usable but gets visually tight — the Blur/Dist/Angle row in Effects is the clearest example. Worth checking whether this is an intentional breakpoint decision.

---

## Top Priority Fixes (ranked by impact-to-effort)

1. **Label the alignment icon buttons** on the Position tab (#2, new) — add text labels or a tooltip/aria-label; smallest fix, biggest single clarity gain found.
2. **Fix the Save/Load Design color mismatch** (#4, new) — one-line CSS change, removes a misleading signal.
3. **Split the Style tab into sub-groups** (#6) — biggest recall burden, straightforward since it's layout, not new logic.
4. **Add units/values where missing** — Duration field unit, numeric readout on position sliders, label on the unexplained progress bar (#1).
5. **Rename jargon labels** (`vw`, Exp/Con abbreviations) (#2) — pure copy change, no logic risk.
6. **Add per-tab help text** matching the Timer tab (#10) — low effort, evens out the whole app.

## Not Evaluated (needs live interaction)
- Actual behavior of input validation (vs. just labeled constraints)
- Error message wording and recovery paths
- Whether the two-column mobile layout is an intentional breakpoint or a missed one
