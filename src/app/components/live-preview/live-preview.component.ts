import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationStateService } from '../../services/presentation-state.service';

@Component({
  selector: 'app-live-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative w-full h-64 sm:h-72 md:h-80 bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
    >
      <!-- Live Preview Header Banner -->
      <div
        class="absolute top-2 left-3 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-full border border-slate-700 text-xs font-medium text-slate-300"
      >
        <span
          class="w-2 h-2 rounded-full"
          [ngClass]="
            state.isPresented()
              ? state.isPaused()
                ? 'bg-amber-400'
                : 'bg-emerald-400 animate-pulse'
              : 'bg-slate-500'
          "
        ></span>
        <span>{{
          state.isPresented() ? (state.isPaused() ? 'PAUSED' : 'LIVE OUTPUT') : 'PREVIEW'
        }}</span>
        @if (
          state.durationSeconds() > 0 &&
          state.activeContent().type !== 'TIMER' &&
          state.activeContent().type !== 'LYRICS'
        ) {
          <span class="text-slate-400 ml-1">({{ state.remainingSeconds() }}s)</span>
        }
      </div>

      <!-- Live Background Layer -->
      <div
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        [ngStyle]="backgroundStyle()"
      >
        @if (state.background().type === 'video' && state.background().mediaUrl) {
          <video
            [src]="state.background().mediaUrl"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover"
          ></video>
        }
      </div>

      <!-- Content Container Layer (Overlay for TEXT, VERSE, TIMER, LYRICS) -->
      @if (state.activeContent().type !== 'MEDIA') {
        <div
          class="relative z-10 w-full h-full flex items-center justify-center p-6 transition-all duration-300 overflow-hidden"
        >
          <div
            [ngClass]="['max-w-full relative', state.isPresented() ? activeAnimationClass() : '']"
            [ngStyle]="contentBoxStyle()"
          >
            <!-- HIGHLIGHT WRAPPER (SOLID / GRADIENT / PICTURE / VIDEO) -->
            <div
              class="relative inline-block overflow-hidden"
              [ngStyle]="highlightContainerStyle()"
            >
              <!-- Highlight Video Background -->
              @if (isHighlightVideo()) {
                <video
                  [src]="state.typography().highlight?.mediaUrl"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                ></video>
              }
              <!-- Text Content Content -->
              <div class="relative z-10">
                @switch (state.activeContent().type) {
                  <!-- Plain Text / Autocomplete -->
                  @case ('TEXT') {
                    <div
                      [ngStyle]="typographyStyle()"
                      class="whitespace-pre-wrap leading-tight text-center"
                    >
                      {{ state.transformedText() || 'Enter text below to preview...' }}
                    </div>
                  }
                  <!-- Verse Reference or Quote -->
                  @case ('VERSE') {
                    <div class="flex flex-col gap-2 text-center">
                      @if (state.activeContent().verseQuote) {
                        <div [ngStyle]="typographyStyle()" class="leading-relaxed text-center">
                          "{{ state.activeContent().verseQuote }}"
                        </div>
                      }
                      @if (state.activeContent().verseRef) {
                        <div
                          class="font-semibold opacity-90 text-center"
                          [ngStyle]="typographyStyle()"
                        >
                          @if (state.activeContent().verseQuote) {
                            <span>— </span>
                          }
                          {{ state.activeContent().verseRef }}
                        </div>
                      }
                    </div>
                  }
                  <!-- Timer Display -->
                  @case ('TIMER') {
                    <div [ngStyle]="typographyStyle()" class="font-mono tracking-wider text-center">
                      {{ timerDisplay() }}
                    </div>
                  }
                  <!-- Song Lyrics Stanza -->
                  @case ('LYRICS') {
                    <div class="flex flex-col gap-2 text-center">
                      @if (state.activeContent().lyricsStanzaTitle) {
                        <div class="text-sm font-semibold tracking-widest uppercase opacity-75">
                          {{ state.activeContent().lyricsStanzaTitle }}
                        </div>
                      }
                      <div
                        [ngStyle]="typographyStyle()"
                        class="whitespace-pre-line leading-snug text-center"
                      >
                        {{
                          state.activeContent().lyricsStanzaBody || 'Select a song stanza below...'
                        }}
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Dedicated MEDIA Preview Layer (Fit / Fill / Original) -->
      @if (state.activeContent().type === 'MEDIA') {
        <div
          class="relative z-10 w-full h-full flex items-center justify-center box-border overflow-hidden"
          [ngClass]="[
            state.isPresented() ? activeAnimationClass() : '',
            state.mediaScaleMode() === 'fill' ? 'p-0' : 'p-3',
          ]"
        >
          <!-- Ambient Blurred Background Fill (Only for 'fit' mode in preview) -->
          @if (
            (state.mediaScaleMode() || 'fit') === 'fit' &&
            (state.activeContent().mediaType === 'image' ||
              state.background().type === 'picture') &&
            (state.activeContent().mediaUrl || state.background().mediaUrl)
          ) {
            <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                [src]="state.activeContent().mediaUrl || state.background().mediaUrl"
                class="w-full h-full object-cover scale-110 filter blur-xl opacity-40 brightness-75 select-none"
                alt="Ambient Blurred Backdrop"
              />
            </div>
          }
          @if (
            (state.mediaScaleMode() || 'fit') === 'fit' &&
            (state.activeContent().mediaType === 'video' || state.background().type === 'video') &&
            (state.activeContent().mediaUrl || state.background().mediaUrl)
          ) {
            <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <video
                [src]="state.activeContent().mediaUrl || state.background().mediaUrl"
                autoplay
                loop
                muted
                playsinline
                class="w-full h-full object-cover scale-110 filter blur-xl opacity-40 brightness-75 select-none"
              ></video>
            </div>
          }
          <!-- Primary Image Output -->
          @if (
            (state.activeContent().mediaType === 'image' ||
              state.background().type === 'picture') &&
            (state.activeContent().mediaUrl || state.background().mediaUrl)
          ) {
            <img
              [src]="state.activeContent().mediaUrl || state.background().mediaUrl"
              [ngClass]="{
                'max-w-full max-h-full object-contain rounded-lg shadow-lg':
                  (state.mediaScaleMode() || 'fit') === 'fit',
                'w-full h-full object-cover rounded-none': state.mediaScaleMode() === 'fill',
                'w-auto h-auto max-w-none max-h-none object-none rounded-lg shadow-lg':
                  state.mediaScaleMode() === 'original',
              }"
              class="relative z-10 select-none transition-all duration-300"
              alt="Media Output"
            />
          }
          <!-- Primary Video Output -->
          @if (
            (state.activeContent().mediaType === 'video' || state.background().type === 'video') &&
            (state.activeContent().mediaUrl || state.background().mediaUrl)
          ) {
            <video
              [src]="state.activeContent().mediaUrl || state.background().mediaUrl"
              autoplay
              loop
              muted
              playsinline
              [ngClass]="{
                'max-w-full max-h-full object-contain rounded-lg shadow-lg':
                  (state.mediaScaleMode() || 'fit') === 'fit',
                'w-full h-full object-cover rounded-none': state.mediaScaleMode() === 'fill',
                'w-auto h-auto max-w-none max-h-none object-none rounded-lg shadow-lg':
                  state.mediaScaleMode() === 'original',
              }"
              class="relative z-10 select-none transition-all duration-300"
            ></video>
          }
          @if (!state.activeContent().mediaUrl && !state.background().mediaUrl) {
            <span class="text-slate-500 italic text-xs z-10">No media loaded</span>
          }
        </div>
      }
    </div>
  `,
})
export class LivePreviewComponent implements OnInit, OnDestroy {
  state = inject(PresentationStateService);

  private tickInterval: any = null;
  readonly liveTick = signal<number>(Date.now());

  ngOnInit() {
    this.tickInterval = setInterval(() => {
      this.liveTick.set(Date.now());
    }, 250);
  }

  ngOnDestroy() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }

  backgroundStyle = computed(() => {
    const bg = this.state.background();
    if (bg.type === 'solid') {
      return { 'background-color': bg.color };
    } else if (bg.type === 'gradient' && bg.gradient) {
      return { 'background-image': bg.gradient };
    } else if (bg.type === 'picture' && bg.mediaUrl) {
      return {
        'background-image': `url('${bg.mediaUrl}')`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    }
    return { 'background-color': '#000000' };
  });

  contentBoxStyle = computed(() => {
    const c = this.state.container();
    const typo = this.state.typography();
    const durationMs = this.state.animationDurationMs();
    const styles: Record<string, string> = {
      'animation-duration': `${durationMs}ms`,
    };

    let transformStr = `rotate(${typo.rotationAngle}deg)`;
    if (typo.flipH) transformStr += ' scaleX(-1)';
    if (typo.flipV) transformStr += ' scaleY(-1)';
    styles['transform'] = transformStr;

    if (c.mode === 'box') {
      styles['background-color'] = c.fillColor;
      styles['width'] = `${c.widthPercent}%`;
      styles['border-radius'] = `${c.cornerRadius}px`;
      styles['padding'] = '1.25rem 2rem';
      styles['backdrop-filter'] = 'blur(8px)';
    } else if (c.mode === 'text-line') {
      styles['background-color'] = c.fillColor;
      styles['border-radius'] = `${c.cornerRadius}px`;
      styles['padding'] = '0.5rem 1rem';
      styles['display'] = 'inline-block';
    }

    return styles;
  });

  highlightContainerStyle = computed(() => {
    const t = this.state.typography();
    const hl = t.highlight;
    const styles: Record<string, string> = {};

    // Legacy or explicit simple highlight
    if (t.highlightColor && (!hl || hl.type === 'none' || hl.type === 'solid')) {
      styles['background-color'] = t.highlightColor;
      styles['padding'] = '4px 10px';
      styles['border-radius'] = '6px';
      return styles;
    }

    if (!hl || hl.type === 'none') {
      return styles;
    }

    const pad = hl.padding ?? 8;
    const rad = hl.borderRadius ?? 8;
    styles['padding'] = `${pad}px ${pad * 1.5}px`;
    styles['border-radius'] = `${rad}px`;

    if (hl.type === 'solid') {
      styles['background-color'] = hl.color || '#FACC15';
    } else if (hl.type === 'gradient') {
      styles['background-image'] = hl.gradient || 'linear-gradient(135deg, #F59E0B, #EF4444)';
    } else if (hl.type === 'picture' && hl.mediaUrl) {
      styles['background-image'] = `url('${hl.mediaUrl}')`;
      styles['background-size'] = 'cover';
      styles['background-position'] = 'center';
    }

    return styles;
  });

  isHighlightVideo = computed(() => {
    const hl = this.state.typography().highlight;
    return hl?.type === 'video' && !!hl.mediaUrl;
  });

  typographyStyle = computed(() => {
    const t = this.state.typography();
    const styles: Record<string, string> = {
      'font-family': `"${t.fontFamily}", sans-serif`,
      'font-size': `${Math.max(14, Math.round(t.fontSize * 0.45))}px`,
      'font-weight': t.bold ? 'bold' : 'normal',
      'font-style': t.italic ? 'italic' : 'normal',
      'letter-spacing': `${t.letterSpacing}px`,
      'text-align': 'center', // Always center in preview
    };

    const decors = [];
    if (t.underline) decors.push('underline');
    if (t.strikethrough) decors.push('line-through');
    if (decors.length) styles['text-decoration'] = decors.join(' ');

    if (t.textFillType === 'gradient') {
      styles['background-image'] = t.textFillGradient;
      styles['-webkit-background-clip'] = 'text';
      styles['background-clip'] = 'text';
      styles['-webkit-text-fill-color'] = 'transparent';
      styles['color'] = 'transparent';
    } else {
      styles['color'] = t.fontColor;
    }

    if (t.textOutlineEnabled) {
      styles['-webkit-text-stroke'] = `${t.textOutlineWeight}px ${t.textOutlineColor}`;
    }

    const textShadows: string[] = [];
    if (t.effects.shadow.enabled) {
      const { blur, distance, angle } = t.effects.shadow;
      const rad = (angle * Math.PI) / 180;
      const x = Math.round(Math.cos(rad) * distance);
      const y = Math.round(Math.sin(rad) * distance);
      textShadows.push(`${x}px ${y}px ${blur}px ${t.effects.shadow.color}`);
    }
    if (t.effects.glow.enabled) {
      textShadows.push(`0 0 ${t.effects.glow.radius}px ${t.effects.glow.color}`);
    }
    if (textShadows.length) {
      styles['text-shadow'] = textShadows.join(', ');
    }

    return styles;
  });

  activeAnimationClass = computed(() => {
    const entry = this.state.entryAnimation();
    switch (entry) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'slide-top':
        return 'animate-slide-down';
      case 'slide-bottom':
        return 'animate-slide-up';
      case 'slide-left':
        return 'animate-slide-left-in';
      case 'slide-right':
        return 'animate-slide-right-in';
      case 'zoom-in':
        return 'animate-zoom-in';
      case 'zoom-in-bounce':
        return 'animate-zoom-in-bounce';
      case 'flip-x':
        return 'animate-flip-x';
      case 'flip-y':
        return 'animate-flip-y';
      case 'blur-in':
        return 'animate-blur-in';
      case 'rotate-in':
        return 'animate-rotate-in';
      case 'exp-h':
        return 'animate-exp-h';
      case 'exp-v':
        return 'animate-exp-v';
      case 'wipe-right':
        return 'animate-wipe-right';
      default:
        return '';
    }
  });

  timerDisplay = computed(() => {
    const tick = this.liveTick(); // Reactive dependency triggers re-computation every tick
    const content = this.state.activeContent();
    const now = new Date(tick);

    if (content.timerMode === 'time-now') {
      if (content.timerClockFormat === '24') {
        return now.toTimeString().split(' ')[0];
      }
      return now.toLocaleTimeString();
    } else if (content.timerMode === 'countdown' && content.timerTargetTimestamp) {
      const diff = content.timerTargetTimestamp - now.getTime();
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
    } else if (
      content.timerMode === 'pomodoro' &&
      content.timerStartTimestamp &&
      typeof content.timerDurationSeconds === 'number'
    ) {
      const elapsed = Math.floor((now.getTime() - content.timerStartTimestamp) / 1000);
      if (content.timerCountUp) {
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else {
        const rem = Math.max(0, content.timerDurationSeconds - elapsed);
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
    return content.timerTarget || '00:00:00';
  });
}
