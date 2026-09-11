import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleBook } from '../../../models/presentation.models';

@Component({
  selector: 'app-book-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="selected.emit(book())"
      [title]="book().name + ' (' + book().category + ' - ' + book().chapters + ' ch)'"
      [ngClass]="[
        isSelected() ? 'ring-2 ring-sky-400 bg-sky-600 text-white font-bold scale-105 z-10 shadow-md' : 'opacity-85 hover:opacity-100 hover:scale-105',
        categoryClass()
      ]"
      class="px-2 py-0.5 rounded text-[11px] font-medium border text-center transition-all shrink-0 cursor-pointer"
    >
      {{ book().abbrev }}
    </button>
  `,
})
export class BookButtonComponent {
  readonly book = input.required<BibleBook>();
  readonly categoryClass = input('');
  readonly isSelected = input(false);
  readonly selected = output<BibleBook>();
}
