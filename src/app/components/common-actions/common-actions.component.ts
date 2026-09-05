import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentButtonComponent } from './present-button.component';
import { HideButtonComponent } from './hide-button.component';
import { DurationControlComponent } from './duration-control.component';

@Component({
  selector: 'app-common-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PresentButtonComponent,
    HideButtonComponent,
    DurationControlComponent,
  ],
  template: `
    <div
      class="bg-white border border-slate-200 rounded-lg p-2 shadow-xs flex items-center gap-3 text-slate-700"
    >
      <!-- LEFT: PLAY / PAUSE BUTTON -->
      <app-present-button />

      <!-- CENTER: DURATION PROGRESS RAIL & NUMBER BOX [ 30 ] -->
      <app-duration-control />

      <!-- RIGHT: CLOSE / HIDE BUTTON -->
      <app-hide-button />
    </div>
  `,
})
export class CommonActionsComponent {}

