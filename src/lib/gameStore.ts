// Backend integration point: replace localStorage with a real-time session store (e.g. Supabase Realtime, Firebase RTDB)

export type Topic =
  | 'addition' |'subtraction' |'multiplication' |'division' |'spelling' |'word-scramble' |'general-knowledge' |'memory-match';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  topic: Topic;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number;
  teamAName: string;
  teamBName: string;
}

export interface Question {
  id: string;
  text: string;
  options: (number | string)[];
  answer: number | string;
  hint?: string;
  category?: string;
}

export interface RoundResult {
  questionId: string;
  question: string;
  correctAnswer: number | string;
  teamAAnswer: number | string | null;
  teamACorrect: boolean;
  teamATime: number;
  teamBAnswer: number | string | null;
  teamBCorrect: boolean;
  teamBTime: number;
}

export interface GameState {
  config: GameConfig;
  questions: Question[];
  currentRound: number;
  teamAScore: number;
  teamBScore: number;
  teamAStreak: number;
  teamBStreak: number;
  rounds: RoundResult[];
  status: 'idle' | 'countdown' | 'playing' | 'round_end' | 'finished';
}

const STORAGE_KEY = 'matharena_game';

export function saveGameState(state: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getRange(difficulty: Difficulty): [number, number] {
  if (difficulty === 'easy') return [1, 10];
  if (difficulty === 'medium') return [2, 25];
  return [5, 50];
}

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Spelling word banks ───────────────────────────────────────────────────
const spellingEasy = [
  { word: 'CAT', scrambled: 'ACT', options: ['CAT', 'ACT', 'TAC', 'CTA'], answer: 'CAT', hint: 'A furry pet that meows' },
  { word: 'DOG', scrambled: 'GOD', options: ['GOD', 'DOG', 'OGD', 'GDO'], answer: 'DOG', hint: 'A loyal pet that barks' },
  { word: 'SUN', scrambled: 'NUS', options: ['SUN', 'NUS', 'UNS', 'SNU'], answer: 'SUN', hint: 'It shines in the sky' },
  { word: 'BIG', scrambled: 'GIB', options: ['BIG', 'GIB', 'IBG', 'GBI'], answer: 'BIG', hint: 'The opposite of small' },
  { word: 'RUN', scrambled: 'NUR', options: ['RUN', 'NUR', 'URN', 'RNU'], answer: 'RUN', hint: 'Move fast on your feet' },
  { word: 'FLY', scrambled: 'YLF', options: ['FLY', 'YLF', 'LFY', 'YFL'], answer: 'FLY', hint: 'Birds and planes do this' },
  { word: 'HAT', scrambled: 'ATH', options: ['HAT', 'ATH', 'THA', 'AHT'], answer: 'HAT', hint: 'You wear it on your head' },
  { word: 'MAP', scrambled: 'PAM', options: ['MAP', 'PAM', 'AMP', 'MPA'], answer: 'MAP', hint: 'Shows you where places are' },
];

const spellingMedium = [
  { word: 'BRAVE', scrambled: 'VERAB', options: ['BRAVE', 'VERAB', 'RAVED', 'BAVER'], answer: 'BRAVE', hint: 'Not afraid of danger' },
  { word: 'CLOUD', scrambled: 'DOLUC', options: ['CLOUD', 'DOLUC', 'COULD', 'CLODU'], answer: 'CLOUD', hint: 'Fluffy thing in the sky' },
  { word: 'FLAME', scrambled: 'MELFA', options: ['FLAME', 'MELFA', 'FLEMA', 'FEMAL'], answer: 'FLAME', hint: 'Fire produces this' },
  { word: 'GLOBE', scrambled: 'BELGO', options: ['GLOBE', 'BELGO', 'GLEBO', 'OBELG'], answer: 'GLOBE', hint: 'A round model of Earth' },
  { word: 'JUICE', scrambled: 'ECUIJ', options: ['JUICE', 'ECUIJ', 'JUCIE', 'ICUJE'], answer: 'JUICE', hint: 'A fruity drink' },
  { word: 'MAGIC', scrambled: 'CIGAM', options: ['MAGIC', 'CIGAM', 'MAGCI', 'ICMAG'], answer: 'MAGIC', hint: 'Wizards use this' },
  { word: 'OCEAN', scrambled: 'NAECO', options: ['OCEAN', 'NAECO', 'CANOE', 'ONAEC'], answer: 'OCEAN', hint: 'A huge body of salt water' },
  { word: 'PLANT', scrambled: 'TNALP', options: ['PLANT', 'TNALP', 'PLNAT', 'TPLAN'], answer: 'PLANT', hint: 'It grows from a seed' },
];

const spellingHard = [
  { word: 'ANCIENT', scrambled: 'TNEICNA', options: ['ANCIENT', 'TNEICNA', 'NAICENT', 'TICNEAN'], answer: 'ANCIENT', hint: 'Very very old' },
  { word: 'BALANCE', scrambled: 'ECNALAB', options: ['BALANCE', 'ECNALAB', 'BLANACE', 'CABLANE'], answer: 'BALANCE', hint: 'Equal on both sides' },
  { word: 'CAPTAIN', scrambled: 'NIATPAC', options: ['CAPTAIN', 'NIATPAC', 'CAPTIAN', 'TAPICAN'], answer: 'CAPTAIN', hint: 'Leader of a ship or team' },
  { word: 'DIAMOND', scrambled: 'DNOMAID', options: ['DIAMOND', 'DNOMAID', 'DIMAOND', 'MONDIAD'], answer: 'DIAMOND', hint: 'The hardest gemstone' },
  { word: 'EXPLORE', scrambled: 'EROLPXE', options: ['EXPLORE', 'EROLPXE', 'EXPLROE', 'PLOEXRE'], answer: 'EXPLORE', hint: 'To discover new places' },
  { word: 'FREEDOM', scrambled: 'MODEERF', options: ['FREEDOM', 'MODEERF', 'FREEMDO', 'DOMFREE'], answer: 'FREEDOM', hint: 'The state of being free' },
  { word: 'GRAVITY', scrambled: 'YTIVARQ', options: ['GRAVITY', 'YTIVARQ', 'GRAVTIY', 'VITYGRA'], answer: 'GRAVITY', hint: 'Force that pulls things down' },
  { word: 'HORIZON', scrambled: 'NOZIROH', options: ['HORIZON', 'NOZIROH', 'HORIZNO', 'ZONIROH'], answer: 'HORIZON', hint: 'Where sky meets the earth' },
];

// ─── General Knowledge question banks ─────────────────────────────────────
const gkEasy = [
  { q: 'What color is the sky on a sunny day?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Blue' },
  { q: 'How many legs does a spider have?', options: ['6', '8', '4', '10'], answer: '8' },
  { q: 'What do bees make?', options: ['Milk', 'Honey', 'Butter', 'Jam'], answer: 'Honey' },
  { q: 'Which planet do we live on?', options: ['Mars', 'Venus', 'Earth', 'Jupiter'], answer: 'Earth' },
  { q: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: '7' },
  { q: 'What sound does a cow make?', options: ['Oink', 'Moo', 'Baa', 'Cluck'], answer: 'Moo' },
  { q: 'What is the biggest animal on land?', options: ['Lion', 'Giraffe', 'Elephant', 'Hippo'], answer: 'Elephant' },
  { q: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], answer: '7' },
  { q: 'What do plants need to grow?', options: ['Candy', 'Sunlight', 'Music', 'Paint'], answer: 'Sunlight' },
  { q: 'Which fruit is yellow and curved?', options: ['Apple', 'Banana', 'Grape', 'Mango'], answer: 'Banana' },
];

const gkMedium = [
  { q: 'What is the fastest land animal?', options: ['Lion', 'Horse', 'Cheetah', 'Leopard'], answer: 'Cheetah' },
  { q: 'How many continents are on Earth?', options: ['5', '6', '7', '8'], answer: '7' },
  { q: 'What gas do plants breathe in?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Carbon Dioxide' },
  { q: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' },
  { q: 'What is the capital of France?', options: ['Rome', 'Berlin', 'Paris', 'Madrid'], answer: 'Paris' },
  { q: 'How many bones are in the human body?', options: ['106', '206', '306', '406'], answer: '206' },
  { q: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], answer: 'Diamond' },
  { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars' },
  { q: 'What is the largest organ in the human body?', options: ['Heart', 'Liver', 'Skin', 'Brain'], answer: 'Skin' },
  { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: '6' },
];

const gkHard = [
  { q: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 'Au' },
  { q: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], answer: 'Saturn' },
  { q: 'What is the speed of light (approx)?', options: ['100,000 km/s', '300,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s' },
  { q: 'Who invented the telephone?', options: ['Edison', 'Tesla', 'Bell', 'Marconi'], answer: 'Bell' },
  { q: 'What is the smallest planet in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], answer: 'Mercury' },
  { q: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: '1945' },
  { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], answer: 'Mitochondria' },
  { q: 'Which element has atomic number 1?', options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'], answer: 'Hydrogen' },
  { q: 'What is the longest river in the world?', options: ['Amazon', 'Congo', 'Nile', 'Yangtze'], answer: 'Nile' },
  { q: 'How many bones are in the human skull?', options: ['8', '22', '14', '30'], answer: '22' },
];

// ─── Memory match patterns ─────────────────────────────────────────────────
const memoryEasy = [
  { q: 'What comes next? 2, 4, 6, 8, __', options: ['9', '10', '11', '12'], answer: '10' },
  { q: 'What comes next? A, B, C, D, __', options: ['E', 'F', 'G', 'H'], answer: 'E' },
  { q: 'What comes next? 1, 3, 5, 7, __', options: ['8', '9', '10', '11'], answer: '9' },
  { q: 'What comes next? Red, Blue, Red, Blue, __', options: ['Green', 'Red', 'Yellow', 'Purple'], answer: 'Red' },
  { q: 'What comes next? 5, 10, 15, 20, __', options: ['22', '24', '25', '30'], answer: '25' },
  { q: 'What comes next? Circle, Square, Circle, Square, __', options: ['Triangle', 'Circle', 'Diamond', 'Star'], answer: 'Circle' },
  { q: 'What comes next? 10, 20, 30, 40, __', options: ['45', '48', '50', '55'], answer: '50' },
  { q: 'What comes next? Mon, Tue, Wed, Thu, __', options: ['Sat', 'Sun', 'Fri', 'Mon'], answer: 'Fri' },
];

const memoryMedium = [
  { q: 'What comes next? 2, 4, 8, 16, __', options: ['24', '28', '32', '36'], answer: '32' },
  { q: 'What comes next? 1, 1, 2, 3, 5, __', options: ['6', '7', '8', '9'], answer: '8' },
  { q: 'What comes next? 100, 90, 80, 70, __', options: ['55', '60', '65', '50'], answer: '60' },
  { q: 'What comes next? 3, 6, 12, 24, __', options: ['36', '42', '48', '30'], answer: '48' },
  { q: 'What comes next? Z, Y, X, W, __', options: ['U', 'V', 'T', 'S'], answer: 'V' },
  { q: 'What comes next? 1, 4, 9, 16, __', options: ['20', '24', '25', '30'], answer: '25' },
  { q: 'What comes next? 2, 3, 5, 7, 11, __', options: ['12', '13', '14', '15'], answer: '13' },
  { q: 'What comes next? Jan, Apr, Jul, Oct, __', options: ['Nov', 'Dec', 'Jan', 'Feb'], answer: 'Jan' },
];

const memoryHard = [
  { q: 'What comes next? 1, 8, 27, 64, __', options: ['100', '121', '125', '144'], answer: '125' },
  { q: 'What comes next? 2, 6, 12, 20, 30, __', options: ['36', '40', '42', '44'], answer: '42' },
  { q: 'What comes next? 0, 1, 1, 2, 3, 5, 8, __', options: ['11', '12', '13', '14'], answer: '13' },
  { q: 'What comes next? 3, 9, 27, 81, __', options: ['162', '243', '324', '405'], answer: '243' },
  { q: 'What comes next? 2, 5, 10, 17, 26, __', options: ['35', '36', '37', '38'], answer: '37' },
  { q: 'What comes next? 1, 2, 6, 24, 120, __', options: ['240', '480', '600', '720'], answer: '720' },
  { q: 'What comes next? 7, 14, 28, 56, __', options: ['84', '98', '112', '120'], answer: '112' },
  { q: 'What comes next? 1, 3, 7, 15, 31, __', options: ['47', '55', '63', '71'], answer: '63' },
];

export function generateQuestions(
  topic: Topic,
  difficulty: Difficulty,
  count: number,
  seed: number = 42
): Question[] {
  const rand = seededRand(seed);

  // ─── Math topics ──────────────────────────────────────────────────────────
  if (topic === 'addition' || topic === 'subtraction' || topic === 'multiplication' || topic === 'division') {
    const [min, max] = getRange(difficulty);
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      const a = Math.floor(rand() * (max - min + 1)) + min;
      const b = Math.floor(rand() * (max - min + 1)) + min;

      let text = '';
      let answer = 0;

      if (topic === 'addition') {
        text = `${a} + ${b}`;
        answer = a + b;
      } else if (topic === 'subtraction') {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        text = `${big} − ${small}`;
        answer = big - small;
      } else if (topic === 'multiplication') {
        const ma = Math.floor(rand() * 10) + 1;
        const mb = Math.floor(rand() * 10) + 1;
        text = `${ma} × ${mb}`;
        answer = ma * mb;
      } else {
        const divisor = Math.floor(rand() * 9) + 1;
        const quotient = Math.floor(rand() * 10) + 1;
        const dividend = divisor * quotient;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      }

      const wrongSet = new Set<number>();
      while (wrongSet.size < 3) {
        const offset = Math.floor(rand() * 8) + 1;
        const sign = rand() > 0.5 ? 1 : -1;
        const wrong = answer + sign * offset;
        if (wrong !== answer && wrong >= 0) wrongSet.add(wrong);
      }
      const wrongs = Array.from(wrongSet);
      const options: number[] = [answer, wrongs[0], wrongs[1], wrongs[2]];
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(rand() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }

      questions.push({ id: `q-${i + 1}`, text, options, answer });
    }
    return questions;
  }

  // ─── Spelling / Word Scramble ─────────────────────────────────────────────
  if (topic === 'spelling' || topic === 'word-scramble') {
    const bank = difficulty === 'easy' ? spellingEasy : difficulty === 'medium' ? spellingMedium : spellingHard;
    const questions: Question[] = [];
    const used = new Set<number>();

    for (let i = 0; i < Math.min(count, bank.length); i++) {
      let idx = Math.floor(rand() * bank.length);
      let tries = 0;
      while (used.has(idx) && tries < 20) { idx = Math.floor(rand() * bank.length); tries++; }
      used.add(idx);
      const item = bank[idx];
      let text = topic === 'word-scramble'
        ? `Unscramble: ${item.scrambled}`
        : `Spell the word: ${item.hint}`;
      questions.push({
        id: `q-${i + 1}`,
        text,
        options: item.options,
        answer: item.answer,
        hint: item.hint,
        category: topic === 'word-scramble' ? 'Word Scramble' : 'Spelling',
      });
    }
    return questions;
  }

  // ─── General Knowledge ────────────────────────────────────────────────────
  if (topic === 'general-knowledge') {
    const bank = difficulty === 'easy' ? gkEasy : difficulty === 'medium' ? gkMedium : gkHard;
    const questions: Question[] = [];
    const used = new Set<number>();

    for (let i = 0; i < Math.min(count, bank.length); i++) {
      let idx = Math.floor(rand() * bank.length);
      let tries = 0;
      while (used.has(idx) && tries < 20) { idx = Math.floor(rand() * bank.length); tries++; }
      used.add(idx);
      const item = bank[idx];
      questions.push({
        id: `q-${i + 1}`,
        text: item.q,
        options: item.options,
        answer: item.answer,
        category: 'General Knowledge',
      });
    }
    return questions;
  }

  // ─── Memory / Pattern ─────────────────────────────────────────────────────
  if (topic === 'memory-match') {
    const bank = difficulty === 'easy' ? memoryEasy : difficulty === 'medium' ? memoryMedium : memoryHard;
    const questions: Question[] = [];
    const used = new Set<number>();

    for (let i = 0; i < Math.min(count, bank.length); i++) {
      let idx = Math.floor(rand() * bank.length);
      let tries = 0;
      while (used.has(idx) && tries < 20) { idx = Math.floor(rand() * bank.length); tries++; }
      used.add(idx);
      const item = bank[idx];
      questions.push({
        id: `q-${i + 1}`,
        text: item.q,
        options: item.options,
        answer: item.answer,
        category: 'Pattern',
      });
    }
    return questions;
  }

  return [];
}

export const DEFAULT_CONFIG: GameConfig = {
  topic: 'addition',
  difficulty: 'easy',
  questionCount: 10,
  timePerQuestion: 20,
  teamAName: 'Team Alpha',
  teamBName: 'Team Beta',
};