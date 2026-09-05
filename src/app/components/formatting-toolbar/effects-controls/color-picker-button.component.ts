import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-color-picker-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="relative flex items-center">
      <label
        title="Font Color"
        class="h-7 px-1.5 flex items-center gap-1 rounded hover:bg-slate-100 cursor-pointer transition-colors"
      >
        <div class="flex flex-col items-center leading-none">
          <span class="text-xs font-serif font-bold text-slate-800">A</span>
          <span
            class="w-full h-1 rounded-full"
            [style.background-color]="fontColorValue()"
          ></span>
        </div>
        <span class="text-[9px] text-slate-500">▾</span>
        <input
          type="color"
          [value]="fontColorValue()"
          (input)="onFontColorInput($event)"
          class="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
      </label>
    </div>
  `,
})
export class ColorPickerButtonComponent {
  readonly state = inject(PresentationStateService);

  readonly fontColorValue = computed(() => {
    const typo = this.state.typography();
    return typo.fontColor || typo.textFillColor || '#dc2626';
  });

  onFontColorInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input) {
      this.state.updateTypography({
        fontColor: input.value,
        textFillColor: input.value,
        textFillType: 'solid',
      });
    }
  }
}
