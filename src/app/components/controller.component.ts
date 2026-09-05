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
    <div class="min-h-screen bg-[#f1f5f9] flex flex-col items-center p-3 sm:p-6 font-sans text-slate-800">
      <!-- MAIN CONTAINER -->
      <div class="w-full max-w-4xl flex flex-col gap-3">
        <!-- 1. LIVE PREVIEW CONTAINER -->
        <section aria-label="Live Preview Section">
          <app-live-preview></app-live-preview>
        </section>

        <!-- 2. FORMATTING TOOLBAR RIBBON (NO TABS, COMPACT ROWS) -->
        <section aria-label="Formatting Toolbar">
          <app-formatting-toolbar></app-formatting-toolbar>
        </section>

        <!-- 3. COMMON ACTIONS BAR -->
        <section aria-label="Common Actions Bar">
          <app-common-actions></app-common-actions>
        </section>

        <!-- 4. INPUT BOX WITH SEGMENTED TABS -->
        <section aria-label="Input Panels" class="relative z-20 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col">
          <!-- FULL WIDTH 5-SEGMENT TAB BAR -->
          <div class="grid grid-cols-5 border-b border-slate-200 bg-white rounded-t-lg overflow-hidden">
            @for (tab of tabs; track tab.id; let last = $last) {
              <button
                (click)="selectTab(tab.id)"
                [ngClass]="[
                  state.activeTab() === tab.id
                    ? 'bg-[#13324b] text-white font-bold'
                    : 'bg-white text-[#13324b] font-bold hover:bg-slate-50',
                  !last ? 'border-r border-slate-200' : ''
                ]"
                class="py-2.5 text-xs tracking-wider transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>

          <!-- TAB CONTENT PANEL -->
          <div class="p-3 sm:p-4 bg-white min-h-[80px] rounded-b-lg">
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

        <!-- SUBTLE FOOTER CONTROLS (DESIGN & HISTORY) -->
        <footer class="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          <div class="flex items-center gap-3">
            <button
              (click)="exportDesign()"
              title="Save Design JSON"
              class="hover:text-slate-600 transition-colors"
            >
              💾 Save Design
            </button>
            <span>&bull;</span>
            <label
              title="Load Design JSON"
              class="hover:text-slate-600 cursor-pointer transition-colors"
            >
              📂 Load Design
              <input type="file" accept=".json" (change)="importDesign($event)" class="hidden" />
            </label>
            @if (state.history().length > 0) {
              <span>&bull;</span>
              <button
                (click)="state.clearHistory()"
                class="hover:text-rose-500 transition-colors"
              >
                Clear History ({{ state.history().length }})
              </button>
            }
          </div>
          <span class="opacity-60 font-mono">Present v5 &bull; Angular 22</span>
        </footer>
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
    if (event.key === 'Escape' || event.code === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      // If an input is focused, blur it and hide
      if (activeEl instanceof HTMLElement) {
        activeEl.blur();
        document.body.focus();
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
