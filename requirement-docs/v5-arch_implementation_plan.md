# Implementation Plan: Angular 22 Presentation Controller Architecture

Upgrade and re-architect the **Presentation Controller** into a modern, component-driven **Angular 22** Progressive Web App (PWA) with Zoneless Signal reactivity, an A/B Preview vs. Program bus model, shared rendering engine, and presenter ergonomics.

---

## User Review Required

> [!IMPORTANT]
> **Angular 22 Zoneless Setup**: We will initialize the project using Angular 22 (`@angular/core@22.x`), `@angular/build:application`, and `provideZonelessChangeDetection()`, removing legacy `zone.js` dependencies.
> 
> **Branch & Git Safety**: All work will be developed and committed on the dedicated `v5-arch` branch created by the user.

---

## Proposed Architectural Changes

```
src/app/
├── core/
│   ├── models/presentation.models.ts        # Comprehensive data contracts & themes
│   ├── services/
│   │   ├── presentation-store.service.ts   # Core store with linkedSignal() (Preview vs Program Bus)
│   │   ├── sync-channel.service.ts         # BroadcastChannel multi-window transport
│   │   ├── storage.service.ts              # IndexedDB + navigator.storage.persist()
│   │   ├── font-loader.service.ts          # Google Fonts dynamic loader
│   │   └── hotkey-manager.service.ts       # Global & contextual keyboard shortcut dispatcher
│   └── styles/style-compiler.service.ts    # Single source of truth for canvas CSS styles
│
├── shared/
│   └── components/presentation-canvas/     # Shared rendering engine (Preview & Stage)
│       └── presentation-canvas.component.ts
│
├── features/
│   ├── controller/                         # Main Controller Route ('/')
│   │   ├── controller-shell.component.ts   # Root container
│   │   ├── header/
│   │   │   ├── header-bar.component.ts
│   │   │   └── theme-selector.component.ts
│   │   ├── preview/
│   │   │   ├── live-preview.component.ts
│   │   │   └── on-air-badge.component.ts
│   │   ├── ribbon/                         # PowerPoint-style formatting toolbar
│   │   │   ├── formatting-ribbon.component.ts
│   │   │   ├── font-controls.component.ts
│   │   │   ├── text-effect-dropdown.component.ts
│   │   │   ├── fill-gradient-dropdown.component.ts
│   │   │   ├── container-box-dropdown.component.ts
│   │   │   ├── background-dropdown.component.ts
│   │   │   ├── animation-dropdown.component.ts
│   │   │   └── alignment-matrix.component.ts
│   │   ├── transport/
│   │   │   ├── common-actions-bar.component.ts
│   │   │   ├── play-pause-button.component.ts
│   │   │   ├── duration-seek-bar.component.ts
│   │   │   └── window-launcher.component.ts
│   │   ├── input-box/                      # Tabbed Input Panels (@defer optimized)
│   │   │   ├── input-box-container.component.ts
│   │   │   ├── text-panel/
│   │   │   ├── verse-panel/                # Multi-verse Shift-Click selection
│   │   │   ├── timer-panel/                # Drift-free performance.now() ticker
│   │   │   ├── lyrics-panel/               # Stanza parser & PageDown/PageUp sequencer
│   │   │   └── media-panel/                # IndexedDB video loops & image assets
│   │   └── history/
│   │       └── history-drawer.component.ts
│   │
│   └── stage/                              # Stage Route ('#/present-view')
│       ├── stage-view.component.ts
│       └── stage-announcer.component.ts    # ARIA-live screen reader announcer
```

---

## Step-by-Step Implementation Phases

### Phase 1: Angular 22 Project Foundation & Configuration
- [NEW] `package.json` with Angular 22 (`@angular/core@^22.0.0`, `@angular/common@^22.0.0`, `@angular/router@^22.0.0`, `@angular/build@^22.0.0`, `typescript`, `tailwindcss`).
- [NEW] `angular.json` configured with `@angular/build:application` (Vite dev server + esbuild optimizer).
- [NEW] `tsconfig.json` & `tsconfig.app.json` with strict mode.
- [MODIFY] `src/app/app.config.ts` configured with `provideZonelessChangeDetection()` and `provideRouter(routes, withHashLocation())`.

### Phase 2: Core Domain & State Architecture
- [NEW] `src/app/core/models/presentation.models.ts` & `bible.models.ts`: Define `DisplayPayload`, `TypographySettings`, `PresentationBackground`, `ContainerStyle`, and 10 OKLCH theme presets.
- [NEW] `src/app/core/services/presentation-store.service.ts`:
  - `livePayload = signal<DisplayPayload | null>(null)` (Program Bus).
  - `stagedPayload = linkedSignal(...)` (Preview Bus).
  - `isLive = computed(...)`, `isDirty = computed(...)`, duration timer actions.
- [NEW] `src/app/core/services/sync-channel.service.ts`: BroadcastChannel dual-window transport with reconnect and hydration handshake (`REQUEST_HYDRATION`, `SYNC_PROGRAM`, `TRANSPORT_CMD`).
- [NEW] `src/app/core/services/storage.service.ts`: IndexedDB media repo with `navigator.storage.persist()` and LocalStorage settings sync.
- [NEW] `src/app/core/services/hotkey-manager.service.ts`: Centralized keyboard shortcuts (`Enter` to Present, `Esc` to Hide, `Space` for Pause/Resume, `PageDown`/`PageUp` for Lyrics stanzas).
- [NEW] `src/app/core/styles/style-compiler.service.ts`: Deterministic CSS style compiler for both Preview and Stage output.

### Phase 3: Shared Canvas & Output Stage
- [NEW] `src/app/shared/components/presentation-canvas/presentation-canvas.component.ts`: Shared rendering engine for typography, video/image backgrounds, highlight containers, and entrance/exit animations.
- [NEW] `src/app/features/stage/stage-view.component.ts`: Secondary window stage display responding to dual-window sync events.
- [NEW] `src/app/features/stage/stage-announcer.component.ts`: Invisible `aria-live="polite"` region for accessibility announcements.

### Phase 4: Formatting Ribbon & Transport Controls
- [NEW] `FormattingRibbonComponent` and its 7 child dropdown components using Angular 22 `model()` and `<details>/<summary>` viewport-clamped positioning.
- [NEW] `CommonActionsBarComponent`: Smart Present/Pause/Resume button, animated seek bar, duration input, and pop-up window launcher with connection indicator.

### Phase 5: Input Panels with Angular 22 `@defer` & Presenter Ergonomics
- [NEW] `TextPanelComponent`: Text input with 66-book Bible autocomplete.
- [NEW] `VersePanelComponent`: 66 books categorized grid + Chapter selector + Verse range selector with `Shift+Click` multi-verse range selection.
- [NEW] `TimerPanelComponent`: Real-time Clock, Target Countdown, and Stopwatch Period with sub-second accuracy.
- [NEW] `LyricsPanelComponent`: Automatic stanza splitter (Verse, Chorus, Bridge) with click-to-present and keyboard stanza sequencing.
- [NEW] `MediaPanelComponent`: Drag-and-drop video/image asset upload, preview with seek/loop toggling.
- [NEW] `LivePreviewComponent` with `OnAirStatusBadgeComponent` (`🔴 LIVE ON AIR` vs `🟡 DRAFT MODIFIED`).
- [NEW] `HistoryDrawerComponent`: 50-item presentation history with 1-click re-presentation.

### Phase 6: PWA & Service Worker
- [MODIFY] `public/sw.js` and `manifest.webmanifest`: Complete offline-first caching for hashed Angular 22 ESM bundles, Google Fonts, and icons.

---

## Verification Plan

### Automated Build & Type Checks
- Run `npm install` to install Angular 22 dependencies.
- Run `npm run build` (or `npx ng build`) to ensure 0 TypeScript compilation errors and valid ESM bundle generation.

### Dual-Window Functional Testing
1. Launch local dev server: `npm start` (or serve `dist/browser`).
2. Open Controller in Browser (`/`).
3. Click "Open Presentation Window": Verify secondary pop-up opens at `#/present-view` and receives `STAGE_READY` handshake.
4. Present Text: Verify text renders instantly on stage with selected typography and animation.
5. Check Live Preview: Verify `🔴 ON AIR` badge appears and matches stage output.
6. Test Lyrics Stanza Navigation: Advance through stanzas using `PageDown` / `ArrowDown` hotkeys.
7. Test Bible Verse Multi-Select: Verify `Shift+Click` selects verse ranges (e.g. John 3:16–18).
8. Test Offline Capability: Simulate offline mode in DevTools and ensure app reloads and renders assets cleanly.
