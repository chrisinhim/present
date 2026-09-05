import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-reset-formatting-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="state.clearFormatting()"
      title="Clear All Formatting"
      class="relative h-7 w-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 transition-colors"
    >
      <span class="text-xs font-serif font-bold">A</span>
      <span class="absolute inset-x-1 top-1/2 h-0.5 bg-rose-500 -rotate-45 rounded"></span>
    </button>
  `,
})
export class ResetFormattingButtonComponent {
  readonly state = inject(PresentationStateService);
}
