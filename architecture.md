# Church Display Console Architecture

The Church Display Console is a high-performance church media system designed for low-latency delivery and volunteer-friendly operation.

## Core Design Principles

- **REQ-G-1**: **Persistent Preview**: A live preview area remains at the top of the interface at all times.
- **REQ-G-2**: **Contextual Workflow**: Four primary departments (Bible, Media, Timers, Songs) with independent histories.
- **REQ-G-3**: **One-Click Delivery**: Selection-to-screen simplicity for all content.

---

## 1. Top-Level Departments

### A. Bible

- **REQ-B-1**: **Lookup Engine**: Individual book buttons (using 3-letter abbreviations) with genre-based color coding for clarity.
  - **REQ-B-1.1**: **Genre Categories (Color Groups)**:
    - **Old Testament**: Law, History, Poetry, Major Prophets, Minor Prophets.
    - **New Testament**: Gospels, History, Pauline Epistles, General Epistles, Revelation.
- **REQ-B-2**: **Selection Grid**: Interactive chapter/verse grids with drag-to-select range support.
- **REQ-B-3**: **Output Boxes**: Separate triggers for Reference, Verse Text, or Custom labels.

### B. Media

- **REQ-M-1**: **Asset Library**: Multi-file loading with persistent listing.
- **REQ-M-2**: **Playback Control**: Play/Pause, Stop, Volume, and Loop toggles.
- **REQ-M-3**: **Overlay Mode**: Ability to tile media as a resizable/repositionable overlay on top of other content.

### C. Timers

- **REQ-T-1**: **3 Modes**: Target Time, Duration, and Realtime Clock.
- **REQ-T-2**: **Zero Actions**: Logic for timer completion (Stop/Remove, Alert/Play Media, or Continue with negative count).
- **REQ-T-3**: **Shortcuts**: Dedicated keys for Start/Stop/Pause functionality.

### D. Songs

- **REQ-S-1**: **Instant Loading**: Direct file loading for quick song addition during services.
- **REQ-S-2**: **Database Mapping**: Automatic parsing of Verse, Chorus, and Bridge sections from text files.
- **REQ-S-3**: **Sequence Flow**: Interactive slide navigation with sequence mapping support.
  - **REQ-S-3.1**: **Song Format**: Supports Title, Verse (v1, v2...), Chorus (c1, c2...), Bridge (b1...), Outro (o1...), and Outro.
  - **REQ-S-3.2**: **Sequence String**: Ability to define flow using short-codes (e.g., `v1 c1 v2 c2 v3 b1 o1`).

---

## 2. Global Control Systems

### History & Management

- **REQ-H-1**: **Pinned History**: Users can "Pin" specific items to prevent them from being removed.
- **REQ-H-2**: **Clear Logic**: A "Clear History" button removes all unpinned items while preserving priority content.

### Virtual Meeting Tools

- **REQ-V-1**: **On-Screen Navigation Toggle**: For environments without multiple displays (online meetings/recordings), navigation buttons can be toggled directly on the presentation output for mouse-based control.

### Keyboard Shortcuts

- **REQ-K-1**: `ENTER`: Present current input.
- **REQ-K-2**: `ESCAPE`: Clear/Hide presentation (includes clearing/hiding timers).
- **REQ-K-3**: `SPACEBAR`: Pause/Resume Timer or advance to Next Slide.
- **REQ-K-4**: `RIGHT ARROW`: Advance to Next Slide.
- **REQ-K-5**: `DOWN ARROW`: Advance to Next Slide.
- **REQ-K-6**: `LEFT ARROW`: Return to Previous Slide.
- **REQ-K-7**: `UP ARROW`: Return to Previous Slide.

---

## 3. Persistent Synchronization

- **REQ-P-1**: **Hybrid Sync**: All settings, presets, and pinned content are stored **Locally** (LocalStorage/IndexedDB) for offline reliability and synced to the **Cloud** for cross-machine consistency.
- **REQ-P-2**: **Presets**: JSON-based Export/Import for styling and service configurations.
