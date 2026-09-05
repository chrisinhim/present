import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-line-spacing-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-0.5">
      <span class="text-xs font-bold text-slate-800 select-none">LS</span>
      <!-- Stepper Box -->
      <div class="flex items-center h-7 bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
        <input
          type="number"
          min="8"
          max="250"
          [ngModel]="state.typography().lineSpacing || 58"
          (ngModelChange)="updateLineSpacing($event)"
          title="Line Spacing (px)"
          class="w-7 text-center text-xs font-medium text-slate-800 focus:outline-none"
        />
        <div class="flex flex-col border-l border-slate-200 h-full justify-center">
          <button
            (click)="adjustLineSpacing(1)"
            title="Increase line spacing"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▲
          </button>
          <button
            (click)="adjustLineSpacing(-1)"
            title="Decrease line spacing"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  `,
})
export class LineSpacingButtonComponent {
  readonly state = inject(PresentationStateService);

  updateLineSpacing(val: number) {
    const lineSpacing = Math.max(8, Math.min(250, Number(val) || 58));
    this.state.updateTypography({ lineSpacing });
  }

  adjustLineSpacing(delta: number) {
    const current = this.state.typography().lineSpacing || 58;
    this.updateLineSpacing(current + delta);
  }
}
