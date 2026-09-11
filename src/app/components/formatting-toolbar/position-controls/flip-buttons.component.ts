import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlipHorizontalButtonComponent } from './flip-horizontal-button.component';
import { FlipVerticalButtonComponent } from './flip-vertical-button.component';

@Component({
  selector: 'app-flip-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlipHorizontalButtonComponent, FlipVerticalButtonComponent],
  template: `
    <div class="flex flex-col gap-1 shrink-0">
      <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Flip</span>
      <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
        <app-flip-horizontal-button />
        <app-flip-vertical-button />
      </div>
    </div>
  `,
})
export class FlipButtonsComponent {}
