import { CharacterVoice } from '../utils/speech';

export type GemId = 'emerald_6' | 'sapphire_7' | 'amethyst_8' | 'sunstone_9';

export interface MagicGem {
  id: GemId;
  name: string;
  number: number;
  colorName: string;
  element: string;
  description: string;
  isCollected: boolean;
  unlockedAtChapter: number;
}

export interface HeroProfile {
  id: 'arya' | 'tara' | 'danu';
  name: string;
  title: string;
  specialSkill: string;
  skillDescription: string;
  avatar: string;
  voiceType: CharacterVoice;
}

export interface StoryChoice {
  id: 'A' | 'B' | 'C';
  label: string;
  mathExpression: string; // e.g., "42 Lonceng (6 × 7)"
  isCorrect: boolean;
  outcomeText: string;
  explanation: string;
  damage?: number;
}

export interface StoryChapter {
  id: number;
  targetNumber: number; // 6, 7, 8, or 9
  gemId: GemId;
  title: string;
  subtitle: string;
  location: string;
  speaker: {
    name: string;
    role: string;
    avatar: string;
    voiceType: CharacterVoice;
  };
  narrative: string[];
  disguisedChallenge: {
    storyProblem: string;
    mathQuestion: string; // "6 × 7 = ?"
    contextClue: string;
  };
  mnemonicTrick: {
    title: string;
    rule: string;
    rhyme: string;
    technique: string;
  };
  choices: StoryChoice[];
  rewardOnSuccess: string;
}

export interface PlayerState {
  hero: HeroProfile;
  currentChapterIndex: number;
  hp: number;
  maxHp: number;
  stars: number;
  collectedGems: Record<GemId, boolean>;
  solvedProblems: number[];
  audioEnabled: boolean;
  voiceEnabled: boolean;
}
