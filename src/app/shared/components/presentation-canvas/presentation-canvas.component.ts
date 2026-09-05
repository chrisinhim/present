import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ContainerStyle,
  PresentationBackground,
  PresentationState,
  TypographySettings,
} from '../../../models/presentation.models';
import { StyleCompilerService } from '../../../core/styles/style-compiler.service';

@Component({
  selector: 'app-presentation-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    class: 'block w-full h-full relative flex-1',
  },
  template: `
    @let s = computedStyles();
    @let c = content();
    @let isAnim = isPresented();
    @let isExit = isExiting();

    <div
      class="relative w-full h-full overflow-hidden select-none"
      [ngStyle]="s.background"
    >
      <!-- BACKGROUND VIDEO (when background type is video) -->
      @if (background().type === 'video' && background().mediaUrl) {
        <video
          [src]="background().mediaUrl"
          autoplay
          loop
          muted
          playsinline
          class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        ></video>
      }

      <!-- MEDIA TAB DIRECT DISPLAY (Full Screen image/video) -->
      @if (c.type === 'MEDIA') {
        <div class="relative z-10 w-full h-full flex items-center justify-center p-4">
          @if (background().type === 'video' && background().mediaUrl) {
            <!-- Rendered by background video layer -->
          } @else if (background().mediaUrl) {
            <img
              [src]="background().mediaUrl"
              alt="Media Presentation"
              class="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
            />
          }
        </div>
      } @else if (isAnim || isExit || showAlways()) {
        <!-- MAIN CONTENT LAYER (TEXT, VERSE, TIMER, LYRICS) -->
        <div
          class="relative z-10 w-full h-full flex p-6 sm:p-10 overflow-hidden"
          [ngClass]="s.alignmentClasses"
          [ngStyle]="s.containerWrapper"
        >
          <div
            [ngClass]="[
              'max-w-5xl relative',
              isExit ? s.exitAnimationClass : s.entryAnimationClass
            ]"
            [ngStyle]="s.contentBox"
            [style.--anim-duration]="animDurationString()"
          >
            <!-- HIGHLIGHT CONTAINER WRAPPER -->
            <div
              class="relative inline-block"
              [ngStyle]="s.highlightContainer"
            >
              <!-- Highlight Video Layer -->
              @if (typography().highlight.type === 'video' && typography().highlight.mediaUrl) {
                <video
                  [src]="typography().highlight.mediaUrl"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                ></video>
              }

              <!-- CONTENT SWITCH -->
              <div class="relative z-10">
                @switch (c.type) {
                  @case ('TEXT') {
                    <div [ngStyle]="s.typography" class="whitespace-pre-wrap leading-tight">
                      {{ c.text || placeholderText() }}
                    </div>
                  }

                  @case ('VERSE') {
                    <div class="flex flex-col gap-3">
                      @if (c.verseMode === 'REFER' || (!c.verseQuote && c.verseRef)) {
                        <div [ngStyle]="s.typography" class="leading-relaxed whitespace-pre-wrap">
                          {{ cleanReferText(c.verseRef, c.text) }}
                        </div>
                      } @else {
                        @if (c.verseQuote) {
                          <div [ngStyle]="s.typography" class="leading-relaxed">
                            "{{ c.verseQuote }}"
                          </div>
                        }
                        @if (c.verseRef) {
                          <div
                            class="font-semibold tracking-wider opacity-90"
                            [style.font-size]="verseRefFontSize()"
                            [style.color]="typography().fontColor || typography().textFillColor"
                          >
                            — {{ c.verseRef }}
                          </div>
                        }
                      }
                    </div>
                  }

                  @case ('TIMER') {
                    <div [ngStyle]="s.typography" class="tabular-nums font-mono tracking-wider">
                      {{ timerString() }}
                    </div>
                  }

                  @case ('LYRICS') {
                    <div class="flex flex-col gap-2">
                      @if (c.lyricsStanzaTitle) {
                        <span
                          class="text-[11px] uppercase tracking-widest font-bold opacity-60"
                          [style.color]="typography().fontColor || typography().textFillColor"
                        >
                          {{ c.lyricsStanzaTitle }}
                        </span>
                      }
                      <div [ngStyle]="s.typography" class="whitespace-pre-line leading-relaxed">
                        {{ c.lyricsStanzaBody }}
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class PresentationCanvasComponent implements OnInit, OnDestroy {
  private readonly compiler = inject(StyleCompilerService);
  private liveInterval: any = null;
  readonly liveTick = signal<number>(Date.now());

  ngOnInit() {
    this.liveInterval = setInterval(() => {
      this.liveTick.set(Date.now());
    }, 250);
  }

  ngOnDestroy() {
    if (this.liveInterval) clearInterval(this.liveInterval);
  }

  // Inputs
  readonly typography = input.required<TypographySettings>();
  readonly background = input.required<PresentationBackground>();
  readonly container = input.required<ContainerStyle>();
  readonly content = input.required<PresentationState['activeContent']>();

  readonly scale = input<number>(1.0);
  readonly isPresented = input<boolean>(false);
  readonly isExiting = input<boolean>(false);
  readonly showAlways = input<boolean>(false);
  readonly entryAnimation = input<string>('fade-in');
  readonly exitAnimation = input<string>('fade-out');
  readonly animationDurationMs = input<number>(400);
  readonly placeholderText = input<string>('');
  readonly timerOverride = input<string>('');

  readonly animDurationString = computed(() => `${this.animationDurationMs()}ms`);

  readonly timerString = computed(() => {
    if (this.timerOverride()) return this.timerOverride();
    const c = this.content();
    if (c.type !== 'TIMER') return '';

    const tick = this.liveTick();
    if (c.timerMode === 'time-now') {
      const now = new Date(tick);
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      if (c.timerClockFormat === '12') {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = String(h % 12 || 12).padStart(2, '0');
        return `${displayH}:${m}:${s} ${ampm}`;
      }
      return `${String(h).padStart(2, '0')}:${m}:${s}`;
    }

    if (c.timerMode === 'countdown') {
      if (!c.timerTargetTimestamp) return c.timerTarget || '0';
      const diff = c.timerTargetTimestamp - tick;
      if (diff <= 0) return '0';
      const totalSeconds = Math.floor(diff / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else if (m > 0) {
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else {
        return `${String(s).padStart(2, '0')}`;
      }
    }

    if (c.timerMode === 'pomodoro') {
      const totalSec = Math.max(0, c.timerRemaining || 0);
      const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      return `${m}:${s}`;
    }

    return c.timerTarget || '00:00:00';
  });

  readonly computedStyles = computed(() =>
    this.compiler.compile(
      this.typography(),
      this.background(),
      this.container(),
      this.scale(),
      this.isPresented(),
      this.isExiting(),
      this.entryAnimation(),
      this.exitAnimation()
    )
  );

  readonly verseRefFontSize = computed(() => {
    const base = this.typography().fontSize || 48;
    return `${Math.max(12, Math.round(base * 0.55 * this.scale()))}px`;
  });

  cleanReferText(ref?: string, text?: string): string {
    const raw = ref || text || '';
    return raw.replace(/^[\s—–-]+/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  }
}
