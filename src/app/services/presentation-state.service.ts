import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  CaseTransform,
  ContainerStyle,
  CustomFont,
  EntryAnimation,
  ExitAnimation,
  HistoryItem,
  MainTabType,
  MediaFileItem,
  MediaScaleMode,
  PresentationBackground,
  PresentationState,
  TabSettings,
  TextAlignment,
  TypographySettings,
  VerticalAlignment,
  AppThemeId,
  APP_THEMES,
} from '../models/presentation.models';
import { StorageService } from './storage.service';
import { FontManagerService } from './font-manager.service';

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontFamily: 'Aptos',
  fontSize: 48,
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
    padding: 8,
    borderRadius: 8,
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
  textFillGradient: 'linear-gradient(135deg, #60A5FA 0%, #A855F7 100%)',
  textOutlineEnabled: false,
  textOutlineColor: '#000000',
  textOutlineWeight: 2,
  effects: {
    shadow: { enabled: true, blur: 4, distance: 3, angle: 45, opacity: 0.8, color: '#000000' },
    reflection: { enabled: false, offset: 4, opacity: 0.3 },
    glow: { enabled: false, radius: 10, color: '#38BDF8' },
    bevel: { enabled: false, intensity: 2 },
  },
};

const DEFAULT_BACKGROUND: PresentationBackground = {
  type: 'solid',
  color: '#000000',
  mediaUrl: '',
};

const DEFAULT_CONTAINER: ContainerStyle = {
  mode: 'none',
  widthPercent: 90,
  cornerRadius: 8,
  fillColor: 'rgba(0, 0, 0, 0.75)',
};

const BUILT_IN_FONTS: string[] = [
  'Aptos',
  'Arial',
  'Calibri',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Roboto',
  'Montserrat',
  'Playfair Display',
  'Open Sans',
  'Lato',
  'Oswald',
  'Raleway',
  'Merriweather',
  'Poppins',
  'Nunito',
];

const SETTINGS_STORAGE_KEY = 'presentationSettings_v3';
const FONTS_STORAGE_KEY = 'presentation_custom_fonts';
const GEOMETRY_STORAGE_KEY = 'pres_geom';

@Injectable({
  providedIn: 'root',
})
export class PresentationStateService {
  private storage = inject(StorageService);
  private fontManager = inject(FontManagerService);
  private broadcastChannel: BroadcastChannel | null = null;
  private presentationWindow: Window | null = null;
  private timerInterval: any = null;

  // Primary Signals
  readonly activeTab = signal<MainTabType>('TEXT');
  readonly typography = signal<TypographySettings>(DEFAULT_TYPOGRAPHY);
  readonly background = signal<PresentationBackground>(DEFAULT_BACKGROUND);
  readonly container = signal<ContainerStyle>(DEFAULT_CONTAINER);
  readonly entryAnimation = signal<EntryAnimation>('fade-in');
  readonly exitAnimation = signal<ExitAnimation>('fade-out');
  readonly animationDurationMs = signal<number>(400); // Default 400ms

  // Custom Fonts Signal
  readonly customFonts = signal<CustomFont[]>([]);

  // All Available Font Families Computed
  readonly availableFontFamilies = computed(() => {
    const customNames = this.customFonts().map((f) => f.name);
    const combined = [...BUILT_IN_FONTS, ...customNames];
    return Array.from(new Set(combined));
  });

  // Presentation Runtime Signals
  readonly durationSeconds = signal<number>(0);
  readonly remainingSeconds = signal<number>(0);
  readonly isPresented = signal<boolean>(false);
  readonly isExiting = signal<boolean>(false);
  readonly isPaused = signal<boolean>(false);
  readonly activeContent = signal<PresentationState['activeContent']>({
    type: 'TEXT',
    text: '',
  });

  // History & Media Files
  readonly history = signal<HistoryItem[]>([]);
  readonly mediaFiles = signal<MediaFileItem[]>([]);

  // Text Transform Helper Computed
  readonly transformedText = computed(() => {
    const raw = this.activeContent().text || '';
    const transform = this.typography().caseTransform;
    if (!raw || transform === 'none') return raw;

    switch (transform) {
      case 'lowercase':
        return raw.toLowerCase();
      case 'uppercase':
        return raw.toUpperCase();
      case 'capitalize':
        return raw.replace(/\b\w/g, (c) => c.toUpperCase());
      case 'toggle':
        return raw
          .split('')
          .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
          .join('');
      default:
        return raw;
    }
  });

  // App Color Theme Signal & Active Theme Computed
  readonly appTheme = signal<AppThemeId>('midnight-slate');
  readonly activeTheme = computed(() => {
    const id = this.appTheme();
    return APP_THEMES.find((t) => t.id === id) || APP_THEMES[0];
  });

  setAppTheme(themeId: AppThemeId) {
    this.appTheme.set(themeId);
    this.storage.setLocal('app_theme_preference', themeId);
  }

  // Media Scale Mode Signal ('fit' | 'fill' | 'original')
  readonly mediaScaleMode = signal<MediaScaleMode>('fit');

  // Video Playback Controls Signals
  readonly videoLoop = signal<boolean>(true);
  readonly videoPlaying = signal<boolean>(true);
  readonly videoCurrentTime = signal<number>(0);
  readonly videoDuration = signal<number>(0);
  readonly videoMuted = signal<boolean>(false);

  // Tab-Specific Settings Cache (TEXT, VERSE, TIMER, LYRICS, MEDIA)
  readonly tabSettings = signal<Record<MainTabType, TabSettings>>({
    TEXT: {
      typography: { ...DEFAULT_TYPOGRAPHY },
      background: { ...DEFAULT_BACKGROUND },
      container: { ...DEFAULT_CONTAINER },
      entryAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      animationDurationMs: 400,
      durationSeconds: 0,
      mediaScaleMode: 'fit',
      videoLoop: true,
    },
    VERSE: {
      typography: { ...DEFAULT_TYPOGRAPHY, fontSize: 44, alignment: 'center' },
      background: { ...DEFAULT_BACKGROUND },
      container: { ...DEFAULT_CONTAINER },
      entryAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      animationDurationMs: 400,
      durationSeconds: 0,
      mediaScaleMode: 'fit',
      videoLoop: true,
    },
    TIMER: {
      typography: { ...DEFAULT_TYPOGRAPHY, fontFamily: 'Courier New', fontSize: 64, bold: true },
      background: { ...DEFAULT_BACKGROUND },
      container: { ...DEFAULT_CONTAINER },
      entryAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      animationDurationMs: 400,
      durationSeconds: 0,
      mediaScaleMode: 'fit',
      videoLoop: true,
    },
    LYRICS: {
      typography: { ...DEFAULT_TYPOGRAPHY, fontSize: 42, alignment: 'center' },
      background: { ...DEFAULT_BACKGROUND },
      container: { ...DEFAULT_CONTAINER },
      entryAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      animationDurationMs: 400,
      durationSeconds: 0,
      mediaScaleMode: 'fit',
      videoLoop: true,
    },
    MEDIA: {
      typography: { ...DEFAULT_TYPOGRAPHY },
      background: { ...DEFAULT_BACKGROUND },
      container: { ...DEFAULT_CONTAINER },
      entryAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      animationDurationMs: 400,
      durationSeconds: 0,
      mediaScaleMode: 'fit',
      videoLoop: true,
    },
  });

  constructor() {
    this.initBroadcastChannel();
    this.restoreSavedState();
    this.loadSavedMedia();
    this.loadCustomFonts();

    // Real-time synchronization & Auto-save effect
    effect(() => {
      // Keep current active tab settings in sync with tabSettings dictionary
      const currentTab = this.activeTab();
      const currentTabSettings: TabSettings = {
        typography: this.typography(),
        background: this.background(),
        container: this.container(),
        entryAnimation: this.entryAnimation(),
        exitAnimation: this.exitAnimation(),
        animationDurationMs: this.animationDurationMs(),
        durationSeconds: this.durationSeconds(),
        mediaScaleMode: this.mediaScaleMode(),
        videoLoop: this.videoLoop(),
      };

      const stateToSave = {
        activeTab: currentTab,
        typography: this.typography(),
        background: this.background(),
        container: this.container(),
        entryAnimation: this.entryAnimation(),
        exitAnimation: this.exitAnimation(),
        animationDurationMs: this.animationDurationMs(),
        durationSeconds: this.durationSeconds(),
        mediaScaleMode: this.mediaScaleMode(),
        videoLoop: this.videoLoop(),
        tabSettings: {
          ...this.tabSettings(),
          [currentTab]: currentTabSettings,
        },
        history: this.history(),
      };
      this.storage.setLocal(SETTINGS_STORAGE_KEY, stateToSave);

      // If presentation is actively displayed on screen, broadcast any setting changes in real-time immediately!
      if (this.isPresented()) {
        this.broadcastSync();
      }
    });
  }

  // --- Per-Tab Settings Switching ---

  switchTab(newTab: MainTabType) {
    const currentTab = this.activeTab();
    if (currentTab === newTab) return;

    // 1. Save current active tab settings snapshot
    const currentSnapshot: TabSettings = {
      typography: { ...this.typography() },
      background: { ...this.background() },
      container: { ...this.container() },
      entryAnimation: this.entryAnimation(),
      exitAnimation: this.exitAnimation(),
      animationDurationMs: this.animationDurationMs(),
      durationSeconds: this.durationSeconds(),
      mediaScaleMode: this.mediaScaleMode(),
      videoLoop: this.videoLoop(),
    };

    const updatedMap = {
      ...this.tabSettings(),
      [currentTab]: currentSnapshot,
    };
    this.tabSettings.set(updatedMap);

    // 2. Set new active tab
    this.activeTab.set(newTab);

    // 3. Restore target tab settings snapshot
    const targetSettings = updatedMap[newTab];
    if (targetSettings) {
      if (targetSettings.typography) {
        this.typography.set({ ...targetSettings.typography });
        this.ensureFontLoaded(targetSettings.typography.fontFamily);
      }
      if (targetSettings.background) this.background.set({ ...targetSettings.background });
      if (targetSettings.container) this.container.set({ ...targetSettings.container });
      if (targetSettings.entryAnimation) this.entryAnimation.set(targetSettings.entryAnimation);
      if (targetSettings.exitAnimation) this.exitAnimation.set(targetSettings.exitAnimation);
      if (typeof targetSettings.animationDurationMs === 'number') this.animationDurationMs.set(targetSettings.animationDurationMs);
      if (typeof targetSettings.durationSeconds === 'number') this.durationSeconds.set(targetSettings.durationSeconds);
      if (targetSettings.mediaScaleMode) this.mediaScaleMode.set(targetSettings.mediaScaleMode);
      if (typeof targetSettings.videoLoop === 'boolean') this.videoLoop.set(targetSettings.videoLoop);
    }
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('presentation_sync_channel');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'REQUEST_STATE') {
          this.broadcastSync();
        } else if (event.data?.type === 'POPUP_CLOSED') {
          this.presentationWindow = null;
        } else if (event.data?.type === 'POPUP_GEOMETRY') {
          this.storage.setLocal(GEOMETRY_STORAGE_KEY, event.data.geometry);
        } else if (event.data?.type === 'TOGGLE_PLAY_PAUSE') {
          this.togglePlayPause();
        } else if (event.data?.type === 'HIDE_PRESENTATION') {
          this.hide();
        } else if (event.data?.type === 'VIDEO_TIME_UPDATE') {
          if (typeof event.data.currentTime === 'number') this.videoCurrentTime.set(event.data.currentTime);
          if (typeof event.data.duration === 'number') this.videoDuration.set(event.data.duration);
        }
      };
    }
  }

  private restoreSavedState() {
    const saved = this.storage.getLocal<Partial<PresentationState>>(SETTINGS_STORAGE_KEY, {});
    
    // Restore per-tab settings if saved
    if (saved.tabSettings) {
      const mergedTabSettings = { ...this.tabSettings(), ...saved.tabSettings };
      this.tabSettings.set(mergedTabSettings);
    }

    if (saved.activeTab) this.activeTab.set(saved.activeTab);
    if (saved.typography) {
      const typo = { ...DEFAULT_TYPOGRAPHY, ...saved.typography };
      // If a saved highlight had a stale blob URL from a previous page session, reset mediaUrl until loaded
      if (typo.highlight?.mediaUrl?.startsWith('blob:')) {
        typo.highlight.mediaUrl = '';
      }
      this.typography.set(typo);
      this.ensureFontLoaded(saved.typography.fontFamily);
    }
    if (saved.background) {
      const bg = { ...DEFAULT_BACKGROUND, ...saved.background };
      if (bg.mediaUrl?.startsWith('blob:')) {
        bg.mediaUrl = '';
      }
      this.background.set(bg);
    }
    if (saved.container) this.container.set({ ...DEFAULT_CONTAINER, ...saved.container });
    if (saved.entryAnimation) this.entryAnimation.set(saved.entryAnimation);
    if (saved.exitAnimation) this.exitAnimation.set(saved.exitAnimation);
    if (typeof saved.animationDurationMs === 'number') this.animationDurationMs.set(saved.animationDurationMs);
    if (typeof saved.durationSeconds === 'number') this.durationSeconds.set(saved.durationSeconds);
    if (saved.history) this.history.set(saved.history);

    const savedTheme = this.storage.getLocal<AppThemeId>('app_theme_preference', 'midnight-slate');
    if (savedTheme) this.appTheme.set(savedTheme);
  }

  // --- Custom Font Management ---

  private loadCustomFonts() {
    const fonts = this.storage.getLocal<CustomFont[]>(FONTS_STORAGE_KEY, []);
    this.customFonts.set(fonts);
    fonts.forEach((font) => {
      if (font.source === 'google') {
        this.fontManager.loadGoogleFont(font.name);
      } else if (font.source === 'local' && font.dataUrl) {
        this.fontManager.loadLocalFont(font.name, font.dataUrl);
      }
    });
  }

  addGoogleFont(fontName: string): boolean {
    const name = fontName.trim();
    if (!name) return false;

    this.fontManager.loadGoogleFont(name);
    const newFont: CustomFont = {
      id: 'gfont_' + Date.now(),
      name,
      source: 'google',
    };

    const current = this.customFonts().filter((f) => f.name.toLowerCase() !== name.toLowerCase());
    const updated = [...current, newFont];
    this.customFonts.set(updated);
    this.storage.setLocal(FONTS_STORAGE_KEY, updated);

    this.updateTypography({ fontFamily: name });
    return true;
  }

  async addLocalFont(fontName: string, file: File): Promise<boolean> {
    const name = fontName.trim() || file.name.replace(/\.[^/.]+$/, '');
    if (!name || !file) return false;

    try {
      const buffer = await file.arrayBuffer();
      await this.fontManager.loadLocalFont(name, buffer);

      let dataUrl = '';
      if (file.size < 3 * 1024 * 1024) {
        const reader = new FileReader();
        dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const newFont: CustomFont = {
        id: 'lfont_' + Date.now(),
        name,
        source: 'local',
        dataUrl,
      };

      const current = this.customFonts().filter((f) => f.name.toLowerCase() !== name.toLowerCase());
      const updated = [...current, newFont];
      this.customFonts.set(updated);
      this.storage.setLocal(FONTS_STORAGE_KEY, updated);

      this.updateTypography({ fontFamily: name });
      return true;
    } catch (e) {
      console.error('Failed to load local font file', e);
      return false;
    }
  }

  removeCustomFont(id: string) {
    const updated = this.customFonts().filter((f) => f.id !== id);
    this.customFonts.set(updated);
    this.storage.setLocal(FONTS_STORAGE_KEY, updated);
  }

  ensureFontLoaded(fontFamily: string) {
    if (!fontFamily) return;
    const custom = this.customFonts().find((f) => f.name.toLowerCase() === fontFamily.toLowerCase());
    if (custom) {
      if (custom.source === 'google') this.fontManager.loadGoogleFont(custom.name);
      else if (custom.source === 'local' && custom.dataUrl) this.fontManager.loadLocalFont(custom.name, custom.dataUrl);
    } else {
      const isGoogleBuiltIn = ['Roboto', 'Montserrat', 'Playfair Display', 'Open Sans', 'Lato', 'Oswald', 'Raleway', 'Merriweather', 'Poppins', 'Nunito'].includes(fontFamily);
      if (isGoogleBuiltIn) {
        this.fontManager.loadGoogleFont(fontFamily);
      }
    }
  }

  // --- Media & IndexedDB ---

  private async loadSavedMedia() {
    const items = await this.storage.getAllMedia();
    const mediaList: MediaFileItem[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      blob: item.blob,
      dataUrl: URL.createObjectURL(item.blob),
      size: item.blob.size,
      lastModified: Date.now(),
    }));
    this.mediaFiles.set(mediaList);

    // Re-link active background or highlight if matching media was previously selected
    const currentBg = this.background();
    if (currentBg.mediaName) {
      const match = mediaList.find((m) => m.name === currentBg.mediaName);
      if (match) {
        this.background.update((b) => ({ ...b, mediaUrl: match.dataUrl || '' }));
      }
    }

    const currentHl = this.typography().highlight;
    if (currentHl?.mediaName) {
      const match = mediaList.find((m) => m.name === currentHl.mediaName);
      if (match) {
        this.updateTypography({
          highlight: { ...currentHl, mediaUrl: match.dataUrl || '' },
        });
      }
    }
  }

  async addMediaFile(file: File): Promise<MediaFileItem> {
    const id = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';
    await this.storage.saveMedia(id, file.name, type, file);

    const mediaItem: MediaFileItem = {
      id,
      name: file.name,
      type,
      blob: file,
      dataUrl: URL.createObjectURL(file),
      size: file.size,
      lastModified: Date.now(),
    };

    this.mediaFiles.update((list) => [mediaItem, ...list]);
    return mediaItem;
  }

  async removeMediaFile(id: string) {
    await this.storage.deleteMedia(id);
    this.mediaFiles.update((list) => list.filter((m) => m.id !== id));
  }

  present(contentOverride?: Partial<PresentationState['activeContent']>) {
    if (contentOverride) {
      this.activeContent.update((c) => ({ ...c, ...contentOverride }));
    }

    this.isExiting.set(false);
    this.isPresented.set(true);
    this.isPaused.set(false);

    // Duration countdown does NOT apply to Timers or Lyrics
    const isManualOnly = this.activeContent().type === 'TIMER' || this.activeContent().type === 'LYRICS';
    const duration = isManualOnly ? 0 : this.durationSeconds();
    this.remainingSeconds.set(duration);

    this.addToHistory();
    this.ensurePresentationWindowOpen();
    if (!isManualOnly) {
      this.startCountdown();
    } else if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.broadcastSync();
  }

  pause() {
    this.isPaused.set(true);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.broadcastSync();
  }

  resume() {
    this.isPaused.set(false);
    this.startCountdown();
    this.broadcastSync();
  }

  togglePlayPause() {
    if (!this.isPresented()) {
      this.present();
    } else if (this.isPaused()) {
      this.resume();
    } else {
      this.pause();
    }
  }

  hide() {
    if (!this.isPresented() || this.isExiting()) return;
    this.isExiting.set(true);
    this.isPaused.set(false);
    this.remainingSeconds.set(0);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.broadcastSync();

    const duration = this.animationDurationMs() || 400;
    setTimeout(() => {
      this.isPresented.set(false);
      this.isExiting.set(false);

      // If active content was a timer, reset runtime timestamps so timers halt completely everywhere
      if (this.activeContent().type === 'TIMER') {
        this.activeContent.update((c) => ({
          ...c,
          timerTargetTimestamp: undefined,
          timerStartTimestamp: undefined,
        }));
      }

      this.broadcastSync();
    }, duration);
  }

  private startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.durationSeconds() <= 0) return;

    this.timerInterval = setInterval(() => {
      if (this.isPaused()) return;
      const current = this.remainingSeconds();
      if (current > 1) {
        this.remainingSeconds.set(current - 1);
        this.broadcastSync();
      } else {
        this.remainingSeconds.set(0);
        this.hide();
      }
    }, 1000);
  }

  openPresentationWindow(): boolean {
    if (typeof window === 'undefined') return false;

    if (this.presentationWindow && !this.presentationWindow.closed) {
      this.presentationWindow.focus();
      return true;
    }

    const savedGeom = this.storage.getLocal<{ width: number; height: number; x: number; y: number }>(
      GEOMETRY_STORAGE_KEY,
      { width: 1024, height: 768, x: 100, y: 100 }
    );

    const features = `width=${savedGeom.width},height=${savedGeom.height},left=${savedGeom.x},top=${savedGeom.y},menubar=no,toolbar=no,location=no,status=no,resizable=yes`;
    
    const url = window.location.origin + window.location.pathname + '#/present-view';
    this.presentationWindow = window.open(url, 'PresentationWindow', features);

    if (!this.presentationWindow || this.presentationWindow.closed || typeof this.presentationWindow.closed === 'undefined') {
      return false;
    }
    return true;
  }

  private ensurePresentationWindowOpen() {
    this.openPresentationWindow();
  }

  broadcastSync() {
    if (!this.broadcastChannel) return;
    this.broadcastChannel.postMessage({
      type: 'SYNC_STATE',
      state: {
        typography: this.typography(),
        background: this.background(),
        container: this.container(),
        entryAnimation: this.entryAnimation(),
        exitAnimation: this.exitAnimation(),
        animationDurationMs: this.animationDurationMs(),
        isPresented: this.isPresented(),
        isExiting: this.isExiting(),
        isPaused: this.isPaused(),
        activeContent: this.activeContent(),
        durationSeconds: this.durationSeconds(),
        remainingSeconds: this.remainingSeconds(),
        customFonts: this.customFonts(),
      },
    });
  }

  // --- History Actions ---

  private addToHistory() {
    const content = this.activeContent();
    let summary = '';

    if (content.type === 'TEXT') summary = (content.text || '').substring(0, 40) || 'Plain Text';
    else if (content.type === 'VERSE') summary = content.verseRef || content.verseQuote?.substring(0, 40) || 'Verse';
    else if (content.type === 'TIMER') summary = `Timer: ${content.timerMode || 'Clock'}`;
    else if (content.type === 'LYRICS') summary = `${content.lyricsSongTitle || 'Song'} - ${content.lyricsStanzaTitle || 'Stanza'}`;
    else if (content.type === 'MEDIA') summary = `Media: ${this.background().mediaName || 'File'}`;

    const newItem: HistoryItem = {
      id: 'hist_' + Date.now(),
      timestamp: Date.now(),
      tab: content.type,
      summary,
      content: { ...content },
      styles: { ...this.typography() },
    };

    this.history.update((prev) => {
      const filtered = prev.filter((item) => item.summary !== summary);
      return [newItem, ...filtered].slice(0, 50);
    });
  }

  removeHistoryItem(id: string) {
    this.history.update((list) => list.filter((item) => item.id !== id));
  }

  clearHistory() {
    this.history.set([]);
  }

  // --- Formatting Helpers ---

  updateTypography(partial: Partial<TypographySettings>) {
    if (partial.fontFamily) {
      this.ensureFontLoaded(partial.fontFamily);
    }
    this.typography.update((prev) => ({ ...prev, ...partial }));

    // If position, alignment, rotation, or flip changes, sync position in real time to present-view
    const isPositionAdjustment =
      'offsetX' in partial ||
      'offsetY' in partial ||
      'alignment' in partial ||
      'verticalAlignment' in partial ||
      'rotationAngle' in partial ||
      'flipH' in partial ||
      'flipV' in partial;

    if (isPositionAdjustment) {
      this.broadcastPositionUpdate();
    }
    if (this.isPresented()) {
      this.broadcastSync();
    }
  }

  broadcastPositionUpdate() {
    if (!this.broadcastChannel) return;
    const t = this.typography();
    this.broadcastChannel.postMessage({
      type: 'SYNC_POSITION',
      position: {
        offsetX: t.offsetX,
        offsetY: t.offsetY,
        alignment: t.alignment,
        verticalAlignment: t.verticalAlignment,
        rotationAngle: t.rotationAngle,
        flipH: t.flipH,
        flipV: t.flipV,
      },
    });
  }

  updateBackground(partial: Partial<PresentationBackground>) {
    this.background.update((prev) => ({ ...prev, ...partial }));
    if (this.isPresented()) {
      this.broadcastSync();
    }
  }

  // --- Video Playback Controls ---

  toggleVideoPlay() {
    const isPlaying = !this.videoPlaying();
    this.videoPlaying.set(isPlaying);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_ACTION',
        action: isPlaying ? 'PLAY' : 'PAUSE',
      });
    }
  }

  seekVideo(time: number) {
    this.videoCurrentTime.set(time);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_ACTION',
        action: 'SEEK',
        currentTime: time,
      });
    }
  }

  toggleVideoMute() {
    const isMuted = !this.videoMuted();
    this.videoMuted.set(isMuted);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_ACTION',
        action: 'MUTE',
        muted: isMuted,
      });
    }
  }

  setVideoLoop(loop: boolean) {
    this.videoLoop.set(loop);
    this.activeContent.update((c) => ({
      ...c,
      videoLoop: loop,
    }));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'VIDEO_ACTION',
        action: 'LOOP',
        loop,
      });
    }
  }

  clearFormatting() {
    this.typography.set(DEFAULT_TYPOGRAPHY);
  }

  exportDesignJson(): string {
    const design = {
      version: '3.0',
      timestamp: Date.now(),
      typography: this.typography(),
      background: this.background(),
      container: this.container(),
      entryAnimation: this.entryAnimation(),
      exitAnimation: this.exitAnimation(),
      animationDurationMs: this.animationDurationMs(),
      durationSeconds: this.durationSeconds(),
      tabSettings: this.tabSettings(),
      customFonts: this.customFonts(),
    };
    return JSON.stringify(design, null, 2);
  }

  importDesignJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.typography) this.typography.set({ ...DEFAULT_TYPOGRAPHY, ...parsed.typography });
      if (parsed.background) this.background.set({ ...DEFAULT_BACKGROUND, ...parsed.background });
      if (parsed.container) this.container.set({ ...DEFAULT_CONTAINER, ...parsed.container });
      if (parsed.entryAnimation) this.entryAnimation.set(parsed.entryAnimation);
      if (parsed.exitAnimation) this.exitAnimation.set(parsed.exitAnimation);
      if (typeof parsed.animationDurationMs === 'number') this.animationDurationMs.set(parsed.animationDurationMs);
      if (typeof parsed.durationSeconds === 'number') this.durationSeconds.set(parsed.durationSeconds);
      if (parsed.tabSettings) this.tabSettings.set({ ...this.tabSettings(), ...parsed.tabSettings });
      if (parsed.customFonts && Array.isArray(parsed.customFonts)) {
        this.customFonts.set(parsed.customFonts);
        this.storage.setLocal(FONTS_STORAGE_KEY, parsed.customFonts);
        parsed.customFonts.forEach((f: CustomFont) => {
          if (f.source === 'google') this.fontManager.loadGoogleFont(f.name);
          else if (f.source === 'local' && f.dataUrl) this.fontManager.loadLocalFont(f.name, f.dataUrl);
        });
      }
      return true;
    } catch (e) {
      console.error('Invalid design json', e);
      return false;
    }
  }
}
