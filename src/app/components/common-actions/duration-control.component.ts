import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-duration-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  host: {
    class: 'flex-1 flex items-center min-w-0',
  },
  template: `
    <div class="w-full flex items-center gap-3">
      <!-- Animated Seek / Progress Slider Rail -->
      <div class="flex-1 relative flex items-center h-5">
        <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            class="h-full bg-slate-400 rounded-full transition-all duration-200"
            [style.width.%]="progressPercent()"
          ></div>
        </div>
      </div>

      <!-- Duration Number Box [ 30 ] -->
      <input
        type="number"
        min="0"
        max="3600"
        [ngModel]="state.durationSeconds()"
        (ngModelChange)="updateDuration($event)"
        title="Duration in seconds (0 = manual)"
        class="w-12 h-9 border border-slate-300 rounded bg-white text-center text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 shadow-xs"
      />
    </div>
  `,
})
export class DurationControlComponent {
  readonly state = inject(PresentationStateService);

  updateDuration(sec: number) {
    this.state.durationSeconds.set(Math.max(0, Number(sec) || 0));
  }

  progressPercent(): number {
    const total = this.state.durationSeconds();
    if (total <= 0) return 0;
    const remaining = this.state.remainingSeconds();
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  }
}

