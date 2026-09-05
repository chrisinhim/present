import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { EntryAnimation } from '../../../models/presentation.models';

@Component({
  selector: 'app-entry-animation-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Entry Animation"
        class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
      >
        <span>↗</span>
        <span>Entry</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 flex flex-col gap-0.5 text-xs text-slate-700 max-h-60 overflow-y-auto"
        >
          @for (anim of animations; track anim.id) {
            <button
              (click)="select(anim.id); isOpen.set(false)"
              [ngClass]="state.entryAnimation() === anim.id ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-100'"
              class="w-full text-left px-2 py-1 rounded flex items-center gap-2"
            >
              <span>{{ anim.icon }}</span>
              <span>{{ anim.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class EntryAnimationButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  readonly animations: { id: EntryAnimation; label: string; icon: string }[] = [
    { id: 'none', label: 'None', icon: '⚪' },
    { id: 'fade-in', label: 'Fade In', icon: '✨' },
    { id: 'slide-top', label: 'Slide Top', icon: '⬇️' },
    { id: 'slide-bottom', label: 'Slide Bottom', icon: '⬆️' },
    { id: 'slide-left', label: 'Slide Left', icon: '⬅️' },
    { id: 'slide-right', label: 'Slide Right', icon: '➡️' },
    { id: 'zoom-in', label: 'Zoom In', icon: '🔍' },
    { id: 'zoom-in-bounce', label: 'Zoom Bounce', icon: '🏀' },
    { id: 'flip-x', label: 'Flip X', icon: '🔄' },
    { id: 'flip-y', label: 'Flip Y', icon: '🔃' },
    { id: 'blur-in', label: 'Blur In', icon: '🌫️' },
    { id: 'rotate-in', label: 'Rotate In', icon: '💫' },
    { id: 'exp-h', label: 'Expand H', icon: '↔️' },
    { id: 'exp-v', label: 'Expand V', icon: '↕️' },
    { id: 'wipe-right', label: 'Wipe Right', icon: '👉' },
  ];

  select(id: EntryAnimation) {
    this.state.entryAnimation.set(id);
  }
}
