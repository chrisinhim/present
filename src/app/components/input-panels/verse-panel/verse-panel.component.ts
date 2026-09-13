import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { BibleService } from '../../../services/bible.service';
import { BibleBook } from '../../../models/presentation.models';
import { HistorySectionComponent } from '../../history-section/history-section.component';
import { VerseToolbarComponent } from './verse-toolbar.component';
import { VerseReferencePickerComponent } from './verse-reference-picker.component';
import { SelectedVersesListComponent } from './selected-verses-list.component';

@Component({
  selector: 'app-verse-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    HistorySectionComponent,
    VerseToolbarComponent,
    VerseReferencePickerComponent,
    SelectedVersesListComponent,
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
      <!-- LEFT: VERSE SELECTION & CONTROLS -->
      <div class="md:col-span-7 flex flex-col gap-4 min-w-0">
        <app-verse-toolbar
          [mode]="verseMode()"
          [translation]="selectedTranslation()"
          [translations]="bibleTranslations"
          [canPresent]="!!selectedBook() && !!selectedChapter()"
          (modeChange)="verseMode.set($event)"
          (translationChange)="onTranslationChange($event)"
          (present)="presentVerse()"
        ></app-verse-toolbar>

      <app-verse-reference-picker
        [books]="allBooks"
        [categoryClasses]="categoryClasses"
        [selectedBook]="selectedBook()"
        [chapters]="chapterList()"
        [selectedChapter]="selectedChapter()"
        [verses]="verseList()"
        [selectedVerses]="selectedVerses()"
        (bookSelected)="selectBook($event)"
        (chapterSelected)="selectChapter($event)"
        (verseMouseDown)="onVerseMouseDown($event.verse, $event.event)"
        (verseMouseEnter)="onVerseMouseEnter($event.verse, $event.event)"
        (verseMouseUp)="onVerseMouseUp()"
        (versesCleared)="clearVerseSelection()"
      ></app-verse-reference-picker>

      @if (verseMode() === 'QUOTE') {
        <app-selected-verses-list
          [items]="selectedVerseItems()"
          [activeVerseRef]="state.activeContent().verseRef"
          [isPresented]="state.isPresented()"
          (verseSelected)="presentSingleVerse($event)"
          (presentAll)="presentAllSelectedVerses()"
        ></app-selected-verses-list>
      }

      </div>

      <!-- RIGHT: VERSE-SPECIFIC HISTORY SECTION -->
      <div class="md:col-span-5">
        <app-history-section [tab]="'VERSE'"></app-history-section>
      </div>
    </div>
  `,
})
export class VersePanelComponent {
  readonly state = inject(PresentationStateService);
  readonly bibleService = inject(BibleService);

  readonly allBooks = this.bibleService.getBooks();
  readonly categoryClasses = this.bibleService.getCategoryColors();

  bibleTranslations = [
    { id: 'KJV', abbrev: 'KJV', name: 'King James Version' },
    { id: 'NIV', abbrev: 'NIV', name: 'New International Version' },
    { id: 'ESV', abbrev: 'ESV', name: 'English Standard Version' },
    { id: 'NKJV', abbrev: 'NKJV', name: 'New King James Version' },
    { id: 'NLT', abbrev: 'NLT', name: 'New Living Translation' },
    { id: 'NASB', abbrev: 'NASB', name: 'New American Standard Bible' },
    { id: 'ASV', abbrev: 'ASV', name: 'American Standard Version' },
    { id: 'WEB', abbrev: 'WEB', name: 'World English Bible' },
  ];

  selectedTranslation = signal<string>('KJV');
  verseMode = signal<'QUOTE' | 'REFER'>('QUOTE');
  selectedBook = signal<BibleBook | null>(this.allBooks[42]); // John default
  selectedChapter = signal<number>(3);
  selectedVerses = signal<number[]>([]);
  fetchedQuoteText = signal<string>(
    'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  );

  onTranslationChange(translationId: string) {
    this.selectedTranslation.set(translationId);
    this.fetchScripture();
  }

  private isDraggingVerses = false;
  private dragAnchorVerse: number | null = null;
  private dragInitialSelection: number[] = [];
  private lastClickedVerse: number | null = null;

  readonly chapterList = computed(() => this.bibleService.getChapterList(this.selectedBook()));
  readonly verseList = computed(() => this.bibleService.getVerseList(this.selectedBook(), this.selectedChapter()));
  readonly selectedReferenceString = computed(() =>
    this.bibleService.formatReferenceString(this.selectedBook(), this.selectedChapter(), this.selectedVerses())
  );
  readonly selectedVerseItems = computed(() =>
    this.bibleService.getVerseItems(this.selectedBook(), this.selectedChapter(), this.selectedVerses())
  );


  selectBook(book: BibleBook) {
    this.selectedBook.set(book);
    this.selectedChapter.set(1);
    this.selectedVerses.set([]); // Do not auto-select first verse
    this.lastClickedVerse = null;
    this.fetchScripture();
  }

  selectChapter(ch: number) {
    this.selectedChapter.set(ch);
    this.selectedVerses.set([]); // Do not auto-select first verse
    this.lastClickedVerse = null;
    this.fetchScripture();
  }

  onVerseMouseDown(v: number, event: MouseEvent) {
    if (event.button !== 0) return; // Left click only
    this.isDraggingVerses = true;
    this.dragAnchorVerse = v;

    const current = this.selectedVerses();
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (isShift && this.lastClickedVerse !== null) {
      // Shift-click range from last clicked verse to current
      const start = Math.min(this.lastClickedVerse, v);
      const end = Math.max(this.lastClickedVerse, v);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      const union = Array.from(new Set([...current, ...range])).sort((a, b) => a - b);
      this.selectedVerses.set(union);
    } else if (isCtrl) {
      // Ctrl-click toggle / add to existing multiple selections
      this.dragInitialSelection = [...current];
      if (current.includes(v)) {
        this.selectedVerses.set(current.filter((item) => item !== v));
      } else {
        this.selectedVerses.set([...current, v].sort((a, b) => a - b));
      }
      this.lastClickedVerse = v;
    } else {
      // Normal Click / Start of Drag
      this.dragInitialSelection = [];
      this.selectedVerses.set([v]);
      this.lastClickedVerse = v;
    }

    this.fetchScripture();
  }

  onVerseMouseEnter(v: number, event: MouseEvent) {
    if (!this.isDraggingVerses || this.dragAnchorVerse === null) return;

    // Dragging over range between dragAnchorVerse and v
    const start = Math.min(this.dragAnchorVerse, v);
    const end = Math.max(this.dragAnchorVerse, v);
    const dragRange = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (event.ctrlKey || event.metaKey) {
      // Combine with pre-drag selection for multi-range dragging
      const union = Array.from(new Set([...this.dragInitialSelection, ...dragRange])).sort(
        (a, b) => a - b,
      );
      this.selectedVerses.set(union);
    } else {
      this.selectedVerses.set(dragRange);
    }

    this.fetchScripture();
  }

  onVerseMouseUp() {
    this.isDraggingVerses = false;
    this.dragAnchorVerse = null;
  }

  isVerseSelected(v: number): boolean {
    return this.selectedVerses().includes(v);
  }

  clearVerseSelection() {
    this.selectedVerses.set([]);
    this.lastClickedVerse = null;
    this.fetchScripture();
  }

  async fetchScripture() {
    const items = this.selectedVerseItems();
    if (items.length === 0) {
      this.fetchedQuoteText.set('');
      return;
    }

    const fullQuote = items.map((it) => it.text).join(' ');
    this.fetchedQuoteText.set(fullQuote);
  }

  presentSingleVerse(item: { verseNum: number; ref: string; text: string }) {
    const tr = this.selectedTranslation();
    const formattedRef = `${item.ref} (${tr})`;
    this.state.present({
      type: 'VERSE',
      verseRef: formattedRef,
      verseQuote: item.text,
      text: item.text,
    });
  }

  presentAllSelectedVerses() {
    const items = this.selectedVerseItems();
    if (items.length === 0) return;

    const tr = this.selectedTranslation();
    const ref = `${this.selectedReferenceString()} (${tr})`;
    const combinedText = items.map((it) => it.text).join(' ');

    this.state.present({
      type: 'VERSE',
      verseRef: ref,
      verseQuote: combinedText,
      text: combinedText,
    });
  }

  presentVerse() {
    const mode = this.verseMode();
    const tr = this.selectedTranslation();
    const rawRef = this.selectedReferenceString();
    const ref = rawRef ? `${rawRef} (${tr})` : '';

    if (mode === 'REFER') {
      this.state.present({
        type: 'VERSE',
        verseMode: 'REFER',
        verseRef: rawRef,
        verseQuote: '',
        text: rawRef,
      });
    } else {
      const items = this.selectedVerseItems();
      if (items.length === 1) {
        this.presentSingleVerse(items[0]);
      } else if (items.length > 1) {
        this.presentAllSelectedVerses();
      } else {
        this.state.present({
          type: 'VERSE',
          verseRef: ref,
          verseQuote: this.fetchedQuoteText(),
          text: this.fetchedQuoteText(),
        });
      }
    }
  }
}
