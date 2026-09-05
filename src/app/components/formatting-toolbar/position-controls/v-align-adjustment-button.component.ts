import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-v-align-adjustment-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-0.5">
      <span class="text-xs font-bold text-slate-800 select-none w-2.5 text-center">V</span>
      <!-- Stepper Box -->
      <div class="flex items-center h-6.5 bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
        <input
          type="number"
          min="-500"
          max="500"
          [ngModel]="state.typography().offsetY"
          (ngModelChange)="updateOffsetY($event)"
          title="Vertical Alignment Adjustment (px)"
          class="w-7 text-center text-xs font-medium text-slate-800 focus:outline-none"
        />
        <div class="flex flex-col border-l border-slate-200 h-full justify-center">
          <button
            (click)="adjustOffsetY(1)"
            title="Nudge down"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▲
          </button>
          <button
            (click)="adjustOffsetY(-1)"
            title="Nudge up"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  `,
})
export class VAlignAdjustmentButtonComponent {
  readonly state = inject(PresentationStateService);

  updateOffsetY(val: number) {
    const offsetY = Number(val) || 0;
    this.state.updateTypography({ offsetY });
  }

  adjustOffsetY(delta: number) {
    const current = this.state.typography().offsetY || 0;
    this.updateOffsetY(current + delta);
  }
}
