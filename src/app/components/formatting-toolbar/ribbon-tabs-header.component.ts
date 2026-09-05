import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type RibbonTabType = 'home' | 'effects' | 'layout' | 'animations';

@Component({
  selector: 'app-ribbon-tabs-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center gap-1 bg-slate-950 px-3 pt-2 border-b border-slate-800 select-none overflow-x-auto scrollbar-none whitespace-nowrap"
    >
      <button
        (click)="tabChange.emit('home')"
        [ngClass]="
          activeTab() === 'home'
            ? 'bg-slate-900 text-sky-400 font-bold border-b-2 border-sky-500'
            : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
        "
        class="px-4 py-1.5 text-xs rounded-t-lg transition-colors flex items-center gap-1.5 shrink-0"
      >
        <span>🔤</span>
        <span>Font</span>
      </button>

      <button
        (click)="tabChange.emit('effects')"
        [ngClass]="
          activeTab() === 'effects'
            ? 'bg-slate-900 text-sky-400 font-bold border-b-2 border-sky-500'
            : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
        "
        class="px-4 py-1.5 text-xs rounded-t-lg transition-colors flex items-center gap-1.5 shrink-0"
      >
        <span>✨</span>
        <span>Effects</span>
        @if (hasActiveEffects()) {
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        }
      </button>

      <button
        (click)="tabChange.emit('layout')"
        [ngClass]="
          activeTab() === 'layout'
            ? 'bg-slate-900 text-sky-400 font-bold border-b-2 border-sky-500'
            : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
        "
        class="px-4 py-1.5 text-xs rounded-t-lg transition-colors flex items-center gap-1.5 shrink-0"
      >
        <span>📐</span>
        <span>Position</span>
      </button>

      <button
        (click)="tabChange.emit('animations')"
        [ngClass]="
          activeTab() === 'animations'
            ? 'bg-slate-900 text-sky-400 font-bold border-b-2 border-sky-500'
            : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
        "
        class="px-4 py-1.5 text-xs rounded-t-lg transition-colors flex items-center gap-1.5 shrink-0"
      >
        <span>🎬</span>
        <span>Animation</span>
      </button>
    </div>
  `,
})
export class RibbonTabsHeaderComponent {
  readonly activeTab = input.required<RibbonTabType>();
  readonly hasActiveEffects = input<boolean>(false);
  readonly tabChange = output<RibbonTabType>();
}
