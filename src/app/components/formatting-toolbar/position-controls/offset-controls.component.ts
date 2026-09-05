import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-offset-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex-1 flex flex-col gap-1.5 p-2 bg-slate-800/60 rounded-xl border border-slate-700">
      <!-- Range X -->
      <div class="flex items-center gap-2 text-xs w-full">
        <span class="text-[10px] text-slate-400 font-semibold w-14 shrink-0 whitespace-nowrap">Offset X:</span>
        <input
          type="range"
          min="-500"
          max="500"
          step="1"
          [ngModel]="state.typography().offsetX"
          (ngModelChange)="setOffset('X', $event)"
          title="Horizontal Offset (-500px to +500px)"
          class="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 w-full"
        />
        <span class="font-mono text-[11px] text-sky-400 w-12 shrink-0 text-right">
          {{ state.typography().offsetX }}px
        </span>
      </div>
      <!-- Range Y -->
      <div class="flex items-center gap-2 text-xs w-full">
        <span class="text-[10px] text-slate-400 font-semibold w-14 shrink-0 whitespace-nowrap">Offset Y:</span>
        <input
          type="range"
          min="-500"
          max="500"
          step="1"
          [ngModel]="state.typography().offsetY"
          (ngModelChange)="setOffset('Y', $event)"
          title="Vertical Offset (-500px to +500px)"
          class="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 w-full"
        />
        <span class="font-mono text-[11px] text-sky-400 w-12 shrink-0 text-right">
          {{ state.typography().offsetY }}px
        </span>
      </div>
    </div>
  `,
})
export class OffsetControlsComponent {
  readonly state = inject(PresentationStateService);

  setOffset(axis: 'X' | 'Y', val: any) {
    const num = Number(val) || 0;
    if (axis === 'X') {
      this.state.updateTypography({ offsetX: num });
    } else {
      this.state.updateTypography({ offsetY: num });
    }
  }
}
