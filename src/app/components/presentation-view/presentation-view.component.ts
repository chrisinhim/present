import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
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
  VideoActionMessage,
  VideoTimeUpdateMessage,
} from '../../models/presentation.models';
import { FontManagerService } from '../../services/font-manager.service';
import { PresentationCanvasComponent } from '../../shared/components/presentation-canvas/presentation-canvas.component';

@Component({
  selector: 'app-presentation-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PresentationCanvasComponent],
  template: `
    <div
      (dblclick)="toggleFullscreen()"
      class="relative w-screen h-screen bg-black overflow-hidden flex flex-col select-none cursor-pointer"
    >
      <!-- ACCESSIBILITY ARIA LIVE REGION -->
      <div
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        {{ ariaAnnouncement() }}
      </div>

      <!-- SHARED CANVAS RENDERING (FULL SCREEN STAGE) -->
      <app-presentation-canvas
        class="block w-full h-full flex-1"
        [typography]="typography()"
        [background]="background()"
        [container]="container()"
        [content]="activeContent()"
        [scale]="1.0"
        [isPresented]="isPresented()"
        [isExiting]="isExiting()"
        [entryAnimation]="entryAnimation()"
        [exitAnimation]="exitAnimation()"
        [animationDurationMs]="animationDurationMs()"
        [timerOverride]="liveTimeString()"
      />

      <!-- MEDIA TAB DIRECT VIDEO HANDLER -->
      @if (
        activeContent().type === 'MEDIA' &&
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
          class="hidden"
        ></video>
      }
    </div>
  `,
})
export class PresentationViewComponent implements OnInit, OnDestroy {
  readonly primaryVideoRef = viewChild<ElementRef<HTMLVideoElement>>('primaryVideo');
  private fontManager = inject(FontManagerService);
  private broadcastChannel: BroadcastChannel | null = null;
  private exitTimer: any = null;
  private backgroundObjectUrl = '';
  private highlightObjectUrl = '';
  private activeContentObjectUrl = '';
  private backgroundBlob?: Blob;
  private highlightBlob?: Blob;
  private activeContentBlob?: Blob;

  isPresented = signal<boolean>(false);
  isExiting = signal<boolean>(false);
  isPaused = signal<boolean>(false);
  activeContent = signal<PresentationState['activeContent']>({ type: 'TEXT', text: '' });
  animationDurationMs = signal<number>(400);

  typography = signal<TypographySettings>({
    fontFamily: 'Aptos',
    fontSize: 56,
    lineSpacing: 58,
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

  private liveTimerInterval: any = null;
  readonly liveTimeString = signal<string>('');
  readonly ariaAnnouncement = signal<string>('');

  constructor() {
    effect(() => {
      const isTimer = this.activeContent().type === 'TIMER';
      if (isTimer) {
        if (!this.liveTimerInterval) {
          this.updateLiveTime();
          this.liveTimerInterval = setInterval(() => {
            this.updateLiveTime();
          }, 250);
        }
      } else {
        if (this.liveTimerInterval) {
          clearInterval(this.liveTimerInterval);
          this.liveTimerInterval = null;
        }
        this.liveTimeString.set('');
      }
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('presentation_sync_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE' && event.data.state) {
          const s = event.data.state;
          const media = event.data.media || {};
          if (s.typography) {
            const highlightUrl = this.replaceObjectUrl('highlight', media.highlightBlob);
            const safeHighlightUrl = highlightUrl || (s.typography.highlight?.mediaUrl?.startsWith('blob:') ? '' : s.typography.highlight?.mediaUrl || '');
            this.typography.set({
              ...s.typography,
              highlight: {
                ...s.typography.highlight,
                mediaUrl: safeHighlightUrl,
              },
            });
            this.ensureFont(s.typography.fontFamily, s.customFonts);
          }
          if (s.background) {
            const backgroundUrl = this.replaceObjectUrl('background', media.backgroundBlob);
            const safeBackgroundUrl = backgroundUrl || (s.background.mediaUrl?.startsWith('blob:') ? '' : s.background.mediaUrl || '');
            this.background.set({ ...s.background, mediaUrl: safeBackgroundUrl });
          }
          if (s.container) this.container.set(s.container);
          if (s.entryAnimation) this.entryAnimation.set(s.entryAnimation);
          if (s.exitAnimation) this.exitAnimation.set(s.exitAnimation);
          if (typeof s.animationDurationMs === 'number')
            this.animationDurationMs.set(s.animationDurationMs);

          if (typeof s.isExiting === 'boolean') {
            this.isExiting.set(s.isExiting);
            if (s.isExiting) {
              this.ariaAnnouncement.set('Presentation cleared');
            }
          }

          if (typeof s.isPresented === 'boolean') {
            const wasPresented = this.isPresented();
            this.isPresented.set(s.isPresented);
            if (!wasPresented && s.isPresented) {
              this.isExiting.set(false);
              const summary = s.activeContent?.text || s.activeContent?.verseRef || 'Presentation';
              this.ariaAnnouncement.set(`Now presenting: ${summary}`);
            } else if (wasPresented && !s.isPresented) {
              this.ariaAnnouncement.set('Presentation cleared');
            }
          }

          if (typeof s.isPaused === 'boolean') this.isPaused.set(s.isPaused);
          if (s.activeContent) {
            const activeContentUrl = this.replaceObjectUrl('activeContent', media.activeContentBlob);
            const safeActiveUrl = activeContentUrl || (s.activeContent.mediaUrl?.startsWith('blob:') ? '' : s.activeContent.mediaUrl || '');
            this.activeContent.set({ ...s.activeContent, mediaUrl: safeActiveUrl });
          }
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
          this.handleVideoAction(event.data);
        }
      };

      this.broadcastChannel.postMessage({ type: 'REQUEST_STATE' });
    }
  }

  private replaceObjectUrl(kind: 'background' | 'highlight' | 'activeContent', blob?: Blob): string {
    const currentUrl =
      kind === 'background'
        ? this.backgroundObjectUrl
        : kind === 'highlight'
          ? this.highlightObjectUrl
          : this.activeContentObjectUrl;
    const currentBlob =
      kind === 'background'
        ? this.backgroundBlob
        : kind === 'highlight'
          ? this.highlightBlob
          : this.activeContentBlob;

    if (blob && currentBlob === blob && currentUrl) {
      return currentUrl;
    }

    if (currentUrl) URL.revokeObjectURL(currentUrl);
    const nextUrl = blob ? URL.createObjectURL(blob) : '';
    if (kind === 'background') {
      this.backgroundObjectUrl = nextUrl;
      this.backgroundBlob = blob;
    } else if (kind === 'highlight') {
      this.highlightObjectUrl = nextUrl;
      this.highlightBlob = blob;
    } else {
      this.activeContentObjectUrl = nextUrl;
      this.activeContentBlob = blob;
    }
    return nextUrl;
  }

  ngOnDestroy() {
    if (this.liveTimerInterval) clearInterval(this.liveTimerInterval);
    if (this.exitTimer) clearTimeout(this.exitTimer);
    this.replaceObjectUrl('background');
    this.replaceObjectUrl('highlight');
    this.replaceObjectUrl('activeContent');
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }


  private handleVideoAction(data: VideoActionMessage) {
    const video = this.primaryVideoRef()?.nativeElement;
    if (!video) return;

    const action = data.action;
    const seekTime = data.currentTime ?? (data as any).time;

    if (action === 'PLAY' || (action as string) === 'play') {
      video.play().catch(() => {});
    } else if (action === 'PAUSE' || (action as string) === 'pause') {
      video.pause();
    } else if ((action === 'SEEK' || (action as string) === 'seek') && typeof seekTime === 'number') {
      video.currentTime = seekTime;
    } else if ((action === 'LOOP' || (action as string) === 'loop') && typeof data.loop === 'boolean') {
      video.loop = data.loop;
    } else if ((action === 'VOLUME' || (action as string) === 'volume') && typeof data.volume === 'number') {
      video.volume = data.volume;
    } else if ((action === 'MUTE' || (action as string) === 'mute') && typeof data.muted === 'boolean') {
      video.muted = data.muted;
    }
  }

  onVideoTimeUpdate(video: HTMLVideoElement) {
    if (!this.broadcastChannel) return;
    const message: VideoTimeUpdateMessage = {
      type: 'VIDEO_TIME_UPDATE',
      currentTime: video.currentTime,
      duration: video.duration || 0,
      paused: video.paused,
    };
    this.broadcastChannel.postMessage(message);
  }

  private updateLiveTime() {
    const content = this.activeContent();
    if (content.type !== 'TIMER') return;

    const now = new Date();
    if (content.timerMode === 'time-now') {
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      if (content.timerClockFormat === '12') {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = String(h % 12 || 12).padStart(2, '0');
        this.liveTimeString.set(`${displayH}:${m}:${s} ${ampm}`);
      } else {
        const displayH = String(h).padStart(2, '0');
        this.liveTimeString.set(`${displayH}:${m}:${s}`);
      }
    } else if (content.timerMode === 'countdown') {
      if (!content.timerTargetTimestamp) {
        this.liveTimeString.set('0');
        return;
      }
      const diffMs = content.timerTargetTimestamp - Date.now();
      if (diffMs <= 0) {
        this.liveTimeString.set('0');
        return;
      }
      const diffSec = Math.floor(diffMs / 1000);
      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;

      if (h > 0) {
        this.liveTimeString.set(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      } else if (m > 0) {
        this.liveTimeString.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      } else if (diffSec < 10) {
        this.liveTimeString.set(`${s}`);
      } else {
        this.liveTimeString.set(`${String(s).padStart(2, '0')}`);
      }
    } else if (content.timerMode === 'pomodoro') {
      const duration = content.timerDurationSeconds || 0;
      const start = content.timerStartTimestamp || 0;
      if (!start) {
        const totalSec = Math.max(0, content.timerRemaining ?? duration);
        const pm = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const ps = String(totalSec % 60).padStart(2, '0');
        this.liveTimeString.set(`${pm}:${ps}`);
        return;
      }
      const elapsed = Math.floor((Date.now() - start) / 1000);
      let currentSec = 0;
      if (content.timerCountUp) {
        currentSec = Math.min(duration, Math.max(0, elapsed));
      } else {
        currentSec = Math.max(0, duration - elapsed);
      }
      const pm = String(Math.floor(currentSec / 60)).padStart(2, '0');
      const ps = String(currentSec % 60).padStart(2, '0');
      this.liveTimeString.set(`${pm}:${ps}`);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  private ensureFont(fontName: string, customFonts?: CustomFont[]) {
    if (!fontName) return;
    this.fontManager.loadGoogleFont(fontName);
    if (customFonts) {
      const match = customFonts.find((f) => f.name === fontName);
      if (match && match.dataUrl) this.fontManager.loadLocalFont(match.name, match.dataUrl);
    }
  }

  private syncCustomFonts(fonts: CustomFont[]) {
    for (const f of fonts) {
      if (f.dataUrl) this.fontManager.loadLocalFont(f.name, f.dataUrl);
    }
  }
}
