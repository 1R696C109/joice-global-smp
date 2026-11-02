/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, Award, BookOpen, Swords, Heart, CheckCircle2 } from 'lucide-react';
import { STORY_CHAPTERS, INITIAL_GEMS, HERO_PROFILES } from './data/storyData';
import { PlayerState, StoryChoice, GemId, HeroProfile } from './types/game';
import { StoryView } from './components/StoryView';
import { PracticeArena } from './components/PracticeArena';
import { InventoryBar } from './components/InventoryBar';
import { TeacherScrollModal } from './components/TeacherScrollModal';
import { HeroSelectionModal } from './components/HeroSelectionModal';
import { BossDuelModal } from './components/BossDuelModal';
import { sound } from './utils/sound';
import { speech } from './utils/speech';

export default function App() {
  const [gameState, setGameState] = useState<'PLAYING' | 'VICTORY' | 'GAME_OVER'>('PLAYING');
  const [activeView, setActiveView] = useState<'story' | 'practice'>('story');
  
  // Modals
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState<boolean>(false);
  const [isBossDuelOpen, setIsBossDuelOpen] = useState<boolean>(false);
  const [teacherModalTab, setTeacherModalTab] = useState<'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive'>('jarimatika');

  const [playerState, setPlayerState] = useState<PlayerState>({
    hero: HERO_PROFILES[0], // Default: Ksatria Arya
    currentChapterIndex: 0,
    hp: 5,
    maxHp: 5,
    stars: 0,
    collectedGems: {
      emerald_6: false,
      sapphire_7: false,
      amethyst_8: false,
      sunstone_9: false,
    },
    solvedProblems: [],
    audioEnabled: true,
    voiceEnabled: true,
  });

  const currentChapter = STORY_CHAPTERS[playerState.currentChapterIndex] || STORY_CHAPTERS[0];

  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    speech.enabled = sound.enabled;
    setPlayerState((prev) => ({
      ...prev,
      audioEnabled: sound.enabled,
      voiceEnabled: sound.enabled,
    }));
    if (sound.enabled) {
      sound.playClick();
    } else {
      speech.stop();
    }
  };

  const handleOpenTeacherScroll = (tab: 'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive' = 'jarimatika') => {
    setTeacherModalTab(tab);
    setIsTeacherModalOpen(true);
  };

  const handleSelectHero = (hero: HeroProfile) => {
    setPlayerState((prev) => ({
      ...prev,
      hero,
      // If hero has extra HP perk
      hp: hero.id === 'arya' ? 5 : 4,
      maxHp: hero.id === 'arya' ? 5 : 4,
    }));
  };

  const handleChoiceSelected = (choice: StoryChoice) => {
    if (choice.isCorrect) {
      const gemId = currentChapter.gemId;
      setPlayerState((prev) => ({
        ...prev,
        stars: prev.stars + 1,
        collectedGems: {
          ...prev.collectedGems,
          [gemId]: true,
        },
        solvedProblems: [...new Set([...prev.solvedProblems, currentChapter.id])],
      }));
      sound.playGemFound();
    } else {
      const damage = choice.damage || 1;
      setPlayerState((prev) => {
        const nextHp = Math.max(0, prev.hp - damage);
        if (nextHp === 0) {
          setTimeout(() => setGameState('GAME_OVER'), 700);
        }
        return {
          ...prev,
          hp: nextHp,
        };
      });
    }
  };

  const handleNextChapter = () => {
    const nextIdx = playerState.currentChapterIndex + 1;
    if (nextIdx >= STORY_CHAPTERS.length) {
      setGameState('VICTORY');
    } else {
      setPlayerState((prev) => ({
        ...prev,
        currentChapterIndex: nextIdx,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestartGame = () => {
    sound.playClick();
    speech.stop();
    setPlayerState({
      hero: HERO_PROFILES[0],
      currentChapterIndex: 0,
      hp: 5,
      maxHp: 5,
      stars: 0,
      collectedGems: {
        emerald_6: false,
        sapphire_7: false,
        amethyst_8: false,
        sunstone_9: false,
      },
      solvedProblems: [],
      audioEnabled: sound.enabled,
      voiceEnabled: sound.enabled,
    });
    setGameState('PLAYING');
    setActiveView('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBossDuelVictory = () => {
    // Reward player with full health restoration and star bonus
    setPlayerState((prev) => ({
      ...prev,
      hp: prev.maxHp,
      stars: prev.stars + 5,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation & Status Header */}
      <InventoryBar
        playerState={playerState}
        gems={INITIAL_GEMS}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenTeacherScroll={() => handleOpenTeacherScroll('jarimatika')}
        onOpenHeroModal={() => setIsHeroModalOpen(true)}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        
        {/* VIEW 1: GAME OVER SCREEN */}
        {gameState === 'GAME_OVER' && (
          <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-slate-900 border border-red-500/30 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-3xl">
              💔
            </div>
            <h2 className="text-xl font-bold font-serif text-white">
              Hati Keberanian {playerState.hero.name} Habis!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Jangan berkecil hati! Matematika adalah petualangan seru yang butuh latihan. Dengarkan petunjuk suara karakter dan pelajari trik jarimatika di <strong className="text-amber-300">Kitab Rahasia Matematika</strong> sebelum mencoba kembali!
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleRestartGame}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Pulihkan Hati & Coba Lagi
              </button>
              <button
                onClick={() => handleOpenTeacherScroll('jarimatika')}
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                📖 Buka Kitab Rahasia Guru SD
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: VICTORY SCREEN */}
        {gameState === 'VICTORY' && (
          <div className="max-w-2xl mx-auto my-8 p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-4xl">
              👑
            </div>
            
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Lencana Kehormatan Tertinggi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                Grand Master Ksatria Aritmatika!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                Selamat, <strong className="text-amber-300">{playerState.hero.name}</strong>! Engkau telah menaklukkan seluruh rahasia perkalian angka 6, 7, 8, dan 9! Keempat Permata Aritmatika kini bersatu memancarkan kedamaian dan kecerdasan ke seluruh pelosok Arithmantia.
              </p>
            </div>

            {/* Gems showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {INITIAL_GEMS.map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-2xl mb-1">💎</div>
                  <span className="text-xs font-bold text-amber-300 block">{g.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Angka {g.number}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              💡 Pesan Guru: "Ingatlah selalu trik jarimatika dan urutan emas 5, 6, 7, 8! Kamu sekarang sudah siap menghadapi semua soal perkalian di sekolah dengan percaya diri!"
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestartGame}
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Mainkan Kembali Petualangan
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveView('practice');
                  setGameState('PLAYING');
                }}
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Masuk ke Arena Latihan Mandiri ➔
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: ACTIVE PLAYING */}
        {gameState === 'PLAYING' && (
          <>
            {activeView === 'story' ? (
              <StoryView
                chapter={currentChapter}
                playerState={playerState}
                hero={playerState.hero}
                onChoiceSelected={handleChoiceSelected}
                onNextChapter={handleNextChapter}
                onRestartGame={handleRestartGame}
                onOpenTeacherScroll={handleOpenTeacherScroll}
                onOpenBossDuel={() => setIsBossDuelOpen(true)}
              />
            ) : (
              <PracticeArena
                onBackToStory={() => setActiveView('story')}
                onOpenTeacherScroll={handleOpenTeacherScroll}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Petualangan Ksatria Hitung · Dilengkapi Karakter & Narasi Suara Interaktif</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Ksatria: {playerState.hero.name}</span>
            <span>·</span>
            <button
              onClick={() => setIsHeroModalOpen(true)}
              className="text-amber-400 hover:underline"
            >
              Ganti Karakter
            </button>
          </div>
        </div>
      </footer>

      {/* Teacher Scroll Modal (Grimoire) */}
      <TeacherScrollModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        initialTab={teacherModalTab}
      />

      {/* Hero Selection Modal */}
      <HeroSelectionModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        selectedHero={playerState.hero}
        onSelectHero={handleSelectHero}
      />

      {/* Boss Duel Challenge Modal */}
      <BossDuelModal
        isOpen={isBossDuelOpen}
        onClose={() => setIsBossDuelOpen(false)}
        chapter={currentChapter}
        hero={playerState.hero}
        onVictory={handleBossDuelVictory}
      />

    </div>
  );
}
