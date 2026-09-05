import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-outline-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Text Outline / Stroke"
        [ngClass]="state.typography().textOutlineEnabled ? 'text-sky-700 font-semibold' : 'text-slate-700'"
        class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs transition-colors"
      >
        <span class="font-serif font-bold">A</span>
        <span>Text Outline</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-56 bg-white border border-slate-200 rounded-lg shadow-xl p-3 flex flex-col gap-2.5 text-xs text-slate-700"
        >
          <div class="flex items-center justify-between">
            <label class="font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                [ngModel]="state.typography().textOutlineEnabled"
                (ngModelChange)="updateOutlineEnabled($event)"
                class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Enable Outline</span>
            </label>
            <input
              type="color"
              [value]="state.typography().textOutlineColor || '#000000'"
              (input)="updateOutlineColor($event)"
              class="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          <div class="flex items-center justify-between text-slate-600 gap-2">
            <span>Weight:</span>
            <input
              type="range"
              min="1"
              max="12"
              [ngModel]="state.typography().textOutlineWeight"
              (ngModelChange)="updateOutlineWeight($event)"
              class="flex-1 accent-sky-600 h-1.5"
            />
            <span class="font-mono text-slate-500 w-6 text-right">{{ state.typography().textOutlineWeight }}px</span>
          </div>

          <div class="flex justify-end pt-1 border-t border-slate-100">
            <button
              (click)="isOpen.set(false)"
              class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
            >
              Done
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class OutlineButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  updateOutlineEnabled(textOutlineEnabled: boolean) {
    this.state.updateTypography({ textOutlineEnabled });
  }

  updateOutlineColor(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input) this.state.updateTypography({ textOutlineColor: input.value });
  }

  updateOutlineWeight(weight: number) {
    this.state.updateTypography({ textOutlineWeight: Number(weight) || 1 });
  }
}
