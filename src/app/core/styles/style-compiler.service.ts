import { Injectable } from '@angular/core';
import {
  ContainerStyle,
  PresentationBackground,
  TypographySettings,
} from '../../models/presentation.models';

export interface CompiledCanvasStyles {
  background: Record<string, string | number>;
  containerWrapper: Record<string, string | number>;
  contentBox: Record<string, string | number>;
  highlightContainer: Record<string, string | number>;
  typography: Record<string, string | number>;
  alignmentClasses: string;
  entryAnimationClass: string;
  exitAnimationClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class StyleCompilerService {
  compile(
    typo: TypographySettings,
    bg: PresentationBackground,
    container: ContainerStyle,
    scale = 1.0,
    isPresented = false,
    isExiting = false,
    entryAnimation = 'fade-in',
    exitAnimation = 'fade-out'
  ): CompiledCanvasStyles {
    // 1. Background Style
    const backgroundStyle: Record<string, string | number> = {};
    if (bg.type === 'gradient' && bg.gradient) {
      backgroundStyle['background'] = bg.gradient;
      backgroundStyle['backgroundImage'] = bg.gradient;
    } else if ((bg.type === 'picture' || (bg.type as string) === 'image') && bg.mediaUrl) {
      backgroundStyle['backgroundImage'] = `url("${bg.mediaUrl}")`;
      backgroundStyle['backgroundSize'] = 'cover';
      backgroundStyle['backgroundPosition'] = 'center';
      backgroundStyle['backgroundRepeat'] = 'no-repeat';
      backgroundStyle['backgroundColor'] = bg.color || '#000000';
    } else {
      backgroundStyle['backgroundColor'] = bg.color || '#000000';
    }

    // 2. Alignment
    let hAlign = 'justify-center text-center';
    let justifyContent = 'center';
    let textAlign: 'left' | 'center' | 'right' = 'center';
    if (typo.alignment === 'left') {
      hAlign = 'justify-start text-left';
      justifyContent = 'flex-start';
      textAlign = 'left';
    } else if (typo.alignment === 'right') {
      hAlign = 'justify-end text-right';
      justifyContent = 'flex-end';
      textAlign = 'right';
    }

    let vAlign = 'items-center';
    let alignItems = 'center';
    if (typo.verticalAlignment === 'top') {
      vAlign = 'items-start';
      alignItems = 'flex-start';
    } else if (typo.verticalAlignment === 'bottom') {
      vAlign = 'items-end';
      alignItems = 'flex-end';
    }

    const alignmentClasses = `${hAlign} ${vAlign}`;

    // 3. Container Wrapper (Positioning Nudges & Full Flex Alignment)
    const offsetX = (typo.offsetX || 0) * scale;
    const offsetY = (typo.offsetY || 0) * scale;
    const containerWrapper: Record<string, string | number> = {
      display: 'flex',
      justifyContent,
      alignItems,
      textAlign,
      transform: `translate(${offsetX}px, ${offsetY}px)`,
    };

    // 4. Content Box (Container Styling)
    const contentBox: Record<string, string | number> = {};
    if (container.mode === 'box') {
      contentBox['width'] = `${container.widthPercent || 90}%`;
      contentBox['backgroundColor'] = container.fillColor || 'rgba(0,0,0,0.75)';
      contentBox['borderRadius'] = `${(container.cornerRadius || 8) * scale}px`;
      contentBox['padding'] = `${16 * scale}px ${24 * scale}px`;
    } else if (container.mode === 'text-line') {
      contentBox['maxWidth'] = `${container.widthPercent || 90}%`;
      contentBox['backgroundColor'] = container.fillColor || 'rgba(0,0,0,0.75)';
      contentBox['borderRadius'] = `${(container.cornerRadius || 8) * scale}px`;
      contentBox['padding'] = `${8 * scale}px ${16 * scale}px`;
    }

    // 5. Highlight Container
    const hl = typo.highlight;
    const highlightContainer: Record<string, string | number> = {};
    if (hl && hl.type !== 'none') {
      highlightContainer['padding'] = `${(hl.padding || 8) * scale}px`;
      highlightContainer['borderRadius'] = `${(hl.borderRadius || 8) * scale}px`;
      highlightContainer['opacity'] = hl.opacity ?? 1;

      if (hl.type === 'solid' && hl.color) {
        highlightContainer['backgroundColor'] = hl.color;
      } else if (hl.type === 'gradient' && hl.gradient) {
        highlightContainer['background'] = hl.gradient;
      } else if (hl.type === 'picture' && hl.mediaUrl) {
        highlightContainer['backgroundImage'] = `url("${hl.mediaUrl}")`;
        highlightContainer['backgroundSize'] = 'cover';
        highlightContainer['backgroundPosition'] = 'center';
      }
    }

    // 6. Typography
    const typography: Record<string, string | number> = {
      fontFamily: typo.fontFamily || 'Aptos, sans-serif',
      fontSize: `${(typo.fontSize || 48) * scale}px`,
      fontWeight: typo.bold ? '700' : '400',
      fontStyle: typo.italic ? 'italic' : 'normal',
      letterSpacing: `${(typo.letterSpacing || 0) * scale}px`,
    };

    if (typo.lineSpacing) {
      typography['lineHeight'] = `${typo.lineSpacing * scale}px`;
    }

    // Text Decoration
    const decos: string[] = [];
    if (typo.underline) decos.push('underline');
    if (typo.strikethrough) decos.push('line-through');
    typography['textDecoration'] = decos.length > 0 ? decos.join(' ') : 'none';

    // Case transform
    if (typo.caseTransform && typo.caseTransform !== 'none') {
      if (typo.caseTransform === 'uppercase') typography['textTransform'] = 'uppercase';
      else if (typo.caseTransform === 'lowercase') typography['textTransform'] = 'lowercase';
      else if (typo.caseTransform === 'capitalize') typography['textTransform'] = 'capitalize';
    }

    // Fills (Solid or Gradient) - fontColor takes priority over default solid fill
    if (typo.textFillType === 'gradient' && typo.textFillGradient) {
      typography['background'] = typo.textFillGradient;
      typography['WebkitBackgroundClip'] = 'text';
      typography['backgroundClip'] = 'text';
      typography['WebkitTextFillColor'] = 'transparent';
      typography['color'] = 'transparent';
    } else {
      typography['color'] = typo.fontColor || typo.textFillColor || '#FFFFFF';
    }

    // Shadows, Glow, Outline Filters
    const shadows: string[] = [];

    // True vector stroke outline
    if (typo.textOutlineEnabled && typo.textOutlineColor) {
      const ow = Math.max(1, (typo.textOutlineWeight || 2) * scale);
      const oc = typo.textOutlineColor;
      typography['WebkitTextStroke'] = `${ow}px ${oc}`;
      typography['paintOrder'] = 'stroke fill';
    }

    // Drop Shadow
    const shadow = typo.effects?.shadow;
    if (shadow?.enabled) {
      const rad = ((shadow.angle || 45) * Math.PI) / 180;
      const dist = (shadow.distance || 4) * scale;
      const sx = Math.cos(rad) * dist;
      const sy = Math.sin(rad) * dist;
      const sblur = (shadow.blur || 4) * scale;
      const scolor = shadow.color || '#000000';
      shadows.push(`${sx.toFixed(1)}px ${sy.toFixed(1)}px ${sblur.toFixed(1)}px ${scolor}`);
    }

    // Glow
    const glow = typo.effects?.glow;
    if (glow?.enabled && glow.color) {
      const gr = (glow.radius || 10) * scale;
      shadows.push(`0 0 ${gr.toFixed(1)}px ${glow.color}`);
    }

    if (shadows.length > 0) {
      typography['textShadow'] = shadows.join(', ');
    }

    // Transformation: Rotate, Flip
    const transforms: string[] = [];
    const isRotated90 = typo.rotationAngle === 90 || typo.rotationAngle === 270;
    if (typo.rotationAngle) transforms.push(`rotate(${typo.rotationAngle}deg)`);
    if (typo.flipH) transforms.push('scaleX(-1)');
    if (typo.flipV) transforms.push('scaleY(-1)');
    if (transforms.length > 0) {
      typography['transform'] = transforms.join(' ');
      typography['display'] = 'inline-block';
      typography['transformOrigin'] = 'center center';
      if (isRotated90) {
        typography['maxWidth'] = `${Math.round(480 * scale)}px`;
      }
    }

    // 7. Animation Classes
    const entryAnimationClass =
      isPresented && !isExiting && entryAnimation !== 'none'
        ? `anim-enter-${entryAnimation} animate-${entryAnimation}`
        : '';
    const exitAnimationClass =
      isExiting && exitAnimation !== 'none'
        ? `anim-exit-${exitAnimation} animate-${exitAnimation}`
        : '';

    return {
      background: backgroundStyle,
      containerWrapper,
      contentBox,
      highlightContainer,
      typography,
      alignmentClasses,
      entryAnimationClass,
      exitAnimationClass,
    };
  }
}
