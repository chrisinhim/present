import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-text-fill-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Text Fill Color & Gradient"
        [ngClass]="isOpen() ? 'border-b-2 border-slate-900 font-semibold' : 'border-b-2 border-transparent'"
        class="h-7 px-2 flex items-center gap-1 hover:bg-slate-100 text-xs text-slate-700 transition-colors"
      >
        <span class="font-serif font-bold">A</span>
        <span>Text Fill</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 flex flex-col gap-2.5 text-xs text-slate-700"
        >
          <!-- Custom Color Picker -->
          <div class="flex items-center justify-between">
            <span class="font-medium text-slate-600">Custom Color:</span>
            <div class="flex items-center gap-2">
              <input
                type="color"
                [value]="currentColor()"
                (input)="onColorInput($event)"
                class="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span class="font-mono text-[11px] text-slate-500 uppercase">{{ currentColor() }}</span>
            </div>
          </div>

          <!-- Quick Palette -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-slate-400 font-semibold uppercase">Palette:</span>
            <div class="flex flex-wrap gap-1.5">
              @for (col of ['#FFFFFF', '#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']; track col) {
                <button
                  (click)="setColor(col)"
                  [style.background-color]="col"
                  class="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform shadow-xs"
                ></button>
              }
            </div>
          </div>

          <!-- Gradient Presets -->
          <div class="flex flex-col gap-1 border-t border-slate-100 pt-2">
            <span class="text-[10px] text-slate-400 font-semibold uppercase">Gradients:</span>
            <div class="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto">
              @for (grad of popularGradients; track grad) {
                <button
                  (click)="setGradient(grad)"
                  [style.background-image]="grad"
                  class="h-6 rounded border border-slate-200 hover:opacity-90 shadow-xs"
                ></button>
              }
            </div>
          </div>

          <!-- Close Button -->
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
export class TextFillButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

  readonly currentColor = computed(() => {
    const typo = this.state.typography();
    return typo.fontColor || typo.textFillColor || '#ffffff';
  });

  popularGradients: string[] = [
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
  ];

  onColorInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.setColor(val);
  }

  setColor(color: string) {
    this.state.updateTypography({
      fontColor: color,
      textFillColor: color,
      textFillType: 'solid',
    });
  }

  setGradient(gradient: string) {
    this.state.updateTypography({
      textFillType: 'gradient',
      textFillGradient: gradient,
    });
  }
}
