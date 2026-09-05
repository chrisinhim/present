import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { ExitAnimation } from '../../../models/presentation.models';

@Component({
  selector: 'app-exit-animation-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Exit Animation"
        class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
      >
        <span>↘</span>
        <span>Exit</span>
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
              [ngClass]="state.exitAnimation() === anim.id ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-100'"
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
export class ExitAnimationButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  readonly animations: { id: ExitAnimation; label: string; icon: string }[] = [
    { id: 'none', label: 'None', icon: '⚪' },
    { id: 'fade-out', label: 'Fade Out', icon: '✨' },
    { id: 'slide-bottom', label: 'Slide Bottom', icon: '⬇️' },
    { id: 'slide-top', label: 'Slide Top', icon: '⬆️' },
    { id: 'slide-left', label: 'Slide Left', icon: '⬅️' },
    { id: 'slide-right', label: 'Slide Right', icon: '➡️' },
    { id: 'zoom-out', label: 'Zoom Out', icon: '🔍' },
    { id: 'flip-x-out', label: 'Flip X Out', icon: '🔄' },
    { id: 'flip-y-out', label: 'Flip Y Out', icon: '🔃' },
    { id: 'blur-out', label: 'Blur Out', icon: '🌫️' },
    { id: 'rotate-out', label: 'Rotate Out', icon: '💫' },
    { id: 'con-h', label: 'Contract H', icon: '↔️' },
    { id: 'con-v', label: 'Contract V', icon: '↕️' },
    { id: 'wipe-left', label: 'Wipe Left', icon: '👈' },
  ];

  select(id: ExitAnimation) {
    this.state.exitAnimation.set(id);
  }
}

