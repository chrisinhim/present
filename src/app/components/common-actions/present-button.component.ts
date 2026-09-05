import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-present-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="togglePresent()"
      [title]="
        state.activeContent().type === 'TIMER'
          ? state.isPresented()
            ? 'Re-Present Timer (Enter)'
            : 'Present Timer (Enter)'
          : state.isPresented()
            ? state.isPaused()
              ? 'Resume Presentation (Space)'
              : 'Pause Duration (Space)'
            : 'Present Now (Enter)'
      "
      class="w-9 h-9 rounded bg-[#13324b] hover:bg-[#0e2437] text-white flex items-center justify-center text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
    >
      @if (state.isPresented() && !state.isPaused()) {
        <span>‖</span>
      } @else {
        <span>▶</span>
      }
    </button>
  `,
})
export class PresentButtonComponent {
  readonly state = inject(PresentationStateService);

  togglePresent() {
    this.state.togglePlayPause();
  }
}

