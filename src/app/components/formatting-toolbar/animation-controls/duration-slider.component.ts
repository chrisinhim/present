import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-duration-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1">
      <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Transition Speed (ms)</span>
      <div class="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5">
        <input
          type="number"
          min="50"
          max="10000"
          step="50"
          [ngModel]="state.animationDurationMs()"
          (ngModelChange)="updateAnimDuration($event)"
          title="Animation duration in milliseconds"
          class="w-14 bg-transparent text-center text-xs font-bold text-sky-400 focus:outline-none"
        />
        <span class="text-[10px] text-slate-400 font-mono">ms</span>
      </div>
    </div>
  `,
})
export class DurationSliderComponent {
  readonly state = inject(PresentationStateService);

  updateAnimDuration(val: any) {
    const ms = Math.max(50, Math.min(10000, Number(val) || 400));
    this.state.animationDurationMs.set(ms);
  }
}
