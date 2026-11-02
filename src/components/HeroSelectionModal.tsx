import React from 'react';
import { Shield, Sparkles, UserCheck, X, Volume2 } from 'lucide-react';
import { HeroProfile } from '../types/game';
import { HERO_PROFILES } from '../data/storyData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedHero: HeroProfile;
  onSelectHero: (hero: HeroProfile) => void;
}

export const HeroSelectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedHero,
  onSelectHero,
}) => {
  if (!isOpen) return null;

  const handleHeroClick = (hero: HeroProfile) => {
    sound.playClick();
    onSelectHero(hero);
    speech.speak(`Aku ${hero.name}! Mari kita pecahkan rahasia perkalian bersama!`, hero.voiceType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-serif text-amber-300">
              Pilih Karakter Ksatria Aritmatika
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Setiap karakter memiliki kepribadian dan keahlian khusus untuk membantumu berpetualang dan menghafal perkalian:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HERO_PROFILES.map((hero) => {
            const isSelected = selectedHero.id === hero.id;
            return (
              <div
                key={hero.id}
                onClick={() => handleHeroClick(hero)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden border border-amber-500/30 mb-3 bg-slate-900 shadow">
                    <img
                      src={hero.avatar}
                      alt={hero.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-bold text-sm text-white text-center">
                    {hero.name}
                  </h3>
                  <span className="text-[11px] text-amber-400 block text-center mb-2">
                    {hero.title}
                  </span>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {hero.skillDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">✨ {hero.specialSkill}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Karakter terpilih: <strong className="text-amber-300">{selectedHero.name}</strong>
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow"
          >
            Mulai Bertualang dengan {selectedHero.name}
          </button>
        </div>

      </div>
    </div>
  );
};
