import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { VerticalAlignment } from '../../../models/presentation.models';

@Component({
  selector: 'app-align-v-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1 shrink-0">
      <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Vertical</span>
      <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
        <button
          (click)="setVerticalAlignment('top')"
          [ngClass]="
            state.typography().verticalAlignment === 'top'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          title="Align Top"
          class="w-7 h-7 rounded text-xs flex items-center justify-center transition-colors"
        >
          ⤒
        </button>
        <button
          (click)="setVerticalAlignment('middle')"
          [ngClass]="
            state.typography().verticalAlignment === 'middle'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          title="Align Middle"
          class="w-7 h-7 rounded text-xs flex items-center justify-center transition-colors"
        >
          ⬍
        </button>
        <button
          (click)="setVerticalAlignment('bottom')"
          [ngClass]="
            state.typography().verticalAlignment === 'bottom'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          title="Align Bottom"
          class="w-7 h-7 rounded text-xs flex items-center justify-center transition-colors"
        >
          ⤓
        </button>
      </div>
    </div>
  `,
})
export class AlignVButtonsComponent {
  readonly state = inject(PresentationStateService);

  setVerticalAlignment(verticalAlignment: VerticalAlignment) {
    this.state.updateTypography({ verticalAlignment });
  }
}
