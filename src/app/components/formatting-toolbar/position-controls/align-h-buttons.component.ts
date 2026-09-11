import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlignLeftButtonComponent } from './align-left-button.component';
import { AlignCenterButtonComponent } from './align-center-button.component';
import { AlignRightButtonComponent } from './align-right-button.component';

@Component({
  selector: 'app-align-h-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlignLeftButtonComponent, AlignCenterButtonComponent, AlignRightButtonComponent],
  template: `
    <div class="flex items-center h-7 bg-white rounded border border-slate-300 shadow-sm overflow-hidden p-0.5">
      <app-align-left-button />
      <app-align-center-button />
      <app-align-right-button />
    </div>
  `,
})
export class AlignHButtonsComponent {}
