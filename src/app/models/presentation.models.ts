export type MainTabType = 'TEXT' | 'VERSE' | 'TIMER' | 'LYRICS' | 'MEDIA';

export type TextAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export type CaseTransform = 'none' | 'lowercase' | 'uppercase' | 'capitalize' | 'toggle';

export type EntryAnimation =
  | 'none'
  | 'fade-in'
  | 'slide-top'
  | 'slide-bottom'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-in-bounce'
  | 'flip-x'
  | 'flip-y'
  | 'blur-in'
  | 'rotate-in'
  | 'exp-h'
  | 'exp-v'
  | 'wipe-right';

export type ExitAnimation =
  | 'none'
  | 'fade-out'
  | 'slide-bottom'
  | 'slide-top'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-out'
  | 'flip-x-out'
  | 'flip-y-out'
  | 'blur-out'
  | 'rotate-out'
  | 'con-h'
  | 'con-v'
  | 'wipe-left';

export type AppThemeId =
  | 'midnight-slate'
  | 'cyber-dark'
  | 'obsidian-gold'
  | 'deep-emerald'
  | 'royal-amethyst'
  | 'clean-light'
  | 'warm-paper'
  | 'nordic-snow'
  | 'lavender-breeze'
  | 'desert-sand';

export interface AppTheme {
  id: AppThemeId;
  name: string;
  category: 'dark' | 'light';
  icon: string;
  previewColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  cardBgClass: string;
  accentClass: string;
}

export const APP_THEMES: AppTheme[] = [
  // Dark Themes
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    category: 'dark',
    icon: '🌌',
    previewColor: '#0f172a',
    bgClass: 'bg-slate-950',
    textClass: 'text-slate-100',
    borderClass: 'border-slate-800',
    cardBgClass: 'bg-slate-900',
    accentClass: 'text-sky-400',
  },
  {
    id: 'cyber-dark',
    name: 'Cyberpunk Neon',
    category: 'dark',
    icon: '⚡',
    previewColor: '#050510',
    bgClass: 'bg-[#060814]',
    textClass: 'text-cyan-100',
    borderClass: 'border-cyan-900/60',
    cardBgClass: 'bg-[#0c1024]',
    accentClass: 'text-cyan-400',
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    category: 'dark',
    icon: '👑',
    previewColor: '#14120c',
    bgClass: 'bg-[#0f0e0b]',
    textClass: 'text-amber-100',
    borderClass: 'border-amber-900/50',
    cardBgClass: 'bg-[#181611]',
    accentClass: 'text-amber-400',
  },
  {
    id: 'deep-emerald',
    name: 'Deep Emerald',
    category: 'dark',
    icon: '🌲',
    previewColor: '#051b14',
    bgClass: 'bg-[#03150f]',
    textClass: 'text-emerald-100',
    borderClass: 'border-emerald-900/60',
    cardBgClass: 'bg-[#06241a]',
    accentClass: 'text-emerald-400',
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    category: 'dark',
    icon: '🔮',
    previewColor: '#170c26',
    bgClass: 'bg-[#10071c]',
    textClass: 'text-purple-100',
    borderClass: 'border-purple-900/60',
    cardBgClass: 'bg-[#1a0e2e]',
    accentClass: 'text-purple-400',
  },

  // Light Themes
  {
    id: 'clean-light',
    name: 'Pure Studio',
    category: 'light',
    icon: '☀️',
    previewColor: '#f8fafc',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-900',
    borderClass: 'border-slate-300',
    cardBgClass: 'bg-white shadow-sm',
    accentClass: 'text-sky-600',
  },
  {
    id: 'warm-paper',
    name: 'Warm Parchment',
    category: 'light',
    icon: '📜',
    previewColor: '#fbf7ee',
    bgClass: 'bg-[#f6f0e2]',
    textClass: 'text-[#2c2416]',
    borderClass: 'border-[#dfd3bd]',
    cardBgClass: 'bg-[#fffdf8] shadow-sm',
    accentClass: 'text-amber-700',
  },
  {
    id: 'nordic-snow',
    name: 'Nordic Frost',
    category: 'light',
    icon: '❄️',
    previewColor: '#f0f9ff',
    bgClass: 'bg-[#e6f4fa]',
    textClass: 'text-sky-950',
    borderClass: 'border-sky-200',
    cardBgClass: 'bg-white shadow-sm',
    accentClass: 'text-sky-600',
  },
  {
    id: 'lavender-breeze',
    name: 'Lavender Breeze',
    category: 'light',
    icon: '🪻',
    previewColor: '#faf5ff',
    bgClass: 'bg-[#f3e8ff]/60',
    textClass: 'text-purple-950',
    borderClass: 'border-purple-200',
    cardBgClass: 'bg-white shadow-sm',
    accentClass: 'text-purple-700',
  },
  {
    id: 'desert-sand',
    name: 'Desert Sand',
    category: 'light',
    icon: '🏜️',
    previewColor: '#fef3c7',
    bgClass: 'bg-[#fef3c7]/60',
    textClass: 'text-amber-950',
    borderClass: 'border-amber-200',
    cardBgClass: 'bg-white shadow-sm',
    accentClass: 'text-amber-800',
  },
];

export interface CustomFont {
  id: string;
  name: string;
  source: 'google' | 'local';
  dataUrl?: string;
  url?: string;
}

export interface TextEffects {
  shadow: {
    enabled: boolean;
    blur: number; // px
    distance: number; // px
    angle: number; // degrees
    opacity: number; // 0..1
    color: string;
  };
  reflection: {
    enabled: boolean;
    offset: number; // px
    opacity: number; // 0..1
  };
  glow: {
    enabled: boolean;
    radius: number; // px
    color: string;
  };
  bevel: {
    enabled: boolean;
    intensity: number; // px
  };
}

export type ContainerMode = 'none' | 'box' | 'text-line' | 'picture';

export interface ContainerStyle {
  mode: ContainerMode;
  widthPercent: number;
  heightPercent?: number;
  cornerRadius: number;
  fillColor: string;
  pictureUrl?: string;
}

export type BackgroundType = 'solid' | 'gradient' | 'picture' | 'video';

export interface PresentationBackground {
  type: BackgroundType;
  color: string;
  gradient?: string;
  mediaUrl: string;
  mediaName?: string;
}

export type HighlightType = 'none' | 'solid' | 'gradient' | 'picture' | 'video';

export interface HighlightSettings {
  type: HighlightType;
  color: string;
  gradient: string;
  mediaUrl: string;
  mediaName?: string;
  opacity?: number;
  padding?: number;
  borderRadius?: number;
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number; // 8 to 120
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  letterSpacing: number; // -2 to 10
  caseTransform: CaseTransform;
  highlightColor: string;
  highlight: HighlightSettings;
  fontColor: string;
  alignment: TextAlignment;
  verticalAlignment: VerticalAlignment;
  offsetX: number;
  offsetY: number;
  rotationAngle: number;
  flipH: boolean;
  flipV: boolean;
  textFillType: 'solid' | 'gradient' | 'none';
  textFillColor: string;
  textFillGradient: string;
  textOutlineEnabled: boolean;
  textOutlineColor: string;
  textOutlineWeight: number;
  effects: TextEffects;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  tab: MainTabType;
  summary: string;
  content: any;
  styles?: Partial<TypographySettings>;
}

export interface BibleBook {
  id: number;
  name: string;
  abbrev: string;
  chapters: number;
  verseCountsPerChapter?: number[];
  category:
    | 'Law'
    | 'History'
    | 'Poetry'
    | 'Major Prophets'
    | 'Minor Prophets'
    | 'Gospels'
    | 'Acts'
    | 'Pauline'
    | 'General'
    | 'Prophecy';
}

export interface MediaFileItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  blob?: Blob;
  dataUrl?: string;
  size: number;
  lastModified: number;
}

export type MediaScaleMode = 'fit' | 'fill' | 'original';

export interface TabSettings {
  typography: TypographySettings;
  background: PresentationBackground;
  container: ContainerStyle;
  entryAnimation: EntryAnimation;
  exitAnimation: ExitAnimation;
  animationDurationMs: number;
  durationSeconds: number;
  mediaScaleMode?: MediaScaleMode;
  videoLoop?: boolean;
}

export interface PresentationState {
  activeTab: MainTabType;
  typography: TypographySettings;
  background: PresentationBackground;
  container: ContainerStyle;
  entryAnimation: EntryAnimation;
  exitAnimation: ExitAnimation;
  animationDurationMs: number; // Duration in milliseconds (e.g. 100 to 5000 ms)
  durationSeconds: number; // 0 = indefinite
  isPresented: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  mediaScaleMode?: MediaScaleMode;
  videoLoop?: boolean;
  videoPlaying?: boolean;
  videoCurrentTime?: number;
  videoDuration?: number;
  videoMuted?: boolean;
  tabSettings?: Partial<Record<MainTabType, TabSettings>>;
  activeContent: {
    type: MainTabType;
    text?: string;
    verseRef?: string;
    verseQuote?: string;
    timerMode?: 'time-now' | 'countdown' | 'pomodoro';
    timerClockFormat?: '12' | '24';
    timerTarget?: string;
    timerTargetTimestamp?: number;
    timerDurationSeconds?: number;
    timerStartTimestamp?: number;
    timerRemaining?: number;
    timerCountUp?: boolean;
    lyricsSongTitle?: string;
    lyricsStanzaTitle?: string;
    lyricsStanzaBody?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    mediaScaleMode?: MediaScaleMode;
    videoLoop?: boolean;
    videoPlaying?: boolean;
    videoCurrentTime?: number;
    videoDuration?: number;
    videoMuted?: boolean;
  };
  history: HistoryItem[];
  customFonts?: CustomFont[];
}
