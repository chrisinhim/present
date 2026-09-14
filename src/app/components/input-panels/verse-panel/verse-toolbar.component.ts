import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type VerseMode = 'QUOTE' | 'REFER';

export interface BibleTranslationOption {
  id: string;
  abbrev: string;
  name: string;
}

@Component({
  selector: 'app-verse-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <div class="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              (click)="modeChange.emit('QUOTE')"
              [class]="mode() === 'QUOTE' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-3 py-1 text-xs rounded-md transition-colors"
            >
              QUOTE
            </button>
            <button
              (click)="modeChange.emit('REFER')"
              [class]="mode() === 'REFER' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-3 py-1 text-xs rounded-md transition-colors"
            >
              REFER
            </button>
          </div>
        </div>

        <div class="h-6 w-px bg-slate-800"></div>

        <div class="flex items-center gap-1.5">
          <select
            [ngModel]="translation()"
            (ngModelChange)="translationChange.emit($event)"
            class="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            @for (option of translations(); track option.id) {
              <option [value]="option.id">{{ option.abbrev }} - {{ option.name }}</option>
            }
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 ml-auto">
        <button
          (click)="present.emit()"
          [disabled]="!canPresent()"
          class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-sm transition-colors shadow-lg cursor-pointer"
        >
          Present Verse
        </button>
      </div>
    </div>
  `,
})
export class VerseToolbarComponent {
  readonly mode = input.required<VerseMode>();
  readonly translation = input.required<string>();
  readonly translations = input.required<readonly BibleTranslationOption[]>();
  readonly canPresent = input(false);

  readonly modeChange = output<VerseMode>();
  readonly translationChange = output<string>();
  readonly present = output<void>();
}
