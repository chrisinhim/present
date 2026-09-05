import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-glow-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1.5 p-2 bg-slate-800/60 rounded-xl border border-slate-700">
      <div class="flex items-center justify-between gap-3">
        <label class="text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            [ngModel]="state.typography().effects.glow.enabled"
            (ngModelChange)="updateGlowEnabled($event)"
            class="rounded bg-slate-900 border-slate-700 text-sky-600"
          />
          <span>Glow Aura</span>
        </label>
        @if (state.typography().effects.glow.enabled) {
          <input
            type="color"
            [value]="state.typography().effects.glow.color || '#38bdf8'"
            (input)="updateGlowColor($event)"
            class="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
          />
        }
      </div>
      @if (state.typography().effects.glow.enabled) {
        <div class="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Radius:</span>
          <input
            type="range"
            min="2"
            max="40"
            [ngModel]="state.typography().effects.glow.radius"
            (ngModelChange)="updateGlowRadius($event)"
            class="w-20 accent-sky-500"
          />
          <span class="font-mono text-slate-300">{{ state.typography().effects.glow.radius }}px</span>
        </div>
      }
    </div>
  `,
})
export class GlowButtonComponent {
  readonly state = inject(PresentationStateService);

  updateGlowEnabled(enabled: boolean) {
    const glow = { ...this.state.typography().effects.glow, enabled };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, glow },
    });
  }

  updateGlowColor(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input) return;
    const glow = { ...this.state.typography().effects.glow, color: input.value };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, glow },
    });
  }

  updateGlowRadius(radius: number) {
    const glow = { ...this.state.typography().effects.glow, radius: Number(radius) || 10 };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, glow },
    });
  }
}
