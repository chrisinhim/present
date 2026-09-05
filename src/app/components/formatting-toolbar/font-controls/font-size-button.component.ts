import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-font-size-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-0.5">
      <!-- Stepper Box -->
      <div class="flex items-center h-7 bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
        <input
          type="number"
          min="8"
          max="120"
          [ngModel]="state.typography().fontSize"
          (ngModelChange)="updateFontSize($event)"
          class="w-7 sm:w-8 text-center text-xs font-medium text-slate-800 focus:outline-none"
        />
        <div class="flex flex-col border-l border-slate-200 h-full justify-center">
          <button
            (click)="adjustFontSize(1)"
            title="Increase font size"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▲
          </button>
          <button
            (click)="adjustFontSize(-1)"
            title="Decrease font size"
            class="text-[7px] text-slate-500 hover:text-slate-900 px-0.5 leading-none hover:bg-slate-100 cursor-pointer"
          >
            ▼
          </button>
        </div>
      </div>

      <!-- A ▲ and A ▼ buttons -->
      <button
        (click)="adjustFontSize(2)"
        title="Increase font size"
        class="h-7 px-1 flex items-center gap-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
      >
        <span>A</span><span class="text-[7px]">▲</span>
      </button>
      <button
        (click)="adjustFontSize(-2)"
        title="Decrease font size"
        class="h-7 px-1 flex items-center gap-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
      >
        <span>A</span><span class="text-[7px]">▼</span>
      </button>
    </div>
  `,
})
export class FontSizeButtonComponent {
  readonly state = inject(PresentationStateService);

  updateFontSize(val: number) {
    const fontSize = Math.max(8, Math.min(120, Number(val) || 48));
    this.state.updateTypography({ fontSize });
  }

  adjustFontSize(delta: number) {
    const current = this.state.typography().fontSize || 48;
    this.updateFontSize(current + delta);
  }
}
