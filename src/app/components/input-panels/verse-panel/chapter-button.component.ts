import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="selected.emit(chapter())"
      [title]="bookName() + ' Chapter ' + chapter()"
      [ngClass]="isSelected() ? 'bg-sky-600 text-white font-bold ring-2 ring-sky-400 scale-105 shadow-md' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'"
      class="min-w-[28px] h-6 px-1.5 rounded text-[11px] font-medium border border-slate-700/60 flex items-center justify-center transition-all shrink-0 cursor-pointer"
    >
      {{ chapter() }}
    </button>
  `,
})
export class ChapterButtonComponent {
  readonly chapter = input.required<number>();
  readonly bookName = input.required<string>();
  readonly isSelected = input(false);
  readonly selected = output<number>();
}
