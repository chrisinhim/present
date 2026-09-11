import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-italic-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<button
    (click)="toggle()"
    [ngClass]="state.typography().italic ? 'bg-sky-100 text-sky-700 font-bold border-sky-300' : 'text-slate-700 hover:bg-slate-100 border-transparent'"
    title="Italic (Ctrl+I)"
    class="h-7 w-6 rounded border text-xs flex items-center justify-center italic font-serif transition-colors"
  >I</button>`,
})
export class ItalicButtonComponent {
  readonly state = inject(PresentationStateService);
  toggle() { this.state.updateTypography({ italic: !this.state.typography().italic }); }
}
