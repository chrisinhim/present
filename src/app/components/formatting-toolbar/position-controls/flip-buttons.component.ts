import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-flip-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1 shrink-0">
      <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Flip</span>
      <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
        <button
          (click)="toggleFlip('H')"
          [ngClass]="
            state.typography().flipH
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:bg-slate-700'
          "
          title="Flip Horizontal"
          class="px-1.5 py-1 text-xs rounded transition-colors"
        >
          ⇄
        </button>
        <button
          (click)="toggleFlip('V')"
          [ngClass]="
            state.typography().flipV
              ? 'bg-sky-600 text-white'
              : 'text-slate-400 hover:bg-slate-700'
          "
          title="Flip Vertical"
          class="px-1.5 py-1 text-xs rounded transition-colors"
        >
          ⇅
        </button>
      </div>
    </div>
  `,
})
export class FlipButtonsComponent {
  readonly state = inject(PresentationStateService);

  toggleFlip(axis: 'H' | 'V') {
    if (axis === 'H') {
      this.state.updateTypography({ flipH: !this.state.typography().flipH });
    } else {
      this.state.updateTypography({ flipV: !this.state.typography().flipV });
    }
  }
}
