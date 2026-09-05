import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-hide-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="state.hide()"
      title="Hide Content (Esc)"
      class="w-20 h-5 rounded bg-[#13324b] hover:bg-[#0e2437] text-white flex items-center justify-center text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
    >
      <span>HIDE (ESC)</span>
    </button>
  `,
})
export class HideButtonComponent {
  readonly state = inject(PresentationStateService);
}

