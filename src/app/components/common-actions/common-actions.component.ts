import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideButtonComponent } from './hide-button.component';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-common-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HideButtonComponent],
  template: `
    <div
      class="bg-white border border-slate-200 rounded-lg px-1 py-0.5 shadow-xs flex items-center gap-1 text-slate-700"
    >
      <!-- SEEKBAR / PROGRESS RAIL -->
      <div class="flex-1 relative flex items-center h-5 px-1">
        <div
          class="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative cursor-pointer"
          (click)="onSeekbarClick($event)"
          title="Presentation Progress Rail"
        >
          <div
            class="h-full bg-[#13324b] rounded-full transition-all duration-200"
            [style.width.%]="progressPercent()"
          ></div>
        </div>
      </div>

      <!-- HIDE BUTTON [✕] -->
      <app-hide-button />
    </div>
  `,
})
export class CommonActionsComponent {
  readonly state = inject(PresentationStateService);

  progressPercent(): number {
    const total = this.state.durationSeconds();
    if (total <= 0) return 0;
    const remaining = this.state.remainingSeconds();
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  }

  onSeekbarClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const total = this.state.durationSeconds();
    if (total > 0) {
      // Seek remaining time
      const elapsed = Math.round(ratio * total);
      this.state.remainingSeconds.set(Math.max(0, total - elapsed));
    }
  }
}
