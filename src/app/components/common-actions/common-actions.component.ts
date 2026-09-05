import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-common-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-slate-200"
    >
      <!-- LEFT: PLAY / PAUSE / PRESENT -->
      <div class="flex items-center gap-2">
        <button
          (click)="togglePresent()"
          [title]="
            state.activeContent().type === 'TIMER'
              ? state.isPresented()
                ? 'Re-Present Timer (Enter)'
                : 'Present Timer (Enter)'
              : state.isPresented()
                ? 'Pause / Resume (Space)'
                : 'Present Now (Enter)'
          "
          [ngClass]="
            state.isPresented()
              ? state.isPaused()
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
              : 'bg-sky-600 hover:bg-sky-500'
          "
          class="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white shadow-lg transition-all"
        >
          <span>{{
            state.activeContent().type === 'TIMER'
              ? state.isPresented()
                ? '▶ Present'
                : '▶ Present'
              : state.isPresented()
                ? state.isPaused()
                  ? '▶ Resume'
                  : '‖ Pause'
                : '▶ Present'
          }}</span>
          <span class="text-[10px] opacity-75 font-mono px-1 py-0.5 bg-black/20 rounded">{{
            state.activeContent().type === 'TIMER'
              ? 'Enter'
              : state.isPresented()
                ? 'Space'
                : 'Enter'
          }}</span>
        </button>

        @if (state.isPresented()) {
          <button
            (click)="state.hide()"
            title="Hide Content (Esc)"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 font-medium text-xs transition-colors"
          >
            <span>✕ Hide</span>
            <span class="text-[9px] opacity-75 font-mono">Esc</span>
          </button>
        }
      </div>

      <!-- CENTER: DURATION & PROGRESS BAR (EXEMPT FOR TIMERS & LYRICS) -->
      @if (state.activeContent().type !== 'TIMER' && state.activeContent().type !== 'LYRICS') {
        <div class="flex-1 min-w-[200px] max-w-md flex flex-col gap-1">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <div class="flex items-center gap-2">
              <span>Duration:</span>
              <input
                type="number"
                min="0"
                max="3600"
                [ngModel]="state.durationSeconds()"
                (ngModelChange)="updateDuration($event)"
                class="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-slate-100 focus:outline-none"
              />
              <span class="text-[10px] text-slate-500">(0 = manual)</span>
            </div>
            @if (state.durationSeconds() > 0) {
              <span class="text-sky-400 font-mono">
                {{ state.remainingSeconds() }}s remaining
              </span>
            }
          </div>
          <!-- Animated Seek Bar -->
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300 rounded-full"
              [style.width.%]="progressPercent()"
            ></div>
          </div>
        </div>
      }

      @if (state.activeContent().type === 'TIMER') {
        <div
          class="flex-1 min-w-[200px] max-w-md flex items-center justify-center text-xs text-slate-400 font-medium bg-slate-950/40 py-2 px-3 rounded-lg border border-slate-800"
        >
          <span class="text-sky-400 font-mono flex items-center gap-1.5">
            <span>⏱️</span>
            <span>Live Timer Mode (Duration auto-hide disabled &bull; Use Present &amp; Hide)</span>
          </span>
        </div>
      }

      @if (state.activeContent().type === 'LYRICS') {
        <div
          class="flex-1 min-w-[200px] max-w-md flex items-center justify-center text-xs text-slate-400 font-medium bg-slate-950/40 py-2 px-3 rounded-lg border border-slate-800"
        >
          <span class="text-emerald-400 font-mono flex items-center gap-1.5">
            <span>🎵</span>
            <span>Song Lyrics Mode (Manual Stanza Flow &bull; Use Paragraph Cards)</span>
          </span>
        </div>
      }

      <!-- RIGHT: POPUP WINDOW TOGGLE & FULLSCREEN -->
      <div class="flex items-center gap-2">
        <button
          (click)="openPopup()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <span>🗔 Popout Window</span>
        </button>
      </div>
    </div>
  `,
})
export class CommonActionsComponent {
  state = inject(PresentationStateService);

  togglePresent() {
    this.state.togglePlayPause();
  }

  updateDuration(sec: number) {
    this.state.durationSeconds.set(Math.max(0, Number(sec) || 0));
  }

  openPopup() {
    this.state.openPresentationWindow();
  }

  progressPercent(): number {
    const total = this.state.durationSeconds();
    if (total <= 0) return 0;
    const remaining = this.state.remainingSeconds();
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  }
}
