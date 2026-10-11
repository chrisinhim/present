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
      [title]="buttonTitle()"
      [attr.aria-label]="buttonTitle()"
      class="h-7 px-1.5 flex items-center gap-1 rounded transition-colors"
      [ngClass]="isHighlightActive() ? 'bg-sky-50 hover:bg-sky-100 ring-1 ring-sky-300' : 'hover:bg-slate-100'"
    >
      <div class="flex flex-col items-center leading-none">
        <span class="text-xs font-serif font-bold text-slate-800">ab</span>
        @if (isHighlightActive()) {
          <span
            class="w-full h-1 rounded-full"
            [ngStyle]="highlightStyle()"
          ></span>
        } @else {
          <span class="w-full h-0.5 rounded-full bg-slate-300 mt-0.5"></span>
        }
      </div>
      <span class="text-[9px] text-slate-500">▾</span>
    </button>
  `,
})
export class HighlightButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly openModal = output<void>();

  readonly isHighlightActive = computed(() => {
    const hl = this.state.typography().highlight;
    return !!hl && hl.type !== 'none';
  });

  readonly highlightStyle = computed(() => {
    const hl = this.state.typography().highlight;
    if (!hl || hl.type === 'none') return {};
    if (hl.type === 'solid') return { 'background-color': hl.color || '#facc15' };
    if (hl.type === 'gradient') return { 'background-image': hl.gradient || 'linear-gradient(135deg, #F59E0B, #EF4444)' };
    if (hl.type === 'picture' && hl.mediaUrl) return { 'background-image': `url("${hl.mediaUrl}")`, 'background-size': 'cover' };
    if (hl.type === 'video') return { 'background-color': '#a855f7' };
    return { 'background-color': '#facc15' };
  });

  readonly buttonTitle = computed(() => {
    const hl = this.state.typography().highlight;
    if (!hl || hl.type === 'none') return 'Text Background (Off)';
    const typeLabel = hl.type.charAt(0).toUpperCase() + hl.type.slice(1);
    return `Text Background (${typeLabel})`;
  });
}
