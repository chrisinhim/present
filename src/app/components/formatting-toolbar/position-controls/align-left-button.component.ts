import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-align-left-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<button (click)="setAlignment()" [ngClass]="state.typography().alignment === 'left' ? 'bg-sky-100 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-100'" title="Align Left" class="h-full px-1.5 rounded flex items-center justify-center transition-colors"><svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/></svg></button>`,
})
export class AlignLeftButtonComponent {
  readonly state = inject(PresentationStateService);
  setAlignment() { this.state.updateTypography({ alignment: 'left' }); }
}
