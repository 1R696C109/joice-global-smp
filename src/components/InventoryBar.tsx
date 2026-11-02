import React from 'react';
import { Heart, Volume2, VolumeX, BookOpen, User, Sparkles } from 'lucide-react';
import { PlayerState, MagicGem } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  playerState: PlayerState;
  gems: MagicGem[];
  activeView: 'story' | 'practice';
  setActiveView: (view: 'story' | 'practice') => void;
  onOpenTeacherScroll: () => void;
  onOpenHeroModal: () => void;
  onToggleSound: () => void;
}

export const InventoryBar: React.FC<Props> = ({
  playerState,
  gems,
  activeView,
  setActiveView,
  onOpenTeacherScroll,
  onOpenHeroModal,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Universal Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (Primary Action) */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sound.playClick();
            setActiveView('story');
          }}
          className="text-base sm:text-lg font-bold font-serif tracking-wide text-amber-300 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>⚔️ Ksatria Hitung</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('story');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'story' ? 'text-amber-300 font-bold' : 'hover:text-white'
            }`}
          >
            Petualangan Utama
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('practice');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'practice' ? 'text-amber-300 font-bold' : 'hover:text-white'
            }`}
          >
            Arena Latihan (6–9)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherScroll();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Kitab Rahasia Matematika
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenHeroModal();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-amber-300"
          >
            <User className="w-3.5 h-3.5" />
            <span>Ksatria: {playerState.hero.name}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onToggleSound();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={playerState.audioEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
            aria-label="Toggle Sound"
          >
            {playerState.audioEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHeroModal();
            }}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Ganti Karakter"
          >
            <User className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherScroll();
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kitab Guru SD</span>
            <span className="sm:hidden">Kitab</span>
          </button>
        </div>
      </div>

      {/* Persistent Child HUD: Health, Hero Status & 4 Collected Runes Bar */}
      <div className="bg-slate-900/60 border-t border-slate-850 px-4 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Hearts / HP */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Hati:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: playerState.maxHp }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i < playerState.hp
                      ? 'text-red-500 fill-red-500 drop-shadow'
                      : 'text-slate-750 fill-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400 font-mono ml-1">
              {playerState.hp}/{playerState.maxHp}
            </span>
          </div>

          {/* 4 Magic Gems Inventory */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Batu Permata:</span>
            <div className="flex items-center gap-1.5">
              {gems.map((gem) => {
                const collected = playerState.collectedGems[gem.id];
                let colorClass = 'bg-slate-800 text-slate-600 border-slate-700';

                if (collected) {
                  if (gem.number === 6) colorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950';
                  if (gem.number === 7) colorClass = 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm shadow-blue-950';
                  if (gem.number === 8) colorClass = 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-950';
                  if (gem.number === 9) colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-950';
                }

                return (
                  <div
                    key={gem.id}
                    title={`${gem.name} (Perkalian ${gem.number}): ${collected ? 'Sudah Ditemukan' : 'Belum Ditemukan'}`}
                    className={`px-2 py-0.5 rounded-md border text-[11px] font-bold font-mono flex items-center gap-1 transition-all ${colorClass}`}
                  >
                    <span>{collected ? '💎' : '⚪'}</span>
                    <span>{gem.number}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile view switch buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveView(activeView === 'story' ? 'practice' : 'story');
              }}
              className="text-amber-400 text-[11px] underline font-semibold"
            >
              {activeView === 'story' ? 'Mode Latihan' : 'Kembali ke Cerita'}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
