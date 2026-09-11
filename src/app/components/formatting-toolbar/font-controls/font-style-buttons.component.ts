import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { BoldButtonComponent } from './bold-button.component';
import { ItalicButtonComponent } from './italic-button.component';
import { UnderlineButtonComponent } from './underline-button.component';
import { StrikethroughButtonComponent } from './strikethrough-button.component';

@Component({
  selector: 'app-font-style-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BoldButtonComponent, ItalicButtonComponent, UnderlineButtonComponent, StrikethroughButtonComponent],
  template: `
    <div class="flex items-center gap-0.5">
      <app-bold-button />
      <app-italic-button />
      <app-underline-button />
      <app-strikethrough-button />
    </div>
  `,
})
export class FontStyleButtonsComponent {
}
