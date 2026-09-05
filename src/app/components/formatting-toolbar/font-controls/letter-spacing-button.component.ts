import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-letter-spacing-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Character Spacing (A↔V)"
        class="h-7 px-1.5 flex items-center gap-0.5 rounded hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
      >
        <span>A↔V</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-36 bg-white border border-slate-200 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 text-xs text-slate-700"
        >
          @for (opt of options; track opt.value) {
            <button
              (click)="selectSpacing(opt.value)"
              [ngClass]="state.typography().letterSpacing === opt.value ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-100'"
              class="w-full text-left px-2 py-1.5 rounded flex items-center justify-between"
            >
              <span>{{ opt.label }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ opt.value }}px</span>
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class LetterSpacingButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  readonly options = [
    { label: 'Very Tight', value: -2 },
    { label: 'Tight', value: -1 },
    { label: 'Normal', value: 0 },
    { label: 'Loose', value: 2 },
    { label: 'Very Loose', value: 4 },
  ];

  selectSpacing(val: number) {
    this.state.updateTypography({ letterSpacing: val });
    this.isOpen.set(false);
  }
}

