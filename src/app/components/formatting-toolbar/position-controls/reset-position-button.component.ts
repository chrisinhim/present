import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-reset-position-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col justify-end shrink-0">
      <button
        (click)="resetLayoutAndTransforms()"
        title="Reset Position (0,0), Rotation (0°), Flipping, and Alignment (Center)"
        class="px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
      >
        <span class="text-sm font-bold">⟲</span>
        <span>Reset</span>
      </button>
    </div>
  `,
})
export class ResetPositionButtonComponent {
  readonly state = inject(PresentationStateService);

  resetLayoutAndTransforms() {
    this.state.updateTypography({
      alignment: 'center',
      verticalAlignment: 'middle',
      rotationAngle: 0,
      flipH: false,
      flipV: false,
      offsetX: 0,
      offsetY: 0,
    });
  }
}
