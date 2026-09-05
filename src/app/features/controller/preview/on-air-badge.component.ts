import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-on-air-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-slate-600/70 bg-slate-900/40 text-[11px] font-sans tracking-wide text-slate-300"
    >
      @if (isPresented()) {
        @if (isPaused()) {
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span class="text-amber-300 font-semibold text-[10px]">PAUSED</span>
        } @else {
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span class="text-rose-300 font-semibold text-[10px]">LIVE ON AIR</span>
        }

        @if (remainingSeconds() > 0) {
          <span class="text-slate-400 font-mono text-[10px]">({{ remainingSeconds() }}s)</span>
        }
      } @else {
        <span class="text-slate-300 text-[10px] tracking-widest uppercase font-medium">LIVE PREVIEW</span>
      }
    </div>
  `,
})
export class OnAirBadgeComponent {
  readonly isPresented = input<boolean>(false);
  readonly isPaused = input<boolean>(false);
  readonly remainingSeconds = input<number>(0);
  readonly isDirty = input<boolean>(false);
}
