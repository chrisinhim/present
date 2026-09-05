import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { FontManagerService } from '../../../services/font-manager.service';

@Component({
  selector: 'app-font-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-5 text-slate-100"
      >
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔤</span>
            <h3 class="text-base font-bold">Add Custom Fonts</h3>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-lg">
            ✕
          </button>
        </div>

        <!-- TAB NAVIGATION IN MODAL -->
        <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            (click)="fontModalTab.set('google')"
            [ngClass]="
              fontModalTab() === 'google'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            "
            class="flex-1 py-1.5 text-xs rounded-lg transition-colors"
          >
            Google Fonts
          </button>
          <button
            (click)="fontModalTab.set('local')"
            [ngClass]="
              fontModalTab() === 'local'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            "
            class="flex-1 py-1.5 text-xs rounded-lg transition-colors"
          >
            Upload Local Font File (.ttf/.otf/.woff2)
          </button>
        </div>

        <!-- GOOGLE FONTS SECTION -->
        @if (fontModalTab() === 'google') {
          <div class="flex flex-col gap-3">
            <label class="text-xs text-slate-400"
              >Google Font Family Name (e.g. <i>Cinzel</i>, <i>Bebas Neue</i>, <i>Caveat</i>,
              <i>Orbitron</i>):</label
            >
            <div class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="googleFontNameInput"
                placeholder="Enter exact Google Font name..."
                class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                (click)="addGoogleFont()"
                [disabled]="!googleFontNameInput.trim()"
                class="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-lg text-xs font-bold text-white transition-colors"
              >
                Add & Apply
              </button>
            </div>
            <!-- Quick Popular Google Font Suggestions -->
            <div class="flex flex-col gap-1.5 mt-2">
              <span class="text-[11px] text-slate-500 font-semibold uppercase"
                >Popular Suggestions:</span
              >
              <div class="flex flex-wrap gap-1.5">
                @for (suggestion of popularGoogleFonts; track suggestion) {
                  <button
                    (click)="quickAddGoogleFont(suggestion)"
                    class="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-[11px] text-slate-300"
                  >
                    + {{ suggestion }}
                  </button>
                }
              </div>
            </div>
          </div>
        }

        <!-- LOCAL FONT FILE UPLOAD SECTION -->
        @if (fontModalTab() === 'local') {
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-slate-400">Custom Font Display Name (optional):</label>
              <input
                type="text"
                [(ngModel)]="localFontNameInput"
                placeholder="e.g. MyCustomChurchFont"
                class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs text-slate-400"
                >Select Font File (.ttf, .otf, .woff, .woff2):</label
              >
              <input
                #fontFileInput
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                (change)="onLocalFontFileSelected($event)"
                class="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
              />
            </div>
          </div>
        }

        <!-- INSTALLED CUSTOM FONTS LIST -->
        @if (state.customFonts().length > 0) {
          <div class="flex flex-col gap-2 pt-3 border-t border-slate-800">
            <span class="text-[11px] font-bold text-slate-400 uppercase"
              >Installed Custom Fonts:</span
            >
            <div class="max-h-32 overflow-y-auto flex flex-col gap-1.5 p-1">
              @for (f of state.customFonts(); track f) {
                <div
                  class="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
                >
                  <span class="font-medium text-slate-200" [style.font-family]="f.name"
                    >{{ f.name }}
                    <span class="text-[10px] text-slate-500">({{ f.source }})</span></span
                  >
                  <div class="flex items-center gap-2">
                    <button
                      (click)="applyFont(f.name)"
                      class="text-sky-400 hover:underline text-[11px]"
                    >
                      Apply
                    </button>
                    <button
                      (click)="state.removeCustomFont(f.id)"
                      class="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class FontModalComponent {
  readonly state = inject(PresentationStateService);
  readonly fontManager = inject(FontManagerService);
  readonly close = output<void>();

  fontModalTab = signal<'google' | 'local'>('google');
  googleFontNameInput = '';
  localFontNameInput = '';

  popularGoogleFonts: string[] = [
    'Cinzel',
    'Bebas Neue',
    'Caveat',
    'Orbitron',
    'Pacifico',
    'Dancing Script',
    'Great Vibes',
    'Righteous',
    'Anton',
    'Lobster',
  ];

  addGoogleFont() {
    const name = this.googleFontNameInput.trim();
    if (!name) return;
    this.state.addGoogleFont(name);
    this.googleFontNameInput = '';
    this.close.emit();
  }

  quickAddGoogleFont(name: string) {
    this.state.addGoogleFont(name);
    this.close.emit();
  }

  async onLocalFontFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const defaultName = file.name.replace(/\.[^/.]+$/, '');
    const fontName = this.localFontNameInput.trim() || defaultName;

    await this.state.addLocalFont(fontName, file);
    this.localFontNameInput = '';
    input.value = '';
    this.close.emit();
  }

  applyFont(fontName: string) {
    this.state.updateTypography({ fontFamily: fontName });
  }
}
