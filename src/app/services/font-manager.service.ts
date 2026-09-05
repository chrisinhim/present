import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontManagerService {
  private loadedFonts = new Set<string>();

  loadGoogleFont(fontFamilyName: string): boolean {
    if (!fontFamilyName || typeof document === 'undefined') return false;
    const cleanName = fontFamilyName.trim();
    if (!cleanName || this.loadedFonts.has('google_' + cleanName)) return true;

    try {
      const linkId = 'gfont_' + cleanName.replace(/\s+/g, '_');
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        const formattedName = cleanName.replace(/\s+/g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,700&display=swap`;
        document.head.appendChild(link);
      }
      this.loadedFonts.add('google_' + cleanName);
      return true;
    } catch (e) {
      console.warn('Error loading Google font', e);
      return false;
    }
  }

  async loadLocalFont(fontFamilyName: string, fontBufferOrUrl: ArrayBuffer | string): Promise<boolean> {
    if (!fontFamilyName || typeof window === 'undefined' || !('FontFace' in window)) return false;
    const cleanName = fontFamilyName.trim();

    try {
      let fontFace: FontFace;
      if (typeof fontBufferOrUrl === 'string') {
        fontFace = new FontFace(cleanName, `url(${fontBufferOrUrl})`);
      } else {
        fontFace = new FontFace(cleanName, fontBufferOrUrl);
      }

      await fontFace.load();
      (document.fonts as any).add(fontFace);
      this.loadedFonts.add('local_' + cleanName);
      return true;
    } catch (e) {
      console.warn('Error loading local font face', e);
      return false;
    }
  }
}
