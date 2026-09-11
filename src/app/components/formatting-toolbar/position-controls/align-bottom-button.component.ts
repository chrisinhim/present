import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-align-bottom-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<button (click)="setAlignment()" [ngClass]="state.typography().verticalAlignment === 'bottom' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'" title="Align Bottom" class="w-7 h-7 rounded text-xs flex items-center justify-center transition-colors">⤓</button>`,
})
export class AlignBottomButtonComponent {
  readonly state = inject(PresentationStateService);
  setAlignment() { this.state.updateTypography({ verticalAlignment: 'bottom' }); }
}
