import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  onBackToStory: () => void;
  onOpenTeacherScroll: (initialTab?: 'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive') => void;
}

interface Question {
  factorA: number;
  factorB: number;
  answer: number;
  options: number[];
  hint: string;
}

export const PracticeArena: React.FC<Props> = ({ onBackToStory, onOpenTeacherScroll }) => {
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Generate question
  const generateNewQuestion = (mult: number | 'all') => {
    const a = mult === 'all' ? [6, 7, 8, 9][Math.floor(Math.random() * 4)] : mult;
    const b = Math.floor(Math.random() * 5) + 5; // between 5 and 9
    const ans = a * b;

    // Generate 3 plausible multiple choices
    const optionsSet = new Set<number>();
    optionsSet.add(ans);

    while (optionsSet.size < 3) {
      const delta = (Math.floor(Math.random() * 5) - 2) * a;
      const candidate = ans + delta;
      if (candidate > 0 && candidate !== ans) {
        optionsSet.add(candidate);
      } else {
        optionsSet.add(ans + (Math.random() > 0.5 ? 6 : -6));
      }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    let hint = '';
    if (a === 9 || b === 9) {
      const target = a === 9 ? b : a;
      hint = `Trik 9: Jumlah digit selalu 9! Puluhannya adalah (${target} - 1 = ${target - 1}), satuannya (${9 - (target - 1)}).`;
    } else if ((a === 7 && b === 8) || (a === 8 && b === 7)) {
      hint = 'Ingat urutan emas beruntun: 5, 6, 7, 8 ➔ 56 = 7 × 8!';
    } else if (a === 8 || b === 8) {
      const target = a === 8 ? b : a;
      hint = `Trik Lipat Tiga: Gandakan 3 kali! (${target} ➔ ${target * 2} ➔ ${target * 4} ➔ ${target * 8}).`;
    } else if (a === 6 || b === 6) {
      const target = a === 6 ? b : a;
      hint = `Trik Pecah 5: Hitung (5 × ${target}) = ${5 * target}, lalu tambahkan ${target}!`;
    }

    setCurrentQuestion({
      factorA: a,
      factorB: b,
      answer: ans,
      options,
      hint,
    });
    setSelectedAnswer(null);
    setShowHint(false);
  };

  useEffect(() => {
    generateNewQuestion(selectedMultiplier);
  }, [selectedMultiplier]);

  const handleAnswer = (val: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;
    setSelectedAnswer(val);

    if (val === currentQuestion.answer) {
      sound.playCorrect();
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // fallback
      }
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-amber-300">
            Arena Latihan Mandiri (Golem Angka)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Uji refleks hitung dan terapkan trik matematika SD tanpa batas waktu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400">Skor: </span>
            <span className="font-bold text-amber-300 font-mono">{score}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400">Streak: </span>
            <span className="font-bold text-emerald-400 font-mono">{streak} 🔥</span>
          </div>
        </div>
      </div>

      {/* Multiplier Filter */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto text-xs">
        <span className="text-slate-400 px-3 whitespace-nowrap">Fokus Angka:</span>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedMultiplier('all');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedMultiplier === 'all'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Campuran (6–9)
        </button>
        {[6, 7, 8, 9].map((m) => (
          <button
            key={m}
            onClick={() => {
              sound.playClick();
              setSelectedMultiplier(m);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedMultiplier === m
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Perkalian {m}
          </button>
        ))}
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tantangan Refleks Golem</span>
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Tutup Petunjuk' : 'Buka Petunjuk Trik'}
            </button>
          </div>

          {/* Large math formula */}
          <div className="py-4">
            <span className="text-4xl sm:text-6xl font-extrabold font-mono tracking-wider text-white">
              {currentQuestion.factorA} × {currentQuestion.factorB} = ?
            </span>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 text-left animate-fade-in">
              <span className="font-bold block mb-1">💡 Trik Cepat Guru SD:</span>
              {currentQuestion.hint}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuestion.answer;
              let style = 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-red-950 border-red-400 text-red-200 ring-2 ring-red-500/30';
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(opt)}
                  className={`py-4 text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Next Question / Feedback */}
          {selectedAnswer !== null && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between animate-fade-in">
              <div className="text-left text-xs sm:text-sm">
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="text-emerald-400 font-bold">
                    Tepat sekali! {currentQuestion.factorA} × {currentQuestion.factorB} = {currentQuestion.answer}!
                  </span>
                ) : (
                  <span className="text-red-400 font-medium">
                    Kurang tepat. Jawaban yang benar adalah {currentQuestion.answer}.
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  generateNewQuestion(selectedMultiplier);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Back Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onBackToStory();
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          ← Kembali ke Petualangan Utama
        </button>
        <button
          onClick={() => onOpenTeacherScroll()}
          className="text-xs text-amber-400 underline hover:text-amber-300 font-semibold"
        >
          Buka Kitab Rahasia (Jarimatika & Pantun) ➔
        </button>
      </div>
    </div>
  );
};
