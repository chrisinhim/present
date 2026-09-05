import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../services/presentation-state.service';
import { PresentButtonComponent } from './present-button.component';

@Component({
  selector: 'app-present-duration-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, PresentButtonComponent],
  template: `
    <div class="flex items-center gap-2 shrink-0">
      <!-- Play / Pause Present Button -->
      <app-present-button />

      <!-- Duration Number Box [ 5 ] -->
      <input
        type="number"
        min="0"
        max="3600"
        [ngModel]="state.durationSeconds()"
        (ngModelChange)="updateDuration($event)"
        title="Duration in seconds (0 = manual / stay until hidden)"
        class="w-12 h-9 border border-slate-300 rounded-md bg-white text-center text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#13324b] focus:ring-1 focus:ring-[#13324b] shadow-xs transition-all"
      />
    </div>
  `,
})
export class PresentDurationControlsComponent {
  readonly state = inject(PresentationStateService);

  updateDuration(sec: number) {
    this.state.durationSeconds.set(Math.max(0, Number(sec) || 0));
  }
}
