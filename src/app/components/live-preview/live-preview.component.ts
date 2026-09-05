import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';
import { PresentationCanvasComponent } from '../../shared/components/presentation-canvas/presentation-canvas.component';
import { OnAirBadgeComponent } from '../../features/controller/preview/on-air-badge.component';

@Component({
  selector: 'app-live-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PresentationCanvasComponent, OnAirBadgeComponent],
  template: `
    <div
      class="relative w-full h-64 sm:h-72 md:h-80 bg-[#112331] rounded-2xl overflow-hidden shadow-md border border-slate-700/60 flex flex-col"
    >
      <!-- STATUS BADGE OVERLAY -->
      <div class="absolute top-3.5 left-3.5 z-20">
        <app-on-air-badge
          [isPresented]="state.isPresented()"
          [isPaused]="state.isPaused()"
          [remainingSeconds]="state.remainingSeconds()"
        />
      </div>

      <!-- SHARED CANVAS RENDERING -->
      <app-presentation-canvas
        class="block w-full h-full flex-1"
        [typography]="state.typography()"
        [background]="state.background()"
        [container]="state.container()"
        [content]="state.activeContent()"
        [scale]="0.6"
        [showAlways]="true"
        [isPresented]="state.isPresented()"
        [isExiting]="state.isExiting()"
        [entryAnimation]="state.entryAnimation()"
        [exitAnimation]="state.exitAnimation()"
        [animationDurationMs]="state.animationDurationMs()"
        [placeholderText]="'Preview Text'"
      />
    </div>
  `,
})
export class LivePreviewComponent {
  readonly state = inject(PresentationStateService);
}
