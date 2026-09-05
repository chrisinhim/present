import { BibleBook } from '../models/presentation.models';

export const BIBLE_BOOKS: BibleBook[] = [
  // Law (5)
  { id: 1, name: 'Genesis', abbrev: 'Gen', chapters: 50, category: 'Law' },
  { id: 2, name: 'Exodus', abbrev: 'Exo', chapters: 40, category: 'Law' },
  { id: 3, name: 'Leviticus', abbrev: 'Lev', chapters: 27, category: 'Law' },
  { id: 4, name: 'Numbers', abbrev: 'Num', chapters: 36, category: 'Law' },
  { id: 5, name: 'Deuteronomy', abbrev: 'Deu', chapters: 34, category: 'Law' },

  // History (12)
  { id: 6, name: 'Joshua', abbrev: 'Jos', chapters: 24, category: 'History' },
  { id: 7, name: 'Judges', abbrev: 'Jdg', chapters: 21, category: 'History' },
  { id: 8, name: 'Ruth', abbrev: 'Rut', chapters: 4, category: 'History' },
  { id: 9, name: '1 Samuel', abbrev: '1Sa', chapters: 31, category: 'History' },
  { id: 10, name: '2 Samuel', abbrev: '2Sa', chapters: 24, category: 'History' },
  { id: 11, name: '1 Kings', abbrev: '1Ki', chapters: 22, category: 'History' },
  { id: 12, name: '2 Kings', abbrev: '2Ki', chapters: 25, category: 'History' },
  { id: 13, name: '1 Chronicles', abbrev: '1Ch', chapters: 29, category: 'History' },
  { id: 14, name: '2 Chronicles', abbrev: '2Ch', chapters: 36, category: 'History' },
  { id: 15, name: 'Ezra', abbrev: 'Ezr', chapters: 10, category: 'History' },
  { id: 16, name: 'Nehemiah', abbrev: 'Neh', chapters: 13, category: 'History' },
  { id: 17, name: 'Esther', abbrev: 'Est', chapters: 10, category: 'History' },

  // Poetry (5)
  { id: 18, name: 'Job', abbrev: 'Job', chapters: 42, category: 'Poetry' },
  { id: 19, name: 'Psalms', abbrev: 'Psa', chapters: 150, category: 'Poetry' },
  { id: 20, name: 'Proverbs', abbrev: 'Pro', chapters: 31, category: 'Poetry' },
  { id: 21, name: 'Ecclesiastes', abbrev: 'Ecc', chapters: 12, category: 'Poetry' },
  { id: 22, name: 'Song of Solomon', abbrev: 'Son', chapters: 8, category: 'Poetry' },

  // Major Prophets (5)
  { id: 23, name: 'Isaiah', abbrev: 'Isa', chapters: 66, category: 'Major Prophets' },
  { id: 24, name: 'Jeremiah', abbrev: 'Jer', chapters: 52, category: 'Major Prophets' },
  { id: 25, name: 'Lamentations', abbrev: 'Lam', chapters: 5, category: 'Major Prophets' },
  { id: 26, name: 'Ezekiel', abbrev: 'Eze', chapters: 48, category: 'Major Prophets' },
  { id: 27, name: 'Daniel', abbrev: 'Dan', chapters: 12, category: 'Major Prophets' },

  // Minor Prophets (12)
  { id: 28, name: 'Hosea', abbrev: 'Hos', chapters: 14, category: 'Minor Prophets' },
  { id: 29, name: 'Joel', abbrev: 'Joe', chapters: 3, category: 'Minor Prophets' },
  { id: 30, name: 'Amos', abbrev: 'Amo', chapters: 9, category: 'Minor Prophets' },
  { id: 31, name: 'Obadiah', abbrev: 'Oba', chapters: 1, category: 'Minor Prophets' },
  { id: 32, name: 'Jonah', abbrev: 'Jon', chapters: 4, category: 'Minor Prophets' },
  { id: 33, name: 'Micah', abbrev: 'Mic', chapters: 7, category: 'Minor Prophets' },
  { id: 34, name: 'Nahum', abbrev: 'Nah', chapters: 3, category: 'Minor Prophets' },
  { id: 35, name: 'Habakkuk', abbrev: 'Hab', chapters: 3, category: 'Minor Prophets' },
  { id: 36, name: 'Zephaniah', abbrev: 'Zep', chapters: 3, category: 'Minor Prophets' },
  { id: 37, name: 'Haggai', abbrev: 'Hag', chapters: 2, category: 'Minor Prophets' },
  { id: 38, name: 'Zechariah', abbrev: 'Zec', chapters: 14, category: 'Minor Prophets' },
  { id: 39, name: 'Malachi', abbrev: 'Mal', chapters: 4, category: 'Minor Prophets' },

  // Gospels (4)
  { id: 40, name: 'Matthew', abbrev: 'Mat', chapters: 28, category: 'Gospels' },
  { id: 41, name: 'Mark', abbrev: 'Mar', chapters: 16, category: 'Gospels' },
  { id: 42, name: 'Luke', abbrev: 'Luk', chapters: 24, category: 'Gospels' },
  { id: 43, name: 'John', abbrev: 'Joh', chapters: 21, category: 'Gospels' },

  // Acts (1)
  { id: 44, name: 'Acts', abbrev: 'Act', chapters: 28, category: 'Acts' },

  // Pauline Epistles (14)
  { id: 45, name: 'Romans', abbrev: 'Rom', chapters: 16, category: 'Pauline' },
  { id: 46, name: '1 Corinthians', abbrev: '1Co', chapters: 16, category: 'Pauline' },
  { id: 47, name: '2 Corinthians', abbrev: '2Co', chapters: 13, category: 'Pauline' },
  { id: 48, name: 'Galatians', abbrev: 'Gal', chapters: 6, category: 'Pauline' },
  { id: 49, name: 'Ephesians', abbrev: 'Eph', chapters: 6, category: 'Pauline' },
  { id: 50, name: 'Philippians', abbrev: 'Phi', chapters: 4, category: 'Pauline' },
  { id: 51, name: 'Colossians', abbrev: 'Col', chapters: 4, category: 'Pauline' },
  { id: 52, name: '1 Thessalonians', abbrev: '1Th', chapters: 5, category: 'Pauline' },
  { id: 53, name: '2 Thessalonians', abbrev: '2Th', chapters: 3, category: 'Pauline' },
  { id: 54, name: '1 Timothy', abbrev: '1Ti', chapters: 6, category: 'Pauline' },
  { id: 55, name: '2 Timothy', abbrev: '2Ti', chapters: 4, category: 'Pauline' },
  { id: 56, name: 'Titus', abbrev: 'Tit', chapters: 3, category: 'Pauline' },
  { id: 57, name: 'Philemon', abbrev: 'Phm', chapters: 1, category: 'Pauline' },
  { id: 58, name: 'Hebrews', abbrev: 'Heb', chapters: 13, category: 'Pauline' },

  // General Epistles (7)
  { id: 59, name: 'James', abbrev: 'Jas', chapters: 5, category: 'General' },
  { id: 60, name: '1 Peter', abbrev: '1Pe', chapters: 5, category: 'General' },
  { id: 61, name: '2 Peter', abbrev: '2Pe', chapters: 3, category: 'General' },
  { id: 62, name: '1 John', abbrev: '1Jn', chapters: 5, category: 'General' },
  { id: 63, name: '2 John', abbrev: '2Jn', chapters: 1, category: 'General' },
  { id: 64, name: '3 John', abbrev: '3Jn', chapters: 1, category: 'General' },
  { id: 65, name: 'Jude', abbrev: 'Jud', chapters: 1, category: 'General' },

  // Prophecy (1)
  { id: 66, name: 'Revelation', abbrev: 'Rev', chapters: 22, category: 'Prophecy' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Law: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300',
  History: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300',
  Poetry: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300',
  'Major Prophets': 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300',
  'Minor Prophets': 'bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950/50 dark:text-pink-300',
  Gospels: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300',
  Acts: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300',
  Pauline: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/50 dark:text-violet-300',
  General: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300',
  Prophecy: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300',
};

// Accurate canonical verse counts for every chapter of all 66 books of the Bible
export const BIBLE_VERSE_COUNTS: Record<string, number[]> = {
  Genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
  Exodus: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
  Leviticus: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
  Numbers: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13],
  Deuteronomy: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12],
  Joshua: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
  Judges: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
  Ruth: [22, 23, 18, 22],
  '1 Samuel': [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13],
  '2 Samuel': [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25],
  '1 Kings': [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53],
  '2 Kings': [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
  '1 Chronicles': [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
  '2 Chronicles': [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23],
  Ezra: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
  Nehemiah: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
  Esther: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
  Job: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17],
  Psalms: [
    6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
    13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17,
    13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12,
    8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19,
    16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5,
    8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7,
    8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13,
    10, 7, 12, 15, 21, 10, 20, 14, 9, 6
  ],
  Proverbs: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31],
  Ecclesiastes: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
  'Song of Solomon': [17, 17, 11, 16, 16, 13, 13, 14],
  Isaiah: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 10, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24],
  Jeremiah: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
  Lamentations: [22, 22, 66, 22, 22],
  Ezekiel: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
  Daniel: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
  Hosea: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
  Joel: [20, 32, 21],
  Amos: [15, 16, 15, 13, 27, 14, 17, 14, 15],
  Obadiah: [21],
  Jonah: [17, 10, 10, 11],
  Micah: [16, 13, 12, 13, 15, 16, 20],
  Nahum: [15, 13, 19],
  Habakkuk: [17, 20, 19],
  Zephaniah: [18, 15, 20],
  Haggai: [15, 23],
  Zechariah: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
  Malachi: [14, 17, 18, 6],
  Matthew: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
  Mark: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
  Luke: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
  John: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
  Acts: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31],
  Romans: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
  '1 Corinthians': [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
  '2 Corinthians': [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
  Galatians: [24, 21, 29, 31, 26, 18],
  Ephesians: [23, 22, 21, 32, 33, 24],
  Philippians: [30, 30, 21, 23],
  Colossians: [29, 23, 25, 18],
  '1 Thessalonians': [10, 20, 13, 18, 28],
  '2 Thessalonians': [12, 17, 18],
  '1 Timothy': [20, 15, 16, 16, 25, 21],
  '2 Timothy': [18, 26, 17, 22],
  Titus: [16, 15, 15],
  Philemon: [25],
  Hebrews: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
  James: [27, 26, 18, 17, 20],
  '1 Peter': [25, 25, 22, 19, 14],
  '2 Peter': [21, 22, 18],
  '1 John': [10, 29, 24, 21, 21],
  '2 John': [13],
  '3 John': [14],
  Jude: [25],
  Revelation: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21],
};

export const SAMPLE_VERSES_DB: Record<string, string> = {
  // Genesis 1
  'Genesis 1:1': 'In the beginning God created the heaven and the earth.',
  'Genesis 1:2': 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
  'Genesis 1:3': 'And God said, Let there be light: and there was light.',
  'Genesis 1:4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
  'Genesis 1:5': 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',

  // Psalm 23
  'Psalms 23:1': 'The LORD is my shepherd; I shall not want.',
  'Psalms 23:2': 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
  'Psalms 23:3': 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
  'Psalms 23:4': 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
  'Psalms 23:5': 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
  'Psalms 23:6': 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',

  // Matthew 5 (Beatitudes)
  'Matthew 5:1': 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:',
  'Matthew 5:2': 'And he opened his mouth, and taught them, saying,',
  'Matthew 5:3': 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
  'Matthew 5:4': 'Blessed are they that mourn: for they shall be comforted.',
  'Matthew 5:5': 'Blessed are the meek: for they shall inherit the earth.',
  'Matthew 5:6': 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.',
  'Matthew 5:7': 'Blessed are the merciful: for they shall obtain mercy.',
  'Matthew 5:8': 'Blessed are the pure in heart: for they shall see God.',
  'Matthew 5:9': 'Blessed are the peacemakers: for they shall be called the children of God.',
  'Matthew 5:10': 'Blessed are they which are persecuted for righteousness\' sake: for theirs is the kingdom of heaven.',

  // John 3
  'John 3:1': 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:',
  'John 3:2': 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.',
  'John 3:3': 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.',
  'John 3:16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  'John 3:17': 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
  'John 3:18': 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.',

  // Romans 8
  'Romans 8:1': 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
  'Romans 8:28': 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
  'Romans 8:31': 'What shall we then say to these things? If God be for us, who can be against us?',
  'Romans 8:37': 'Nay, in all these things we are more than conquerors through him that loved us.',
  'Romans 8:38': 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
  'Romans 8:39': 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',

  // 1 Corinthians 13
  '1 Corinthians 13:1': 'Though I speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal.',
  '1 Corinthians 13:4': 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
  '1 Corinthians 13:7': 'Beareth all things, believeth all things, hopeth all things, endureth all things.',
  '1 Corinthians 13:8': 'Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.',
  '1 Corinthians 13:13': 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.',
};
