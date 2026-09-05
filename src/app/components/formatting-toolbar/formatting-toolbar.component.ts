import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';

// Font Controls
import { FontFamilyButtonComponent } from './font-controls/font-family-button.component';
import { FontSizeButtonComponent } from './font-controls/font-size-button.component';
import { FontStyleButtonsComponent } from './font-controls/font-style-buttons.component';
import { TextCaseButtonComponent } from './font-controls/text-case-button.component';
import { LetterSpacingButtonComponent } from './font-controls/letter-spacing-button.component';
import { LineSpacingButtonComponent } from './font-controls/line-spacing-button.component';

// Effects Controls
import { ColorPickerButtonComponent } from './effects-controls/color-picker-button.component';
import { HighlightButtonComponent } from './effects-controls/highlight-button.component';
import { BackgroundButtonComponent } from './effects-controls/background-button.component';
import { TextFillButtonComponent } from './effects-controls/text-fill-button.component';
import { OutlineButtonComponent } from './effects-controls/outline-button.component';
import { TextEffectsButtonComponent } from './effects-controls/text-effects-button.component';
import { ResetFormattingButtonComponent } from './effects-controls/reset-formatting-button.component';

// Position Controls
import { RotateButtonsComponent } from './position-controls/rotate-buttons.component';
import { QuickAlignButtonComponent } from './position-controls/quick-align-button.component';
import { VAlignAdjustmentButtonComponent } from './position-controls/v-align-adjustment-button.component';
import { HAlignAdjustmentButtonComponent } from './position-controls/h-align-adjustment-button.component';

// Animation Controls
import { EntryAnimationButtonComponent } from './animation-controls/entry-animation-button.component';
import { ExitAnimationButtonComponent } from './animation-controls/exit-animation-button.component';

// Modals
import { FontModalComponent } from './modals/font-modal.component';
import { HighlightModalComponent } from './modals/highlight-modal.component';
import { BackgroundModalComponent } from './modals/background-modal.component';

@Component({
  selector: 'app-formatting-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontFamilyButtonComponent,
    FontSizeButtonComponent,
    FontStyleButtonsComponent,
    TextCaseButtonComponent,
    LetterSpacingButtonComponent,
    LineSpacingButtonComponent,
    ColorPickerButtonComponent,
    HighlightButtonComponent,
    BackgroundButtonComponent,
    TextFillButtonComponent,
    OutlineButtonComponent,
    TextEffectsButtonComponent,
    ResetFormattingButtonComponent,
    RotateButtonsComponent,
    QuickAlignButtonComponent,
    VAlignAdjustmentButtonComponent,
    HAlignAdjustmentButtonComponent,
    EntryAnimationButtonComponent,
    ExitAnimationButtonComponent,
    FontModalComponent,
    HighlightModalComponent,
    BackgroundModalComponent,
  ],
  templateUrl: './formatting-toolbar.component.html',
})
export class FormattingToolbarComponent {
  readonly state = inject(PresentationStateService);

  readonly showFontModal = signal<boolean>(false);
  readonly showHighlightModal = signal<boolean>(false);
  readonly showBgModal = signal<boolean>(false);
}

