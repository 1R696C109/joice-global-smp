import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Swords, Timer, Heart, Award, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { StoryChapter, HeroProfile } from '../types/game';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chapter: StoryChapter;
  hero: HeroProfile;
  onVictory: () => void;
}

interface DuelQuestion {
  questionText: string;
  factorA: number;
  factorB: number;
  answer: number;
  options: number[];
}

export const BossDuelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  chapter,
  hero,
  onVictory,
}) => {
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [questions, setQuestions] = useState<DuelQuestion[]>([]);
  const [duelState, setDuelState] = useState<'FIGHTING' | 'WON' | 'LOST'>('FIGHTING');
  const [playerHp, setPlayerHp] = useState<number>(3);
  const [bossHp, setBossHp] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>('');

  const guardianName = chapter.speaker.name;
  const targetNum = chapter.targetNumber;

  // Initialize 3 duel questions tailored to this guardian's target number
  useEffect(() => {
    if (isOpen) {
      const qs: DuelQuestion[] = [6, 7, 8, 9].map((multiplier) => {
        const a = targetNum;
        const b = multiplier;
        const ans = a * b;
        const opts = new Set<number>([ans]);
        while (opts.size < 3) {
          const fake = ans + (Math.floor(Math.random() * 5) - 2) * a;
          if (fake > 0 && fake !== ans) opts.add(fake);
          else opts.add(ans + (Math.random() > 0.5 ? 4 : -4));
        }
        return {
          questionText: `Berapakah hasil dari ${a} × ${b}?`,
          factorA: a,
          factorB: b,
          answer: ans,
          options: Array.from(opts).sort(() => Math.random() - 0.5),
        };
      }).slice(0, 3);

      setQuestions(qs);
      setCurrentRound(0);
      setTimeLeft(15);
      setDuelState('FIGHTING');
      setPlayerHp(3);
      setBossHp(3);
      setFeedback(`Aku, ${guardianName}, mengujimu dalam 3 serangan kilat!`);

      // Character speaks intro
      speech.speak(`Aku ${guardianName}! Buktikan ketangkasan perkalian ${targetNum} milikmu!`, chapter.speaker.voiceType);
    }
  }, [isOpen, chapter, targetNum]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || duelState !== 'FIGHTING') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time out for this question
          handleAnswer(-999);
          return 15;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, duelState, currentRound]);

  const handleAnswer = (ans: number) => {
    if (duelState !== 'FIGHTING') return;
    const curQ = questions[currentRound];
    if (!curQ) return;

    if (ans === curQ.answer) {
      sound.playCorrect();
      const newBossHp = bossHp - 1;
      setBossHp(newBossHp);
      setFeedback(`Serangan mantra tepat! ${curQ.factorA} × ${curQ.factorB} = ${curQ.answer}!`);
      speech.speak(`Bagus! ${curQ.factorA} kali ${curQ.factorB} adalah ${curQ.answer}!`, hero.voiceType);

      if (newBossHp <= 0) {
        setDuelState('WON');
        sound.playGemFound();
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
        } catch {}
        onVictory();
        speech.speak(`Luar biasa! Engkau berhasil menaklukkan tantanganku!`, chapter.speaker.voiceType);
      } else {
        setCurrentRound((r) => r + 1);
        setTimeLeft(15);
      }
    } else {
      sound.playWrong();
      const newPlayerHp = playerHp - 1;
      setPlayerHp(newPlayerHp);
      setFeedback(`Salah! Jawaban yang benar adalah ${curQ.answer}. Bertahanlah!`);
      speech.speak(`Kurang tepat! Hasilnya adalah ${curQ.answer}!`, chapter.speaker.voiceType);

      if (newPlayerHp <= 0) {
        setDuelState('LOST');
      } else {
        setCurrentRound((r) => r + 1);
        setTimeLeft(15);
      }
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentRound];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-serif text-amber-300">
              Tantangan Duel Penjaga: {guardianName}
            </h2>
          </div>
          <button
            onClick={() => {
              speech.stop();
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Combatants Bar */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {/* Player */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-300">{hero.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < playerHp ? 'text-red-500 fill-red-500' : 'text-slate-700'}`}
                />
              ))}
            </div>
          </div>

          {/* Boss */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-400">{guardianName}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border ${
                    i < bossHp ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-800 border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Duel State: FIGHTING */}
        {duelState === 'FIGHTING' && currentQ && (
          <div className="space-y-5 text-center">
            {/* Timer bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-amber-400" /> Waktu:
              </span>
              <span className="font-mono font-bold text-amber-300">{timeLeft} detik</span>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Pertanyaan Cepat {currentRound + 1} dari 3:</p>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider block">
                {currentQ.factorA} × {currentQ.factorB} = ?
              </span>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-3">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="py-3 text-xl font-bold font-mono rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white transition-transform active:scale-95 shadow"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <p className="text-xs text-amber-300 italic animate-fade-in">
                "{feedback}"
              </p>
            )}
          </div>
        )}

        {/* Duel State: WON */}
        {duelState === 'WON' && (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
              🏆
            </div>
            <h3 className="text-xl font-bold font-serif text-amber-300">
              Kemenangan Sempurna!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Engkau berhasil menjawab seluruh tantangan kilat dari {guardianName}! Gelar "Penakluk Gerbang Perkalian {targetNum}" kini tersemat padamu!
            </p>
            <button
              onClick={() => {
                speech.stop();
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
            >
              Tutup & Lanjutkan Petualangan
            </button>
          </div>
        )}

        {/* Duel State: LOST */}
        {duelState === 'LOST' && (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl">
              🛡️
            </div>
            <h3 className="text-xl font-bold font-serif text-red-300">
              Pertahananmu Tertembus!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Mantra {guardianName} masih terlalu cepat. Buka kembali Kitab Rahasia untuk mempertajam trik jarimatika dan ulangi duel!
            </p>
            <button
              onClick={() => {
                speech.stop();
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Kembali Berlatih
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
