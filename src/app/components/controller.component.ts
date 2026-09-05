import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../services/presentation-state.service';
import { LivePreviewComponent } from './live-preview/live-preview.component';
import { FormattingToolbarComponent } from './formatting-toolbar/formatting-toolbar.component';
import { CommonActionsComponent } from './common-actions/common-actions.component';
import { TextPanelComponent } from './input-panels/text-panel/text-panel.component';
import { VersePanelComponent } from './input-panels/verse-panel/verse-panel.component';
import { TimerPanelComponent } from './input-panels/timer-panel/timer-panel.component';
import { LyricsPanelComponent } from './input-panels/lyrics-panel/lyrics-panel.component';
import { MediaPanelComponent } from './input-panels/media-panel/media-panel.component';
import { MainTabType } from '../models/presentation.models';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LivePreviewComponent,
    FormattingToolbarComponent,
    CommonActionsComponent,
    TextPanelComponent,
    VersePanelComponent,
    TimerPanelComponent,
    LyricsPanelComponent,
    MediaPanelComponent,
  ],
  template: `
    <div
      [ngClass]="[state.activeTheme().bgClass, state.activeTheme().textClass]"
      class="min-h-screen flex flex-col items-center p-3 sm:p-6 font-sans transition-colors duration-300"
    >
      <!-- MAIN CONTAINER -->
      <div class="w-full max-w-6xl flex flex-col gap-4">
        <!-- HEADER APP TITLE BAR -->
        <header
          [ngClass]="state.activeTheme().borderClass"
          class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">📽️</span>
            <div>
              <h1 class="text-base font-bold tracking-tight">Presentation Controller</h1>
              <p class="text-[11px] opacity-75">Live Presentation & Multimedia Broadcasting</p>
            </div>
          </div>

          <!-- THEME PICKER & DESIGN EXPORT / IMPORT -->
          <div class="flex items-center gap-2">
            <!-- Theme Switcher Dropdown -->
            <div
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium"
              [ngClass]="[state.activeTheme().cardBgClass, state.activeTheme().borderClass]"
            >
              <span class="text-sm">{{ state.activeTheme().icon }}</span>
              <span class="text-[11px] opacity-75 hidden sm:inline">Theme:</span>
              <select
                [ngModel]="state.appTheme()"
                (ngModelChange)="state.setAppTheme($event)"
                class="bg-transparent border-0 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <optgroup label="Dark Themes">
                  @for (t of darkThemes; track t) {
                    <option [value]="t.id" class="bg-slate-900 text-slate-100">
                      {{ t.icon }} {{ t.name }}
                    </option>
                  }
                </optgroup>
                <optgroup label="Light Themes">
                  @for (t of lightThemes; track t) {
                    <option [value]="t.id" class="bg-white text-slate-900">
                      {{ t.icon }} {{ t.name }}
                    </option>
                  }
                </optgroup>
              </select>
            </div>

            <button
              (click)="exportDesign()"
              title="Save Design JSON"
              [ngClass]="[state.activeTheme().cardBgClass, state.activeTheme().borderClass]"
              class="px-2.5 py-1 border hover:opacity-90 rounded-lg text-xs font-medium transition-colors"
            >
              💾 Save Design
            </button>

            <label
              title="Load Design JSON"
              [ngClass]="[state.activeTheme().cardBgClass, state.activeTheme().borderClass]"
              class="px-2.5 py-1 border hover:opacity-90 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              📂 Load Design
              <input type="file" accept=".json" (change)="importDesign($event)" class="hidden" />
            </label>
          </div>
        </header>

        <!-- 1. LIVE PREVIEW CONTAINER -->
        <section aria-label="Live Preview Section">
          <app-live-preview></app-live-preview>
        </section>

        <!-- 2. FORMATTING TOOLBAR RIBBON -->
        <section aria-label="Formatting Toolbar Ribbon">
          <app-formatting-toolbar></app-formatting-toolbar>
        </section>

        <!-- 3. COMMON ACTIONS BAR -->
        <section aria-label="Common Actions Bar">
          <app-common-actions></app-common-actions>
        </section>

        <!-- 4. INPUT BOX WITH TABS -->
        <section
          [ngClass]="[state.activeTheme().cardBgClass, state.activeTheme().borderClass]"
          class="border rounded-xl overflow-hidden shadow-2xl flex flex-col"
        >
          <!-- TAB HEADERS -->
          <div
            [ngClass]="state.activeTheme().borderClass"
            class="flex border-b bg-black/10 overflow-x-auto"
          >
            @for (tab of tabs; track tab) {
              <button
                (click)="selectTab(tab.id)"
                [ngClass]="
                  state.activeTab() === tab.id
                    ? 'border-sky-500 text-sky-400 font-bold border-b-2 bg-white/5'
                    : 'border-transparent opacity-75 hover:opacity-100'
                "
                class="px-5 py-3 text-xs tracking-wider transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>

          <!-- TAB CONTENT PANELS -->
          <div class="p-4 sm:p-6">
            @switch (state.activeTab()) {
              @case ('TEXT') {
                <app-text-panel></app-text-panel>
              }
              @case ('VERSE') {
                <app-verse-panel></app-verse-panel>
              }
              @case ('TIMER') {
                <app-timer-panel></app-timer-panel>
              }
              @case ('LYRICS') {
                <app-lyrics-panel></app-lyrics-panel>
              }
              @case ('MEDIA') {
                <app-media-panel></app-media-panel>
              }
            }
          </div>
        </section>

        <!-- 5. PRESENTATION HISTORY DRAWER -->
        @if (state.history().length > 0) {
          <section class="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
                Presentation History ({{ state.history().length }}/50)
              </span>
              <button
                (click)="state.clearHistory()"
                class="text-[11px] text-rose-400 hover:underline"
              >
                Clear All History
              </button>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2">
              @for (item of state.history(); track item) {
                <div
                  class="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 shrink-0"
                >
                  <span
                    class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-sky-400 font-semibold"
                    >{{ item.tab }}</span
                  >
                  <span class="max-w-[150px] truncate">{{ item.summary }}</span>
                  <button
                    (click)="rePresent(item)"
                    title="Re-present"
                    class="text-sky-400 hover:text-sky-300 font-bold ml-1"
                  >
                    ▶
                  </button>
                  <button
                    (click)="state.removeHistoryItem(item.id)"
                    title="Delete"
                    class="text-slate-500 hover:text-rose-400"
                  >
                    ✕
                  </button>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class ControllerComponent {
  state = inject(PresentationStateService);

  tabs: { id: MainTabType; label: string; icon: string }[] = [
    { id: 'TEXT', label: 'TEXT', icon: '📝' },
    { id: 'VERSE', label: 'VERSE', icon: '📖' },
    { id: 'TIMER', label: 'TIMER', icon: '⏱️' },
    { id: 'LYRICS', label: 'LYRICS', icon: '🎵' },
    { id: 'MEDIA', label: 'MEDIA', icon: '🖼️' },
  ];

  darkThemes = [
    { id: 'midnight-slate', name: 'Midnight Slate', icon: '🌌' },
    { id: 'cyber-dark', name: 'Cyberpunk Neon', icon: '⚡' },
    { id: 'obsidian-gold', name: 'Obsidian Gold', icon: '👑' },
    { id: 'deep-emerald', name: 'Deep Emerald', icon: '🌲' },
    { id: 'royal-amethyst', name: 'Royal Amethyst', icon: '🔮' },
  ];

  lightThemes = [
    { id: 'clean-light', name: 'Pure Studio', icon: '☀️' },
    { id: 'warm-paper', name: 'Warm Parchment', icon: '📜' },
    { id: 'nordic-snow', name: 'Nordic Frost', icon: '❄️' },
    { id: 'lavender-breeze', name: 'Lavender Breeze', icon: '🪻' },
    { id: 'desert-sand', name: 'Desert Sand', icon: '🏜️' },
  ];

  selectTab(tabId: MainTabType) {
    this.state.switchTab(tabId);
  }

  rePresent(item: any) {
    this.state.present(item.content);
  }

  exportDesign() {
    const json = this.state.exportDesignJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation_design_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importDesign(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) this.state.importDesignJson(text);
      };
      reader.readAsText(input.files[0]);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalShortcuts(event: KeyboardEvent) {
    const activeEl = document.activeElement;
    const isInput =
      activeEl?.tagName === 'INPUT' ||
      activeEl?.tagName === 'TEXTAREA' ||
      activeEl?.tagName === 'SELECT' ||
      activeEl?.getAttribute('contenteditable') === 'true';

    // 1. SPACE: Pause / Resume duration
    if (event.code === 'Space' && !isInput) {
      event.preventDefault();
      this.state.togglePlayPause();
      return;
    }

    // 2. ESCAPE: Hide presentation content
    if (event.key === 'Escape') {
      // If an input is focused, blur it and hide
      if (activeEl instanceof HTMLElement) {
        activeEl.blur();
      }
      this.state.hide();
      return;
    }

    // 3. ENTER: Present active staged content (when not in a multiline textarea or modifier held)
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      if (!isInput) {
        event.preventDefault();
        this.state.present();
      }
    }
  }
}
