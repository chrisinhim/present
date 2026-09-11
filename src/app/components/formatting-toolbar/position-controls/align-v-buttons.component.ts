import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlignTopButtonComponent } from './align-top-button.component';
import { AlignMiddleButtonComponent } from './align-middle-button.component';
import { AlignBottomButtonComponent } from './align-bottom-button.component';

@Component({
  selector: 'app-align-v-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlignTopButtonComponent, AlignMiddleButtonComponent, AlignBottomButtonComponent],
  template: `
    <div class="flex flex-col gap-1 shrink-0">
      <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Vertical</span>
      <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
        <app-align-top-button />
        <app-align-middle-button />
        <app-align-bottom-button />
      </div>
    </div>
  `,
})
export class AlignVButtonsComponent {}
