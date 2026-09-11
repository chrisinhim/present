import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-flip-horizontal-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<button (click)="toggle()" [ngClass]="state.typography().flipH ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-700'" title="Flip Horizontal" class="px-1.5 py-1 text-xs rounded transition-colors">⇄</button>`,
})
export class FlipHorizontalButtonComponent {
  readonly state = inject(PresentationStateService);
  toggle() { this.state.updateTypography({ flipH: !this.state.typography().flipH }); }
}
