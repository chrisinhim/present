import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ContainerStyle,
  CustomFont,
  EntryAnimation,
  ExitAnimation,
  PresentationBackground,
  PresentationState,
  TypographySettings,
} from '../../models/presentation.models';
import { FontManagerService } from '../../services/font-manager.service';

@Component({
  selector: 'app-presentation-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (dblclick)="toggleFullscreen()"
      class="relative w-screen h-screen bg-black overflow-hidden flex flex-col select-none cursor-pointer"
    >
      <!-- BACKGROUND LAYER -->
      <div
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        [ngStyle]="backgroundStyle()"
      >
        @if (background().type === 'video' && background().mediaUrl) {
          <video
            [src]="background().mediaUrl"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover"
          ></video>
        }
      </div>

      <!-- MAIN PRESENTATION CONTENT CONTAINER -->
      <!-- Standard Overlay Mode for TEXT, VERSE, TIMER, LYRICS -->
      @if ((isPresented() || isExiting()) && activeContent().type !== 'MEDIA') {
        <div
          class="relative z-10 w-full h-full flex p-12 transition-all duration-300 overflow-hidden"
          [ngClass]="alignmentClasses()"
          [ngStyle]="containerWrapperStyle()"
        >
          <div
            [ngClass]="[
              'max-w-5xl relative',
              isExiting() ? activeExitAnimationClass() : activeEntryAnimationClass(),
            ]"
            [ngStyle]="contentBoxStyle()"
          >
            <!-- HIGHLIGHT WRAPPER LAYER (SOLID, GRADIENT, PICTURE, VIDEO) -->
            <div
              class="relative inline-block overflow-hidden"
              [ngStyle]="highlightContainerStyle()"
            >
              <!-- Video Highlight Element -->
              @if (isHighlightVideo()) {
                <video
                  [src]="typography().highlight?.mediaUrl"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                ></video>
              }
              <!-- Active Content Render -->
              <div class="relative z-10">
                @switch (activeContent().type) {
                  <!-- Plain Text -->
                  @case ('TEXT') {
                    <div [ngStyle]="typographyStyle()" class="whitespace-pre-wrap leading-tight">
                      {{ activeContent().text }}
                    </div>
                  }
                  <!-- Verse Reference or Quote -->
                  @case ('VERSE') {
                    <div class="flex flex-col gap-4">
                      @if (activeContent().verseQuote) {
                        <div [ngStyle]="typographyStyle()" class="leading-relaxed">
                          "{{ activeContent().verseQuote }}"
                        </div>
                      }
                      @if (activeContent().verseRef) {
                        <div
                          [ngClass]="
                            activeContent().verseQuote
                              ? 'text-right font-bold opacity-90 tracking-wide'
                              : 'text-center font-bold tracking-wide'
                          "
                          [ngStyle]="typographyStyle()"
                        >
                          @if (activeContent().verseQuote) {
                            <span>— </span>
                          }
                          {{ activeContent().verseRef }}
                        </div>
                      }
                    </div>
                  }
                  <!-- Timer Display (Live Ticking) -->
                  @case ('TIMER') {
                    <div [ngStyle]="typographyStyle()" class="font-mono tracking-wider font-bold">
                      {{ timerDisplay() }}
                    </div>
                  }
                  <!-- Song Lyrics Stanza -->
                  @case ('LYRICS') {
                    <div class="flex flex-col gap-4 text-center">
                      @if (activeContent().lyricsStanzaTitle) {
                        <div class="text-xl font-bold tracking-widest uppercase opacity-70">
                          {{ activeContent().lyricsStanzaTitle }}
                        </div>
                      }
                      <div
                        [ngStyle]="typographyStyle()"
                        class="whitespace-pre-line leading-relaxed"
                      >
                        {{ activeContent().lyricsStanzaBody }}
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Dedicated MEDIA Present Mode (Fit / Fill / Original) -->
      @if ((isPresented() || isExiting()) && activeContent().type === 'MEDIA') {
        <div
          class="relative z-10 w-full h-full flex items-center justify-center box-border overflow-hidden"
          [ngClass]="[
            isExiting() ? activeExitAnimationClass() : activeEntryAnimationClass(),
            activeContent().mediaScaleMode === 'fill' ? 'p-0' : 'p-4 sm:p-8',
          ]"
        >
          <!-- Ambient Blurred Background Fill (Only for 'fit' mode when aspect ratios differ) -->
          @if (
            (activeContent().mediaScaleMode || 'fit') === 'fit' &&
            (activeContent().mediaType === 'image' || background().type === 'picture') &&
            (activeContent().mediaUrl || background().mediaUrl)
          ) {
            <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                [src]="activeContent().mediaUrl || background().mediaUrl"
                class="w-full h-full object-cover scale-110 filter blur-2xl opacity-40 brightness-75 select-none"
                alt="Ambient Blurred Backdrop"
              />
            </div>
          }
          @if (
            (activeContent().mediaScaleMode || 'fit') === 'fit' &&
            (activeContent().mediaType === 'video' || background().type === 'video') &&
            (activeContent().mediaUrl || background().mediaUrl)
          ) {
            <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <video
                [src]="activeContent().mediaUrl || background().mediaUrl"
                autoplay
                loop
                muted
                playsinline
                class="w-full h-full object-cover scale-110 filter blur-2xl opacity-40 brightness-75 select-none"
              ></video>
            </div>
          }
          <!-- Primary Image Output -->
          @if (
            (activeContent().mediaType === 'image' || background().type === 'picture') &&
            (activeContent().mediaUrl || background().mediaUrl)
          ) {
            <img
              [src]="activeContent().mediaUrl || background().mediaUrl"
              [ngClass]="{
                'max-w-full max-h-full object-contain rounded-xl shadow-2xl drop-shadow-2xl':
                  (activeContent().mediaScaleMode || 'fit') === 'fit',
                'w-full h-full object-cover rounded-none':
                  activeContent().mediaScaleMode === 'fill',
                'w-auto h-auto max-w-none max-h-none object-none rounded-xl shadow-2xl':
                  activeContent().mediaScaleMode === 'original',
              }"
              class="relative z-10 select-none transition-all duration-300"
              alt="Media Output"
            />
          }
          <!-- Primary Video Output -->
          @if (
            (activeContent().mediaType === 'video' || background().type === 'video') &&
            (activeContent().mediaUrl || background().mediaUrl)
          ) {
            <video
              #primaryVideo
              [src]="activeContent().mediaUrl || background().mediaUrl"
              [loop]="activeContent().videoLoop !== false"
              [muted]="activeContent().videoMuted ?? false"
              autoplay
              playsinline
              (timeupdate)="onVideoTimeUpdate(primaryVideo)"
              (loadedmetadata)="onVideoLoadedMetadata(primaryVideo)"
              [ngClass]="{
                'max-w-full max-h-full object-contain rounded-xl shadow-2xl drop-shadow-2xl':
                  (activeContent().mediaScaleMode || 'fit') === 'fit',
                'w-full h-full object-cover rounded-none':
                  activeContent().mediaScaleMode === 'fill',
                'w-auto h-auto max-w-none max-h-none object-none rounded-xl shadow-2xl':
                  activeContent().mediaScaleMode === 'original',
              }"
              class="relative z-10 select-none transition-all duration-300"
            ></video>
          }
        </div>
      }
    </div>
  `,
})
export class PresentationViewComponent implements OnInit, OnDestroy {
  readonly primaryVideoRef = viewChild<ElementRef<HTMLVideoElement>>('primaryVideo');
  private fontManager = inject(FontManagerService);
  private broadcastChannel: BroadcastChannel | null = null;
  private exitTimer: any = null;

  isPresented = signal<boolean>(false);
  isExiting = signal<boolean>(false);
  isPaused = signal<boolean>(false);
  activeContent = signal<PresentationState['activeContent']>({ type: 'TEXT', text: '' });
  animationDurationMs = signal<number>(400);

  typography = signal<TypographySettings>({
    fontFamily: 'Aptos',
    fontSize: 56,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    letterSpacing: 0,
    caseTransform: 'none',
    highlightColor: '',
    highlight: {
      type: 'none',
      color: '#FACC15',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      mediaUrl: '',
      opacity: 1,
      padding: 12,
      borderRadius: 12,
    },
    fontColor: '#FFFFFF',
    alignment: 'center',
    verticalAlignment: 'middle',
    offsetX: 0,
    offsetY: 0,
    rotationAngle: 0,
    flipH: false,
    flipV: false,
    textFillType: 'solid',
    textFillColor: '#FFFFFF',
    textFillGradient: '',
    textOutlineEnabled: false,
    textOutlineColor: '#000000',
    textOutlineWeight: 2,
    effects: {
      shadow: { enabled: true, blur: 6, distance: 4, angle: 45, opacity: 0.8, color: '#000000' },
      reflection: { enabled: false, offset: 4, opacity: 0.3 },
      glow: { enabled: false, radius: 10, color: '#38BDF8' },
      bevel: { enabled: false, intensity: 2 },
    },
  });

  background = signal<PresentationBackground>({ type: 'solid', color: '#000000', mediaUrl: '' });
  container = signal<ContainerStyle>({
    mode: 'none',
    widthPercent: 90,
    cornerRadius: 8,
    fillColor: 'rgba(0,0,0,0.6)',
  });
  entryAnimation = signal<EntryAnimation>('fade-in');
  exitAnimation = signal<ExitAnimation>('fade-out');

  // Real-time ticking for Clock / Countdown in present view
  private liveTimerInterval: any = null;
  readonly liveTimeString = signal<string>('');

  readonly timerDisplay = computed(() => {
    const content = this.activeContent();
    if (content.type !== 'TIMER') return '';

    return this.liveTimeString() || content.timerTarget || '00:00:00';
  });

  ngOnInit() {
    this.updateLiveTime();
    this.liveTimerInterval = setInterval(() => {
      this.updateLiveTime();
    }, 250);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('presentation_sync_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE' && event.data.state) {
          const s = event.data.state;
          if (s.typography) {
            this.typography.set(s.typography);
            this.ensureFont(s.typography.fontFamily, s.customFonts);
          }
          if (s.background) this.background.set(s.background);
          if (s.container) this.container.set(s.container);
          if (s.entryAnimation) this.entryAnimation.set(s.entryAnimation);
          if (s.exitAnimation) this.exitAnimation.set(s.exitAnimation);
          if (typeof s.animationDurationMs === 'number')
            this.animationDurationMs.set(s.animationDurationMs);

          if (typeof s.isPresented === 'boolean') {
            if (this.isPresented() && !s.isPresented) {
              this.handleExit();
            } else if (!this.isPresented() && s.isPresented) {
              if (this.exitTimer) clearTimeout(this.exitTimer);
              this.isExiting.set(false);
              this.isPresented.set(true);
            }
          }

          if (typeof s.isPaused === 'boolean') this.isPaused.set(s.isPaused);
          if (s.activeContent) this.activeContent.set(s.activeContent);
          if (s.customFonts) this.syncCustomFonts(s.customFonts);
        } else if (event.data?.type === 'SYNC_POSITION' && event.data.position) {
          const p = event.data.position;
          this.typography.update((curr) => ({
            ...curr,
            offsetX: p.offsetX,
            offsetY: p.offsetY,
            alignment: p.alignment,
            verticalAlignment: p.verticalAlignment,
            rotationAngle: p.rotationAngle,
            flipH: p.flipH,
            flipV: p.flipV,
          }));
        } else if (event.data?.type === 'VIDEO_ACTION') {
          const vid = this.primaryVideoRef()?.nativeElement;
          if (vid) {
            if (event.data.action === 'PLAY') vid.play().catch(() => {});
            else if (event.data.action === 'PAUSE') vid.pause();
            else if (event.data.action === 'SEEK' && typeof event.data.currentTime === 'number')
              vid.currentTime = event.data.currentTime;
            else if (event.data.action === 'MUTE' && typeof event.data.muted === 'boolean')
              vid.muted = event.data.muted;
            else if (event.data.action === 'LOOP' && typeof event.data.loop === 'boolean')
              vid.loop = event.data.loop;
          }
        }
      };

      this.broadcastChannel.postMessage({ type: 'REQUEST_STATE' });
    }
  }

  onVideoTimeUpdate(videoEl: HTMLVideoElement) {
    if (this.broadcastChannel && videoEl) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_TIME_UPDATE',
        currentTime: videoEl.currentTime,
        duration: videoEl.duration || 0,
      });
    }
  }

  onVideoLoadedMetadata(videoEl: HTMLVideoElement) {
    if (this.broadcastChannel && videoEl) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_TIME_UPDATE',
        currentTime: videoEl.currentTime,
        duration: videoEl.duration || 0,
      });
    }
  }

  private handleExit() {
    const exitAnim = this.exitAnimation();
    if (exitAnim === 'none') {
      this.isPresented.set(false);
      this.isExiting.set(false);
      return;
    }

    this.isExiting.set(true);
    this.isPresented.set(false);

    if (this.exitTimer) clearTimeout(this.exitTimer);
    const duration = this.animationDurationMs();
    this.exitTimer = setTimeout(() => {
      this.isExiting.set(false);
    }, duration);
  }

  private syncCustomFonts(fonts: CustomFont[]) {
    fonts.forEach((f) => {
      if (f.source === 'google') this.fontManager.loadGoogleFont(f.name);
      else if (f.source === 'local' && f.dataUrl) this.fontManager.loadLocalFont(f.name, f.dataUrl);
    });
  }

  private ensureFont(family: string, customFonts?: CustomFont[]) {
    if (!family) return;
    const match = customFonts?.find((f) => f.name.toLowerCase() === family.toLowerCase());
    if (match) {
      if (match.source === 'google') this.fontManager.loadGoogleFont(match.name);
      else if (match.source === 'local' && match.dataUrl)
        this.fontManager.loadLocalFont(match.name, match.dataUrl);
    } else {
      this.fontManager.loadGoogleFont(family);
    }
  }

  private updateLiveTime() {
    const content = this.activeContent();
    const now = new Date();

    if (content.timerMode === 'time-now') {
      if (content.timerClockFormat === '24') {
        this.liveTimeString.set(now.toTimeString().split(' ')[0]);
      } else {
        this.liveTimeString.set(now.toLocaleTimeString());
      }
    } else if (content.timerMode === 'countdown' && content.timerTargetTimestamp) {
      const diff = content.timerTargetTimestamp - now.getTime();
      if (diff <= 0) {
        this.liveTimeString.set('0');
        // Countdown reached zero -> Trigger Exit Animation and hide
        if (this.isPresented() && !this.isExiting()) {
          this.handleExit();
          if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({ type: 'HIDE_PRESENTATION' });
          }
        }
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        let str = '';
        if (h > 0) {
          // >= 1 hour: HH:MM:SS
          str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else if (m > 0) {
          // < 1 hour: MM:SS
          str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else {
          // < 1 minute: SS
          str = `${String(s).padStart(2, '0')}`;
        }
        this.liveTimeString.set(str);
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
        this.liveTimeString.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      } else {
        const rem = Math.max(0, content.timerDurationSeconds - elapsed);
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        this.liveTimeString.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    }
  }

  ngOnDestroy() {
    if (this.liveTimerInterval) clearInterval(this.liveTimerInterval);
    if (this.exitTimer) clearTimeout(this.exitTimer);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'POPUP_CLOSED' });
      this.broadcastChannel.close();
    }
  }

  @HostListener('window:pagehide')
  saveGeometry() {
    if (typeof window !== 'undefined' && this.broadcastChannel) {
      const geometry = {
        width: window.outerWidth,
        height: window.outerHeight,
        x: window.screenX,
        y: window.screenY,
      };
      this.broadcastChannel.postMessage({ type: 'POPUP_GEOMETRY', geometry });
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleWindowKeydown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'TOGGLE_PLAY_PAUSE' });
      }
    } else if (event.key === 'Escape') {
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'HIDE_PRESENTATION' });
      }
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  }

  alignmentClasses(): string {
    const t = this.typography();
    const h =
      t.alignment === 'left'
        ? 'justify-start'
        : t.alignment === 'right'
          ? 'justify-end'
          : 'justify-center';
    const v =
      t.verticalAlignment === 'top'
        ? 'items-start'
        : t.verticalAlignment === 'bottom'
          ? 'items-end'
          : 'items-center';
    return `${h} ${v}`;
  }

  backgroundStyle(): Record<string, string> {
    const bg = this.background();
    if (bg.type === 'solid') return { 'background-color': bg.color };
    if (bg.type === 'gradient' && bg.gradient) {
      return { 'background-image': bg.gradient };
    }
    if (bg.type === 'picture' && bg.mediaUrl) {
      return {
        'background-image': `url('${bg.mediaUrl}')`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    }
    return { 'background-color': '#000000' };
  }

  containerWrapperStyle(): Record<string, string> {
    const t = this.typography();
    return {
      transform: `translate(${t.offsetX}px, ${t.offsetY}px)`,
    };
  }

  contentBoxStyle(): Record<string, string> {
    const c = this.container();
    const t = this.typography();
    const durationMs = this.animationDurationMs();
    const styles: Record<string, string> = {
      'animation-duration': `${durationMs}ms`,
    };

    let transformStr = `rotate(${t.rotationAngle}deg)`;
    if (t.flipH) transformStr += ' scaleX(-1)';
    if (t.flipV) transformStr += ' scaleY(-1)';
    styles['transform'] = transformStr;

    if (c.mode === 'box') {
      styles['background-color'] = c.fillColor;
      styles['width'] = `${c.widthPercent}%`;
      styles['border-radius'] = `${c.cornerRadius}px`;
      styles['padding'] = '2rem 3rem';
      styles['backdrop-filter'] = 'blur(10px)';
    } else if (c.mode === 'text-line') {
      styles['background-color'] = c.fillColor;
      styles['border-radius'] = `${c.cornerRadius}px`;
      styles['padding'] = '0.75rem 1.5rem';
      styles['display'] = 'inline-block';
    }

    return styles;
  }

  highlightContainerStyle(): Record<string, string> {
    const t = this.typography();
    const hl = t.highlight;
    const styles: Record<string, string> = {};

    if (t.highlightColor && (!hl || hl.type === 'none' || hl.type === 'solid')) {
      styles['background-color'] = t.highlightColor;
      styles['padding'] = '8px 16px';
      styles['border-radius'] = '8px';
      return styles;
    }

    if (!hl || hl.type === 'none') {
      return styles;
    }

    const pad = (hl.padding ?? 8) * 1.5;
    const rad = (hl.borderRadius ?? 8) * 1.5;
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
  }

  isHighlightVideo(): boolean {
    const hl = this.typography().highlight;
    return hl?.type === 'video' && !!hl.mediaUrl;
  }

  typographyStyle(): Record<string, string> {
    const t = this.typography();
    const styles: Record<string, string> = {
      'font-family': `"${t.fontFamily}", sans-serif`,
      'font-size': `${t.fontSize}px`,
      'font-weight': t.bold ? 'bold' : 'normal',
      'font-style': t.italic ? 'italic' : 'normal',
      'letter-spacing': `${t.letterSpacing}px`,
      'text-align': t.alignment,
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

    const shadows: string[] = [];
    if (t.effects.shadow.enabled) {
      const { blur, distance, angle, color } = t.effects.shadow;
      const rad = (angle * Math.PI) / 180;
      const x = Math.round(Math.cos(rad) * distance);
      const y = Math.round(Math.sin(rad) * distance);
      shadows.push(`${x}px ${y}px ${blur}px ${color}`);
    }
    if (t.effects.glow.enabled) {
      shadows.push(`0 0 ${t.effects.glow.radius}px ${t.effects.glow.color}`);
    }
    if (shadows.length) {
      styles['text-shadow'] = shadows.join(', ');
    }

    return styles;
  }

  activeEntryAnimationClass(): string {
    const entry = this.entryAnimation();
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
  }

  activeExitAnimationClass(): string {
    const exit = this.exitAnimation();
    switch (exit) {
      case 'fade-out':
        return 'animate-fade-out';
      case 'slide-bottom':
        return 'animate-slide-out-bottom';
      case 'slide-top':
        return 'animate-slide-out-top';
      case 'slide-left':
        return 'animate-slide-out-left';
      case 'slide-right':
        return 'animate-slide-out-right';
      case 'zoom-out':
        return 'animate-zoom-out';
      case 'flip-x-out':
        return 'animate-flip-x-out';
      case 'flip-y-out':
        return 'animate-flip-y-out';
      case 'blur-out':
        return 'animate-blur-out';
      case 'rotate-out':
        return 'animate-rotate-out';
      case 'con-h':
        return 'animate-con-h';
      case 'con-v':
        return 'animate-con-v';
      case 'wipe-left':
        return 'animate-wipe-left';
      default:
        return '';
    }
  }
}
