import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { TextAlignment, VerticalAlignment } from '../../../models/presentation.models';

interface AlignCell {
  v: VerticalAlignment;
  h: TextAlignment;
  title: string;
}

@Component({
  selector: 'app-quick-align-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      title="Quick Align (3x3 Matrix)"
      class="bg-white border border-slate-300 rounded shadow-xs p-0.5 flex flex-col gap-0.5"
    >
      @for (row of grid; track $index) {
        <div class="flex items-center gap-0.5">
          @for (cell of row; track cell.v + '-' + cell.h) {
            <button
              (click)="setAlign(cell.v, cell.h)"
              [title]="cell.title"
              [ngClass]="
                isActive(cell.v, cell.h)
                  ? 'bg-sky-100 text-sky-700 border-sky-300'
                  : 'text-slate-500 hover:bg-slate-100 border-transparent'
              "
              class="w-4.5 h-4 sm:w-5 sm:h-4.5 rounded border flex items-center justify-center transition-colors cursor-pointer"
            >
              @if (cell.h === 'left') {
                <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/>
                </svg>
              } @else if (cell.h === 'center') {
                <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 5h18v2H3V5zm3 4h12v2H6V9zm-3 4h18v2H3v-2zm3 4h12v2H6v-2z"/>
                </svg>
              } @else {
                <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 5h18v2H3V5zm6 4h12v2H9V9zm-6 4h18v2H3v-2zm6 4h12v2H9v-2z"/>
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class QuickAlignButtonComponent {
  readonly state = inject(PresentationStateService);

  readonly grid: AlignCell[][] = [
    [
      { v: 'top', h: 'left', title: 'Top Left' },
      { v: 'top', h: 'center', title: 'Top Center' },
      { v: 'top', h: 'right', title: 'Top Right' },
    ],
    [
      { v: 'middle', h: 'left', title: 'Middle Left' },
      { v: 'middle', h: 'center', title: 'Middle Center' },
      { v: 'middle', h: 'right', title: 'Middle Right' },
    ],
    [
      { v: 'bottom', h: 'left', title: 'Bottom Left' },
      { v: 'bottom', h: 'center', title: 'Bottom Center' },
      { v: 'bottom', h: 'right', title: 'Bottom Right' },
    ],
  ];

  isActive(v: VerticalAlignment, h: TextAlignment): boolean {
    const typo = this.state.typography();
    return typo.verticalAlignment === v && typo.alignment === h;
  }

  setAlign(verticalAlignment: VerticalAlignment, alignment: TextAlignment) {
    this.state.updateTypography({ verticalAlignment, alignment });
  }
}
