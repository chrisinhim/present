import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BibleBook } from '../../../models/presentation.models';
import { BookPanelComponent } from './book-panel.component';
import { ChapterPanelComponent } from './chapter-panel.component';
import { VersePanelListComponent } from './verse-panel-list.component';
import { VersePointerEvent } from './verse-button.component';

@Component({
  selector: 'app-verse-reference-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookPanelComponent, ChapterPanelComponent, VersePanelListComponent],
  template: `
    <app-book-panel
      [books]="books()"
      [categoryClasses]="categoryClasses()"
      [selectedBook]="selectedBook()"
      (bookSelected)="bookSelected.emit($event)"
    ></app-book-panel>

    <app-chapter-panel
      [book]="selectedBook()"
      [chapters]="chapters()"
      [selectedChapter]="selectedChapter()"
      (chapterSelected)="chapterSelected.emit($event)"
    ></app-chapter-panel>

    <app-verse-panel-list
      [book]="selectedBook()"
      [chapter]="selectedChapter()"
      [verses]="verses()"
      [selectedVerses]="selectedVerses()"
      (mouseDown)="verseMouseDown.emit($event)"
      (mouseEnter)="verseMouseEnter.emit($event)"
      (mouseUp)="verseMouseUp.emit()"
      (versesCleared)="versesCleared.emit()"
    ></app-verse-panel-list>
  `,
})
export class VerseReferencePickerComponent {
  readonly books = input.required<readonly BibleBook[]>();
  readonly categoryClasses = input.required<Record<string, string>>();
  readonly selectedBook = input<BibleBook | null>(null);
  readonly chapters = input<readonly number[]>([]);
  readonly selectedChapter = input<number | null>(null);
  readonly verses = input<readonly number[]>([]);
  readonly selectedVerses = input<readonly number[]>([]);

  readonly bookSelected = output<BibleBook>();
  readonly chapterSelected = output<number>();
  readonly verseMouseDown = output<VersePointerEvent>();
  readonly verseMouseEnter = output<VersePointerEvent>();
  readonly verseMouseUp = output<void>();
  readonly versesCleared = output<void>();
}
