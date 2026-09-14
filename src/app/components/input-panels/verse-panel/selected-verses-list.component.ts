import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectedVerseItem {
  verseNum: number;
  ref: string;
  text: string;
}

@Component({
  selector: 'app-selected-verses-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-300">Scripture Verses List ({{ items().length }} selected)</span>
          <span class="text-[10px] text-slate-500">Click any verse below to present it individually</span>
        </div>
        @if (items().length > 1) {
          <button
            (click)="presentAll.emit()"
            class="px-3 py-1 bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-bold rounded-lg transition-colors"
          >
            ▶ Present All (Combined)
          </button>
        }
      </div>

      @if (items().length > 0) {
        <div class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          @for (item of items(); track item.ref) {
            <div
              (click)="verseSelected.emit(item)"
              [ngClass]="
                activeVerseRef() === item.ref && isPresented()
                  ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-400'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              "
              class="p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5">
                  <span
                    class="w-2 h-2 rounded-full"
                    [ngClass]="activeVerseRef() === item.ref && isPresented() ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'"
                  ></span>
                  {{ item.ref }}
                </span>
                <button
                  (click)="verseSelected.emit(item); $event.stopPropagation()"
                  class="px-2.5 py-0.5 rounded bg-slate-800 group-hover:bg-sky-600 text-slate-300 group-hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>▶ Present</span>
                </button>
              </div>
              <p class="text-slate-200 text-sm leading-relaxed">{{ item.text }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          Select one or more verses above (click, drag, or Shift/Ctrl click) to preview and present them here.
        </div>
      }
    </div>
  `,
})
export class SelectedVersesListComponent {
  readonly items = input.required<readonly SelectedVerseItem[]>();
  readonly activeVerseRef = input<string | undefined>();
  readonly isPresented = input(false);

  readonly verseSelected = output<SelectedVerseItem>();
  readonly presentAll = output<void>();
}
