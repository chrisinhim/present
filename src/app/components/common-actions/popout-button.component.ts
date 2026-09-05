import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-popout-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="openPopup()"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
    >
      <span>🗔 Popout Window</span>
    </button>
  `,
})
export class PopoutButtonComponent {
  readonly state = inject(PresentationStateService);

  openPopup() {
    this.state.openPresentationWindow();
  }
}
