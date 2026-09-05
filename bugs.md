1. [FIXED] Effects -> color is not working.
   - Fixed fontColor priority over default solid fill in `StyleCompilerService` and synchronized `updateFontColor` with `textFillColor` and real-time state broadcast.

2. [FIXED] Effects -> Background is not working properly. It is applying as a strip on the top of the presentation window. But it should apply to the whole slide.
   - Added `host: { class: 'block w-full h-full relative flex-1' }` to `PresentationCanvasComponent` and `class="block w-full h-full flex-1"` to `PresentationViewComponent` so custom element fills 100% of the slide viewport.

3. [FIXED] Effects -> Background -> Gradient is not working.
   - Added `bg.type === 'gradient'` handler in `StyleCompilerService` and routed `updateBgColor` through `updateBackground()`.

4. [FIXED] Effects -> outline is not working properly. It is not creating an outline. It is creating multiple copies of the existing text and moving them in different directions.
   - Replaced 4-corner offset text-shadows with modern vector `-webkit-text-stroke: ${ow}px ${oc}` and `paint-order: stroke fill`.

5. [FIXED] Position -> vertical Alignment is not working.
   - Canvas now fills 100% slide height (eliminating the collapsed container) and `containerWrapper` uses explicit flex styles (`display: 'flex'`, `justifyContent`, `alignItems`) for instant top/middle/bottom alignment.

6. [FIXED] Position -> Offset - X is not working properly. Instead of moving the text in real time, it is moving the text in an animated style.
   - Removed `transition-all duration-300` from the transform container div in `PresentationCanvasComponent` for 60fps real-time translations.

7. [FIXED] Position -> Offset - Y is not working properly. Instead of moving the text in real time, it is moving the text in an animated style.
   - Removed `transition-all duration-300` from the transform container div in `PresentationCanvasComponent` for 60fps real-time translations.

8. [FIXED] Animation - Entry and Exit animations are not working.
   - Added explicit `animation-duration: var(--anim-duration, 0.4s)` to all CSS animation classes in `styles.css`, reconciled animation class names with `EntryAnimation` and `ExitAnimation` models, and wired the animation duration input to the canvas.

9. [FIXED] Hide button is removing the background also. It should not.
   - The canvas now retains `block w-full h-full relative flex-1` when content is hidden, preserving the slide background intact on stage and preview.