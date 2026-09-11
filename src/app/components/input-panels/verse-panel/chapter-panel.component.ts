import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { BibleBook } from '../../../models/presentation.models';
import { ChapterButtonComponent } from './chapter-button.component';

@Component({
  selector: 'app-chapter-panel',
  standalone: true,
  imports: [ChapterButtonComponent],
  template: `
    @if (book(); as selectedBook) {
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>{{ selectedBook.name }} Chapters ({{ selectedBook.chapters }} &bull; Scroll Horizontally)</span>
        </div>
        <div
          #scrollContainer
          (wheel)="scrollHorizontally($event)"
          class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
        >
          @for (chapter of chapters(); track chapter) {
            <app-chapter-button
              [chapter]="chapter"
              [bookName]="selectedBook.name"
              [isSelected]="selectedChapter() === chapter"
              (selected)="chapterSelected.emit($event)"
            ></app-chapter-button>
          }
        </div>
      </div>
    }
  `,
})
export class ChapterPanelComponent {
  readonly book = input<BibleBook | null>(null);
  readonly chapters = input<readonly number[]>([]);
  readonly selectedChapter = input<number | null>(null);
  readonly chapterSelected = output<number>();
  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scrollHorizontally(event: WheelEvent) {
    event.preventDefault();
    this.scrollContainer()?.nativeElement && (this.scrollContainer()!.nativeElement.scrollLeft += event.deltaY || event.deltaX);
  }
}
