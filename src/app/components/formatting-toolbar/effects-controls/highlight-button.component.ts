import { Component, ChangeDetectionStrategy, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-highlight-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="openModal.emit()"
      title="Text Highlight Color"
      class="h-7 px-1.5 flex items-center gap-1 rounded hover:bg-slate-100 transition-colors"
    >
      <div class="flex flex-col items-center leading-none">
        <span class="text-xs font-serif font-bold text-slate-800">ab</span>
        <span
          class="w-full h-1 rounded-full"
          [style.background-color]="highlightColor()"
        ></span>
      </div>
      <span class="text-[9px] text-slate-500">▾</span>
    </button>
  `,
})
export class HighlightButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly openModal = output<void>();

  readonly highlightColor = computed(() => {
    const hl = this.state.typography().highlight;
    if (hl && hl.type === 'solid' && hl.color) return hl.color;
    return '#facc15'; // Default yellow highlight bar
  });
}
