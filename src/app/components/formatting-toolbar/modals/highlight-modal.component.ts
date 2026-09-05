import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { HighlightType } from '../../../models/presentation.models';

@Component({
  selector: 'app-highlight-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      [style.left.px]="highlightModalPos().x"
      [style.top.px]="highlightModalPos().y"
      class="fixed z-50 w-80 sm:w-96 bg-slate-900/95 border-2 border-slate-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 text-slate-100 select-none"
    >
      <!-- Draggable Window Header -->
      <div
        (mousedown)="startDragHighlightModal($event)"
        class="flex items-center justify-between border-b border-slate-800 pb-2 cursor-grab active:cursor-grabbing"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">🖍️</span>
          <h3 class="text-sm font-bold tracking-wide">Text Highlight Options</h3>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-slate-500 font-mono">⠿ drag</span>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-base ml-2">
            ✕
          </button>
        </div>
      </div>

      <!-- Mode Selector Tabs (Solid, Gradient, Picture, Video) -->
      <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        <button
          (click)="setHighlightType('solid')"
          [ngClass]="
            highlightTab() === 'solid'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          class="flex-1 py-1 text-xs rounded-lg transition-colors whitespace-nowrap px-1.5"
        >
          Solid
        </button>
        <button
          (click)="setHighlightType('gradient')"
          [ngClass]="
            highlightTab() === 'gradient'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          class="flex-1 py-1 text-xs rounded-lg transition-colors whitespace-nowrap px-1.5"
        >
          Gradient
        </button>
        <button
          (click)="setHighlightType('picture')"
          [ngClass]="
            highlightTab() === 'picture'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          class="flex-1 py-1 text-xs rounded-lg transition-colors whitespace-nowrap px-1.5"
        >
          Picture
        </button>
        <button
          (click)="setHighlightType('video')"
          [ngClass]="
            highlightTab() === 'video'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          class="flex-1 py-1 text-xs rounded-lg transition-colors whitespace-nowrap px-1.5"
        >
          Video
        </button>
      </div>

      <!-- TAB 1: SOLID COLOR HIGHLIGHT -->
      @if (highlightTab() === 'solid') {
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <label class="text-xs text-slate-400">Choose Color:</label>
            <input
              type="color"
              [value]="state.typography().highlight.color || '#FACC15'"
              (input)="updateHighlightSolid($any($event.target).value)"
              class="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>
          <!-- Quick Palette -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-slate-500 font-semibold uppercase">Popular Swatches:</span>
            <div class="flex flex-wrap gap-1.5">
              @for (
                col of [
                  '#FACC15',
                  '#F87171',
                  '#4ADE80',
                  '#38BDF8',
                  '#C084FC',
                  '#FB923C',
                  '#FFFFFF',
                  '#000000',
                ];
                track col
              ) {
                <button
                  (click)="updateHighlightSolid(col)"
                  [style.background-color]="col"
                  class="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                ></button>
              }
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: GRADIENT HIGHLIGHT -->
      @if (highlightTab() === 'gradient') {
        <div class="flex flex-col gap-2">
          <label class="text-xs text-slate-400">Select Preset Gradient:</label>
          <div class="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-0.5">
            @for (grad of popularGradients; track grad) {
              <button
                (click)="updateHighlightGradient(grad)"
                [style.background-image]="grad"
                [ngClass]="
                  state.typography().highlight.gradient === grad
                    ? 'ring-2 ring-sky-400 scale-[1.02]'
                    : 'opacity-80 hover:opacity-100'
                "
                class="h-8 rounded-lg shadow border border-slate-700 transition-all flex items-center justify-center font-bold text-[11px] text-white drop-shadow"
              >
                Preset
              </button>
            }
          </div>
        </div>
      }

      <!-- TAB 3: PICTURE HIGHLIGHT -->
      @if (highlightTab() === 'picture') {
        <div class="flex flex-col gap-2">
          <label class="text-xs text-slate-400">Upload Texture / Picture:</label>
          <input
            type="file"
            accept="image/*"
            (change)="onHighlightMediaSelected($event, 'picture')"
            class="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-300 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
          />
          @if (
            state.typography().highlight.type === 'picture' && state.typography().highlight.mediaUrl
          ) {
            <div class="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
              <img
                [src]="state.typography().highlight.mediaUrl"
                class="w-12 h-8 object-cover rounded"
                alt="Selected highlight"
              />
              <span class="text-[11px] text-slate-300 truncate">{{
                state.typography().highlight.mediaName || 'Custom Picture'
              }}</span>
            </div>
          }
        </div>
      }

      <!-- TAB 4: VIDEO HIGHLIGHT -->
      @if (highlightTab() === 'video') {
        <div class="flex flex-col gap-2">
          <label class="text-xs text-slate-400">Upload Looping Video:</label>
          <input
            type="file"
            accept="video/*"
            (change)="onHighlightMediaSelected($event, 'video')"
            class="bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-300 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
          />
          @if (
            state.typography().highlight.type === 'video' && state.typography().highlight.mediaUrl
          ) {
            <div class="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
              <video
                [src]="state.typography().highlight.mediaUrl"
                class="w-12 h-8 object-cover rounded"
                autoplay
                loop
                muted
              ></video>
              <span class="text-[11px] text-slate-300 truncate">{{
                state.typography().highlight.mediaName || 'Custom Looping Video'
              }}</span>
            </div>
          }
        </div>
      }

      <!-- PADDING & CORNER RADIUS ADJUSTMENTS -->
      @if (highlightTab() !== 'none') {
        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-[10px] text-slate-400">
              <span>Padding</span>
              <span>{{ state.typography().highlight.padding ?? 8 }}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="32"
              [ngModel]="state.typography().highlight.padding ?? 8"
              (ngModelChange)="updateHighlightPadding($event)"
              class="accent-sky-500 h-1.5"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-[10px] text-slate-400">
              <span>Radius</span>
              <span>{{ state.typography().highlight.borderRadius ?? 8 }}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              [ngModel]="state.typography().highlight.borderRadius ?? 8"
              (ngModelChange)="updateHighlightRadius($event)"
              class="accent-sky-500 h-1.5"
            />
          </div>
        </div>
      }

      <!-- Bottom Actions -->
      <div class="flex items-center justify-between pt-1 border-t border-slate-800/80">
        <button
          (click)="clearHighlight(); close.emit()"
          class="px-2.5 py-1 text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-semibold"
        >
          Clear
        </button>
        <button
          (click)="close.emit()"
          class="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  `,
})
export class HighlightModalComponent {
  readonly state = inject(PresentationStateService);
  readonly close = output<void>();

  highlightTab = signal<HighlightType>('solid');
  highlightModalPos = signal<{ x: number; y: number }>({ x: 200, y: 120 });
  private isDraggingModal = false;
  private dragStartOffset = { x: 0, y: 0 };

  popularGradients: string[] = [
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
    'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
    'linear-gradient(135deg, #000000 0%, #434343 100%)',
    'linear-gradient(135deg, #1E3A8A 0%, #065F46 100%)',
  ];

  constructor() {
    const hl = this.state.typography().highlight;
    if (hl && hl.type !== 'none') {
      this.highlightTab.set(hl.type);
    }
  }

  startDragHighlightModal(e: MouseEvent) {
    this.isDraggingModal = true;
    this.dragStartOffset = {
      x: e.clientX - this.highlightModalPos().x,
      y: e.clientY - this.highlightModalPos().y,
    };
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!this.isDraggingModal) return;
      this.highlightModalPos.set({
        x: Math.max(10, Math.min(window.innerWidth - 340, moveEvent.clientX - this.dragStartOffset.x)),
        y: Math.max(10, Math.min(window.innerHeight - 300, moveEvent.clientY - this.dragStartOffset.y)),
      });
    };
    const onMouseUp = () => {
      this.isDraggingModal = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  setHighlightType(type: HighlightType) {
    this.highlightTab.set(type);
    const prev = this.state.typography().highlight;
    this.state.updateTypography({
      highlight: {
        ...prev,
        type,
        color: prev.color || '#FACC15',
        gradient: prev.gradient || this.popularGradients[0],
      },
    });
  }

  updateHighlightSolid(color: string) {
    this.state.updateTypography({
      highlight: {
        ...this.state.typography().highlight,
        type: 'solid',
        color,
      },
    });
  }

  updateHighlightGradient(gradient: string) {
    this.state.updateTypography({
      highlight: {
        ...this.state.typography().highlight,
        type: 'gradient',
        gradient,
      },
    });
  }

  updateHighlightPadding(padding: number) {
    this.state.updateTypography({
      highlight: {
        ...this.state.typography().highlight,
        padding: Number(padding) || 8,
      },
    });
  }

  updateHighlightRadius(borderRadius: number) {
    this.state.updateTypography({
      highlight: {
        ...this.state.typography().highlight,
        borderRadius: Number(borderRadius) || 8,
      },
    });
  }

  onHighlightMediaSelected(e: Event, mode: 'picture' | 'video') {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.state.updateTypography({
        highlight: {
          ...this.state.typography().highlight,
          type: mode,
          mediaUrl: reader.result as string,
          mediaName: file.name,
        },
      });
    };
    reader.readAsDataURL(file);
  }

  clearHighlight() {
    this.state.updateTypography({
      highlight: {
        type: 'none',
        color: '',
        gradient: '',
        mediaUrl: '',
        mediaName: '',
      },
      highlightColor: '',
    });
  }
}
