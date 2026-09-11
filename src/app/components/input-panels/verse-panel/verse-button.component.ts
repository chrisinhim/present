import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VersePointerEvent {
  verse: number;
  event: MouseEvent;
}

@Component({
  selector: 'app-verse-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (mousedown)="mouseDown.emit({ verse: verse(), event: $event })"
      (mouseenter)="mouseEnter.emit({ verse: verse(), event: $event })"
      (mouseup)="mouseUp.emit()"
      [title]="bookName() + ' ' + chapter() + ':' + verse()"
      [ngClass]="isSelected() ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 scale-105 shadow-md' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'"
      class="min-w-[28px] h-6 px-1.5 rounded text-[11px] font-medium border border-slate-700/60 flex items-center justify-center transition-all shrink-0 cursor-pointer user-select-none"
    >
      {{ verse() }}
    </button>
  `,
})
export class VerseButtonComponent {
  readonly verse = input.required<number>();
  readonly bookName = input.required<string>();
  readonly chapter = input.required<number>();
  readonly isSelected = input(false);
  readonly mouseDown = output<VersePointerEvent>();
  readonly mouseEnter = output<VersePointerEvent>();
  readonly mouseUp = output<void>();
}
