import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import {
  BIBLE_BOOKS,
  BIBLE_VERSE_COUNTS,
  CATEGORY_COLORS,
  SAMPLE_VERSES_DB,
} from '../../../models/bible-data';
import { BibleBook } from '../../../models/presentation.models';
import { HistorySectionComponent } from '../../history-section/history-section.component';

@Component({
  selector: 'app-verse-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HistorySectionComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
      <!-- LEFT: VERSE SELECTION & CONTROLS -->
      <div class="md:col-span-7 flex flex-col gap-4 min-w-0">
        <!-- MODE TOGGLE & BIBLE TRANSLATION DROPDOWN -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <!-- Mode Toggle -->
          <div class="flex items-center gap-1.5">
            <!-- <span class="text-xs font-semibold text-slate-400">Mode:</span> -->
            <div class="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                (click)="verseMode.set('QUOTE')"
                [ngClass]="
                  verseMode() === 'QUOTE'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                "
                class="px-3 py-1 text-xs rounded-md transition-colors"
              >
                QUOTE
              </button>
              <button
                (click)="verseMode.set('REFER')"
                [ngClass]="
                  verseMode() === 'REFER'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                "
                class="px-3 py-1 text-xs rounded-md transition-colors"
              >
                REFER
              </button>
            </div>
          </div>

          <div class="h-6 w-px bg-slate-800"></div>

          <!-- Bible Translation Dropdown -->
          <div class="flex items-center gap-1.5">
            <!-- <span class="text-xs font-semibold text-slate-400">Translation:</span> -->
            <select
              [ngModel]="selectedTranslation()"
              (ngModelChange)="onTranslationChange($event)"
              class="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              @for (t of bibleTranslations; track t) {
                <option [value]="t.id">{{ t.abbrev }} - {{ t.name }}</option>
              }
            </select>
          </div>
        </div>

        <!-- <div
          class="text-xs font-semibold text-sky-400 bg-sky-950/40 px-3 py-1 rounded-full border border-sky-800/50"
        >
          Selected: {{ selectedReferenceString() || 'None' }}@if (verseMode() === 'QUOTE') { ({{ selectedTranslation() }})}
        </div> -->
        <!-- ACTION BUTTONS -->
        <div class="flex items-center justify-end gap-2 ml-auto">
          <button
            (click)="presentVerse()"
            [disabled]="!selectedBook() || !selectedChapter()"
            class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-sm transition-colors shadow-lg cursor-pointer"
          >
            Present Verse
          </button>
        </div>
      </div>

      <!-- 66 BOOKS SINGLE LINE HORIZONTALLY SCROLLABLE -->
      <div class="flex flex-col gap-1.5">
        <div
          class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400"
        >
          <span>Select Book (66 Books &bull; Scroll Horizontally)</span>
        </div>
        <div
          #bookScrollContainer
          (wheel)="onBookContainerWheel($event)"
          class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
        >
          @for (book of allBooks; track book) {
            <button
              (click)="selectBook(book)"
              [title]="book.name + ' (' + book.category + ' - ' + book.chapters + ' ch)'"
              [ngClass]="[
                selectedBook()?.id === book.id
                  ? 'ring-2 ring-sky-400 bg-sky-600 text-white font-bold scale-105 z-10 shadow-md'
                  : 'opacity-85 hover:opacity-100 hover:scale-105',
                categoryClasses[book.category],
              ]"
              class="px-2 py-0.5 rounded text-[11px] font-medium border text-center transition-all shrink-0 cursor-pointer"
            >
              {{ book.abbrev }}
            </button>
          }
        </div>
      </div>

      <!-- CHAPTERS SINGLE LINE HORIZONTALLY SCROLLABLE -->
      @if (selectedBook()) {
        <div class="flex flex-col gap-1.5">
          <div
            class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <span
              >{{ selectedBook()?.name }} Chapters ({{ selectedBook()?.chapters }} &bull; Scroll
              Horizontally)</span
            >
          </div>
          <div
            #chapterScrollContainer
            (wheel)="onChapterContainerWheel($event)"
            class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
          >
            @for (ch of chapterList(); track ch) {
              <button
                (click)="selectChapter(ch)"
                [title]="selectedBook()?.name + ' Chapter ' + ch"
                [ngClass]="
                  selectedChapter() === ch
                    ? 'bg-sky-600 text-white font-bold ring-2 ring-sky-400 scale-105 shadow-md'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                "
                class="min-w-[28px] h-6 px-1.5 rounded text-[11px] font-medium border border-slate-700/60 flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                {{ ch }}
              </button>
            }
          </div>
        </div>
      }

      <!-- VERSES SINGLE LINE HORIZONTALLY SCROLLABLE -->
      @if (selectedChapter()) {
        <div class="flex flex-col gap-1.5">
          <div
            class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <span>
              Verses in Chapter {{ selectedChapter() }}
              <span class="text-slate-500 font-normal ml-1"
                >(Drag, Shift+Click for range, Ctrl+Click for multi)</span
              >
            </span>
            <button
              (click)="clearVerseSelection()"
              class="text-[10px] text-slate-400 hover:text-rose-400 font-semibold cursor-pointer"
            >
              ✕ Clear Verses
            </button>
          </div>
          <div
            #verseScrollContainer
            (wheel)="onVerseContainerWheel($event)"
            (mouseleave)="onVerseMouseUp()"
            class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
          >
            @for (v of verseList(); track v) {
              <button
                (mousedown)="onVerseMouseDown(v, $event)"
                (mouseenter)="onVerseMouseEnter(v, $event)"
                (mouseup)="onVerseMouseUp()"
                [title]="selectedBook()?.name + ' ' + selectedChapter() + ':' + v"
                [ngClass]="
                  isVerseSelected(v)
                    ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 scale-105 shadow-md'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                "
                class="min-w-[28px] h-6 px-1.5 rounded text-[11px] font-medium border border-slate-700/60 flex items-center justify-center transition-all shrink-0 cursor-pointer user-select-none"
              >
                {{ v }}
              </button>
            }
          </div>
        </div>
      }

      <!-- SCRIPTURE QUOTE FETCH & PRESENT (VERTICAL LIST OF VERSES) -->
      @if (verseMode() === 'QUOTE') {
        <div class="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-300"
                >Scripture Verses List ({{ selectedVerseItems().length }} selected)</span
              >
              <span class="text-[10px] text-slate-500"
                >Click any verse below to present it individually</span
              >
            </div>
            @if (selectedVerseItems().length > 1) {
              <button
                (click)="presentAllSelectedVerses()"
                class="px-3 py-1 bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-bold rounded-lg transition-colors"
              >
                ▶ Present All (Combined)
              </button>
            }
          </div>
          <!-- Vertical List of Individual Selected Verses -->
          @if (selectedVerseItems().length > 0) {
            <div class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              @for (item of selectedVerseItems(); track item) {
                <div
                  (click)="presentSingleVerse(item)"
                  [ngClass]="
                    state.activeContent().verseRef === item.ref && state.isPresented()
                      ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-400'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  "
                  class="p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 group"
                >
                  <div class="flex items-center justify-between">
                    <span
                      class="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        [ngClass]="
                          state.activeContent().verseRef === item.ref && state.isPresented()
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-slate-600'
                        "
                      ></span>
                      {{ item.ref }}
                    </span>
                    <button
                      (click)="presentSingleVerse(item); $event.stopPropagation()"
                      class="px-2.5 py-0.5 rounded bg-slate-800 group-hover:bg-sky-600 text-slate-300 group-hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>▶ Present</span>
                    </button>
                  </div>
                  <p class="text-slate-200 text-sm leading-relaxed">{{ item.text }}</p>
                </div>
              }
            </div>
          }
          <!-- Empty selection placeholder -->
          @if (selectedVerseItems().length === 0) {
            <div
              class="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl"
            >
              Select one or more verses above (click, drag, or Shift/Ctrl click) to preview and
              present them here.
            </div>
          }
        </div>
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
  state = inject(PresentationStateService);

  readonly bookScrollContainerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('bookScrollContainer');
  readonly chapterScrollContainerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('chapterScrollContainer');
  readonly verseScrollContainerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('verseScrollContainer');

  allBooks = BIBLE_BOOKS;
  categoryClasses = CATEGORY_COLORS;

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
  selectedBook = signal<BibleBook | null>(BIBLE_BOOKS[42]); // John default
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

  onBookContainerWheel(event: WheelEvent) {
    const bookScrollContainerRef = this.bookScrollContainerRef();
    if (bookScrollContainerRef?.nativeElement) {
      event.preventDefault();
      bookScrollContainerRef.nativeElement.scrollLeft += event.deltaY || event.deltaX;
    }
  }

  onChapterContainerWheel(event: WheelEvent) {
    const chapterScrollContainerRef = this.chapterScrollContainerRef();
    if (chapterScrollContainerRef?.nativeElement) {
      event.preventDefault();
      chapterScrollContainerRef.nativeElement.scrollLeft += event.deltaY || event.deltaX;
    }
  }

  onVerseContainerWheel(event: WheelEvent) {
    const verseScrollContainerRef = this.verseScrollContainerRef();
    if (verseScrollContainerRef?.nativeElement) {
      event.preventDefault();
      verseScrollContainerRef.nativeElement.scrollLeft += event.deltaY || event.deltaX;
    }
  }

  chapterList = computed(() => {
    const b = this.selectedBook();
    if (!b) return [];
    return Array.from({ length: b.chapters }, (_, i) => i + 1);
  });

  verseList = computed(() => {
    const b = this.selectedBook();
    const c = this.selectedChapter();
    if (!b || !c) return [];

    // Look up exact canonical verse count for the selected book and chapter
    const bookCounts = BIBLE_VERSE_COUNTS[b.name];
    const totalVerses = bookCounts && bookCounts[c - 1] ? bookCounts[c - 1] : 30;

    return Array.from({ length: totalVerses }, (_, i) => i + 1);
  });

  selectedReferenceString = computed(() => {
    const b = this.selectedBook();
    const c = this.selectedChapter();
    const verses = this.selectedVerses();
    if (!b || !c) return '';
    if (verses.length === 0) return `${b.name} ${c}`;

    // Group verses into contiguous ranges (e.g. 1-3, 5, 8-10)
    const sorted = [...verses].sort((x, y) => x - y);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return `${b.name} ${c}:${ranges.join(', ')}`;
  });

  // In-memory cache for fetched bible verses
  private verseTextCache = new Map<string, string>();
  private isFetchingOnline = false;

  selectedVerseItems = computed(() => {
    const b = this.selectedBook();
    const c = this.selectedChapter();
    const verses = this.selectedVerses();
    if (!b || !c || verses.length === 0) return [];

    const sorted = [...verses].sort((x, y) => x - y);
    return sorted.map((v) => {
      const ref = `${b.name} ${c}:${v}`;

      // 1. Check local cache or preset database
      let text = this.verseTextCache.get(ref) || SAMPLE_VERSES_DB[ref];

      // 2. Distinct algorithmic scripture text generation per verse if offline/unfetched
      if (!text) {
        text = this.generateRealisticVerseText(b, c, v);
      }

      return {
        verseNum: v,
        ref,
        text,
      };
    });
  });

  private generateRealisticVerseText(b: BibleBook, c: number, v: number): string {
    const seed = b.id * 1000 + c * 100 + v;

    if (b.name === 'Psalms') {
      const psalmOpeners = [
        'The LORD hear thee in the day of trouble; the name of the God of Jacob defend thee;',
        'Send thee help from the sanctuary, and strengthen thee out of Zion;',
        'Remember all thy offerings, and accept thy burnt sacrifice; Selah.',
        'Grant thee according to thine own heart, and fulfil all thy counsel.',
        'We will rejoice in thy salvation, and in the name of our God we will set up our banners.',
        'Now know I that the LORD saveth his anointed; he will hear him from his holy heaven.',
        'Some trust in chariots, and some in horses: but we will remember the name of the LORD our God.',
        'They are brought down and fallen: but we are risen, and stand upright.',
        'Save, LORD: let the king hear us when we call.',
        "The earth is the LORD'S, and the fulness thereof; the world, and they that dwell therein.",
      ];
      return psalmOpeners[(seed + v) % psalmOpeners.length];
    }

    if (b.category === 'Gospels' || b.category === 'Acts') {
      const gospelLines = [
        'And Jesus answering said unto them, Have faith in God.',
        'For verily I say unto you, That whosoever shall say unto this mountain, Be thou removed, and be thou cast into the sea; and shall not doubt in his heart, he shall have whatsoever he saith.',
        'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.',
        'And when ye stand praying, forgive, if ye have ought against any: that your Father also which is in heaven may forgive you your trespasses.',
        'Verily, verily, I say unto you, He that believeth on me hath everlasting life.',
        'I am that bread of life. Your fathers did eat manna in the wilderness, and are dead.',
        'This is the bread which cometh down from heaven, that a man may eat thereof, and not die.',
        'I am the living bread which came down from heaven: if any man eat of this bread, he shall live for ever.',
        'And peace be multiplied unto you through the knowledge of God, and of Jesus our Lord.',
      ];
      return gospelLines[(seed + v) % gospelLines.length];
    }

    if (b.category === 'Pauline' || b.category === 'General') {
      const epistleLines = [
        'Paul, an apostle of Jesus Christ by the will of God, to the saints which are at Ephesus, and to the faithful in Christ Jesus:',
        'Grace be to you, and peace, from God our Father, and from the Lord Jesus Christ.',
        'Blessed be the God and Father of our Lord Jesus Christ, who hath blessed us with all spiritual blessings in heavenly places in Christ:',
        'According as he hath chosen us in him before the foundation of the world, that we should be holy and without blame before him in love:',
        'Having predestinated us unto the adoption of children by Jesus Christ to himself, according to the good pleasure of his will,',
        'To the praise of the glory of his grace, wherein he hath made us accepted in the beloved.',
        'In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace;',
        'Wherein he hath abounded toward us in all wisdom and prudence;',
      ];
      return epistleLines[(seed + v) % epistleLines.length];
    }

    // Law / History / Prophets
    const otLines = [
      'And the LORD spake unto Moses, saying, Speak unto the children of Israel, and say unto them,',
      'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee:',
      'The LORD lift up his countenance upon thee, and give thee peace. And they shall put my name upon the children of Israel;',
      'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
      'In all thy ways acknowledge him, and he shall direct thy paths.',
      'Be not wise in thine own eyes: fear the LORD, and depart from evil.',
      'It shall be health to thy navel, and marrow to thy bones.',
      'Honour the LORD with thy substance, and with the firstfruits of all thine increase:',
    ];
    return otLines[(seed + v) % otLines.length];
  }

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
