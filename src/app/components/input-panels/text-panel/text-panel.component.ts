import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { BIBLE_BOOKS } from '../../../models/bible-data';
import { BibleBook } from '../../../models/presentation.models';

@Component({
  selector: 'app-text-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative flex flex-col gap-3">
      <div class="relative">
        <textarea
          #textArea
          [(ngModel)]="textInput"
          (ngModelChange)="onTextChange($event)"
          (keydown)="onKeyDown($event)"
          (blur)="onBlur()"
          placeholder="Type presentation text, announcements, or Bible books (e.g. Genesis, 1 Cor, Rom 8:28)..."
          rows="5"
          class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-y text-base leading-relaxed"
        >
        </textarea>

        <!-- AUTOCOMPLETE DROPDOWN OVERLAY -->
        @if (showSuggestions() && suggestions().length > 0) {
          <div
            class="absolute left-4 top-16 z-30 w-72 max-h-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-y-auto p-1 text-slate-200"
          >
            <div
              class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800"
            >
              Bible Books (Tab / Enter to select)
            </div>
            @for (book of suggestions(); track book; let i = $index) {
              <div
                (mousedown)="selectSuggestion(book.name)"
                [ngClass]="
                  i === selectedIndex()
                    ? 'bg-sky-600 text-white font-bold'
                    : 'hover:bg-slate-800 text-slate-300'
                "
                class="px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between transition-colors"
              >
                <div class="flex items-center gap-2">
                  <span>📖</span>
                  <span>{{ book.name }}</span>
                </div>
                <span class="text-[10px] opacity-75 font-mono">{{ book.abbrev }}</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <span
            >Hint:
            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono"
              >Tab</kbd
            >
            to complete,
            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono"
              >Shift+Enter</kbd
            >
            for newline,
            <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono"
              >Enter</kbd
            >
            to Present</span
          >
        </div>
        <button
          (click)="presentNow()"
          class="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors"
        >
          Present Text
        </button>
      </div>
    </div>
  `,
})
export class TextPanelComponent {
  state = inject(PresentationStateService);

  readonly textAreaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea');

  textInput = signal<string>('');
  showSuggestions = signal<boolean>(false);
  suggestions = signal<BibleBook[]>([]);
  selectedIndex = signal<number>(0);
  private currentQueryToken = '';

  constructor() {
    const existing = this.state.activeContent();
    if (existing.type === 'TEXT' && existing.text) {
      this.textInput.set(existing.text);
    }
  }

  onTextChange(text: string) {
    this.state.activeContent.set({
      type: 'TEXT',
      text,
    });

    this.checkAutocomplete(text);
  }

  private checkAutocomplete(text: string) {
    if (!text) {
      this.showSuggestions.set(false);
      return;
    }

    // Extract current cursor position or last word phrase
    const cursor = this.textAreaRef()?.nativeElement?.selectionStart ?? text.length;
    const textBeforeCursor = text.substring(0, cursor);

    // Look for the token before cursor (supporting numbers like "1 Cor", "2 Ki")
    const match = textBeforeCursor.match(/([0-3]?\s*[a-zA-Z]+)$/);
    if (!match) {
      this.showSuggestions.set(false);
      return;
    }

    const token = match[1].trim();
    if (token.length < 2) {
      this.showSuggestions.set(false);
      return;
    }

    this.currentQueryToken = token;
    const normalizedQuery = token.toLowerCase();

    // Contiguous sequence matching on Bible book name or abbreviation (e.g., "gen", "sam", "1 cor")
    const matches = BIBLE_BOOKS.filter((b) => {
      const bookName = b.name.toLowerCase();
      const abbrev = b.abbrev.toLowerCase();
      return (
        bookName.startsWith(normalizedQuery) ||
        bookName.includes(normalizedQuery) ||
        abbrev.startsWith(normalizedQuery) ||
        abbrev.includes(normalizedQuery)
      );
    }).sort((a, b) => {
      // Prioritize exact prefix matches
      const aStarts = a.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      return aStarts - bStarts;
    });

    if (matches.length > 0) {
      this.suggestions.set(matches);
      this.selectedIndex.set(0);
      this.showSuggestions.set(true);
    } else {
      this.showSuggestions.set(false);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const isOpen = this.showSuggestions() && this.suggestions().length > 0;

    if (isOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const list = this.suggestions();
        const next = (this.selectedIndex() + 1) % list.length;
        this.selectedIndex.set(next);
        return;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const list = this.suggestions();
        const prev = (this.selectedIndex() - 1 + list.length) % list.length;
        this.selectedIndex.set(prev);
        return;
      } else if (event.key === 'Tab' || (event.key === 'Enter' && !event.shiftKey)) {
        // Tab or Enter chooses the currently highlighted item (defaults to 1st option)
        event.preventDefault();
        const chosen = this.suggestions()[this.selectedIndex()];
        if (chosen) {
          this.selectSuggestion(chosen.name);
        }
        return;
      } else if (event.key === 'Escape') {
        this.showSuggestions.set(false);
        return;
      }
    }

    // Default Enter when no autocomplete is active -> Present
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.presentNow();
    }
  }

  selectSuggestion(bookName: string) {
    const text = this.textInput();
    const cursor = this.textAreaRef()?.nativeElement?.selectionStart ?? text.length;
    const before = text.substring(0, cursor);
    const after = text.substring(cursor);

    // Replace the matched query token before the cursor with the full book name
    if (this.currentQueryToken && before.endsWith(this.currentQueryToken)) {
      const replacedBefore = before.slice(0, -this.currentQueryToken.length) + bookName + ' ';
      const updated = replacedBefore + after;
      this.textInput.set(updated);
      this.state.activeContent.set({ type: 'TEXT', text: updated });
    } else {
      const words = text.split(/[\s,]+/);
      words[words.length - 1] = bookName + ' ';
      const updated = words.join(' ');
      this.textInput.set(updated);
      this.state.activeContent.set({ type: 'TEXT', text: updated });
    }

    this.showSuggestions.set(false);

    // Return focus to textarea
    setTimeout(() => {
      const textAreaRef = this.textAreaRef();
      if (textAreaRef?.nativeElement) {
        textAreaRef.nativeElement.focus();
      }
    }, 0);
  }

  onBlur() {
    // Delay hiding so clicks on suggestion list register
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }

  presentNow() {
    this.state.present({
      type: 'TEXT',
      text: this.textInput(),
    });
  }
}
