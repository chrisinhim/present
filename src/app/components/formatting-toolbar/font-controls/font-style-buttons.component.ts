import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-font-style-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-0.5">
      <!-- Bold -->
      <button
        (click)="toggleStyle('bold')"
        [ngClass]="
          state.typography().bold
            ? 'bg-sky-100 text-sky-700 font-bold border-sky-300'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        "
        title="Bold (Ctrl+B)"
        class="h-7 w-6 rounded border text-xs flex items-center justify-center font-bold transition-colors"
      >
        B
      </button>

      <!-- Italic -->
      <button
        (click)="toggleStyle('italic')"
        [ngClass]="
          state.typography().italic
            ? 'bg-sky-100 text-sky-700 font-bold border-sky-300'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        "
        title="Italic (Ctrl+I)"
        class="h-7 w-6 rounded border text-xs flex items-center justify-center italic font-serif transition-colors"
      >
        I
      </button>

      <!-- Underline -->
      <button
        (click)="toggleStyle('underline')"
        [ngClass]="
          state.typography().underline
            ? 'bg-sky-100 text-sky-700 font-bold border-sky-300'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        "
        title="Underline (Ctrl+U)"
        class="h-7 w-6 rounded border text-xs flex items-center justify-center underline transition-colors"
      >
        U
      </button>

      <!-- Strikethrough -->
      <button
        (click)="toggleStyle('strikethrough')"
        [ngClass]="
          state.typography().strikethrough
            ? 'bg-sky-100 text-sky-700 font-bold border-sky-300'
            : 'text-slate-700 hover:bg-slate-100 border-transparent'
        "
        title="Strikethrough"
        class="h-7 w-6 rounded border text-xs flex items-center justify-center line-through transition-colors"
      >
        S
      </button>
    </div>
  `,
})
export class FontStyleButtonsComponent {
  readonly state = inject(PresentationStateService);

  toggleStyle(prop: 'bold' | 'italic' | 'underline' | 'strikethrough') {
    const current = !!this.state.typography()[prop];
    this.state.updateTypography({ [prop]: !current });
  }
}
