import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-font-family-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center">
      <select
        [ngModel]="state.typography().fontFamily"
        (ngModelChange)="onFontChange($event)"
        class="h-7 bg-white border border-slate-300 rounded px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer w-24 sm:w-28 truncate shadow-xs"
      >
        @for (font of state.availableFontFamilies(); track font) {
          <option [value]="font">
            {{ font }}
          </option>
        }
        <option value="__ADD_NEW__">+ Add Font...</option>
      </select>
    </div>
  `,
})
export class FontFamilyButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly openFontModal = output<void>();

  onFontChange(val: string) {
    if (val === '__ADD_NEW__') {
      this.openFontModal.emit();
    } else {
      this.state.updateTypography({ fontFamily: val });
    }
  }
}

