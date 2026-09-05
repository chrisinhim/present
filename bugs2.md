1. [FIXED] Position -> Rotate clock-wise and Rotate counter-clock-wise are not working properly. When the text is rotated at 90 degrees, the text is getting truncated from the top and bottom. May be the bounding box is not getting updated after rotation.
   - Removed `overflow-hidden` from the highlight wrapper container in `PresentationCanvasComponent` that was cropping rotated text to the unrotated 30px line height.
   - Updated `StyleCompilerService` to set `transformOrigin: 'center center'` and constrain inline `maxWidth` to the slide height dimension when rotated 90° or 270° so multi-word text wraps cleanly within the slide boundaries.
   - Normalized `rotate(deltaDeg)` in `FormattingToolbarComponent` to 0..359 degrees.

2. [FIXED] When I present a text with ENTER button and immediately press ESCAPE, the text is not removed. I am having to click on a neutral place and then the ESCAPE works.
   - Fixed `onKeyDown` in `TextPanelComponent`: `Escape` now immediately blurs the textarea, closes suggestions, and hides the presentation via `this.state.hide()`.
   - `Enter` key (without Shift) immediately calls `presentNow()` and blurs the textarea. Autocomplete selection is now dedicated to `Tab` (per the UI hint: "Tab to complete").
   - `Escape` now functions instantaneously from anywhere without needing to click a neutral area.