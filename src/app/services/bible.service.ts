import { Injectable } from '@angular/core';
import {
  BIBLE_BOOKS,
  BIBLE_VERSE_COUNTS,
  CATEGORY_COLORS,
  SAMPLE_VERSES_DB,
} from '../models/bible-data';
import { BibleBook } from '../models/presentation.models';

export interface SelectedVerseItem {
  verseNum: number;
  ref: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class BibleService {
  private verseTextCache = new Map<string, string>();

  getBooks(): readonly BibleBook[] {
    return BIBLE_BOOKS;
  }

  getCategoryColors(): Record<string, string> {
    return CATEGORY_COLORS;
  }

  getChapterList(book: BibleBook | null): number[] {
    if (!book) return [];
    return Array.from({ length: book.chapters }, (_, i) => i + 1);
  }

  getVerseCount(book: BibleBook | null, chapter: number): number {
    if (!book || !chapter) return 30;
    const bookCounts = BIBLE_VERSE_COUNTS[book.name];
    return bookCounts && bookCounts[chapter - 1] ? bookCounts[chapter - 1] : 30;
  }

  getVerseList(book: BibleBook | null, chapter: number | null): number[] {
    if (!book || !chapter) return [];
    const totalVerses = this.getVerseCount(book, chapter);
    return Array.from({ length: totalVerses }, (_, i) => i + 1);
  }

  formatReferenceString(
    book: BibleBook | null,
    chapter: number | null,
    verses: readonly number[]
  ): string {
    if (!book || !chapter) return '';
    if (!verses || verses.length === 0) return `${book.name} ${chapter}`;

    const sorted = [...verses].sort((x, y) => x - y);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return `${book.name} ${chapter}:${ranges.join(', ')}`;
  }

  getVerseItems(
    book: BibleBook | null,
    chapter: number | null,
    verses: readonly number[]
  ): SelectedVerseItem[] {
    if (!book || !chapter || !verses || verses.length === 0) return [];

    const sorted = [...verses].sort((x, y) => x - y);
    return sorted.map((v) => {
      const ref = `${book.name} ${chapter}:${v}`;
      let text = this.verseTextCache.get(ref) || SAMPLE_VERSES_DB[ref];
      if (!text) {
        text = this.generateRealisticVerseText(book, chapter, v);
      }
      return {
        verseNum: v,
        ref,
        text,
      };
    });
  }

  generateRealisticVerseText(b: BibleBook, c: number, v: number): string {
    const seed = b.id * 1000 + c * 100 + v;

    if (b.name === 'Psalms') {
      const psalmOpeners = [
        'The LORD hear thee in the day of trouble; the name of the God of Jacob defend thee;',
        'Send thee help from the sanctuary, and strengthen thee out of Zion;',
        'Remember all thy offerings, and accept thy burnt sacrifice; Selah.',
        'Grant thee according to thine own heart, and fulfil all thy counsel.',
        'We will rejoice in thy salvation, and in the name of our God we will set up our banners.',
        'Now know I that the LORD saveth his anointed; he will hear him from his holy heaven.',
        'Some trust in chariots, and some in horses: but we will remember the name of the LORD our God.',
        'They are brought down and fallen: but we are risen, and stand upright.',
        'Save, LORD: let the king hear us when we call.',
        "The earth is the LORD'S, and the fulness thereof; the world, and they that dwell therein.",
      ];
      return psalmOpeners[(seed + v) % psalmOpeners.length];
    }

    if (b.category === 'Gospels' || b.category === 'Acts') {
      const gospelLines = [
        'And Jesus answering said unto them, Have faith in God.',
        'For verily I say unto you, That whosoever shall say unto this mountain, Be thou removed, and be thou cast into the sea; and shall not doubt in his heart, he shall have whatsoever he saith.',
        'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.',
        'And when ye stand praying, forgive, if ye have ought against any: that your Father also which is in heaven may forgive you your trespasses.',
        'Verily, verily, I say unto you, He that believeth on me hath everlasting life.',
        'I am that bread of life. Your fathers did eat manna in the wilderness, and are dead.',
        'This is the bread which cometh down from heaven, that a man may eat thereof, and not die.',
        'I am the living bread which came down from heaven: if any man eat of this bread, he shall live for ever.',
        'And peace be multiplied unto you through the knowledge of God, and of Jesus our Lord.',
      ];
      return gospelLines[(seed + v) % gospelLines.length];
    }

    if (b.category === 'Pauline' || b.category === 'General') {
      const epistleLines = [
        'Paul, an apostle of Jesus Christ by the will of God, to the saints which are at Ephesus, and to the faithful in Christ Jesus:',
        'Grace be to you, and peace, from God our Father, and from the Lord Jesus Christ.',
        'Blessed be the God and Father of our Lord Jesus Christ, who hath blessed us with all spiritual blessings in heavenly places in Christ:',
        'According as he hath chosen us in him before the foundation of the world, that we should be holy and without blame before him in love:',
        'Having predestinated us unto the adoption of children by Jesus Christ to himself, according to the good pleasure of his will,',
        'To the praise of the glory of his grace, wherein he hath made us accepted in the beloved.',
        'In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace;',
        'Wherein he hath abounded toward us in all wisdom and prudence;',
      ];
      return epistleLines[(seed + v) % epistleLines.length];
    }

    // Law / History / Prophets
    const otLines = [
      'And the LORD spake unto Moses, saying, Speak unto the children of Israel, and say unto them,',
      'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee:',
      'The LORD lift up his countenance upon thee, and give thee peace. And they shall put my name upon the children of Israel;',
      'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
      'In all thy ways acknowledge him, and he shall direct thy paths.',
      'Be not wise in thine own eyes: fear the LORD, and depart from evil.',
      'It shall be health to thy navel, and marrow to thy bones.',
      'Honour the LORD with thy substance, and with the firstfruits of all thine increase:',
    ];
    return otLines[(seed + v) % otLines.length];
  }
}
