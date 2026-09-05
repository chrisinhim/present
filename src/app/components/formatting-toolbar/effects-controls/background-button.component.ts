import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-background-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="openModal.emit()"
      title="Presentation Background (Color, Gradient, Image, Video)"
      class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
    >
      <span class="text-sm">▨</span>
      <span>Background</span>
      <span class="text-[9px] text-slate-400">▾</span>
    </button>
  `,
})
export class BackgroundButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly openModal = output<void>();
}
