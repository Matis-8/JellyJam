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
  teamAQuestions: Question[];
  teamBQuestions: Question[];
  currentRound: number;
  teamARound: number;
  teamBRound: number;
  teamAScore: number;
  teamBScore: number;
  teamAStreak: number;
  teamBStreak: number;
  rounds: RoundResult[];
  status: 'idle' | 'countdown' | 'playing' | 'round_end' | 'finished';
}

const STORAGE_KEY = 'jellyjam_game';

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
  { word: 'BED', scrambled: 'DEB', options: ['BED', 'DEB', 'EBD', 'DBE'], answer: 'BED', hint: 'You sleep in this' },
  { word: 'CUP', scrambled: 'PCU', options: ['CUP', 'PCU', 'UCP', 'PUC'], answer: 'CUP', hint: 'You drink from this' },
  { word: 'BOX', scrambled: 'OXB', options: ['BOX', 'OXB', 'XBO', 'OBX'], answer: 'BOX', hint: 'A square container' },
  { word: 'JAM', scrambled: 'MAJ', options: ['JAM', 'MAJ', 'AMJ', 'JMA'], answer: 'JAM', hint: 'Sweet spread for bread' },
  { word: 'PIG', scrambled: 'GIP', options: ['PIG', 'GIP', 'IGP', 'GPI'], answer: 'PIG', hint: 'A pink farm animal' },
  { word: 'HEN', scrambled: 'NEH', options: ['HEN', 'NEH', 'ENH', 'NHE'], answer: 'HEN', hint: 'A female chicken' },
  { word: 'OWL', scrambled: 'WOL', options: ['OWL', 'WOL', 'LOW', 'WLO'], answer: 'OWL', hint: 'A bird that hoots at night' },
  { word: 'ANT', scrambled: 'TAN', options: ['ANT', 'TAN', 'NAT', 'ATN'], answer: 'ANT', hint: 'A tiny insect that lives in colonies' },
  { word: 'EGG', scrambled: 'GGE', options: ['EGG', 'GGE', 'GEG', 'EGG'], answer: 'EGG', hint: 'Chickens lay these' },
  { word: 'ICE', scrambled: 'CEI', options: ['ICE', 'CEI', 'ECI', 'IEC'], answer: 'ICE', hint: 'Frozen water' },
  { word: 'JAR', scrambled: 'RAJ', options: ['JAR', 'RAJ', 'ARJ', 'JRA'], answer: 'JAR', hint: 'A glass container with a lid' },
  { word: 'KEY', scrambled: 'YEK', options: ['KEY', 'YEK', 'EKY', 'KYE'], answer: 'KEY', hint: 'Opens a lock' },
  { word: 'LEG', scrambled: 'GEL', options: ['LEG', 'GEL', 'EGL', 'LGE'], answer: 'LEG', hint: 'You walk on these' },
  { word: 'MUD', scrambled: 'DUM', options: ['MUD', 'DUM', 'UMD', 'MDU'], answer: 'MUD', hint: 'Wet dirty earth' },
  { word: 'NET', scrambled: 'TEN', options: ['NET', 'TEN', 'ENT', 'NTE'], answer: 'NET', hint: 'Used to catch fish or play tennis' },
  { word: 'OAK', scrambled: 'KOA', options: ['OAK', 'KOA', 'AOK', 'KAO'], answer: 'OAK', hint: 'A type of strong tree' },
  { word: 'PAN', scrambled: 'NAP', options: ['PAN', 'NAP', 'ANP', 'NPA'], answer: 'PAN', hint: 'Used for cooking on a stove' },
  { word: 'RAT', scrambled: 'TAR', options: ['RAT', 'TAR', 'ART', 'TRA'], answer: 'RAT', hint: 'A small rodent with a long tail' },
  { word: 'SAP', scrambled: 'PAS', options: ['SAP', 'PAS', 'APS', 'SPA'], answer: 'SAP', hint: 'Liquid inside a tree' },
  { word: 'TAP', scrambled: 'PAT', options: ['TAP', 'PAT', 'APT', 'TPA'], answer: 'TAP', hint: 'You turn this for water' },
  { word: 'VAN', scrambled: 'NAV', options: ['VAN', 'NAV', 'ANV', 'NVA'], answer: 'VAN', hint: 'A large vehicle for carrying things' },
  { word: 'WAX', scrambled: 'XAW', options: ['WAX', 'XAW', 'AWX', 'XWA'], answer: 'WAX', hint: 'Candles are made of this' },
  { word: 'YAK', scrambled: 'KAY', options: ['YAK', 'KAY', 'AKY', 'KYA'], answer: 'YAK', hint: 'A large hairy animal from Tibet' },
  { word: 'ZAP', scrambled: 'PAZ', options: ['ZAP', 'PAZ', 'APZ', 'ZPA'], answer: 'ZAP', hint: 'To hit with electricity' },
  { word: 'BAT', scrambled: 'TAB', options: ['BAT', 'TAB', 'ABT', 'TBA'], answer: 'BAT', hint: 'Used to hit a ball' },
  { word: 'CAP', scrambled: 'PAC', options: ['CAP', 'PAC', 'ACP', 'CPA'], answer: 'CAP', hint: 'A hat with a brim' },
  { word: 'DEN', scrambled: 'END', options: ['DEN', 'END', 'NED', 'DNE'], answer: 'DEN', hint: 'A cozy room or animal home' },
  { word: 'FAN', scrambled: 'NAF', options: ['FAN', 'NAF', 'ANF', 'NFA'], answer: 'FAN', hint: 'Keeps you cool in summer' },
  { word: 'GUM', scrambled: 'MUG', options: ['GUM', 'MUG', 'UMG', 'GMU'], answer: 'GUM', hint: 'You chew this' },
  { word: 'HOP', scrambled: 'POH', options: ['HOP', 'POH', 'OPH', 'PHO'], answer: 'HOP', hint: 'Jump on one foot' },
  { word: 'INN', scrambled: 'NNI', options: ['INN', 'NNI', 'NIN', 'INI'], answer: 'INN', hint: 'A small hotel' },
  { word: 'JOT', scrambled: 'TOJ', options: ['JOT', 'TOJ', 'OTJ', 'JTO'], answer: 'JOT', hint: 'To write a quick note' },
  { word: 'KIT', scrambled: 'TIK', options: ['KIT', 'TIK', 'ITK', 'KTI'], answer: 'KIT', hint: 'A set of tools or supplies' },
  { word: 'LIP', scrambled: 'PIL', options: ['LIP', 'PIL', 'IPL', 'LPI'], answer: 'LIP', hint: 'Part of your mouth' },
  { word: 'MOB', scrambled: 'BOM', options: ['MOB', 'BOM', 'OBM', 'MBO'], answer: 'MOB', hint: 'A large noisy crowd' },
  { word: 'NIT', scrambled: 'TIN', options: ['NIT', 'TIN', 'ITN', 'TNI'], answer: 'NIT', hint: 'A tiny bug egg in hair' },
  { word: 'OPT', scrambled: 'TOP', options: ['OPT', 'TOP', 'POT', 'TPO'], answer: 'OPT', hint: 'To choose or decide' },
  { word: 'PEA', scrambled: 'APE', options: ['PEA', 'APE', 'EAP', 'PAE'], answer: 'PEA', hint: 'A small round green vegetable' },
  { word: 'RIB', scrambled: 'BIR', options: ['RIB', 'BIR', 'IBR', 'RBI'], answer: 'RIB', hint: 'A bone in your chest' },
  { word: 'SOB', scrambled: 'BOS', options: ['SOB', 'BOS', 'OBS', 'SBO'], answer: 'SOB', hint: 'To cry loudly' },
  { word: 'TUB', scrambled: 'BUT', options: ['TUB', 'BUT', 'UBT', 'TBU'], answer: 'TUB', hint: 'You bathe in this' },
  { word: 'URN', scrambled: 'RUN', options: ['URN', 'RUN', 'NUR', 'UNR'], answer: 'URN', hint: 'A vase-shaped container' },
  { word: 'VET', scrambled: 'TEV', options: ['VET', 'TEV', 'EVT', 'VTE'], answer: 'VET', hint: 'A doctor for animals' },
  { word: 'WIG', scrambled: 'GIW', options: ['WIG', 'GIW', 'IGW', 'WGI'], answer: 'WIG', hint: 'Fake hair worn on the head' },
  { word: 'YAM', scrambled: 'MAY', options: ['YAM', 'MAY', 'AMY', 'YMA'], answer: 'YAM', hint: 'A sweet root vegetable' },
  { word: 'ZIP', scrambled: 'PIZ', options: ['ZIP', 'PIZ', 'IPZ', 'ZPI'], answer: 'ZIP', hint: 'Fastener on a jacket' },
  { word: 'AXE', scrambled: 'EXA', options: ['AXE', 'EXA', 'XAE', 'AEX'], answer: 'AXE', hint: 'A tool for chopping wood' },
  { word: 'BUN', scrambled: 'NUB', options: ['BUN', 'NUB', 'UNB', 'BNU'], answer: 'BUN', hint: 'A round bread roll' },
  { word: 'COB', scrambled: 'BOC', options: ['COB', 'BOC', 'OBC', 'CBO'], answer: 'COB', hint: 'The center of an ear of corn' },
  { word: 'DIP', scrambled: 'PID', options: ['DIP', 'PID', 'IPD', 'DPI'], answer: 'DIP', hint: 'To put briefly into liquid' },
  { word: 'EEL', scrambled: 'LEE', options: ['EEL', 'LEE', 'ELE', 'LEL'], answer: 'EEL', hint: 'A snake-like fish' },
  { word: 'FIG', scrambled: 'GIF', options: ['FIG', 'GIF', 'IGF', 'FGI'], answer: 'FIG', hint: 'A sweet purple fruit' },
  { word: 'GEL', scrambled: 'LEG', options: ['GEL', 'LEG', 'ELG', 'GLE'], answer: 'GEL', hint: 'Used to style hair' },
  { word: 'HUG', scrambled: 'GUH', options: ['HUG', 'GUH', 'UGH', 'HGU'], answer: 'HUG', hint: 'Wrap your arms around someone' },
  { word: 'IVY', scrambled: 'YVI', options: ['IVY', 'YVI', 'VIY', 'IYV'], answer: 'IVY', hint: 'A climbing plant on walls' },
  { word: 'JUG', scrambled: 'GUJ', options: ['JUG', 'GUJ', 'UGJ', 'JGU'], answer: 'JUG', hint: 'A container for pouring liquids' },
  { word: 'KID', scrambled: 'DIK', options: ['KID', 'DIK', 'IDK', 'KDI'], answer: 'KID', hint: 'A young child or baby goat' },
  { word: 'LAP', scrambled: 'PAL', options: ['LAP', 'PAL', 'APL', 'LPA'], answer: 'LAP', hint: 'Your thighs when sitting' },
  { word: 'MOO', scrambled: 'OOM', options: ['MOO', 'OOM', 'OMO', 'OOM'], answer: 'MOO', hint: 'Sound a cow makes' },
  { word: 'NUN', scrambled: 'UNN', options: ['NUN', 'UNN', 'NNU', 'UNO'], answer: 'NUN', hint: 'A religious woman in a convent' },
  { word: 'OAR', scrambled: 'ROA', options: ['OAR', 'ROA', 'ARO', 'ORA'], answer: 'OAR', hint: 'Used to row a boat' },
  { word: 'POD', scrambled: 'DOP', options: ['POD', 'DOP', 'ODP', 'PDO'], answer: 'POD', hint: 'A seed container like a pea pod' },
  { word: 'ROD', scrambled: 'DOR', options: ['ROD', 'DOR', 'ORD', 'RDO'], answer: 'ROD', hint: 'A long thin stick' },
  { word: 'SIP', scrambled: 'PIS', options: ['SIP', 'PIS', 'IPS', 'SPI'], answer: 'SIP', hint: 'To drink in small amounts' },
  { word: 'TON', scrambled: 'NOT', options: ['TON', 'NOT', 'ONT', 'TNO'], answer: 'TON', hint: 'A unit of weight' },
  { word: 'UMP', scrambled: 'PUM', options: ['UMP', 'PUM', 'MPU', 'UPM'], answer: 'UMP', hint: 'A referee in baseball' },
  { word: 'VOW', scrambled: 'WOV', options: ['VOW', 'WOV', 'OWV', 'VWO'], answer: 'VOW', hint: 'A solemn promise' },
  { word: 'WEB', scrambled: 'BEW', options: ['WEB', 'BEW', 'EBW', 'WBE'], answer: 'WEB', hint: 'A spider makes this' },
  { word: 'YEW', scrambled: 'WEY', options: ['YEW', 'WEY', 'EWY', 'YWE'], answer: 'YEW', hint: 'An evergreen tree' },
  { word: 'ZOO', scrambled: 'OOZ', options: ['ZOO', 'OOZ', 'OZO', 'ZOO'], answer: 'ZOO', hint: 'Where animals are kept for people to see' },
  { word: 'ARM', scrambled: 'MAR', options: ['ARM', 'MAR', 'RAM', 'RMA'], answer: 'ARM', hint: 'Part of your body from shoulder to hand' },
  { word: 'BIT', scrambled: 'TIB', options: ['BIT', 'TIB', 'ITB', 'BTI'], answer: 'BIT', hint: 'A small piece or amount' },
  { word: 'COT', scrambled: 'TOC', options: ['COT', 'TOC', 'OTC', 'CTO'], answer: 'COT', hint: 'A small portable bed' },
  { word: 'DAM', scrambled: 'MAD', options: ['DAM', 'MAD', 'ADM', 'DMA'], answer: 'DAM', hint: 'A wall built across a river' },
  { word: 'ELM', scrambled: 'MEL', options: ['ELM', 'MEL', 'LME', 'EML'], answer: 'ELM', hint: 'A type of tall tree' },
  { word: 'FIN', scrambled: 'NIF', options: ['FIN', 'NIF', 'INF', 'FNI'], answer: 'FIN', hint: 'A fish uses this to swim' },
  { word: 'GIN', scrambled: 'NIG', options: ['GIN', 'NIG', 'ING', 'GNI'], answer: 'GIN', hint: 'A clear alcoholic drink' },
  { word: 'HEM', scrambled: 'MEH', options: ['HEM', 'MEH', 'EMH', 'HME'], answer: 'HEM', hint: 'The folded edge of fabric' },
  { word: 'INK', scrambled: 'KIN', options: ['INK', 'KIN', 'NIK', 'IKN'], answer: 'INK', hint: 'Used in pens for writing' },
  { word: 'JET', scrambled: 'TEJ', options: ['JET', 'TEJ', 'ETJ', 'JTE'], answer: 'JET', hint: 'A fast aircraft' },
  { word: 'KEN', scrambled: 'NEK', options: ['KEN', 'NEK', 'ENK', 'KNE'], answer: 'KEN', hint: 'Range of knowledge' },
  { word: 'LOT', scrambled: 'TOL', options: ['LOT', 'TOL', 'OTL', 'LTO'], answer: 'LOT', hint: 'A large amount or a piece of land' },
  { word: 'MOP', scrambled: 'POM', options: ['MOP', 'POM', 'OPM', 'MPO'], answer: 'MOP', hint: 'Used to clean floors' },
  { word: 'NIP', scrambled: 'PIN', options: ['NIP', 'PIN', 'IPN', 'NPI'], answer: 'NIP', hint: 'A small sharp bite' },
  { word: 'ORB', scrambled: 'BRO', options: ['ORB', 'BRO', 'ROB', 'OBR'], answer: 'ORB', hint: 'A sphere or globe' },
  { word: 'PIT', scrambled: 'TIP', options: ['PIT', 'TIP', 'IPT', 'PTI'], answer: 'PIT', hint: 'A hole in the ground' },
  { word: 'RUG', scrambled: 'GUR', options: ['RUG', 'GUR', 'UGR', 'RGU'], answer: 'RUG', hint: 'A floor covering' },
  { word: 'SET', scrambled: 'TES', options: ['SET', 'TES', 'EST', 'STE'], answer: 'SET', hint: 'A group of things' },
  { word: 'TIN', scrambled: 'NIT', options: ['TIN', 'NIT', 'ITN', 'TNI'], answer: 'TIN', hint: 'A metal container' },
  { word: 'USE', scrambled: 'SUE', options: ['USE', 'SUE', 'EUS', 'UES'], answer: 'USE', hint: 'To employ something' },
  { word: 'VIM', scrambled: 'MIV', options: ['VIM', 'MIV', 'IMV', 'VMI'], answer: 'VIM', hint: 'Lively energy and enthusiasm' },
  { word: 'WIT', scrambled: 'TIW', options: ['WIT', 'TIW', 'ITW', 'WTI'], answer: 'WIT', hint: 'Clever humor' },
  { word: 'YEN', scrambled: 'NEY', options: ['YEN', 'NEY', 'ENY', 'YNE'], answer: 'YEN', hint: 'Japanese currency' },
  { word: 'ZIT', scrambled: 'TIZ', options: ['ZIT', 'TIZ', 'ITZ', 'ZTI'], answer: 'ZIT', hint: 'A pimple on the skin' },
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
  { word: 'QUEEN', scrambled: 'NEEQU', options: ['QUEEN', 'NEEQU', 'QUENE', 'ENQUE'], answer: 'QUEEN', hint: 'A female ruler' },
  { word: 'RIVER', scrambled: 'REVIR', options: ['RIVER', 'REVIR', 'RVIER', 'IREVR'], answer: 'RIVER', hint: 'A flowing body of water' },
  { word: 'STORM', scrambled: 'MROTS', options: ['STORM', 'MROTS', 'STROM', 'TORMS'], answer: 'STORM', hint: 'Heavy rain and thunder' },
  { word: 'TIGER', scrambled: 'REGIT', options: ['TIGER', 'REGIT', 'TIGRE', 'GITER'], answer: 'TIGER', hint: 'A striped big cat' },
  { word: 'UNDER', scrambled: 'REDNU', options: ['UNDER', 'REDNU', 'UNRED', 'DRUNE'], answer: 'UNDER', hint: 'Below something' },
  { word: 'VOICE', scrambled: 'ECIOV', options: ['VOICE', 'ECIOV', 'VOCIE', 'IVOCE'], answer: 'VOICE', hint: 'Sound you make when speaking' },
  { word: 'WATER', scrambled: 'RETAW', options: ['WATER', 'RETAW', 'WATRE', 'TAWER'], answer: 'WATER', hint: 'Essential liquid for life' },
  { word: 'XENON', scrambled: 'NONEX', options: ['XENON', 'NONEX', 'XNEON', 'NEXON'], answer: 'XENON', hint: 'A noble gas element' },
  { word: 'YACHT', scrambled: 'THCAY', options: ['YACHT', 'THCAY', 'YATCH', 'CAHTY'], answer: 'YACHT', hint: 'A fancy sailing boat' },
  { word: 'ZEBRA', scrambled: 'ARBEZ', options: ['ZEBRA', 'ARBEZ', 'ZERAB', 'BAREZ'], answer: 'ZEBRA', hint: 'A striped African animal' },
  { word: 'ANGEL', scrambled: 'LEGNA', options: ['ANGEL', 'LEGNA', 'ANGLE', 'NAGLE'], answer: 'ANGEL', hint: 'A heavenly being with wings' },
  { word: 'BEACH', scrambled: 'HCAEB', options: ['BEACH', 'HCAEB', 'BEAHC', 'CAHBE'], answer: 'BEACH', hint: 'Sandy shore by the sea' },
  { word: 'CANDY', scrambled: 'YDNAC', options: ['CANDY', 'YDNAC', 'CANYD', 'DYNAC'], answer: 'CANDY', hint: 'A sweet treat' },
  { word: 'DANCE', scrambled: 'ECNAD', options: ['DANCE', 'ECNAD', 'DNAEC', 'CANED'], answer: 'DANCE', hint: 'Move to music' },
  { word: 'EAGLE', scrambled: 'ELGAE', options: ['EAGLE', 'ELGAE', 'EAGEL', 'GALEE'], answer: 'EAGLE', hint: 'A large bird of prey' },
  { word: 'FAIRY', scrambled: 'YRIAF', options: ['FAIRY', 'YRIAF', 'FAIRY', 'RIYAF'], answer: 'FAIRY', hint: 'A magical tiny creature with wings' },
  { word: 'GIANT', scrambled: 'TNAIG', options: ['GIANT', 'TNAIG', 'GINAT', 'NAIGT'], answer: 'GIANT', hint: 'An extremely large person or thing' },
  { word: 'HAPPY', scrambled: 'YPPAH', options: ['HAPPY', 'YPPAH', 'HAPYP', 'PPYAH'], answer: 'HAPPY', hint: 'Feeling joy' },
  { word: 'IMAGE', scrambled: 'EGAMI', options: ['IMAGE', 'EGAMI', 'IMEGA', 'GEMIA'], answer: 'IMAGE', hint: 'A picture or representation' },
  { word: 'JEWEL', scrambled: 'LEWEJ', options: ['JEWEL', 'LEWEJ', 'JEWLE', 'WEJEL'], answer: 'JEWEL', hint: 'A precious gemstone' },
  { word: 'KNEEL', scrambled: 'LEENK', options: ['KNEEL', 'LEENK', 'KNELE', 'ELENK'], answer: 'KNEEL', hint: 'To go down on your knees' },
  { word: 'LEMON', scrambled: 'NOMEL', options: ['LEMON', 'NOMEL', 'LEMNO', 'ONLEM'], answer: 'LEMON', hint: 'A sour yellow citrus fruit' },
  { word: 'MONEY', scrambled: 'YENOM', options: ['MONEY', 'YENOM', 'MOENY', 'NEOMY'], answer: 'MONEY', hint: 'Currency used to buy things' },
  { word: 'NIGHT', scrambled: 'THGIN', options: ['NIGHT', 'THGIN', 'NIGTH', 'GHINT'], answer: 'NIGHT', hint: 'The dark time after sunset' },
  { word: 'ONION', scrambled: 'NOINO', options: ['ONION', 'NOINO', 'ONIOM', 'NINOO'], answer: 'ONION', hint: 'A layered vegetable that makes you cry' },
  { word: 'PIANO', scrambled: 'ONAIP', options: ['PIANO', 'ONAIP', 'PIAON', 'NAIPO'], answer: 'PIANO', hint: 'A musical instrument with keys' },
  { word: 'QUIET', scrambled: 'TEIUQ', options: ['QUIET', 'TEIUQ', 'QUEIT', 'IQUET'], answer: 'QUIET', hint: 'Making little or no noise' },
  { word: 'RADIO', scrambled: 'OIDAR', options: ['RADIO', 'OIDAR', 'RAIOD', 'DARIO'], answer: 'RADIO', hint: 'A device that receives broadcasts' },
  { word: 'SMILE', scrambled: 'ELIMS', options: ['SMILE', 'ELIMS', 'SMIEL', 'ILEMS'], answer: 'SMILE', hint: 'A happy facial expression' },
  { word: 'TRAIN', scrambled: 'NIART', options: ['TRAIN', 'NIART', 'TRIAN', 'NAITR'], answer: 'TRAIN', hint: 'A vehicle that runs on tracks' },
  { word: 'UNCLE', scrambled: 'ELCNU', options: ['UNCLE', 'ELCNU', 'UNCLE', 'CLUNE'], answer: 'UNCLE', hint: 'Your parent\'s brother' },
  { word: 'VIOLA', scrambled: 'ALOIV', options: ['VIOLA', 'ALOIV', 'VOILA', 'IAVOL'], answer: 'VIOLA', hint: 'A stringed instrument like a violin' },
  { word: 'WITCH', scrambled: 'HCTIW', options: ['WITCH', 'HCTIW', 'WITCG', 'CHWIT'], answer: 'WITCH', hint: 'A magical woman in fairy tales' },
  { word: 'EXTRA', scrambled: 'ARTXE', options: ['EXTRA', 'ARTXE', 'EXTAR', 'TAXRE'], answer: 'EXTRA', hint: 'More than usual' },
  { word: 'YOUNG', scrambled: 'GNUOY', options: ['YOUNG', 'GNUOY', 'YONUG', 'NUOGY'], answer: 'YOUNG', hint: 'Not old' },
  { word: 'ZONAL', scrambled: 'LANOZ', options: ['ZONAL', 'LANOZ', 'ZONAL', 'NALOZ'], answer: 'ZONAL', hint: 'Relating to a zone or area' },
  { word: 'ALBUM', scrambled: 'MUBLA', options: ['ALBUM', 'MUBLA', 'ALBMU', 'BUMLA'], answer: 'ALBUM', hint: 'A collection of songs or photos' },
  { word: 'BLEND', scrambled: 'DNELB', options: ['BLEND', 'DNELB', 'BLNED', 'NDLEB'], answer: 'BLEND', hint: 'To mix together smoothly' },
  { word: 'CHESS', scrambled: 'SSEHS', options: ['CHESS', 'SSEHS', 'CHSES', 'SCHES'], answer: 'CHESS', hint: 'A board game with kings and queens' },
  { word: 'DRIFT', scrambled: 'TFIRD', options: ['DRIFT', 'TFIRD', 'DRFIT', 'FTIRD'], answer: 'DRIFT', hint: 'To float or move slowly' },
  { word: 'ELBOW', scrambled: 'WOBEL', options: ['ELBOW', 'WOBEL', 'ELBWO', 'BOWEL'], answer: 'ELBOW', hint: 'The joint in the middle of your arm' },
  { word: 'FLOCK', scrambled: 'KCOLF', options: ['FLOCK', 'KCOLF', 'FLOKC', 'COLFK'], answer: 'FLOCK', hint: 'A group of birds or sheep' },
  { word: 'GROAN', scrambled: 'NAORG', options: ['GROAN', 'NAORG', 'GRONA', 'ORANG'], answer: 'GROAN', hint: 'A deep sound of pain or displeasure' },
  { word: 'HATCH', scrambled: 'HCTAH', options: ['HATCH', 'HCTAH', 'HATHC', 'CAHTH'], answer: 'HATCH', hint: 'To emerge from an egg' },
  { word: 'IVORY', scrambled: 'YROVI', options: ['IVORY', 'YROVI', 'IVORY', 'RYOVI'], answer: 'IVORY', hint: 'A creamy white color or elephant tusk material' },
  { word: 'JOKER', scrambled: 'REKOJ', options: ['JOKER', 'REKOJ', 'JOEKR', 'KROJE'], answer: 'JOKER', hint: 'Someone who tells jokes' },
  { word: 'KNACK', scrambled: 'KCANK', options: ['KNACK', 'KCANK', 'KNAKC', 'CANKK'], answer: 'KNACK', hint: 'A special skill or talent' },
  { word: 'LUNAR', scrambled: 'RANUL', options: ['LUNAR', 'RANUL', 'LUNRA', 'NAURL'], answer: 'LUNAR', hint: 'Relating to the moon' },
  { word: 'MAPLE', scrambled: 'ELPAM', options: ['MAPLE', 'ELPAM', 'MAPEL', 'PELAM'], answer: 'MAPLE', hint: 'A tree known for its syrup' },
  { word: 'NOBLE', scrambled: 'ELBON', options: ['NOBLE', 'ELBON', 'NOBEL', 'BOLEN'], answer: 'NOBLE', hint: 'Having high moral qualities' },
  { word: 'ORBIT', scrambled: 'TIBRO', options: ['ORBIT', 'TIBRO', 'ORBIT', 'BROIT'], answer: 'ORBIT', hint: 'The path of a planet around the sun' },
  { word: 'PEARL', scrambled: 'LRAEP', options: ['PEARL', 'LRAEP', 'PEARL', 'RLEAP'], answer: 'PEARL', hint: 'A gem found inside an oyster' },
  { word: 'QUILT', scrambled: 'TLIUQ', options: ['QUILT', 'TLIUQ', 'QUILR', 'LITQU'], answer: 'QUILT', hint: 'A warm bed covering made of patches' },
  { word: 'RANCH', scrambled: 'HCNAR', options: ['RANCH', 'HCNAR', 'RANCG', 'CNAHR'], answer: 'RANCH', hint: 'A large farm for cattle' },
  { word: 'SCOUT', scrambled: 'TUOCS', options: ['SCOUT', 'TUOCS', 'SCOTU', 'UOCTS'], answer: 'SCOUT', hint: 'To explore or search ahead' },
  { word: 'TORCH', scrambled: 'HCROT', options: ['TORCH', 'HCROT', 'TORCG', 'CROHT'], answer: 'TORCH', hint: 'A portable light source' },
  { word: 'USHER', scrambled: 'REHSU', options: ['USHER', 'REHSU', 'USHRE', 'HESUR'], answer: 'USHER', hint: 'A person who guides people to seats' },
  { word: 'VIVID', scrambled: 'DIVIV', options: ['VIVID', 'DIVIV', 'VIDIV', 'IVDIV'], answer: 'VIVID', hint: 'Bright and striking' },
  { word: 'WALTZ', scrambled: 'ZTLAW', options: ['WALTZ', 'ZTLAW', 'WALZT', 'LTZAW'], answer: 'WALTZ', hint: 'A ballroom dance' },
  { word: 'XYLEM', scrambled: 'MELYX', options: ['XYLEM', 'MELYX', 'XYLME', 'LEMYX'], answer: 'XYLEM', hint: 'Plant tissue that transports water' },
  { word: 'YEARN', scrambled: 'NRAEY', options: ['YEARN', 'NRAEY', 'YENAR', 'RAENY'], answer: 'YEARN', hint: 'To have a strong desire' },
  { word: 'ZESTY', scrambled: 'YTSEZ', options: ['ZESTY', 'YTSEZ', 'ZESYT', 'TSYEZ'], answer: 'ZESTY', hint: 'Full of flavor and energy' },
  { word: 'ABODE', scrambled: 'EDOBA', options: ['ABODE', 'EDOBA', 'ABOED', 'DOEBA'], answer: 'ABODE', hint: 'A place where someone lives' },
  { word: 'BLAZE', scrambled: 'EZELB', options: ['BLAZE', 'EZELB', 'BLAZR', 'ZELBA'], answer: 'BLAZE', hint: 'A bright burning fire' },
  { word: 'CRISP', scrambled: 'PSIRC', options: ['CRISP', 'PSIRC', 'CRIPS', 'SIRCP'], answer: 'CRISP', hint: 'Firm and crunchy' },
  { word: 'DEPOT', scrambled: 'TOPED', options: ['DEPOT', 'TOPED', 'DEPOT', 'OPTED'], answer: 'DEPOT', hint: 'A storage place or bus station' },
  { word: 'EPOCH', scrambled: 'HCOPE', options: ['EPOCH', 'HCOPE', 'EPOHC', 'COHPE'], answer: 'EPOCH', hint: 'A period of time in history' },
  { word: 'FABLE', scrambled: 'ELBAF', options: ['FABLE', 'ELBAF', 'FABRL', 'LABFE'], answer: 'FABLE', hint: 'A short story with a moral lesson' },
  { word: 'GAUZE', scrambled: 'EZUAG', options: ['GAUZE', 'EZUAG', 'GAUZR', 'ZUAGE'], answer: 'GAUZE', hint: 'A thin transparent fabric' },
  { word: 'HAVEN', scrambled: 'NEVAH', options: ['HAVEN', 'NEVAH', 'HAVNE', 'VENAH'], answer: 'HAVEN', hint: 'A safe place' },
  { word: 'INFER', scrambled: 'REFNI', options: ['INFER', 'REFNI', 'INFRE', 'FERNI'], answer: 'INFER', hint: 'To conclude from evidence' },
  { word: 'JOUST', scrambled: 'TSUOJ', options: ['JOUST', 'TSUOJ', 'JOUSR', 'SUOJT'], answer: 'JOUST', hint: 'A medieval combat on horseback' },
  { word: 'KARMA', scrambled: 'AMRAK', options: ['KARMA', 'AMRAK', 'KARMA', 'RAKAM'], answer: 'KARMA', hint: 'The idea that good deeds bring good results' },
  { word: 'LANCE', scrambled: 'ECNAL', options: ['LANCE', 'ECNAL', 'LNACE', 'NACLE'], answer: 'LANCE', hint: 'A long spear used by knights' },
  { word: 'MANOR', scrambled: 'RONAM', options: ['MANOR', 'RONAM', 'MANRO', 'NORAM'], answer: 'MANOR', hint: 'A large country house' },
  { word: 'NICHE', scrambled: 'EHCIN', options: ['NICHE', 'EHCIN', 'NICHG', 'CHINE'], answer: 'NICHE', hint: 'A specialized area or hollow in a wall' },
  { word: 'OPTIC', scrambled: 'CITPO', options: ['OPTIC', 'CITPO', 'OPTCI', 'TICOP'], answer: 'OPTIC', hint: 'Relating to the eye or vision' },
  { word: 'PRISM', scrambled: 'MSIRP', options: ['PRISM', 'MSIRP', 'PRIMS', 'SIRMP'], answer: 'PRISM', hint: 'A glass shape that splits light into colors' },
  { word: 'QUOTA', scrambled: 'ATOQU', options: ['QUOTA', 'ATOQU', 'QUOAT', 'TAQUO'], answer: 'QUOTA', hint: 'A fixed share or amount' },
  { word: 'RAVEN', scrambled: 'NEVAR', options: ['RAVEN', 'NEVAR', 'RAVNE', 'VENRA'], answer: 'RAVEN', hint: 'A large black bird' },
  { word: 'SHAWL', scrambled: 'LWAHS', options: ['SHAWL', 'LWAHS', 'SHAWL', 'WAHLS'], answer: 'SHAWL', hint: 'A large piece of cloth worn over shoulders' },
  { word: 'TROUT', scrambled: 'TUORT', options: ['TROUT', 'TUORT', 'TROUG', 'UORTT'], answer: 'TROUT', hint: 'A freshwater fish' },
  { word: 'UNIFY', scrambled: 'YIFNU', options: ['UNIFY', 'YIFNU', 'UNIFR', 'FINUY'], answer: 'UNIFY', hint: 'To bring together as one' },
  { word: 'VAPOR', scrambled: 'ROPAV', options: ['VAPOR', 'ROPAV', 'VAPRO', 'PORAV'], answer: 'VAPOR', hint: 'Gas form of a liquid' },
  { word: 'WRATH', scrambled: 'HTARW', options: ['WRATH', 'HTARW', 'WRATG', 'THARW'], answer: 'WRATH', hint: 'Extreme anger' },
  { word: 'OXIDE', scrambled: 'EDIXO', options: ['OXIDE', 'EDIXO', 'OXDIE', 'DIOXE'], answer: 'OXIDE', hint: 'A compound containing oxygen' },
  { word: 'YIELD', scrambled: 'DLEIY', options: ['YIELD', 'DLEIY', 'YILED', 'LDIYE'], answer: 'YIELD', hint: 'To produce or give way' },
  { word: 'ZILCH', scrambled: 'HCLIZ', options: ['ZILCH', 'HCLIZ', 'ZILHC', 'CLIZH'], answer: 'ZILCH', hint: 'Nothing at all' },
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
  { word: 'IMAGINE', scrambled: 'ENIGAMI', options: ['IMAGINE', 'ENIGAMI', 'IMAGNIE', 'GINEMIA'], answer: 'IMAGINE', hint: 'To picture something in your mind' },
  { word: 'JOURNEY', scrambled: 'YENRUOJ', options: ['JOURNEY', 'YENRUOJ', 'JOURNYE', 'RUOJNEY'], answer: 'JOURNEY', hint: 'A long trip' },
  { word: 'KINGDOM', scrambled: 'MODGNIK', options: ['KINGDOM', 'MODGNIK', 'KINGODM', 'DOMKING'], answer: 'KINGDOM', hint: 'A land ruled by a king or queen' },
  { word: 'LANTERN', scrambled: 'NRETNAL', options: ['LANTERN', 'NRETNAL', 'LANTREN', 'TERNLAN'], answer: 'LANTERN', hint: 'A portable light with a handle' },
  { word: 'MYSTERY', scrambled: 'YRETYSM', options: ['MYSTERY', 'YRETYSM', 'MYSRETY', 'TERYSMY'], answer: 'MYSTERY', hint: 'Something unexplained or secret' },
  { word: 'NETWORK', scrambled: 'KROWTEN', options: ['NETWORK', 'KROWTEN', 'NETWROK', 'ROWKTEN'], answer: 'NETWORK', hint: 'A system of connected things' },
  { word: 'OBSERVE', scrambled: 'EVRESBO', options: ['OBSERVE', 'EVRESBO', 'OBSREVE', 'RESVOBE'], answer: 'OBSERVE', hint: 'To watch carefully' },
  { word: 'PATTERN', scrambled: 'NRETTAP', options: ['PATTERN', 'NRETTAP', 'PATRERN', 'TERNPAT'], answer: 'PATTERN', hint: 'A repeated design or sequence' },
  { word: 'QUANTUM', scrambled: 'MUTNAQU', options: ['QUANTUM', 'MUTNAQU', 'QUANTMU', 'NAMUQUT'], answer: 'QUANTUM', hint: 'The smallest unit of energy' },
  { word: 'REQUIRE', scrambled: 'ERIUQER', options: ['REQUIRE', 'ERIUQER', 'REQIURE', 'UIRQERE'], answer: 'REQUIRE', hint: 'To need something' },
  { word: 'SILENCE', scrambled: 'ECNELIS', options: ['SILENCE', 'ECNELIS', 'SILECNE', 'NELICES'], answer: 'SILENCE', hint: 'Complete absence of sound' },
  { word: 'TRIUMPH', scrambled: 'HPMUIRT', options: ['TRIUMPH', 'HPMUIRT', 'TRIUMPG', 'MUIRPHT'], answer: 'TRIUMPH', hint: 'A great victory' },
  { word: 'UNIFORM', scrambled: 'MROFIUN', options: ['UNIFORM', 'MROFIUN', 'UNIFOMR', 'FORMUNI'], answer: 'UNIFORM', hint: 'A standard outfit worn by a group' },
  { word: 'VENTURE', scrambled: 'ERUTENV', options: ['VENTURE', 'ERUTENV', 'VENRUTE', 'TURENVE'], answer: 'VENTURE', hint: 'A risky or daring undertaking' },
  { word: 'WARRIOR', scrambled: 'ROIRRAW', options: ['WARRIOR', 'ROIRRAW', 'WARROIR', 'IORWARR'], answer: 'WARRIOR', hint: 'A brave fighter' },
  { word: 'XTERNAL', scrambled: 'LANRETX', options: ['XTERNAL', 'LANRETX', 'XTERLAN', 'NALTERX'], answer: 'XTERNAL', hint: 'On the outside (external)' },
  { word: 'YOUNGER', scrambled: 'REGNUOY', options: ['YOUNGER', 'REGNUOY', 'YOUNEGR', 'GRUONEY'], answer: 'YOUNGER', hint: 'Less old than another' },
  { word: 'ZEALOUS', scrambled: 'SUOLAEZ', options: ['ZEALOUS', 'SUOLAEZ', 'ZEALOSU', 'LAOZEUS'], answer: 'ZEALOUS', hint: 'Very enthusiastic and eager' },
  { word: 'ABANDON', scrambled: 'NODNAAB', options: ['ABANDON', 'NODNAAB', 'ABANDNO', 'NAABDON'], answer: 'ABANDON', hint: 'To leave behind completely' },
  { word: 'BENEATH', scrambled: 'HTAENEB', options: ['BENEATH', 'HTAENEB', 'BENEHAT', 'TAHENBE'], answer: 'BENEATH', hint: 'Under or below something' },
  { word: 'CENTURY', scrambled: 'YRUTNEC', options: ['CENTURY', 'YRUTNEC', 'CENTUYR', 'RUTNEYC'], answer: 'CENTURY', hint: 'A period of 100 years' },
  { word: 'DESTINY', scrambled: 'YNITSEД', options: ['DESTINY', 'YNITSEД', 'DESTNIY', 'NITYSED'], answer: 'DESTINY', hint: 'A predetermined course of events' },
  { word: 'ELEMENT', scrambled: 'TNEMELЕ', options: ['ELEMENT', 'TNEMELЕ', 'ELEMNET', 'MENTELE'], answer: 'ELEMENT', hint: 'A basic substance in chemistry' },
  { word: 'FANTASY', scrambled: 'YSATНAF', options: ['FANTASY', 'YSATНAF', 'FANTAYS', 'ATSYFAN'], answer: 'FANTASY', hint: 'An imaginative story or dream' },
  { word: 'GENERAL', scrambled: 'LARENEG', options: ['GENERAL', 'LARENEG', 'GENERLA', 'RENEGAL'], answer: 'GENERAL', hint: 'A high-ranking military officer' },
  { word: 'HARVEST', scrambled: 'TSEVRAH', options: ['HARVEST', 'TSEVRAH', 'HARVETS', 'VERAHTS'], answer: 'HARVEST', hint: 'To gather crops' },
  { word: 'INSPIRE', scrambled: 'ERIРSNI', options: ['INSPIRE', 'ERIРSNI', 'INSRIPE', 'PIRENIS'], answer: 'INSPIRE', hint: 'To motivate or encourage' },
  { word: 'JUSTICE', scrambled: 'ECITSUJ', options: ['JUSTICE', 'ECITSUJ', 'JUSTCIE', 'ITSUJCE'], answer: 'JUSTICE', hint: 'Fairness and rightness' },
  { word: 'KINSHIP', scrambled: 'РIHSNIK', options: ['KINSHIP', 'РIHSNIK', 'KINSIHP', 'SHIPNIK'], answer: 'KINSHIP', hint: 'A family relationship' },
  { word: 'LIBERTY', scrambled: 'YTREBIL', options: ['LIBERTY', 'YTREBIL', 'LIBERTУ', 'REBITLY'], answer: 'LIBERTY', hint: 'Freedom from control' },
  { word: 'MONARCH', scrambled: 'HCRANOM', options: ['MONARCH', 'HCRANOM', 'MONARСH', 'RANCHOM'], answer: 'MONARCH', hint: 'A king or queen' },
  { word: 'NARRATE', scrambled: 'ETARRAN', options: ['NARRATE', 'ETARRAN', 'NARRАTE', 'TARRANE'], answer: 'NARRATE', hint: 'To tell a story' },
  { word: 'OBSCURE', scrambled: 'ERUCBSO', options: ['OBSCURE', 'ERUCBSO', 'OBSСURE', 'RUCBSOE'], answer: 'OBSCURE', hint: 'Not well known or hard to see' },
  { word: 'PILGRIM', scrambled: 'MIRGILP', options: ['PILGRIM', 'MIRGILP', 'PILGRИМ', 'GRIMILP'], answer: 'PILGRIM', hint: 'A person on a religious journey' },
  { word: 'QUARREL', scrambled: 'LERRAУQ', options: ['QUARREL', 'LERRAУQ', 'QUARRЕL', 'RRELAUQ'], answer: 'QUARREL', hint: 'An angry argument' },
  { word: 'RADIANT', scrambled: 'TNAIDAR', options: ['RADIANT', 'TNAIDAR', 'RADIАNT', 'NAIDART'], answer: 'RADIANT', hint: 'Sending out light or warmth' },
  { word: 'SCHOLAR', scrambled: 'RALOHCS', options: ['SCHOLAR', 'RALOHCS', 'SCHOLАR', 'LOHRACS'], answer: 'SCHOLAR', hint: 'A learned person or student' },
  { word: 'THUNDER', scrambled: 'REDNUHT', options: ['THUNDER', 'REDNUHT', 'THUNDЕR', 'NUHRTDE'], answer: 'THUNDER', hint: 'The loud sound during a storm' },
  { word: 'UPRIGHT', scrambled: 'THGIRPU', options: ['UPRIGHT', 'THGIRPU', 'UPRІGHT', 'GHTIRPU'], answer: 'UPRIGHT', hint: 'Standing straight or honest' },
  { word: 'VIBRANT', scrambled: 'TNARBIV', options: ['VIBRANT', 'TNARBIV', 'VIBRАNT', 'NARBTIV'], answer: 'VIBRANT', hint: 'Full of energy and color' },
  { word: 'WHISPER', scrambled: 'REPSIHW', options: ['WHISPER', 'REPSIHW', 'WHISPЕR', 'PSIREWH'], answer: 'WHISPER', hint: 'To speak very softly' },
  { word: 'XYLOPHONE', scrambled: 'ENOHPYLX', options: ['XYLOPHONE', 'ENOHPYLX', 'XYLOPHOНЕ', 'NOHPELYX'], answer: 'XYLOPHONE', hint: 'A musical instrument with wooden bars' },
  { word: 'YEARNING', scrambled: 'GNINRAEY', options: ['YEARNING', 'GNINRAEY', 'YEARNІNG', 'NINGRAEY'], answer: 'YEARNING', hint: 'A deep longing or desire' },
  { word: 'ZEPPELIN', scrambled: 'NILEPPEZ', options: ['ZEPPELIN', 'NILEPPEZ', 'ZEPPELIН', 'EPPILENZ'], answer: 'ZEPPELIN', hint: 'A type of airship' },
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
  { q: 'How many legs does a cat have?', options: ['2', '4', '6', '8'], answer: '4' },
  { q: 'What is the color of grass?', options: ['Blue', 'Red', 'Green', 'Yellow'], answer: 'Green' },
  { q: 'Which animal is known as man\'s best friend?', options: ['Cat', 'Dog', 'Horse', 'Rabbit'], answer: 'Dog' },
  { q: 'How many months are in a year?', options: ['10', '11', '12', '13'], answer: '12' },
  { q: 'What do you use to write on a blackboard?', options: ['Pen', 'Chalk', 'Crayon', 'Marker'], answer: 'Chalk' },
  { q: 'Which animal can fly?', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Bird' },
  { q: 'What is the opposite of hot?', options: ['Warm', 'Cool', 'Cold', 'Icy'], answer: 'Cold' },
  { q: 'How many wheels does a bicycle have?', options: ['1', '2', '3', '4'], answer: '2' },
  { q: 'What do you call a baby dog?', options: ['Kitten', 'Cub', 'Puppy', 'Foal'], answer: 'Puppy' },
  { q: 'Which season comes after winter?', options: ['Summer', 'Autumn', 'Spring', 'Fall'], answer: 'Spring' },
  { q: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' },
  { q: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: '3' },
  { q: 'What color is a ripe tomato?', options: ['Green', 'Blue', 'Red', 'Yellow'], answer: 'Red' },
  { q: 'Which animal gives us milk?', options: ['Hen', 'Cow', 'Dog', 'Cat'], answer: 'Cow' },
  { q: 'What do fish use to breathe?', options: ['Lungs', 'Gills', 'Nose', 'Skin'], answer: 'Gills' },
  { q: 'How many fingers are on one hand?', options: ['4', '5', '6', '7'], answer: '5' },
  { q: 'What is the tallest animal?', options: ['Elephant', 'Horse', 'Giraffe', 'Camel'], answer: 'Giraffe' },
  { q: 'Which planet is closest to the sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 'Mercury' },
  { q: 'What do caterpillars turn into?', options: ['Bees', 'Butterflies', 'Beetles', 'Moths'], answer: 'Butterflies' },
  { q: 'How many hours are in a day?', options: ['12', '20', '24', '48'], answer: '24' },
  { q: 'What is the color of the sun?', options: ['White', 'Yellow', 'Orange', 'Red'], answer: 'Yellow' },
  { q: 'Which animal is the king of the jungle?', options: ['Tiger', 'Elephant', 'Lion', 'Gorilla'], answer: 'Lion' },
  { q: 'What do you call frozen rain?', options: ['Hail', 'Snow', 'Sleet', 'Frost'], answer: 'Hail' },
  { q: 'How many sides does a square have?', options: ['3', '4', '5', '6'], answer: '4' },
  { q: 'What is the smallest continent?', options: ['Europe', 'Antarctica', 'Australia', 'South America'], answer: 'Australia' },
  { q: 'Which fruit is red and grows on a tree?', options: ['Strawberry', 'Apple', 'Cherry', 'Raspberry'], answer: 'Apple' },
  { q: 'What do you call a baby cat?', options: ['Puppy', 'Cub', 'Kitten', 'Foal'], answer: 'Kitten' },
  { q: 'How many legs does an insect have?', options: ['4', '6', '8', '10'], answer: '6' },
  { q: 'What is the capital of the United States?', options: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], answer: 'Washington D.C.' },
  { q: 'Which is the fastest land animal?', options: ['Horse', 'Cheetah', 'Lion', 'Leopard'], answer: 'Cheetah' },
  { q: 'What do you call the study of stars?', options: ['Biology', 'Geology', 'Astronomy', 'Chemistry'], answer: 'Astronomy' },
  { q: 'How many zeros are in one thousand?', options: ['2', '3', '4', '5'], answer: '3' },
  { q: 'What is the opposite of day?', options: ['Evening', 'Dusk', 'Night', 'Twilight'], answer: 'Night' },
  { q: 'Which animal has a trunk?', options: ['Rhino', 'Hippo', 'Elephant', 'Giraffe'], answer: 'Elephant' },
  { q: 'What is the color of a polar bear?', options: ['Black', 'Brown', 'White', 'Grey'], answer: 'White' },
  { q: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8' },
  { q: 'What do you call a person who fixes teeth?', options: ['Doctor', 'Nurse', 'Dentist', 'Vet'], answer: 'Dentist' },
  { q: 'Which vegetable is orange and long?', options: ['Potato', 'Carrot', 'Pumpkin', 'Sweet potato'], answer: 'Carrot' },
  { q: 'What is the largest planet in our solar system?', options: ['Saturn', 'Uranus', 'Neptune', 'Jupiter'], answer: 'Jupiter' },
  { q: 'How many minutes are in an hour?', options: ['30', '45', '60', '90'], answer: '60' },
  { q: 'What do you call a baby bear?', options: ['Cub', 'Pup', 'Kit', 'Foal'], answer: 'Cub' },
  { q: 'Which ocean is to the east of the United States?', options: ['Pacific', 'Indian', 'Atlantic', 'Arctic'], answer: 'Atlantic' },
  { q: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], answer: 'Diamond' },
  { q: 'How many wheels does a car have?', options: ['2', '3', '4', '6'], answer: '4' },
  { q: 'What do you call the place where books are kept?', options: ['Museum', 'Library', 'Gallery', 'Archive'], answer: 'Library' },
  { q: 'Which bird cannot fly?', options: ['Eagle', 'Parrot', 'Penguin', 'Sparrow'], answer: 'Penguin' },
  { q: 'What is the color of a ripe banana?', options: ['Green', 'Red', 'Yellow', 'Orange'], answer: 'Yellow' },
  { q: 'How many seconds are in a minute?', options: ['30', '45', '60', '100'], answer: '60' },
  { q: 'What do you call the top of a mountain?', options: ['Base', 'Slope', 'Peak', 'Ridge'], answer: 'Peak' },
  { q: 'Which animal is known for its black and white stripes?', options: ['Leopard', 'Tiger', 'Zebra', 'Cheetah'], answer: 'Zebra' },
  { q: 'What is the opposite of fast?', options: ['Quick', 'Rapid', 'Slow', 'Swift'], answer: 'Slow' },
  { q: 'How many sides does a pentagon have?', options: ['4', '5', '6', '7'], answer: '5' },
  { q: 'What do you call a person who paints pictures?', options: ['Sculptor', 'Architect', 'Artist', 'Designer'], answer: 'Artist' },
  { q: 'Which is the longest river in the world?', options: ['Amazon', 'Congo', 'Nile', 'Yangtze'], answer: 'Nile' },
  { q: 'What do you call a baby horse?', options: ['Cub', 'Foal', 'Pup', 'Calf'], answer: 'Foal' },
  { q: 'How many days are in February in a normal year?', options: ['27', '28', '29', '30'], answer: '28' },
  { q: 'What is the color of a flamingo?', options: ['White', 'Red', 'Pink', 'Orange'], answer: 'Pink' },
  { q: 'Which animal is the largest in the sea?', options: ['Shark', 'Dolphin', 'Blue Whale', 'Orca'], answer: 'Blue Whale' },
  { q: 'What do you call a person who flies an airplane?', options: ['Captain', 'Pilot', 'Navigator', 'Steward'], answer: 'Pilot' },
  { q: 'How many letters are in the English alphabet?', options: ['24', '25', '26', '27'], answer: '26' },
  { q: 'What is the color of a ripe strawberry?', options: ['Orange', 'Yellow', 'Red', 'Purple'], answer: 'Red' },
  { q: 'Which planet has rings around it?', options: ['Jupiter', 'Mars', 'Saturn', 'Neptune'], answer: 'Saturn' },
  { q: 'What do you call a baby cow?', options: ['Foal', 'Cub', 'Calf', 'Pup'], answer: 'Calf' },
  { q: 'How many sides does an octagon have?', options: ['6', '7', '8', '9'], answer: '8' },
  { q: 'What is the opposite of big?', options: ['Tiny', 'Small', 'Little', 'Miniature'], answer: 'Small' },
  { q: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Korea', 'Japan', 'Thailand'], answer: 'Japan' },
  { q: 'What do you call a group of fish?', options: ['Pack', 'Herd', 'School', 'Flock'], answer: 'School' },
  { q: 'How many toes does a human have?', options: ['8', '9', '10', '12'], answer: '10' },
  { q: 'What is the color of a lemon?', options: ['Orange', 'Green', 'Yellow', 'White'], answer: 'Yellow' },
  { q: 'Which animal is known for its long neck?', options: ['Elephant', 'Hippo', 'Giraffe', 'Camel'], answer: 'Giraffe' },
  { q: 'What do you call the place where planes land?', options: ['Harbor', 'Station', 'Airport', 'Terminal'], answer: 'Airport' },
  { q: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], answer: '366' },
  { q: 'What is the color of the ocean?', options: ['Green', 'Blue', 'Teal', 'Turquoise'], answer: 'Blue' },
  { q: 'Which animal is the symbol of Australia?', options: ['Koala', 'Kangaroo', 'Platypus', 'Wombat'], answer: 'Kangaroo' },
  { q: 'What do you call a person who treats sick people?', options: ['Teacher', 'Lawyer', 'Doctor', 'Engineer'], answer: 'Doctor' },
  { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: '6' },
  { q: 'What is the opposite of up?', options: ['Below', 'Under', 'Down', 'Beneath'], answer: 'Down' },
  { q: 'Which fruit is green on the outside and red on the inside?', options: ['Apple', 'Melon', 'Watermelon', 'Kiwi'], answer: 'Watermelon' },
  { q: 'What do you call a person who teaches students?', options: ['Principal', 'Teacher', 'Librarian', 'Counselor'], answer: 'Teacher' },
  { q: 'How many wheels does a tricycle have?', options: ['2', '3', '4', '5'], answer: '3' },
  { q: 'What is the color of a carrot?', options: ['Yellow', 'Red', 'Orange', 'Green'], answer: 'Orange' },
  { q: 'Which animal makes a web?', options: ['Ant', 'Bee', 'Spider', 'Fly'], answer: 'Spider' },
  { q: 'What do you call a person who cooks food professionally?', options: ['Waiter', 'Chef', 'Baker', 'Butcher'], answer: 'Chef' },
  { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: '7' },
  { q: 'What is the color of a ripe mango?', options: ['Red', 'Green', 'Yellow', 'Orange'], answer: 'Yellow' },
  { q: 'Which animal is known for storing food in its cheeks?', options: ['Rabbit', 'Squirrel', 'Hamster', 'Mouse'], answer: 'Hamster' },
  { q: 'What do you call the place where ships dock?', options: ['Airport', 'Station', 'Harbor', 'Depot'], answer: 'Harbor' },
  { q: 'How many bones are in the human body?', options: ['106', '206', '306', '406'], answer: '206' },
  { q: 'What is the opposite of light?', options: ['Shadow', 'Shade', 'Dark', 'Dim'], answer: 'Dark' },
  { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars' },
  { q: 'What do you call a person who writes books?', options: ['Editor', 'Publisher', 'Author', 'Journalist'], answer: 'Author' },
  { q: 'How many sides does a rectangle have?', options: ['3', '4', '5', '6'], answer: '4' },
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
  { q: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], answer: 'Tokyo' },
  { q: 'Which is the longest bone in the human body?', options: ['Spine', 'Femur', 'Humerus', 'Tibia'], answer: 'Femur' },
  { q: 'What is the chemical symbol for water?', options: ['HO', 'H2O', 'H2O2', 'OH'], answer: 'H2O' },
  { q: 'Which country has the largest population?', options: ['India', 'USA', 'China', 'Russia'], answer: 'China' },
  { q: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 'Canberra' },
  { q: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], answer: '4' },
  { q: 'What is the tallest mountain in the world?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], answer: 'Mount Everest' },
  { q: 'Which gas makes up most of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], answer: 'Nitrogen' },
  { q: 'What is the capital of Germany?', options: ['Munich', 'Hamburg', 'Berlin', 'Frankfurt'], answer: 'Berlin' },
  { q: 'How many teeth does an adult human have?', options: ['28', '30', '32', '34'], answer: '32' },
  { q: 'Which planet is the smallest in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], answer: 'Mercury' },
  { q: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], answer: 'Brasília' },
  { q: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], answer: '46' },
  { q: 'What is the largest desert in the world?', options: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'], answer: 'Antarctic' },
  { q: 'Which element is represented by the symbol Fe?', options: ['Fluorine', 'Iron', 'Francium', 'Fermium'], answer: 'Iron' },
  { q: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 'Ottawa' },
  { q: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], answer: '6' },
  { q: 'What is the speed of sound in air?', options: ['343 m/s', '500 m/s', '1000 m/s', '200 m/s'], answer: '343 m/s' },
  { q: 'Which country is the largest by area?', options: ['China', 'USA', 'Canada', 'Russia'], answer: 'Russia' },
  { q: 'What is the capital of Italy?', options: ['Milan', 'Venice', 'Rome', 'Naples'], answer: 'Rome' },
  { q: 'How many valence electrons does carbon have?', options: ['2', '4', '6', '8'], answer: '4' },
  { q: 'Which is the deepest ocean trench?', options: ['Puerto Rico Trench', 'Java Trench', 'Mariana Trench', 'Tonga Trench'], answer: 'Mariana Trench' },
  { q: 'What is the capital of Spain?', options: ['Barcelona', 'Seville', 'Madrid', 'Valencia'], answer: 'Madrid' },
  { q: 'How many bones are in the human skull?', options: ['8', '22', '14', '30'], answer: '22' },
  { q: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], answer: 'Saturn' },
  { q: 'What is the capital of China?', options: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'], answer: 'Beijing' },
  { q: 'How many ribs does a human have?', options: ['10', '12', '24', '26'], answer: '24' },
  { q: 'Which is the smallest country in the world?', options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], answer: 'Vatican City' },
  { q: 'What is the capital of Russia?', options: ['St. Petersburg', 'Moscow', 'Novosibirsk', 'Kazan'], answer: 'Moscow' },
  { q: 'How many keys does a standard piano have?', options: ['72', '76', '88', '92'], answer: '88' },
  { q: 'Which element has the symbol O?', options: ['Osmium', 'Oxygen', 'Oganesson', 'Yttrium'], answer: 'Oxygen' },
  { q: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], answer: 'New Delhi' },
  { q: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8' },
  { q: 'Which country invented paper?', options: ['Japan', 'Egypt', 'China', 'India'], answer: 'China' },
  { q: 'What is the capital of Mexico?', options: ['Guadalajara', 'Monterrey', 'Mexico City', 'Puebla'], answer: 'Mexico City' },
  { q: 'How many muscles are in the human body?', options: ['400', '500', '600', '700'], answer: '600' },
  { q: 'Which is the largest country in Africa?', options: ['Sudan', 'Libya', 'Algeria', 'Democratic Republic of Congo'], answer: 'Algeria' },
  { q: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Luxor', 'Giza'], answer: 'Cairo' },
  { q: 'How many days does it take Earth to orbit the sun?', options: ['354', '365', '366', '370'], answer: '365' },
  { q: 'Which element has the symbol Na?', options: ['Neon', 'Nickel', 'Sodium', 'Nitrogen'], answer: 'Sodium' },
  { q: 'What is the capital of South Africa?', options: ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban'], answer: 'Pretoria' },
  { q: 'How many vertebrae does the human spine have?', options: ['26', '33', '40', '24'], answer: '33' },
  { q: 'Which is the longest wall in the world?', options: ['Hadrian\'s Wall', 'Great Wall of China', 'Berlin Wall', 'Aurelian Wall'], answer: 'Great Wall of China' },
  { q: 'What is the capital of Argentina?', options: ['Santiago', 'Lima', 'Buenos Aires', 'Montevideo'], answer: 'Buenos Aires' },
  { q: 'How many moons does Mars have?', options: ['0', '1', '2', '3'], answer: '2' },
  { q: 'Which element has the symbol K?', options: ['Krypton', 'Potassium', 'Kurchatovium', 'Cobalt'], answer: 'Potassium' },
  { q: 'What is the capital of Turkey?', options: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'], answer: 'Ankara' },
  { q: 'How many layers does the Earth have?', options: ['2', '3', '4', '5'], answer: '4' },
  { q: 'Which is the largest rainforest in the world?', options: ['Congo', 'Amazon', 'Daintree', 'Tongass'], answer: 'Amazon' },
  { q: 'What is the capital of South Korea?', options: ['Busan', 'Incheon', 'Seoul', 'Daegu'], answer: 'Seoul' },
  { q: 'How many bones are in the human hand?', options: ['19', '27', '33', '14'], answer: '27' },
  { q: 'Which planet rotates on its side?', options: ['Neptune', 'Saturn', 'Uranus', 'Jupiter'], answer: 'Uranus' },
  { q: 'What is the capital of Nigeria?', options: ['Lagos', 'Kano', 'Abuja', 'Ibadan'], answer: 'Abuja' },
  { q: 'How many elements are in the periodic table?', options: ['108', '112', '118', '124'], answer: '118' },
  { q: 'Which is the tallest waterfall in the world?', options: ['Niagara Falls', 'Victoria Falls', 'Angel Falls', 'Iguazu Falls'], answer: 'Angel Falls' },
  { q: 'What is the capital of Saudi Arabia?', options: ['Jeddah', 'Mecca', 'Riyadh', 'Medina'], answer: 'Riyadh' },
  { q: 'How many teeth does a shark have in its lifetime?', options: ['100', '1000', '5000', '30000'], answer: '30000' },
  { q: 'Which element has the symbol Au?', options: ['Silver', 'Aluminum', 'Gold', 'Argon'], answer: 'Gold' },
  { q: 'What is the capital of Sweden?', options: ['Oslo', 'Copenhagen', 'Stockholm', 'Helsinki'], answer: 'Stockholm' },
  { q: 'How many chambers does a fish heart have?', options: ['1', '2', '3', '4'], answer: '2' },
  { q: 'Which is the most spoken language in the world?', options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'], answer: 'Mandarin Chinese' },
  { q: 'What is the capital of Pakistan?', options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'], answer: 'Islamabad' },
  { q: 'How many bones are in the human foot?', options: ['19', '26', '33', '14'], answer: '26' },
  { q: 'Which planet is farthest from the sun?', options: ['Uranus', 'Saturn', 'Neptune', 'Jupiter'], answer: 'Neptune' },
  { q: 'What is the capital of Thailand?', options: ['Chiang Mai', 'Phuket', 'Bangkok', 'Pattaya'], answer: 'Bangkok' },
  { q: 'How many pairs of chromosomes do humans have?', options: ['21', '23', '25', '27'], answer: '23' },
  { q: 'Which is the largest lake in the world?', options: ['Superior', 'Victoria', 'Caspian Sea', 'Baikal'], answer: 'Caspian Sea' },
  { q: 'What is the capital of Poland?', options: ['Krakow', 'Gdansk', 'Warsaw', 'Wroclaw'], answer: 'Warsaw' },
  { q: 'How many bones are in the human ear?', options: ['1', '2', '3', '4'], answer: '3' },
  { q: 'Which element has the symbol Ag?', options: ['Argon', 'Silver', 'Antimony', 'Arsenic'], answer: 'Silver' },
  { q: 'What is the capital of Netherlands?', options: ['Rotterdam', 'The Hague', 'Amsterdam', 'Utrecht'], answer: 'Amsterdam' },
  { q: 'How many lobes does the human brain have?', options: ['3', '4', '5', '6'], answer: '4' },
  { q: 'Which is the largest island in the world?', options: ['Borneo', 'Madagascar', 'Greenland', 'New Guinea'], answer: 'Greenland' },
  { q: 'What is the capital of Portugal?', options: ['Porto', 'Braga', 'Lisbon', 'Coimbra'], answer: 'Lisbon' },
  { q: 'How many bones are in the human wrist?', options: ['6', '8', '10', '12'], answer: '8' },
  { q: 'Which planet has the shortest day?', options: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'], answer: 'Jupiter' },
  { q: 'What is the capital of Greece?', options: ['Thessaloniki', 'Patras', 'Athens', 'Heraklion'], answer: 'Athens' },
  { q: 'How many bones are in the human spine?', options: ['24', '26', '33', '36'], answer: '33' },
  { q: 'Which is the deepest lake in the world?', options: ['Superior', 'Caspian Sea', 'Baikal', 'Tanganyika'], answer: 'Baikal' },
  { q: 'What is the capital of Czech Republic?', options: ['Brno', 'Ostrava', 'Prague', 'Plzen'], answer: 'Prague' },
  { q: 'How many bones are in the human knee?', options: ['1', '2', '3', '4'], answer: '3' },
  { q: 'Which element has the symbol Pb?', options: ['Platinum', 'Phosphorus', 'Lead', 'Palladium'], answer: 'Lead' },
  { q: 'What is the capital of Hungary?', options: ['Debrecen', 'Miskolc', 'Budapest', 'Pecs'], answer: 'Budapest' },
  { q: 'How many bones are in the human arm?', options: ['2', '3', '4', '5'], answer: '3' },
  { q: 'Which is the largest volcano in the world?', options: ['Kilimanjaro', 'Vesuvius', 'Mauna Loa', 'Etna'], answer: 'Mauna Loa' },
  { q: 'What is the capital of Romania?', options: ['Cluj-Napoca', 'Timisoara', 'Bucharest', 'Iasi'], answer: 'Bucharest' },
  { q: 'How many bones are in the human leg?', options: ['2', '3', '4', '5'], answer: '4' },
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
  { q: 'What is the Planck constant approximately?', options: ['6.63×10⁻³⁴ J·s', '9.11×10⁻³¹ kg', '1.38×10⁻²³ J/K', '6.02×10²³ mol⁻¹'], answer: '6.63×10⁻³⁴ J·s' },
  { q: 'Who wrote "The Origin of Species"?', options: ['Newton', 'Einstein', 'Darwin', 'Mendel'], answer: 'Darwin' },
  { q: 'What is the atomic number of carbon?', options: ['4', '6', '8', '12'], answer: '6' },
  { q: 'Which war was fought between 1950 and 1953?', options: ['Vietnam War', 'Korean War', 'Gulf War', 'Falklands War'], answer: 'Korean War' },
  { q: 'What is the formula for the area of a circle?', options: ['2πr', 'πr²', 'πd', '2πr²'], answer: 'πr²' },
  { q: 'Who discovered penicillin?', options: ['Pasteur', 'Lister', 'Fleming', 'Koch'], answer: 'Fleming' },
  { q: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Shymkent', 'Astana', 'Karaganda'], answer: 'Astana' },
  { q: 'Which element has the highest melting point?', options: ['Iron', 'Platinum', 'Tungsten', 'Osmium'], answer: 'Tungsten' },
  { q: 'What year was the Magna Carta signed?', options: ['1066', '1215', '1348', '1492'], answer: '1215' },
  { q: 'What is the chemical formula for table salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], answer: 'NaCl' },
  { q: 'Who painted the Sistine Chapel ceiling?', options: ['Leonardo da Vinci', 'Raphael', 'Michelangelo', 'Botticelli'], answer: 'Michelangelo' },
  { q: 'What is the half-life of Carbon-14?', options: ['1,000 years', '5,730 years', '10,000 years', '50,000 years'], answer: '5,730 years' },
  { q: 'Which country was the first to give women the right to vote?', options: ['USA', 'UK', 'New Zealand', 'Australia'], answer: 'New Zealand' },
  { q: 'What is the chemical symbol for tungsten?', options: ['Tu', 'Tn', 'W', 'Tg'], answer: 'W' },
  { q: 'Who developed the theory of general relativity?', options: ['Newton', 'Bohr', 'Einstein', 'Heisenberg'], answer: 'Einstein' },
  { q: 'What is the largest organ inside the human body?', options: ['Heart', 'Liver', 'Kidney', 'Lung'], answer: 'Liver' },
  { q: 'Which battle ended Napoleon\'s rule?', options: ['Austerlitz', 'Trafalgar', 'Waterloo', 'Borodino'], answer: 'Waterloo' },
  { q: 'What is the chemical formula for glucose?', options: ['C6H12O6', 'C12H22O11', 'CH4', 'C2H5OH'], answer: 'C6H12O6' },
  { q: 'Who invented the World Wide Web?', options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Vint Cerf'], answer: 'Tim Berners-Lee' },
  { q: 'What is the atomic mass of oxygen?', options: ['8', '14', '16', '18'], answer: '16' },
  { q: 'Which empire was the largest in history by land area?', options: ['Roman Empire', 'British Empire', 'Mongol Empire', 'Ottoman Empire'], answer: 'British Empire' },
  { q: 'What is the speed of sound in water?', options: ['343 m/s', '1000 m/s', '1480 m/s', '3000 m/s'], answer: '1480 m/s' },
  { q: 'Who wrote "War and Peace"?', options: ['Dostoevsky', 'Tolstoy', 'Chekhov', 'Turgenev'], answer: 'Tolstoy' },
  { q: 'What is the chemical symbol for mercury?', options: ['Me', 'Mr', 'Hg', 'Mc'], answer: 'Hg' },
  { q: 'Which year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], answer: '1989' },
  { q: 'What is the boiling point of water in Kelvin?', options: ['100 K', '273 K', '373 K', '473 K'], answer: '373 K' },
  { q: 'Who discovered the structure of DNA?', options: ['Mendel and Darwin', 'Watson and Crick', 'Pasteur and Koch', 'Curie and Bohr'], answer: 'Watson and Crick' },
  { q: 'What is the chemical formula for ammonia?', options: ['NH3', 'NO2', 'N2O', 'HNO3'], answer: 'NH3' },
  { q: 'Which philosopher wrote "The Republic"?', options: ['Aristotle', 'Socrates', 'Plato', 'Epicurus'], answer: 'Plato' },
  { q: 'What is the atomic number of gold?', options: ['47', '74', '79', '82'], answer: '79' },
  { q: 'Who composed the "Moonlight Sonata"?', options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], answer: 'Beethoven' },
  { q: 'What is the chemical formula for sulfuric acid?', options: ['HCl', 'HNO3', 'H2SO4', 'H3PO4'], answer: 'H2SO4' },
  { q: 'Which year did the French Revolution begin?', options: ['1776', '1789', '1799', '1804'], answer: '1789' },
  { q: 'What is the gravitational constant G?', options: ['6.67×10⁻¹¹ N·m²/kg²', '9.81 m/s²', '3×10⁸ m/s', '1.6×10⁻¹⁹ C'], answer: '6.67×10⁻¹¹ N·m²/kg²' },
  { q: 'Who wrote "Hamlet"?', options: ['Marlowe', 'Jonson', 'Shakespeare', 'Chaucer'], answer: 'Shakespeare' },
  { q: 'What is the chemical symbol for lead?', options: ['Le', 'Ld', 'Pb', 'Pl'], answer: 'Pb' },
  { q: 'Which year did World War I begin?', options: ['1912', '1913', '1914', '1915'], answer: '1914' },
  { q: 'What is the melting point of iron in Celsius?', options: ['1000°C', '1200°C', '1538°C', '1800°C'], answer: '1538°C' },
  { q: 'Who invented the steam engine?', options: ['Watt', 'Stephenson', 'Newcomen', 'Trevithick'], answer: 'Watt' },
  { q: 'What is the chemical formula for methane?', options: ['C2H6', 'CH4', 'C3H8', 'C4H10'], answer: 'CH4' },
  { q: 'Which ancient wonder was located in Alexandria?', options: ['Colossus of Rhodes', 'Lighthouse of Alexandria', 'Hanging Gardens', 'Temple of Artemis'], answer: 'Lighthouse of Alexandria' },
  { q: 'What is the atomic number of uranium?', options: ['82', '88', '92', '94'], answer: '92' },
  { q: 'Who wrote "1984"?', options: ['Huxley', 'Orwell', 'Kafka', 'Bradbury'], answer: 'Orwell' },
  { q: 'What is the chemical formula for ethanol?', options: ['CH3OH', 'C2H5OH', 'C3H7OH', 'C4H9OH'], answer: 'C2H5OH' },
  { q: 'Which year did the Apollo 11 land on the moon?', options: ['1967', '1968', '1969', '1970'], answer: '1969' },
  { q: 'What is the density of water at 4°C?', options: ['0.9 g/cm³', '1.0 g/cm³', '1.1 g/cm³', '1.2 g/cm³'], answer: '1.0 g/cm³' },
  { q: 'Who invented the printing press?', options: ['Galileo', 'Gutenberg', 'Copernicus', 'Da Vinci'], answer: 'Gutenberg' },
  { q: 'What is the chemical symbol for potassium?', options: ['Po', 'Pt', 'K', 'Ka'], answer: 'K' },
  { q: 'Which year did the Roman Empire fall?', options: ['376 AD', '410 AD', '476 AD', '500 AD'], answer: '476 AD' },
  { q: 'What is the formula for kinetic energy?', options: ['mgh', '½mv²', 'mv', 'Fd'], answer: '½mv²' },
  { q: 'Who painted "The Starry Night"?', options: ['Monet', 'Picasso', 'Van Gogh', 'Dali'], answer: 'Van Gogh' },
  { q: 'What is the chemical formula for carbon dioxide?', options: ['CO', 'CO2', 'C2O', 'CO3'], answer: 'CO2' },
  { q: 'Which year was the United Nations founded?', options: ['1943', '1944', '1945', '1946'], answer: '1945' },
  { q: 'What is the atomic number of helium?', options: ['1', '2', '3', '4'], answer: '2' },
  { q: 'Who wrote "The Divine Comedy"?', options: ['Petrarch', 'Boccaccio', 'Dante', 'Virgil'], answer: 'Dante' },
  { q: 'What is the chemical formula for ozone?', options: ['O', 'O2', 'O3', 'O4'], answer: 'O3' },
  { q: 'Which year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], answer: '1912' },
  { q: 'What is the speed of Earth\'s rotation at the equator?', options: ['465 m/s', '1000 m/s', '1670 km/h', '3000 km/h'], answer: '1670 km/h' },
  { q: 'Who invented the light bulb?', options: ['Tesla', 'Bell', 'Edison', 'Faraday'], answer: 'Edison' },
  { q: 'What is the chemical symbol for silver?', options: ['Si', 'Sv', 'Ag', 'Sr'], answer: 'Ag' },
  { q: 'Which year did the Cold War end?', options: ['1987', '1989', '1991', '1993'], answer: '1991' },
  { q: 'What is the formula for Ohm\'s Law?', options: ['P=IV', 'V=IR', 'F=ma', 'E=mc²'], answer: 'V=IR' },
  { q: 'Who wrote "The Iliad"?', options: ['Virgil', 'Ovid', 'Homer', 'Sophocles'], answer: 'Homer' },
  { q: 'What is the chemical formula for hydrochloric acid?', options: ['H2SO4', 'HNO3', 'HCl', 'H3PO4'], answer: 'HCl' },
  { q: 'Which year was the Eiffel Tower built?', options: ['1879', '1885', '1889', '1895'], answer: '1889' },
  { q: 'What is the atomic number of iron?', options: ['24', '26', '28', '30'], answer: '26' },
  { q: 'Who discovered gravity?', options: ['Galileo', 'Einstein', 'Newton', 'Kepler'], answer: 'Newton' },
  { q: 'What is the chemical formula for sodium hydroxide?', options: ['NaCl', 'NaOH', 'Na2O', 'NaHCO3'], answer: 'NaOH' },
  { q: 'Which year did the first iPhone launch?', options: ['2005', '2006', '2007', '2008'], answer: '2007' },
  { q: 'What is the Avogadro number?', options: ['6.02×10²²', '6.02×10²³', '6.02×10²⁴', '6.02×10²⁵'], answer: '6.02×10²³' },
  { q: 'Who wrote "Crime and Punishment"?', options: ['Tolstoy', 'Chekhov', 'Dostoevsky', 'Turgenev'], answer: 'Dostoevsky' },
  { q: 'What is the chemical symbol for tin?', options: ['Ti', 'Tn', 'Sn', 'Ts'], answer: 'Sn' },
  { q: 'Which year did the Great Fire of London occur?', options: ['1564', '1616', '1666', '1716'], answer: '1666' },
  { q: 'What is the formula for the volume of a sphere?', options: ['πr²h', '4/3πr³', '2πr²', 'πr³'], answer: '4/3πr³' },
  { q: 'Who invented the airplane?', options: ['Edison', 'Bell', 'Wright Brothers', 'Curtiss'], answer: 'Wright Brothers' },
  { q: 'What is the chemical formula for hydrogen peroxide?', options: ['H2O', 'H2O2', 'HO', 'H3O'], answer: 'H2O2' },
  { q: 'Which year was the Declaration of Independence signed?', options: ['1774', '1775', '1776', '1777'], answer: '1776' },
  { q: 'What is the atomic number of nitrogen?', options: ['5', '6', '7', '8'], answer: '7' },
  { q: 'Who composed "The Four Seasons"?', options: ['Bach', 'Handel', 'Vivaldi', 'Telemann'], answer: 'Vivaldi' },
  { q: 'What is the chemical formula for acetic acid?', options: ['HCOOH', 'CH3COOH', 'C2H5COOH', 'C3H7COOH'], answer: 'CH3COOH' },
  { q: 'Which year did the first human go to space?', options: ['1957', '1959', '1961', '1963'], answer: '1961' },
  { q: 'What is the mass of an electron?', options: ['9.11×10⁻³¹ kg', '1.67×10⁻²⁷ kg', '1.67×10⁻²⁴ kg', '9.11×10⁻²⁸ kg'], answer: '9.11×10⁻³¹ kg' },
  { q: 'Who wrote "Don Quixote"?', options: ['Lope de Vega', 'Cervantes', 'Calderon', 'Quevedo'], answer: 'Cervantes' },
  { q: 'What is the chemical symbol for chromium?', options: ['Ch', 'Cm', 'Cr', 'Co'], answer: 'Cr' },
  { q: 'Which year did the Renaissance begin?', options: ['1200s', '1300s', '1400s', '1500s'], answer: '1300s' },
  { q: 'What is the formula for electric power?', options: ['P=V/I', 'P=IV', 'P=I/V', 'P=V²I'], answer: 'P=IV' },
  { q: 'Who invented the telescope?', options: ['Galileo', 'Kepler', 'Lippershey', 'Newton'], answer: 'Lippershey' },
  { q: 'What is the chemical formula for nitric acid?', options: ['H2SO4', 'HCl', 'HNO3', 'H3PO4'], answer: 'HNO3' },
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
  { q: 'What comes next? 3, 6, 9, 12, __', options: ['13', '14', '15', '16'], answer: '15' },
  { q: 'What comes next? 1, 2, 3, 4, __', options: ['4', '5', '6', '7'], answer: '5' },
  { q: 'What comes next? 100, 200, 300, 400, __', options: ['450', '480', '500', '550'], answer: '500' },
  { q: 'What comes next? A, C, E, G, __', options: ['H', 'I', 'J', 'K'], answer: 'I' },
  { q: 'What comes next? 4, 8, 12, 16, __', options: ['18', '19', '20', '22'], answer: '20' },
  { q: 'What comes next? Jan, Feb, Mar, Apr, __', options: ['Jun', 'Jul', 'May', 'Aug'], answer: 'May' },
  { q: 'What comes next? 50, 45, 40, 35, __', options: ['28', '30', '32', '25'], answer: '30' },
  { q: 'What comes next? Sun, Mon, Tue, Wed, __', options: ['Fri', 'Sat', 'Thu', 'Sun'], answer: 'Thu' },
  { q: 'What comes next? 2, 2, 2, 2, __', options: ['1', '2', '3', '4'], answer: '2' },
  { q: 'What comes next? 1, 10, 100, 1000, __', options: ['5000', '8000', '10000', '100000'], answer: '10000' },
  { q: 'What comes next? B, D, F, H, __', options: ['I', 'J', 'K', 'L'], answer: 'J' },
  { q: 'What comes next? 20, 18, 16, 14, __', options: ['10', '11', '12', '13'], answer: '12' },
  { q: 'What comes next? Spring, Summer, Autumn, Winter, __', options: ['Autumn', 'Winter', 'Spring', 'Summer'], answer: 'Spring' },
  { q: 'What comes next? 7, 14, 21, 28, __', options: ['30', '32', '35', '36'], answer: '35' },
  { q: 'What comes next? Z, Y, X, W, __', options: ['T', 'U', 'V', 'S'], answer: 'V' },
  { q: 'What comes next? 9, 18, 27, 36, __', options: ['40', '42', '45', '48'], answer: '45' },
  { q: 'What comes next? Dog, Cat, Dog, Cat, __', options: ['Bird', 'Dog', 'Fish', 'Rabbit'], answer: 'Dog' },
  { q: 'What comes next? 6, 12, 18, 24, __', options: ['28', '30', '32', '36'], answer: '30' },
  { q: 'What comes next? M, N, O, P, __', options: ['Q', 'R', 'S', 'T'], answer: 'Q' },
  { q: 'What comes next? 25, 50, 75, 100, __', options: ['110', '115', '120', '125'], answer: '125' },
  { q: 'What comes next? 1, 1, 1, 1, __', options: ['0', '1', '2', '3'], answer: '1' },
  { q: 'What comes next? 8, 16, 24, 32, __', options: ['36', '38', '40', '42'], answer: '40' },
  { q: 'What comes next? North, East, South, West, __', options: ['East', 'North', 'South', 'West'], answer: 'North' },
  { q: 'What comes next? 11, 22, 33, 44, __', options: ['50', '52', '55', '60'], answer: '55' },
  { q: 'What comes next? C, F, I, L, __', options: ['M', 'N', 'O', 'P'], answer: 'O' },
  { q: 'What comes next? 60, 55, 50, 45, __', options: ['35', '38', '40', '42'], answer: '40' },
  { q: 'What comes next? 1, 3, 1, 3, __', options: ['1', '2', '3', '4'], answer: '1' },
  { q: 'What comes next? 0, 5, 10, 15, __', options: ['18', '19', '20', '21'], answer: '20' },
  { q: 'What comes next? A, E, I, O, __', options: ['P', 'Q', 'R', 'U'], answer: 'U' },
  { q: 'What comes next? 30, 60, 90, 120, __', options: ['140', '145', '150', '160'], answer: '150' },
  { q: 'What comes next? Big, Small, Big, Small, __', options: ['Medium', 'Big', 'Tiny', 'Large'], answer: 'Big' },
  { q: 'What comes next? 12, 24, 36, 48, __', options: ['54', '56', '60', '64'], answer: '60' },
  { q: 'What comes next? D, E, F, G, __', options: ['G', 'H', 'I', 'J'], answer: 'H' },
  { q: 'What comes next? 200, 400, 600, 800, __', options: ['900', '950', '1000', '1100'], answer: '1000' },
  { q: 'What comes next? Hot, Cold, Hot, Cold, __', options: ['Warm', 'Hot', 'Cool', 'Icy'], answer: 'Hot' },
  { q: 'What comes next? 15, 30, 45, 60, __', options: ['65', '70', '75', '80'], answer: '75' },
  { q: 'What comes next? P, Q, R, S, __', options: ['T', 'U', 'V', 'W'], answer: 'T' },
  { q: 'What comes next? 1000, 900, 800, 700, __', options: ['550', '600', '650', '700'], answer: '600' },
  { q: 'What comes next? Yes, No, Yes, No, __', options: ['Maybe', 'No', 'Yes', 'Always'], answer: 'Yes' },
  { q: 'What comes next? 13, 26, 39, 52, __', options: ['60', '62', '65', '68'], answer: '65' },
  { q: 'What comes next? V, W, X, Y, __', options: ['A', 'B', 'Z', 'C'], answer: 'Z' },
  { q: 'What comes next? 40, 80, 120, 160, __', options: ['180', '190', '200', '210'], answer: '200' },
  { q: 'What comes next? Up, Down, Up, Down, __', options: ['Left', 'Right', 'Up', 'Down'], answer: 'Up' },
  { q: 'What comes next? 5, 15, 25, 35, __', options: ['40', '42', '45', '50'], answer: '45' },
  { q: 'What comes next? G, H, I, J, __', options: ['J', 'K', 'L', 'M'], answer: 'K' },
  { q: 'What comes next? 70, 60, 50, 40, __', options: ['25', '28', '30', '35'], answer: '30' },
  { q: 'What comes next? Fast, Slow, Fast, Slow, __', options: ['Medium', 'Fast', 'Quick', 'Stop'], answer: 'Fast' },
  { q: 'What comes next? 16, 32, 48, 64, __', options: ['72', '76', '80', '84'], answer: '80' },
  { q: 'What comes next? K, L, M, N, __', options: ['M', 'N', 'O', 'P'], answer: 'O' },
  { q: 'What comes next? 90, 80, 70, 60, __', options: ['45', '48', '50', '55'], answer: '50' },
  { q: 'What comes next? Day, Night, Day, Night, __', options: ['Evening', 'Day', 'Dusk', 'Dawn'], answer: 'Day' },
  { q: 'What comes next? 17, 34, 51, 68, __', options: ['75', '80', '85', '90'], answer: '85' },
  { q: 'What comes next? T, U, V, W, __', options: ['W', 'X', 'Y', 'Z'], answer: 'X' },
  { q: 'What comes next? 18, 36, 54, 72, __', options: ['80', '85', '90', '95'], answer: '90' },
  { q: 'What comes next? Left, Right, Left, Right, __', options: ['Up', 'Down', 'Left', 'Right'], answer: 'Left' },
  { q: 'What comes next? 19, 38, 57, 76, __', options: ['85', '90', '95', '100'], answer: '95' },
  { q: 'What comes next? X, Y, Z, A, __', options: ['A', 'B', 'C', 'D'], answer: 'B' },
  { q: 'What comes next? 21, 42, 63, 84, __', options: ['95', '100', '105', '110'], answer: '105' },
  { q: 'What comes next? Open, Close, Open, Close, __', options: ['Half', 'Open', 'Shut', 'Lock'], answer: 'Open' },
  { q: 'What comes next? 22, 44, 66, 88, __', options: ['100', '105', '110', '115'], answer: '110' },
  { q: 'What comes next? Q, R, S, T, __', options: ['T', 'U', 'V', 'W'], answer: 'U' },
  { q: 'What comes next? 24, 48, 72, 96, __', options: ['100', '108', '120', '124'], answer: '120' },
  { q: 'What comes next? In, Out, In, Out, __', options: ['Around', 'In', 'Through', 'Over'], answer: 'In' },
  { q: 'What comes next? 26, 52, 78, 104, __', options: ['120', '125', '130', '135'], answer: '130' },
  { q: 'What comes next? W, X, Y, Z, __', options: ['A', 'B', 'C', 'D'], answer: 'A' },
  { q: 'What comes next? 27, 54, 81, 108, __', options: ['125', '130', '135', '140'], answer: '135' },
  { q: 'What comes next? On, Off, On, Off, __', options: ['Maybe', 'On', 'Pause', 'Stop'], answer: 'On' },
  { q: 'What comes next? 28, 56, 84, 112, __', options: ['130', '135', '140', '145'], answer: '140' },
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
  { q: 'What comes next? 5, 10, 20, 40, __', options: ['60', '70', '80', '90'], answer: '80' },
  { q: 'What comes next? 1, 2, 4, 7, 11, __', options: ['14', '15', '16', '17'], answer: '16' },
  { q: 'What comes next? 64, 32, 16, 8, __', options: ['2', '3', '4', '6'], answer: '4' },
  { q: 'What comes next? 1, 3, 6, 10, 15, __', options: ['18', '19', '20', '21'], answer: '21' },
  { q: 'What comes next? A, D, G, J, __', options: ['K', 'L', 'M', 'N'], answer: 'M' },
  { q: 'What comes next? 81, 27, 9, 3, __', options: ['0', '1', '2', '3'], answer: '1' },
  { q: 'What comes next? 2, 6, 18, 54, __', options: ['108', '126', '162', '180'], answer: '162' },
  { q: 'What comes next? 1, 5, 14, 30, __', options: ['45', '50', '55', '60'], answer: '55' },
  { q: 'What comes next? B, E, H, K, __', options: ['L', 'M', 'N', 'O'], answer: 'N' },
  { q: 'What comes next? 256, 64, 16, 4, __', options: ['0', '1', '2', '3'], answer: '1' },
  { q: 'What comes next? 1, 2, 3, 5, 8, 13, __', options: ['18', '19', '20', '21'], answer: '21' },
  { q: 'What comes next? 1000, 500, 250, 125, __', options: ['50', '60', '62.5', '75'], answer: '62.5' },
  { q: 'What comes next? 2, 5, 11, 23, __', options: ['44', '45', '46', '47'], answer: '47' },
  { q: 'What comes next? C, F, I, L, O, __', options: ['P', 'Q', 'R', 'S'], answer: 'R' },
  { q: 'What comes next? 1, 8, 27, 64, __', options: ['100', '121', '125', '144'], answer: '125' },
  { q: 'What comes next? 3, 7, 15, 31, __', options: ['55', '60', '63', '65'], answer: '63' },
  { q: 'What comes next? 2, 3, 5, 8, 13, 21, __', options: ['30', '32', '34', '36'], answer: '34' },
  { q: 'What comes next? 4, 9, 16, 25, 36, __', options: ['42', '45', '48', '49'], answer: '49' },
  { q: 'What comes next? D, G, J, M, __', options: ['N', 'O', 'P', 'Q'], answer: 'P' },
  { q: 'What comes next? 1, 4, 13, 40, __', options: ['100', '115', '121', '130'], answer: '121' },
  { q: 'What comes next? 2, 4, 12, 48, __', options: ['120', '192', '240', '288'], answer: '240' },
  { q: 'What comes next? 1, 2, 6, 24, 120, __', options: ['240', '480', '600', '720'], answer: '720' },
  { q: 'What comes next? 5, 6, 8, 11, 15, __', options: ['18', '19', '20', '21'], answer: '20' },
  { q: 'What comes next? E, H, K, N, __', options: ['O', 'P', 'Q', 'R'], answer: 'Q' },
  { q: 'What comes next? 3, 4, 6, 9, 13, __', options: ['16', '17', '18', '19'], answer: '18' },
  { q: 'What comes next? 2, 10, 30, 68, __', options: ['120', '130', '130', '130'], answer: '130' },
  { q: 'What comes next? 1, 3, 9, 27, 81, __', options: ['162', '243', '324', '405'], answer: '243' },
  { q: 'What comes next? 6, 11, 21, 41, __', options: ['71', '81', '91', '101'], answer: '81' },
  { q: 'What comes next? F, I, L, O, __', options: ['P', 'Q', 'R', 'S'], answer: 'R' },
  { q: 'What comes next? 1, 2, 4, 8, 16, 32, __', options: ['48', '56', '64', '72'], answer: '64' },
  { q: 'What comes next? 7, 11, 16, 22, 29, __', options: ['35', '36', '37', '38'], answer: '37' },
  { q: 'What comes next? 2, 7, 17, 37, __', options: ['67', '72', '77', '82'], answer: '77' },
  { q: 'What comes next? G, J, M, P, __', options: ['Q', 'R', 'S', 'T'], answer: 'S' },
  { q: 'What comes next? 1, 2, 3, 5, 8, 13, 21, __', options: ['30', '32', '34', '36'], answer: '34' },
  { q: 'What comes next? 10, 9, 7, 4, __', options: ['0', '1', '2', '3'], answer: '0' },
  { q: 'What comes next? 3, 5, 9, 17, __', options: ['29', '31', '33', '35'], answer: '33' },
  { q: 'What comes next? H, K, N, Q, __', options: ['R', 'S', 'T', 'U'], answer: 'T' },
  { q: 'What comes next? 2, 3, 5, 7, 11, 13, __', options: ['15', '16', '17', '18'], answer: '17' },
  { q: 'What comes next? 1, 4, 10, 22, __', options: ['40', '44', '46', '48'], answer: '46' },
  { q: 'What comes next? 4, 6, 10, 18, __', options: ['30', '32', '34', '36'], answer: '34' },
  { q: 'What comes next? I, L, O, R, __', options: ['S', 'T', 'U', 'V'], answer: 'U' },
  { q: 'What comes next? 1, 3, 7, 13, 21, __', options: ['29', '30', '31', '32'], answer: '31' },
  { q: 'What comes next? 5, 8, 13, 21, 34, __', options: ['50', '52', '55', '58'], answer: '55' },
  { q: 'What comes next? 2, 5, 14, 41, __', options: ['100', '110', '120', '122'], answer: '122' },
  { q: 'What comes next? J, M, P, S, __', options: ['T', 'U', 'V', 'W'], answer: 'V' },
  { q: 'What comes next? 1, 6, 21, 66, __', options: ['196', '201', '206', '211'], answer: '201' },
  { q: 'What comes next? 3, 6, 11, 18, 27, __', options: ['36', '38', '40', '42'], answer: '38' },
  { q: 'What comes next? 2, 6, 12, 20, 30, __', options: ['36', '40', '42', '44'], answer: '42' },
  { q: 'What comes next? K, N, Q, T, __', options: ['U', 'V', 'W', 'X'], answer: 'W' },
  { q: 'What comes next? 1, 2, 4, 7, 11, 16, __', options: ['20', '21', '22', '23'], answer: '22' },
  { q: 'What comes next? 4, 7, 12, 19, 28, __', options: ['37', '38', '39', '40'], answer: '39' },
  { q: 'What comes next? 3, 8, 18, 38, __', options: ['68', '72', '76', '78'], answer: '78' },
  { q: 'What comes next? L, O, R, U, __', options: ['V', 'W', 'X', 'Y'], answer: 'X' },
  { q: 'What comes next? 1, 3, 6, 11, 18, __', options: ['25', '27', '29', '31'], answer: '27' },
  { q: 'What comes next? 5, 7, 11, 19, 35, __', options: ['60', '65', '67', '70'], answer: '67' },
  { q: 'What comes next? 2, 4, 8, 14, 22, __', options: ['30', '32', '34', '36'], answer: '32' },
  { q: 'What comes next? M, P, S, V, __', options: ['W', 'X', 'Y', 'Z'], answer: 'Y' },
  { q: 'What comes next? 1, 4, 9, 16, 25, 36, __', options: ['42', '45', '48', '49'], answer: '49' },
  { q: 'What comes next? 6, 10, 16, 24, 34, __', options: ['44', '46', '48', '50'], answer: '46' },
  { q: 'What comes next? 3, 9, 18, 30, 45, __', options: ['58', '60', '63', '66'], answer: '63' },
  { q: 'What comes next? N, Q, T, W, __', options: ['X', 'Y', 'Z', 'A'], answer: 'Z' },
  { q: 'What comes next? 1, 5, 13, 29, __', options: ['55', '57', '61', '65'], answer: '61' },
  { q: 'What comes next? 4, 8, 16, 28, 44, __', options: ['60', '62', '64', '66'], answer: '64' },
  { q: 'What comes next? 2, 8, 18, 32, 50, __', options: ['68', '70', '72', '74'], answer: '72' },
  { q: 'What comes next? O, R, U, X, __', options: ['A', 'B', 'C', 'D'], answer: 'A' },
  { q: 'What comes next? 1, 7, 19, 43, __', options: ['85', '87', '91', '95'], answer: '91' },
  { q: 'What comes next? 5, 11, 23, 47, __', options: ['90', '93', '95', '97'], answer: '95' },
  { q: 'What comes next? 3, 12, 27, 48, __', options: ['70', '72', '75', '80'], answer: '75' },
  { q: 'What comes next? P, S, V, Y, __', options: ['A', 'B', 'C', 'D'], answer: 'B' },
  { q: 'What comes next? 1, 9, 25, 49, __', options: ['64', '81', '100', '121'], answer: '81' },
  { q: 'What comes next? 6, 14, 30, 62, __', options: ['118', '120', '124', '126'], answer: '126' },
  { q: 'What comes next? 2, 12, 36, 80, __', options: ['140', '145', '150', '155'], answer: '150' },
  { q: 'What comes next? Q, T, W, Z, __', options: ['A', 'B', 'C', 'D'], answer: 'C' },
  { q: 'What comes next? 1, 11, 31, 71, __', options: ['131', '141', '151', '161'], answer: '151' },
  { q: 'What comes next? 4, 16, 36, 64, __', options: ['90', '96', '100', '108'], answer: '100' },
  { q: 'What comes next? 3, 15, 35, 63, __', options: ['95', '97', '99', '101'], answer: '99' },
  { q: 'What comes next? R, U, X, A, __', options: ['B', 'C', 'D', 'E'], answer: 'D' },
  { q: 'What comes next? 1, 13, 37, 85, __', options: ['175', '181', '187', '193'], answer: '181' },
  { q: 'What comes next? 5, 25, 55, 95, __', options: ['135', '140', '145', '150'], answer: '145' },
  { q: 'What comes next? 2, 14, 42, 98, __', options: ['186', '190', '194', '198'], answer: '194' },
  { q: 'What comes next? S, V, Y, B, __', options: ['D', 'E', 'F', 'G'], answer: 'E' },
  { q: 'What comes next? 1, 15, 43, 99, __', options: ['195', '199', '211', '215'], answer: '211' },
  { q: 'What comes next? 6, 18, 42, 90, __', options: ['168', '174', '180', '186'], answer: '186' },
  { q: 'What comes next? 4, 20, 56, 120, __', options: ['220', '224', '228', '232'], answer: '220' },
  { q: 'What comes next? T, W, Z, C, __', options: ['E', 'F', 'G', 'H'], answer: 'F' },
  { q: 'What comes next? 1, 17, 49, 113, __', options: ['241', '245', '249', '253'], answer: '241' },
  { q: 'What comes next? 7, 21, 49, 105, __', options: ['210', '217', '224', '231'], answer: '217' },
  { q: 'What comes next? 3, 21, 63, 141, __', options: ['295', '297', '299', '301'], answer: '297' },
  { q: 'What comes next? U, X, A, D, __', options: ['F', 'G', 'H', 'I'], answer: 'G' },
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
  { q: 'What comes next? 2, 3, 5, 7, 11, 13, 17, __', options: ['18', '19', '20', '21'], answer: '19' },
  { q: 'What comes next? 1, 4, 9, 16, 25, 36, 49, __', options: ['56', '60', '64', '72'], answer: '64' },
  { q: 'What comes next? 1, 2, 4, 8, 16, 32, 64, __', options: ['96', '112', '128', '144'], answer: '128' },
  { q: 'What comes next? 1, 1, 2, 3, 5, 8, 13, 21, __', options: ['30', '32', '34', '36'], answer: '34' },
  { q: 'What comes next? 2, 6, 18, 54, 162, __', options: ['324', '486', '648', '810'], answer: '486' },
  { q: 'What comes next? 1, 5, 14, 30, 55, __', options: ['80', '85', '91', '95'], answer: '91' },
  { q: 'What comes next? 3, 5, 11, 29, 83, __', options: ['239', '245', '251', '257'], answer: '245' },
  { q: 'What comes next? 1, 2, 5, 14, 42, __', options: ['120', '126', '132', '138'], answer: '132' },
  { q: 'What comes next? 2, 4, 12, 48, 240, __', options: ['1200', '1320', '1440', '1560'], answer: '1440' },
  { q: 'What comes next? 1, 3, 6, 10, 15, 21, __', options: ['25', '27', '28', '30'], answer: '28' },
  { q: 'What comes next? 4, 6, 10, 18, 34, __', options: ['60', '62', '64', '66'], answer: '66' },
  { q: 'What comes next? 1, 2, 3, 5, 8, 13, 21, 34, __', options: ['50', '52', '55', '58'], answer: '55' },
  { q: 'What comes next? 2, 8, 26, 80, __', options: ['230', '240', '242', '250'], answer: '242' },
  { q: 'What comes next? 1, 6, 21, 66, 201, __', options: ['596', '600', '606', '616'], answer: '606' },
  { q: 'What comes next? 3, 7, 16, 35, 74, __', options: ['150', '151', '153', '155'], answer: '153' },
  { q: 'What comes next? 1, 4, 10, 22, 46, __', options: ['90', '92', '94', '96'], answer: '94' },
  { q: 'What comes next? 2, 5, 11, 23, 47, __', options: ['90', '93', '95', '97'], answer: '95' },
  { q: 'What comes next? 1, 3, 9, 27, 81, 243, __', options: ['486', '729', '972', '1215'], answer: '729' },
  { q: 'What comes next? 5, 10, 20, 35, 55, __', options: ['75', '80', '85', '90'], answer: '80' },
  { q: 'What comes next? 1, 2, 6, 24, 120, 720, __', options: ['4040', '4320', '5040', '5760'], answer: '5040' },
  { q: 'What comes next? 2, 3, 7, 43, __', options: ['1805', '1806', '1807', '1808'], answer: '1807' },
  { q: 'What comes next? 1, 7, 25, 79, __', options: ['235', '241', '247', '253'], answer: '241' },
  { q: 'What comes next? 3, 4, 7, 11, 18, 29, __', options: ['44', '46', '47', '48'], answer: '47' },
  { q: 'What comes next? 1, 2, 4, 7, 11, 16, 22, __', options: ['27', '28', '29', '30'], answer: '29' },
  { q: 'What comes next? 2, 6, 14, 30, 62, __', options: ['120', '124', '126', '130'], answer: '126' },
  { q: 'What comes next? 1, 3, 8, 21, 55, __', options: ['140', '144', '148', '152'], answer: '144' },
  { q: 'What comes next? 4, 5, 9, 14, 23, 37, __', options: ['58', '60', '62', '64'], answer: '60' },
  { q: 'What comes next? 1, 4, 14, 51, __', options: ['185', '188', '191', '194'], answer: '188' },
  { q: 'What comes next? 2, 7, 22, 67, __', options: ['196', '200', '202', '206'], answer: '202' },
  { q: 'What comes next? 1, 2, 3, 7, 13, 23, __', options: ['40', '42', '43', '44'], answer: '43' },
  { q: 'What comes next? 3, 6, 15, 42, __', options: ['120', '123', '126', '129'], answer: '123' },
  { q: 'What comes next? 1, 5, 17, 53, __', options: ['155', '160', '161', '165'], answer: '161' },
  { q: 'What comes next? 2, 4, 10, 28, __', options: ['76', '80', '82', '84'], answer: '82' },
  { q: 'What comes next? 1, 3, 12, 60, __', options: ['355', '360', '365', '370'], answer: '360' },
  { q: 'What comes next? 5, 6, 11, 17, 28, 45, __', options: ['70', '72', '73', '75'], answer: '73' },
  { q: 'What comes next? 1, 2, 8, 48, __', options: ['380', '384', '388', '392'], answer: '384' },
  { q: 'What comes next? 3, 8, 23, 68, __', options: ['200', '203', '206', '209'], answer: '203' },
  { q: 'What comes next? 1, 6, 31, 156, __', options: ['775', '780', '781', '785'], answer: '781' },
  { q: 'What comes next? 2, 9, 30, 93, __', options: ['280', '282', '284', '286'], answer: '282' },
  { q: 'What comes next? 1, 4, 16, 64, 256, __', options: ['512', '768', '1024', '1280'], answer: '1024' },
  { q: 'What comes next? 3, 5, 8, 13, 21, 34, __', options: ['52', '55', '57', '60'], answer: '55' },
  { q: 'What comes next? 1, 2, 6, 42, __', options: ['1800', '1806', '1812', '1818'], answer: '1806' },
  { q: 'What comes next? 2, 10, 40, 140, __', options: ['460', '480', '500', '520'], answer: '480' },
  { q: 'What comes next? 1, 3, 13, 63, __', options: ['310', '313', '316', '319'], answer: '313' },
  { q: 'What comes next? 4, 12, 48, 240, __', options: ['1400', '1440', '1480', '1520'], answer: '1440' },
  { q: 'What comes next? 1, 8, 57, 448, __', options: ['3580', '3585', '3590', '3595'], answer: '3585' },
  { q: 'What comes next? 2, 6, 24, 120, 720, __', options: ['4040', '4320', '5040', '5760'], answer: '5040' },
  { q: 'What comes next? 1, 2, 4, 14, 34, __', options: ['84', '88', '92', '96'], answer: '88' },
  { q: 'What comes next? 3, 11, 43, 171, __', options: ['680', '683', '686', '689'], answer: '683' },
  { q: 'What comes next? 1, 5, 25, 125, 625, __', options: ['2500', '3000', '3125', '3750'], answer: '3125' },
  { q: 'What comes next? 2, 14, 98, 686, __', options: ['4800', '4802', '4806', '4810'], answer: '4802' },
  { q: 'What comes next? 1, 3, 7, 21, 43, __', options: ['127', '129', '131', '133'], answer: '129' },
  { q: 'What comes next? 4, 8, 24, 96, 480, __', options: ['2760', '2880', '3000', '3120'], answer: '2880' },
  { q: 'What comes next? 1, 2, 5, 26, __', options: ['675', '677', '679', '681'], answer: '677' },
  { q: 'What comes next? 3, 6, 18, 72, 360, __', options: ['1980', '2100', '2160', '2220'], answer: '2160' },
  { q: 'What comes next? 1, 4, 27, 256, __', options: ['3000', '3125', '3250', '3375'], answer: '3125' },
  { q: 'What comes next? 2, 12, 72, 432, __', options: ['2590', '2592', '2594', '2596'], answer: '2592' },
  { q: 'What comes next? 1, 6, 36, 216, __', options: ['1290', '1295', '1296', '1300'], answer: '1296' },
  { q: 'What comes next? 5, 15, 45, 135, __', options: ['395', '400', '405', '410'], answer: '405' },
  { q: 'What comes next? 1, 2, 3, 5, 11, 23, __', options: ['45', '47', '49', '51'], answer: '47' },
  { q: 'What comes next? 2, 6, 30, 210, __', options: ['1840', '1848', '1860', '1890'], answer: '1890' },
  { q: 'What comes next? 1, 7, 49, 343, __', options: ['2400', '2401', '2402', '2403'], answer: '2401' },
  { q: 'What comes next? 3, 9, 81, 6561, __', options: ['43046720', '43046721', '43046722', '43046723'], answer: '43046721' },
  { q: 'What comes next? 1, 3, 5, 15, 17, 51, __', options: ['53', '55', '57', '59'], answer: '53' },
  { q: 'What comes next? 2, 4, 16, 256, __', options: ['65534', '65535', '65536', '65537'], answer: '65536' },
  { q: 'What comes next? 1, 2, 4, 8, 16, 32, 64, 128, __', options: ['192', '224', '256', '288'], answer: '256' },
  { q: 'What comes next? 3, 7, 13, 21, 31, 43, __', options: ['55', '57', '59', '61'], answer: '57' },
  { q: 'What comes next? 1, 4, 9, 16, 25, 36, 49, 64, __', options: ['72', '81', '90', '100'], answer: '81' },
  { q: 'What comes next? 2, 3, 5, 7, 11, 13, 17, 19, __', options: ['21', '22', '23', '24'], answer: '23' },
  { q: 'What comes next? 1, 1, 2, 3, 5, 8, 13, 21, 34, __', options: ['50', '52', '55', '58'], answer: '55' },
  { q: 'What comes next? 4, 7, 13, 25, 49, __', options: ['95', '97', '99', '101'], answer: '97' },
  { q: 'What comes next? 1, 2, 6, 24, 120, 720, 5040, __', options: ['35280', '40320', '45360', '50400'], answer: '40320' },
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
    const usedTexts = new Set<string>();

    for (let i = 0; i < count; i++) {
      let text = '';
      let answer = 0;
      let tries = 0;

      do {
        const a = Math.floor(rand() * (max - min + 1)) + min;
        const b = Math.floor(rand() * (max - min + 1)) + min;

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
        tries++;
      } while (usedTexts.has(text) && tries < 50);

      usedTexts.add(text);

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
    // Shuffle the full bank using seeded random, then take first `count` items
    const indices = Array.from({ length: bank.length }, (_, i) => i);
    for (let j = indices.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [indices[j], indices[k]] = [indices[k], indices[j]];
    }
    const take = Math.min(count, bank.length);
    for (let i = 0; i < take; i++) {
      const item = bank[indices[i]];
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
    const indices = Array.from({ length: bank.length }, (_, i) => i);
    for (let j = indices.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [indices[j], indices[k]] = [indices[k], indices[j]];
    }
    const take = Math.min(count, bank.length);
    for (let i = 0; i < take; i++) {
      const item = bank[indices[i]];
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
    const indices = Array.from({ length: bank.length }, (_, i) => i);
    for (let j = indices.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [indices[j], indices[k]] = [indices[k], indices[j]];
    }
    const take = Math.min(count, bank.length);
    for (let i = 0; i < take; i++) {
      const item = bank[indices[i]];
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

export function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const DEFAULT_CONFIG: GameConfig = {
  topic: 'addition',
  difficulty: 'easy',
  questionCount: 10,
  timePerQuestion: 20,
  teamAName: 'Team Alpha',
  teamBName: 'Team Beta',
};