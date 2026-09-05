import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

interface Stanza {
  title: string;
  body: string;
}

interface SongFileItem {
  id: string;
  name: string;
  stanzas: Stanza[];
}

@Component({
  selector: 'app-lyrics-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-4">
      <!-- TOP ACTION BAR: BROWSE FILES & PASTE SONG -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <!-- Hidden Native File Input -->
          <input
            #fileInput
            type="file"
            multiple
            accept=".txt,.text,.lyrics"
            (change)="onFilesSelected($event)"
            class="hidden"
          />

          <button
            (click)="fileInput.click()"
            class="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-sky-400 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <span>📁</span>
            <span>Browse Text Files</span>
          </button>

          <button
            (click)="openPasteModal()"
            class="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <span>📋</span>
            <span>Paste Song Text</span>
          </button>

          @if (songFiles().length > 0) {
            <button
              (click)="clearAllSongs()"
              class="px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-400 font-medium transition-colors cursor-pointer"
            >
              ✕ Clear List
            </button>
          }
        </div>

        @if (selectedSong()) {
          <div
            class="text-xs font-semibold text-sky-400 bg-sky-950/40 px-3 py-1 rounded-full border border-sky-800/50"
          >
            Active: {{ selectedSong()?.name }}
          </div>
        }
      </div>

      <!-- PASTE SONG TEXT MODAL / EXPANDED SECTION -->
      @if (isPastingText()) {
        <div
          class="p-4 bg-slate-950/90 rounded-xl border border-sky-500/50 shadow-2xl flex flex-col gap-3 animate-fade-in"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-white">Paste Song Lyrics</span>
              <span class="text-[11px] text-slate-400"
                >(Paragraphs separated by blank lines will become individual clickable
                stanzas)</span
              >
            </div>
            <button
              (click)="isPastingText.set(false)"
              class="text-slate-400 hover:text-white text-xs"
            >
              ✕ Cancel
            </button>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] text-slate-400 font-medium"
              >Song / Hymn Title (Optional):</label
            >
            <input
              type="text"
              [(ngModel)]="pastedTitle"
              placeholder="e.g. Amazing Grace / 10,000 Reasons..."
              class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] text-slate-400 font-medium">Lyrics Text:</label>
            <textarea
              [(ngModel)]="pastedText"
              rows="8"
              placeholder="Paste your song text here...&#10;&#10;Verse 1&#10;Amazing grace how sweet the sound...&#10;&#10;Chorus&#10;My chains are gone I've been set free..."
              class="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono resize-y"
            >
            </textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button
              (click)="isPastingText.set(false)"
              class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="submitPastedSong()"
              [disabled]="!pastedText.trim()"
              class="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>✓</span>
              <span>Done (Parse Paragraphs)</span>
            </button>
          </div>
        </div>
      }

      <!-- 2-COLUMN WORKSPACE: LEFT (FILES LIST) | RIGHT (CLICKABLE PARAGRAPHS) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- LEFT COLUMN: FILES / SONGS LIST (4 cols) -->
        <div
          class="md:col-span-4 flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-h-96"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Songs / Files ({{ songFiles().length }})
            </span>
            <button
              (click)="fileInput.click()"
              class="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
            >
              + Add
            </button>
          </div>

          <!-- Songs List -->
          <div class="flex flex-col gap-1 overflow-y-auto pr-1">
            @for (song of songFiles(); track song; let idx = $index) {
              <div
                (click)="selectSong(song)"
                [ngClass]="
                  selectedSong()?.id === song.id
                    ? 'bg-sky-950/70 border-sky-500 text-white ring-1 ring-sky-500/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                "
                class="p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-xs">🎵</span>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-semibold truncate">{{ song.name }}</span>
                    <span class="text-[10px] text-slate-500"
                      >{{ song.stanzas.length }} paragraphs</span
                    >
                  </div>
                </div>
                <button
                  (click)="removeSong(song.id, $event)"
                  title="Remove song"
                  class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                >
                  ✕
                </button>
              </div>
            }

            <!-- Empty state -->
            @if (songFiles().length === 0) {
              <div
                class="p-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2 border border-dashed border-slate-800 rounded-lg"
              >
                <span>No songs or files loaded</span>
                <div class="flex gap-2 mt-1">
                  <button
                    (click)="fileInput.click()"
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded text-[11px]"
                  >
                    Browse Files
                  </button>
                  <button
                    (click)="openPasteModal()"
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px]"
                  >
                    Paste Text
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- RIGHT COLUMN: CLICKABLE PARAGRAPHS / STANZAS (8 cols) -->
        <div
          class="md:col-span-8 flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-h-96"
        >
          <div
            class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">
                {{ selectedSong() ? selectedSong()?.name : 'Song Paragraphs' }}
              </span>
              @if (selectedSong()) {
                <span class="text-[11px] text-slate-500">
                  ({{ selectedSong()?.stanzas?.length }} paragraphs)
                </span>
              }
            </div>

            <!-- Stanza Stepper & Hotkey Controls -->
            @if (selectedSong()) {
              <div class="flex items-center gap-1.5">
                <button
                  (click)="prevStanza()"
                  [disabled]="activeStanzaIndex() <= 0"
                  title="Previous Stanza (PageUp or Up Arrow)"
                  class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>⇦</span>
                  <span class="hidden sm:inline">Prev (PgUp)</span>
                </button>
                @if (activeStanzaIndex() >= 0) {
                  <span
                    class="text-[11px] font-mono text-sky-400 px-2 py-0.5 bg-sky-950/60 rounded border border-sky-800/40"
                  >
                    {{ activeStanzaIndex() + 1 }} / {{ selectedSong()?.stanzas?.length }}
                  </span>
                }
                <button
                  (click)="nextStanza()"
                  [disabled]="
                    !selectedSong() ||
                    activeStanzaIndex() >= (selectedSong()?.stanzas?.length || 1) - 1
                  "
                  title="Next Stanza (PageDown or Down Arrow)"
                  class="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span class="hidden sm:inline">Next (PgDn)</span>
                  <span>⇨</span>
                </button>
              </div>
            }
          </div>

          <!-- Paragraph Cards Grid / Vertical List -->
          <div class="flex flex-col gap-2.5 overflow-y-auto pr-1">
            @for (stanza of selectedSong()?.stanzas; track stanza; let i = $index) {
              <div
                (click)="presentStanza(stanza, i)"
                [ngClass]="
                  activeStanzaIndex() === i &&
                  state.isPresented() &&
                  state.activeContent().lyricsSongTitle === selectedSong()?.name
                    ? 'border-sky-500 bg-sky-950/50 ring-1 ring-sky-400 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-850'
                "
                class="p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2.5 h-2.5 rounded-full"
                      [ngClass]="
                        activeStanzaIndex() === i &&
                        state.isPresented() &&
                        state.activeContent().lyricsSongTitle === selectedSong()?.name
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-slate-600'
                      "
                    >
                    </span>
                    <span class="text-xs font-bold text-sky-400">{{ stanza.title }}</span>
                  </div>
                  <button
                    (click)="presentStanza(stanza, i); $event.stopPropagation()"
                    class="px-3 py-1 rounded bg-slate-800 group-hover:bg-sky-600 text-slate-300 group-hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>▶ Present</span>
                  </button>
                </div>
                <p
                  class="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-slate-700/60 font-sans"
                >
                  {{ stanza.body }}
                </p>
              </div>
            }

            <!-- Empty Stanza placeholder -->
            @if (!selectedSong()) {
              <div
                class="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2"
              >
                <span class="text-2xl">📖</span>
                <span
                  >Select a song from the left column or browse/paste lyrics to preview paragraphs
                  here.</span
                >
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LyricsPanelComponent {
  state = inject(PresentationStateService);

  readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  isPastingText = signal<boolean>(false);
  pastedTitle = '';
  pastedText = '';

  activeStanzaIndex = signal<number>(-1);

  songFiles = signal<SongFileItem[]>([
    {
      id: 'song_default_1',
      name: 'Blessed Assurance',
      stanzas: [
        {
          title: 'Verse 1',
          body: 'Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.',
        },
        {
          title: 'Chorus',
          body: 'This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.',
        },
        {
          title: 'Verse 2',
          body: 'Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love.',
        },
      ],
    },
    {
      id: 'song_default_2',
      name: 'Amazing Grace',
      stanzas: [
        {
          title: 'Verse 1',
          body: 'Amazing grace how sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.',
        },
        {
          title: 'Verse 2',
          body: "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.",
        },
        {
          title: 'Verse 3',
          body: "Through many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
        },
      ],
    },
  ]);

  selectedSong = signal<SongFileItem | null>(this.songFiles()[0]);

  openPasteModal() {
    this.pastedTitle = '';
    this.pastedText = '';
    this.isPastingText.set(true);
  }

  submitPastedSong() {
    if (!this.pastedText.trim()) return;

    const stanzas = this.parseLyricsIntoStanzas(this.pastedText);
    const title =
      this.pastedTitle.trim() ||
      this.extractTitleFromLyrics(this.pastedText) ||
      `Song ${this.songFiles().length + 1}`;

    const newSong: SongFileItem = {
      id: 'song_' + Date.now(),
      name: title,
      stanzas,
    };

    this.songFiles.update((prev) => [newSong, ...prev]);
    this.selectedSong.set(newSong);
    this.isPastingText.set(false);
    this.pastedText = '';
    this.pastedTitle = '';
  }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const newItems: SongFileItem[] = [];

    for (const file of files) {
      const text = await file.text();
      const stanzas = this.parseLyricsIntoStanzas(text);
      const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

      newItems.push({
        id: 'song_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name,
        stanzas,
      });
    }

    this.songFiles.update((prev) => [...newItems, ...prev]);
    if (newItems.length > 0) {
      this.selectedSong.set(newItems[0]);
    }

    // Reset native input so selecting same files again fires event
    input.value = '';
  }

  selectSong(song: SongFileItem) {
    this.selectedSong.set(song);
    this.activeStanzaIndex.set(-1);
  }

  removeSong(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.songFiles.update((list) => list.filter((s) => s.id !== id));
    if (this.selectedSong()?.id === id) {
      const remaining = this.songFiles();
      this.selectedSong.set(remaining.length > 0 ? remaining[0] : null);
      this.activeStanzaIndex.set(-1);
    }
  }

  clearAllSongs() {
    this.songFiles.set([]);
    this.selectedSong.set(null);
    this.activeStanzaIndex.set(-1);
  }

  private parseLyricsIntoStanzas(rawText: string): Stanza[] {
    const rawParagraphs = rawText
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let verseCount = 1;

    return rawParagraphs.map((para) => {
      const lines = para.split(/\r?\n/).map((l) => l.trim());
      const firstLineLower = lines[0].toLowerCase();

      let title = '';
      let body = para;

      if (firstLineLower.startsWith('verse') || firstLineLower.startsWith('stanza')) {
        title = lines[0];
        body = lines.slice(1).join('\n');
      } else if (firstLineLower.startsWith('chorus') || firstLineLower.startsWith('refrain')) {
        title = lines[0];
        body = lines.slice(1).join('\n');
      } else if (firstLineLower.startsWith('bridge')) {
        title = lines[0];
        body = lines.slice(1).join('\n');
      } else if (firstLineLower.startsWith('outro') || firstLineLower.startsWith('intro')) {
        title = lines[0];
        body = lines.slice(1).join('\n');
      } else {
        title = `Verse ${verseCount++}`;
      }

      return {
        title,
        body: body.trim(),
      };
    });
  }

  private extractTitleFromLyrics(text: string): string {
    const firstLine = text.trim().split(/\r?\n/)[0]?.trim();
    if (firstLine && firstLine.length < 50 && !firstLine.toLowerCase().startsWith('verse')) {
      return firstLine;
    }
    return '';
  }

  presentStanza(stanza: Stanza, index: number) {
    this.activeStanzaIndex.set(index);
    const song = this.selectedSong();

    this.state.present({
      type: 'LYRICS',
      lyricsSongTitle: song ? song.name : 'Song Lyrics',
      lyricsStanzaTitle: stanza.title,
      lyricsStanzaBody: stanza.body,
      text: stanza.body,
    });
  }

  nextStanza() {
    const song = this.selectedSong();
    if (!song || song.stanzas.length === 0) return;
    const current = this.activeStanzaIndex();
    const nextIdx = current < song.stanzas.length - 1 ? current + 1 : current;
    if (nextIdx !== current && song.stanzas[nextIdx]) {
      this.presentStanza(song.stanzas[nextIdx], nextIdx);
    }
  }

  prevStanza() {
    const song = this.selectedSong();
    if (!song || song.stanzas.length === 0) return;
    const current = this.activeStanzaIndex();
    const prevIdx = current > 0 ? current - 1 : 0;
    if (prevIdx !== current && song.stanzas[prevIdx]) {
      this.presentStanza(song.stanzas[prevIdx], prevIdx);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleLyricsKeydown(event: KeyboardEvent) {
    // Only intercept when LYRICS tab is active and not focused inside input/textarea
    if (this.state.activeTab() !== 'LYRICS') return;
    if (this.isPastingText()) return;

    const activeEl = document.activeElement;
    const isInput =
      activeEl?.tagName === 'INPUT' ||
      activeEl?.tagName === 'TEXTAREA' ||
      activeEl?.tagName === 'SELECT' ||
      activeEl?.getAttribute('contenteditable') === 'true';

    if (isInput) return;

    if (event.key === 'PageDown' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.nextStanza();
    } else if (event.key === 'PageUp' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.prevStanza();
    }
  }
}
