import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-align-h-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex items-center h-7 bg-white rounded border border-slate-300 shadow-sm overflow-hidden p-0.5">
      <!-- Left Align -->
      <button
        (click)="setAlignment('left')"
        [ngClass]="
          state.typography().alignment === 'left'
            ? 'bg-sky-100 text-sky-700 font-bold'
            : 'text-slate-600 hover:bg-slate-100'
        "
        title="Align Left"
        class="h-full px-1.5 rounded flex items-center justify-center transition-colors"
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/>
        </svg>
      </button>

      <!-- Center Align -->
      <button
        (click)="setAlignment('center')"
        [ngClass]="
          state.typography().alignment === 'center'
            ? 'bg-sky-100 text-sky-700 font-bold'
            : 'text-slate-600 hover:bg-slate-100'
        "
        title="Align Center"
        class="h-full px-1.5 rounded flex items-center justify-center transition-colors"
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M3 5h18v2H3V5zm3 4h12v2H6V9zm-3 4h18v2H3v-2zm3 4h12v2H6v-2z"/>
        </svg>
      </button>

      <!-- Right Align -->
      <button
        (click)="setAlignment('right')"
        [ngClass]="
          state.typography().alignment === 'right'
            ? 'bg-sky-100 text-sky-700 font-bold'
            : 'text-slate-600 hover:bg-slate-100'
        "
        title="Align Right"
        class="h-full px-1.5 rounded flex items-center justify-center transition-colors"
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M3 5h18v2H3V5zm6 4h12v2H9V9zm-6 4h18v2H3v-2zm6 4h12v2H9v-2z"/>
        </svg>
      </button>
    </div>
  `,
})
export class AlignHButtonsComponent {
  readonly state = inject(PresentationStateService);

  setAlignment(alignment: 'left' | 'center' | 'right') {
    this.state.updateTypography({ alignment });
  }
}
