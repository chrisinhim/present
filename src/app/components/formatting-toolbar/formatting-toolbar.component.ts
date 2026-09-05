import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../services/presentation-state.service';
import { HighlightType, VerticalAlignment } from '../../models/presentation.models';

@Component({
  selector: 'app-formatting-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formatting-toolbar.component.html',
})
export class FormattingToolbarComponent {
  state = inject(PresentationStateService);

  activeRibbonTab = signal<'home' | 'effects' | 'layout' | 'animations'>('home');
  showFontModal = signal<boolean>(false);
  showHighlightModal = signal<boolean>(false);
  highlightTab = signal<HighlightType>('solid');

  // Draggable Floating Highlight Modal Position
  highlightModalPos = signal<{ x: number; y: number }>({ x: 200, y: 120 });
  private isDraggingModal = false;
  private dragStartOffset = { x: 0, y: 0 };

  // Draggable Floating Background Modal Position
  showBgModal = signal<boolean>(false);
  bgTab = signal<'solid' | 'gradient' | 'picture' | 'video'>('solid');
  bgModalPos = signal<{ x: number; y: number }>({ x: 260, y: 140 });
  private isDraggingBgModal = false;
  private dragBgStartOffset = { x: 0, y: 0 };

  fontModalTab = signal<'google' | 'local'>('google');
  googleFontNameInput = '';
  localFontNameInput = '';

  popularGoogleFonts: string[] = [
    'Cinzel',
    'Bebas Neue',
    'Caveat',
    'Orbitron',
    'Pacifico',
    'Dancing Script',
    'Great Vibes',
    'Righteous',
    'Anton',
    'Lobster',
  ];

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

  highlightValue = computed(() => {
    const hl = this.state.typography().highlight;
    if (hl && hl.type !== 'none') return hl.color || '#FACC15';
    return this.state.typography().highlightColor || '#ffff00';
  });

  fontColorValue = computed(() => this.state.typography().fontColor || '#ffffff');
  bgColorValue = computed(() => this.state.background().color || '#000000');

  hasActiveHighlight = computed(() => {
    const t = this.state.typography();
    return !!t.highlightColor || (!!t.highlight && t.highlight.type !== 'none');
  });

  hasActiveBg = computed(() => {
    const bg = this.state.background();
    return bg.type !== 'solid' || (bg.color && bg.color !== '#000000');
  });

  hasActiveEffects = computed(() => {
    const t = this.state.typography();
    return t.effects.shadow.enabled || t.effects.glow.enabled || t.textOutlineEnabled;
  });

  hasActiveLayoutTransforms = computed(() => {
    const t = this.state.typography();
    return (
      t.offsetX !== 0 ||
      t.offsetY !== 0 ||
      t.rotationAngle !== 0 ||
      t.flipH ||
      t.flipV ||
      t.alignment !== 'center' ||
      t.verticalAlignment !== 'middle'
    );
  });

  // --- Highlight Handlers ---

  openHighlightModal() {
    const hl = this.state.typography().highlight;
    if (hl && hl.type !== 'none') {
      this.highlightTab.set(hl.type);
    } else {
      this.highlightTab.set('solid');
    }

    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, Math.min(window.innerWidth - 480, window.innerWidth - 500));
      const defaultY = 140;
      this.highlightModalPos.set({ x: defaultX, y: defaultY });
    }

    this.showHighlightModal.set(true);
  }

  startDragHighlightModal(event: MouseEvent) {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).closest('button')) {
      return;
    }
    this.isDraggingModal = true;
    const currentPos = this.highlightModalPos();
    this.dragStartOffset = {
      x: event.clientX - currentPos.x,
      y: event.clientY - currentPos.y,
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!this.isDraggingModal) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 320, e.clientX - this.dragStartOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - this.dragStartOffset.y));
      this.highlightModalPos.set({ x: newX, y: newY });
    };

    const mouseUpHandler = () => {
      this.isDraggingModal = false;
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  }

  setHighlightType(type: HighlightType) {
    this.highlightTab.set(type);
    const curr = this.state.typography().highlight || {
      type: 'solid',
      color: '#FACC15',
      gradient: this.popularGradients[0],
      mediaUrl: '',
      opacity: 1,
      padding: 8,
      borderRadius: 8,
    };

    if (type === 'none') {
      this.state.updateTypography({
        highlightColor: '',
        highlight: { ...curr, type: 'none' },
      });
    } else {
      this.state.updateTypography({
        highlightColor: type === 'solid' ? curr.color : '',
        highlight: { ...curr, type },
      });
    }
  }

  updateHighlightSolid(color: string) {
    const curr = this.state.typography().highlight;
    this.state.updateTypography({
      highlightColor: color,
      highlight: { ...(curr || {}), type: 'solid', color },
    });
  }

  updateHighlightGradient(gradient: string) {
    const curr = this.state.typography().highlight;
    this.state.updateTypography({
      highlightColor: '',
      highlight: { ...(curr || {}), type: 'gradient', gradient },
    });
  }

  async onHighlightMediaSelected(event: Event, type: 'picture' | 'video') {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const mediaItem = await this.state.addMediaFile(file);
      const curr = this.state.typography().highlight;
      this.state.updateTypography({
        highlightColor: '',
        highlight: {
          ...(curr || {}),
          type,
          mediaUrl: mediaItem.dataUrl || '',
          mediaName: mediaItem.name,
        },
      });
      input.value = '';
    }
  }

  clearHighlight() {
    this.state.updateTypography({
      highlightColor: '',
      highlight: {
        type: 'none',
        color: '#FACC15',
        gradient: this.popularGradients[0],
        mediaUrl: '',
        opacity: 1,
        padding: 8,
        borderRadius: 8,
      },
    });
  }

  updateHighlightPadding(pad: number) {
    const curr = this.state.typography().highlight;
    this.state.updateTypography({
      highlight: { ...(curr || {}), padding: Number(pad) },
    });
  }

  updateHighlightRadius(rad: number) {
    const curr = this.state.typography().highlight;
    this.state.updateTypography({
      highlight: { ...(curr || {}), borderRadius: Number(rad) },
    });
  }

  // --- Background Modal Handlers ---

  openBgModal() {
    const bg = this.state.background();
    if (bg && bg.type) {
      this.bgTab.set(bg.type);
    } else {
      this.bgTab.set('solid');
    }

    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, Math.min(window.innerWidth - 440, window.innerWidth - 460));
      const defaultY = 160;
      this.bgModalPos.set({ x: defaultX, y: defaultY });
    }

    this.showBgModal.set(true);
  }

  startDragBgModal(event: MouseEvent) {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).closest('button')) {
      return;
    }
    this.isDraggingBgModal = true;
    const currentPos = this.bgModalPos();
    this.dragBgStartOffset = {
      x: event.clientX - currentPos.x,
      y: event.clientY - currentPos.y,
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!this.isDraggingBgModal) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 320, e.clientX - this.dragBgStartOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - this.dragBgStartOffset.y));
      this.bgModalPos.set({ x: newX, y: newY });
    };

    const mouseUpHandler = () => {
      this.isDraggingBgModal = false;
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  }

  setBgType(type: 'solid' | 'gradient' | 'picture' | 'video') {
    this.bgTab.set(type);
    const curr = this.state.background();
    if (type === 'solid') {
      this.state.updateBackground({
        type: 'solid',
        color: curr.color || '#000000',
      });
    } else if (type === 'gradient') {
      this.state.updateBackground({
        type: 'gradient',
        gradient: curr.gradient || this.popularGradients[0],
      });
    }
  }

  updateBgSolid(color: string) {
    this.state.updateBackground({
      type: 'solid',
      color,
    });
  }

  updateBgGradient(gradient: string) {
    this.state.updateBackground({
      type: 'gradient',
      gradient,
    });
  }

  async onBgMediaSelected(event: Event, type: 'picture' | 'video') {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const mediaItem = await this.state.addMediaFile(file);
      this.state.updateBackground({
        type,
        mediaUrl: mediaItem.dataUrl || '',
        mediaName: mediaItem.name,
      });
      input.value = '';
    }
  }

  clearBg() {
    this.state.updateBackground({
      type: 'solid',
      color: '#000000',
      gradient: '',
      mediaUrl: '',
      mediaName: '',
    });
  }

  // --- Font & Formatting Handlers ---

  onFontColorInput(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.updateFontColor(color);
  }

  onBgColorInput(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.updateBgColor(color);
  }

  updateShadowEnabled(enabled: boolean) {
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, shadow: { ...eff.shadow, enabled } },
    });
  }

  updateShadowColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, shadow: { ...eff.shadow, color } },
    });
  }

  updateShadowDistance(distance: number) {
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, shadow: { ...eff.shadow, distance: Number(distance) } },
    });
  }

  updateShadowBlur(blur: number) {
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, shadow: { ...eff.shadow, blur: Number(blur) } },
    });
  }

  updateOutlineEnabled(enabled: boolean) {
    this.state.updateTypography({ textOutlineEnabled: enabled });
  }

  updateOutlineColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.state.updateTypography({ textOutlineColor: color });
  }

  updateOutlineWeight(weight: number) {
    this.state.updateTypography({ textOutlineWeight: Number(weight) });
  }

  updateGlowEnabled(enabled: boolean) {
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, glow: { ...eff.glow, enabled } },
    });
  }

  updateGlowColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, glow: { ...eff.glow, color } },
    });
  }

  updateGlowRadius(radius: number) {
    const eff = this.state.typography().effects;
    this.state.updateTypography({
      effects: { ...eff, glow: { ...eff.glow, radius: Number(radius) } },
    });
  }

  updateAnimDuration(ms: number) {
    const clamped = Math.max(50, Math.min(10000, Number(ms) || 400));
    this.state.animationDurationMs.set(clamped);
  }

  updateFontFamily(family: string) {
    this.state.updateTypography({ fontFamily: family });
  }

  addGoogleFont() {
    if (this.googleFontNameInput.trim()) {
      this.state.addGoogleFont(this.googleFontNameInput.trim());
      this.googleFontNameInput = '';
      this.showFontModal.set(false);
    }
  }

  quickAddGoogleFont(name: string) {
    this.state.addGoogleFont(name);
    this.showFontModal.set(false);
  }

  async onLocalFontFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const name = this.localFontNameInput.trim() || file.name.replace(/\.[^/.]+$/, '');
      await this.state.addLocalFont(name, file);
      this.localFontNameInput = '';
      input.value = '';
      this.showFontModal.set(false);
    }
  }

  updateFontSize(size: number) {
    const clamped = Math.min(120, Math.max(8, Number(size) || 12));
    this.state.updateTypography({ fontSize: clamped });
  }

  adjustFontSize(delta: number) {
    const current = this.state.typography().fontSize;
    this.updateFontSize(current + delta);
  }

  toggleStyle(style: 'bold' | 'italic' | 'underline' | 'strikethrough') {
    const current = this.state.typography()[style];
    this.state.updateTypography({ [style]: !current });
  }

  updateLetterSpacing(val: number) {
    this.state.updateTypography({ letterSpacing: Number(val) });
  }

  updateCase(val: any) {
    this.state.updateTypography({ caseTransform: val });
  }

  updateFontColor(color: string) {
    this.state.updateTypography({ fontColor: color });
  }

  setAlignment(alignment: 'left' | 'center' | 'right') {
    this.state.updateTypography({ alignment, offsetX: 0 });
  }

  setVerticalAlignment(verticalAlignment: VerticalAlignment) {
    this.state.updateTypography({ verticalAlignment, offsetY: 0 });
  }

  adjustOffset(axis: 'X' | 'Y', delta: number) {
    const typo = this.state.typography();
    if (axis === 'X') {
      this.state.updateTypography({ offsetX: typo.offsetX + delta });
    } else {
      this.state.updateTypography({ offsetY: typo.offsetY + delta });
    }
  }

  setOffset(axis: 'X' | 'Y', value: number) {
    if (axis === 'X') {
      this.state.updateTypography({ offsetX: Number(value) });
    } else {
      this.state.updateTypography({ offsetY: Number(value) });
    }
  }

  resetLayoutAndTransforms() {
    this.state.updateTypography({
      offsetX: 0,
      offsetY: 0,
      rotationAngle: 0,
      flipH: false,
      flipV: false,
      alignment: 'center',
      verticalAlignment: 'middle',
    });
  }

  resetOffset() {
    this.state.updateTypography({ offsetX: 0, offsetY: 0 });
  }

  rotate(deltaDeg: number) {
    const current = this.state.typography().rotationAngle;
    this.state.updateTypography({ rotationAngle: (current + deltaDeg) % 360 });
  }

  toggleFlip(axis: 'H' | 'V') {
    if (axis === 'H') {
      this.state.updateTypography({ flipH: !this.state.typography().flipH });
    } else {
      this.state.updateTypography({ flipV: !this.state.typography().flipV });
    }
  }

  updateBgColor(color: string) {
    this.state.background.update((bg) => ({ ...bg, type: 'solid', color }));
  }
}
