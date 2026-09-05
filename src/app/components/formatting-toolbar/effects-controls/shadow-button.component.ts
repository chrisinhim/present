import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-shadow-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-1.5 p-2 bg-slate-800/60 rounded-xl border border-slate-700">
      <div class="flex items-center justify-between gap-3">
        <label class="text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            [ngModel]="state.typography().effects.shadow.enabled"
            (ngModelChange)="updateShadowEnabled($event)"
            class="rounded bg-slate-900 border-slate-700 text-sky-600"
          />
          <span>Drop Shadow</span>
        </label>
        @if (state.typography().effects.shadow.enabled) {
          <input
            type="color"
            [value]="state.typography().effects.shadow.color || '#000000'"
            (input)="updateShadowColor($event)"
            class="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
          />
        }
      </div>
      @if (state.typography().effects.shadow.enabled) {
        <div class="flex items-center gap-3 text-[11px] text-slate-400">
          <div class="flex items-center gap-1">
            <span>Dist:</span>
            <input
              type="range"
              min="0"
              max="30"
              [ngModel]="state.typography().effects.shadow.distance"
              (ngModelChange)="updateShadowDistance($event)"
              class="w-16 accent-sky-500"
            />
            <span class="font-mono text-slate-300">{{ state.typography().effects.shadow.distance }}px</span>
          </div>
          <div class="flex items-center gap-1">
            <span>Blur:</span>
            <input
              type="range"
              min="0"
              max="30"
              [ngModel]="state.typography().effects.shadow.blur"
              (ngModelChange)="updateShadowBlur($event)"
              class="w-16 accent-sky-500"
            />
            <span class="font-mono text-slate-300">{{ state.typography().effects.shadow.blur }}px</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class ShadowButtonComponent {
  readonly state = inject(PresentationStateService);

  updateShadowEnabled(enabled: boolean) {
    const shadow = { ...this.state.typography().effects.shadow, enabled };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, shadow },
    });
  }

  updateShadowColor(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input) return;
    const shadow = { ...this.state.typography().effects.shadow, color: input.value };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, shadow },
    });
  }

  updateShadowDistance(distance: number) {
    const shadow = { ...this.state.typography().effects.shadow, distance: Number(distance) || 0 };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, shadow },
    });
  }

  updateShadowBlur(blur: number) {
    const shadow = { ...this.state.typography().effects.shadow, blur: Number(blur) || 0 };
    this.state.updateTypography({
      effects: { ...this.state.typography().effects, shadow },
    });
  }
}
