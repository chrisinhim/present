import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';
import { HistoryItem, MainTabType } from '../../models/presentation.models';

@Component({
  selector: 'app-history-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-full min-h-[170px] relative overflow-hidden">
      <!-- HEADER -->
      <div class="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-[#13324b] tracking-wide">History section</span>
          @if (filteredHistory().length > 0) {
            <span class="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.2 rounded-full">
              {{ filteredHistory().length }}
            </span>
          }
        </div>

        @if (filteredHistory().length > 0) {
          <button
            (click)="clearAll()"
            title="Clear history"
            class="text-[11px] text-slate-400 hover:text-rose-500 font-medium transition-colors cursor-pointer"
          >
            Clear All
          </button>
        }
      </div>

      <!-- LIST / EMPTY STATE -->
      <div class="flex-1 overflow-y-auto max-h-[170px] p-2 space-y-1.5">
        @if (filteredHistory().length === 0) {
          <div class="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-3 text-slate-400">
            <span class="text-lg opacity-40 mb-1">⏱️</span>
            <p class="text-xs font-medium text-slate-500">No {{ tab() ? tab() + ' ' : '' }}items presented yet</p>
            <p class="text-[10px] text-slate-400">Presented items will appear here for 1-click recall</p>
          </div>
        } @else {
          @for (item of filteredHistory(); track item.id) {
            <div
              (click)="state.presentHistoryItem(item)"
              class="group flex items-center justify-between p-2 rounded-md border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer text-xs"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <!-- Tab Badge -->
                <span
                  [ngClass]="badgeClass(item.tab)"
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase shrink-0"
                >
                  {{ item.tab }}
                </span>

                <!-- Summary Text -->
                <span
                  class="truncate text-slate-700 font-medium group-hover:text-[#13324b]"
                  [title]="item.summary"
                >
                  {{ item.summary }}
                </span>
              </div>

              <!-- Actions & Time -->
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <!-- Quick Present Icon -->
                <button
                  (click)="$event.stopPropagation(); state.presentHistoryItem(item)"
                  title="Present this item"
                  class="w-5 h-5 rounded hover:bg-[#13324b] hover:text-white text-slate-400 flex items-center justify-center transition-colors text-[10px] cursor-pointer"
                >
                  ▶
                </button>

                <!-- Delete Single Item -->
                <button
                  (click)="$event.stopPropagation(); state.removeHistoryItem(item.id)"
                  title="Delete from history"
                  class="w-5 h-5 rounded hover:bg-rose-100 hover:text-rose-600 text-slate-300 flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class HistorySectionComponent {
  readonly state = inject(PresentationStateService);
  readonly tab = input<MainTabType>();

  readonly filteredHistory = computed(() => {
    const currentTab = this.tab();
    if (!currentTab) return this.state.history();
    return this.state.history().filter((item) => item.tab === currentTab);
  });

  clearAll() {
    const currentTab = this.tab();
    if (currentTab) {
      this.state.clearHistoryForTab(currentTab);
    } else {
      this.state.clearHistory();
    }
  }

  badgeClass(tab: MainTabType): string {
    switch (tab) {
      case 'TEXT':
        return 'bg-slate-100 text-slate-700';
      case 'VERSE':
        return 'bg-sky-100 text-sky-800';
      case 'TIMER':
        return 'bg-amber-100 text-amber-800';
      case 'LYRICS':
        return 'bg-purple-100 text-purple-800';
      case 'MEDIA':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  formatTime(timestamp: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
