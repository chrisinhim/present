import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-h-align-adjustment-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-0.5">
      <span class="text-xs font-bold text-slate-800 select-none w-2.5 text-center">H</span>
      <!-- Stepper Box -->
      <div class="flex items-center h-6.5 bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
        <input
          type="number"
          min="-500"
          max="500"
          [ngModel]="state.typography().offsetX"
          (ngModelChange)="updateOffsetX($event)"
          title="Horizontal Alignment Adjustment (px)"
          class="w-7 text-center text-xs font-medium text-slate-800 focus:outline-none"
        />
        <div class="flex flex-col border-l border-slate-200 h-full justify-center">
          <button
            (click)="adjustOffsetX(1)"
            title="Nudge right"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▲
          </button>
          <button
            (click)="adjustOffsetX(-1)"
            title="Nudge left"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  `,
})
export class HAlignAdjustmentButtonComponent {
  readonly state = inject(PresentationStateService);

  updateOffsetX(val: number) {
    const offsetX = Number(val) || 0;
    this.state.updateTypography({ offsetX });
  }

  adjustOffsetX(delta: number) {
    const current = this.state.typography().offsetX || 0;
    this.updateOffsetX(current + delta);
  }
}
