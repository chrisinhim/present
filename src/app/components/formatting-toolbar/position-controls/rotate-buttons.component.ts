import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-rotate-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Rotation and Flip Options"
        class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
      >
        <span class="text-sm">⟳</span>
        <span>Rotate</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-44 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 flex flex-col gap-1 text-xs text-slate-700"
        >
          <button
            (click)="rotate(90); isOpen.set(false)"
            class="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Rotate 90° Clockwise</span>
            <span class="text-slate-400 font-mono">↷ 90°</span>
          </button>
          <button
            (click)="rotate(-90); isOpen.set(false)"
            class="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Rotate 90° CCW</span>
            <span class="text-slate-400 font-mono">↶ 90°</span>
          </button>
          <div class="h-px bg-slate-200 my-0.5"></div>
          <button
            (click)="toggleFlip('H'); isOpen.set(false)"
            class="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Flip Horizontal</span>
            <span class="text-slate-400 font-mono">⇄</span>
          </button>
          <button
            (click)="toggleFlip('V'); isOpen.set(false)"
            class="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Flip Vertical</span>
            <span class="text-slate-400 font-mono">⇅</span>
          </button>
          <div class="h-px bg-slate-200 my-0.5"></div>
          <button
            (click)="reset(); isOpen.set(false)"
            class="w-full text-left px-2.5 py-1.5 rounded text-rose-600 hover:bg-rose-50 flex items-center justify-between font-semibold"
          >
            <span>Reset Rotation</span>
            <span>⟲</span>
          </button>
        </div>
      }
    </div>
  `,
})
export class RotateButtonsComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  rotate(deltaDeg: number) {
    const current = this.state.typography().rotationAngle || 0;
    const normalized = (((current + deltaDeg) % 360) + 360) % 360;
    this.state.updateTypography({ rotationAngle: normalized });
  }

  toggleFlip(axis: 'H' | 'V') {
    if (axis === 'H') {
      this.state.updateTypography({ flipH: !this.state.typography().flipH });
    } else {
      this.state.updateTypography({ flipV: !this.state.typography().flipV });
    }
  }

  reset() {
    this.state.updateTypography({ rotationAngle: 0, flipH: false, flipV: false });
  }
}
