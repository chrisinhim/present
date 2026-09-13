import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { BibleBook } from '../../../models/presentation.models';
import { VerseButtonComponent, VersePointerEvent } from './verse-button.component';

@Component({
  selector: 'app-verse-panel-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VerseButtonComponent],
  template: `
    @if (book(); as selectedBook) {
      @if (chapter(); as selectedChapter) {
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Verses in Chapter {{ selectedChapter }} <span class="text-slate-500 font-normal ml-1">(Drag, Shift+Click for range, Ctrl+Click for multi)</span></span>
            <button (click)="versesCleared.emit()" class="text-[10px] text-slate-400 hover:text-rose-400 font-semibold cursor-pointer">✕ Clear Verses</button>
          </div>
          <div
            #scrollContainer
            (wheel)="scrollHorizontally($event)"
            (mouseleave)="mouseUp.emit()"
            class="flex items-center gap-1 overflow-x-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 select-none whitespace-nowrap"
          >
            @for (verse of verses(); track verse) {
              <app-verse-button
                [verse]="verse"
                [bookName]="selectedBook.name"
                [chapter]="selectedChapter"
                [isSelected]="selectedVerses().includes(verse)"
                (mouseDown)="mouseDown.emit($event)"
                (mouseEnter)="mouseEnter.emit($event)"
                (mouseUp)="mouseUp.emit()"
              ></app-verse-button>
            }
          </div>
        </div>
      }
    }
  `,
})
export class VersePanelListComponent {
  readonly book = input<BibleBook | null>(null);
  readonly chapter = input<number | null>(null);
  readonly verses = input<readonly number[]>([]);
  readonly selectedVerses = input<readonly number[]>([]);
  readonly mouseDown = output<VersePointerEvent>();
  readonly mouseEnter = output<VersePointerEvent>();
  readonly mouseUp = output<void>();
  readonly versesCleared = output<void>();
  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scrollHorizontally(event: WheelEvent) {
    event.preventDefault();
    this.scrollContainer()?.nativeElement && (this.scrollContainer()!.nativeElement.scrollLeft += event.deltaY || event.deltaX);
  }
}
