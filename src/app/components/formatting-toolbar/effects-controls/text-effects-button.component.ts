import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-text-effects-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative inline-block">
      <button
        (click)="isOpen.set(!isOpen())"
        title="Text Effects (Shadow & Glow)"
        class="h-7 px-2 flex items-center gap-1 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
      >
        <span class="font-serif font-bold">A</span>
        <span>Text Effects</span>
        <span class="text-[9px] text-slate-400">▾</span>
      </button>

      @if (isOpen()) {
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
        <div
          class="absolute left-0 top-8 z-50 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 flex flex-col gap-3 text-xs text-slate-700"
        >
          <!-- Drop Shadow Section -->
          <div class="flex flex-col gap-1.5 pb-2 border-b border-slate-100">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  [ngModel]="state.typography().effects.shadow.enabled"
                  (ngModelChange)="updateShadowEnabled($event)"
                  class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Drop Shadow</span>
              </label>
              <input
                type="color"
                [value]="state.typography().effects.shadow.color || '#000000'"
                (input)="updateShadowColor($event)"
                class="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
            @if (state.typography().effects.shadow.enabled) {
              <div class="flex flex-col gap-1 text-[11px] text-slate-500 pt-1">
                <div class="flex items-center justify-between">
                  <span>Distance: {{ state.typography().effects.shadow.distance }}px</span>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    [ngModel]="state.typography().effects.shadow.distance"
                    (ngModelChange)="updateShadowDistance($event)"
                    class="w-24 accent-sky-600 h-1.5"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span>Blur: {{ state.typography().effects.shadow.blur }}px</span>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    [ngModel]="state.typography().effects.shadow.blur"
                    (ngModelChange)="updateShadowBlur($event)"
                    class="w-24 accent-sky-600 h-1.5"
                  />
                </div>
              </div>
            }
          </div>

          <!-- Glow Aura Section -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  [ngModel]="state.typography().effects.glow.enabled"
                  (ngModelChange)="updateGlowEnabled($event)"
                  class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Glow Aura</span>
              </label>
              <input
                type="color"
                [value]="state.typography().effects.glow.color || '#38bdf8'"
                (input)="updateGlowColor($event)"
                class="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
            @if (state.typography().effects.glow.enabled) {
              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Radius: {{ state.typography().effects.glow.radius }}px</span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  [ngModel]="state.typography().effects.glow.radius"
                  (ngModelChange)="updateGlowRadius($event)"
                  class="w-24 accent-sky-600 h-1.5"
                />
              </div>
            }
          </div>

          <div class="flex justify-end pt-1 border-t border-slate-100">
            <button
              (click)="isOpen.set(false)"
              class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
            >
              Done
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class TextEffectsButtonComponent {
  readonly state = inject(PresentationStateService);
  readonly isOpen = signal<boolean>(false);

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
