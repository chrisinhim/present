import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { BibleBook } from '../../../models/presentation.models';
import { BookButtonComponent } from './book-button.component';

@Component({
  selector: 'app-book-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookButtonComponent],
  template: `
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span>Select Book (66 Books &bull; Scroll Horizontally)</span>
      </div>
      <div
        #scrollContainer
        (wheel)="scrollHorizontally($event)"
        class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
      >
        @for (book of books(); track book.id) {
          <app-book-button
            [book]="book"
            [categoryClass]="categoryClasses()[book.category]"
            [isSelected]="selectedBook()?.id === book.id"
            (selected)="bookSelected.emit($event)"
          ></app-book-button>
        }
      </div>
    </div>
  `,
})
export class BookPanelComponent {
  readonly books = input.required<readonly BibleBook[]>();
  readonly categoryClasses = input.required<Record<string, string>>();
  readonly selectedBook = input<BibleBook | null>(null);
  readonly bookSelected = output<BibleBook>();
  readonly scrollContainer = viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

  scrollHorizontally(event: WheelEvent) {
    event.preventDefault();
    this.scrollContainer().nativeElement.scrollLeft += event.deltaY || event.deltaX;
  }
}
