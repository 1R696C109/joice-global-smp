import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, Shield, Award, ChevronRight, RotateCcw, Volume2, VolumeX, AlertTriangle, CheckCircle2, Swords, Radio } from 'lucide-react';
import { StoryChapter, StoryChoice, PlayerState, HeroProfile } from '../types/game';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

interface Props {
  chapter: StoryChapter;
  playerState: PlayerState;
  hero: HeroProfile;
  onChoiceSelected: (choice: StoryChoice) => void;
  onNextChapter: () => void;
  onRestartGame: () => void;
  onOpenTeacherScroll: (initialTab?: 'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive') => void;
  onOpenBossDuel: () => void;
}

export const StoryView: React.FC<Props> = ({
  chapter,
  playerState,
  hero,
  onChoiceSelected,
  onNextChapter,
  onRestartGame,
  onOpenTeacherScroll,
  onOpenBossDuel,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [shakeCard, setShakeCard] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const isCurrentChapterSolved = playerState.solvedProblems.includes(chapter.id);

  // Subscribe to speech state for animated voice waves
  useEffect(() => {
    const unsub = speech.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, []);

  // Voice narration functions
  const handleSpeakDialogue = () => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      return;
    }
    const fullSpeechText = `${chapter.speaker.name} berkata: ${chapter.narrative.join(' ')}`;
    speech.speak(fullSpeechText, chapter.speaker.voiceType);
  };

  const handleSpeakProblem = () => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      return;
    }
    const problemText = `Tantangan rahasia: ${chapter.disguisedChallenge.storyProblem}. Mantra matematika: ${chapter.disguisedChallenge.mathQuestion}.`;
    speech.speak(problemText, chapter.speaker.voiceType);
  };

  const handleSpeakRhyme = () => {
    sound.playClick();
    if (isSpeaking) {
      speech.stop();
      return;
    }
    const rhymeText = `Dengarkan pantun perkalian ini: ${chapter.mnemonicTrick.rhyme}`;
    speech.speak(rhymeText, 'bubo');
  };

  const handleSelectChoice = (choice: StoryChoice) => {
    setSelectedChoice(choice);
    onChoiceSelected(choice);

    if (choice.isCorrect) {
      sound.playCorrect();
      speech.speak(`Mantra benar! ${choice.outcomeText}`, chapter.speaker.voiceType);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      sound.playWrong();
      speech.speak(`Mantra melenceng! ${choice.explanation}`, chapter.speaker.voiceType);
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
    }
  };

  const getGemBorder = (num: number) => {
    if (num === 6) return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30';
    if (num === 7) return 'border-blue-500/40 text-blue-400 bg-blue-950/30';
    if (num === 8) return 'border-purple-500/40 text-purple-400 bg-purple-950/30';
    return 'border-amber-500/40 text-amber-400 bg-amber-950/30';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Chapter Banner & Ambient Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-slate-950">
          <img
            src="/src/assets/images/quest_castle_gate_1793602567208.jpg"
            alt="Pintu Gerbang Petualangan Ksatria Hitung"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-70 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getGemBorder(chapter.targetNumber)}`}>
              Tantangan Perkalian Angka {chapter.targetNumber}
            </span>
            <span className="text-xs text-slate-300 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/60">
              📍 {chapter.location}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white tracking-wide text-balance">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-1">
              {chapter.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Character Info Banner */}
      <div className="p-3 px-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-amber-400 font-bold">Ksatria Aktif:</span>
          <span className="font-semibold text-slate-200">{hero.name} ({hero.title})</span>
          <span className="hidden sm:inline text-slate-400">· {hero.specialSkill}</span>
        </div>
        <button
          onClick={onOpenBossDuel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold transition-colors shadow-sm"
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>Tantangan Duel Gerbang</span>
        </button>
      </div>

      {/* Speaker Dialogue & Story Narration */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          
          {/* Speaker Avatar */}
          <div className="relative shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 bg-slate-950 shadow-md ${
              isSpeaking ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-amber-500/40'
            }`}>
              <img
                src={chapter.speaker.avatar}
                alt={chapter.speaker.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow">
                <Radio className="w-3 h-3 animate-pulse" /> Bicara
              </span>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 text-base sm:text-lg">
                  {chapter.speaker.name}
                </span>
                <span className="text-[11px] text-slate-400">· {chapter.speaker.role}</span>
              </div>

              {/* Character Voice Action Button */}
              <button
                onClick={handleSpeakDialogue}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title="Dengarkan dialog karakter bersuara bahasa Indonesia"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-slate-950' : 'text-amber-400'}`} />
                <span>{isSpeaking ? 'Hentikan Suara' : 'Dengarkan Suara Karakter'}</span>
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {chapter.narrative.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The Disguised Math Challenge Box */}
      <div className={`p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 shadow-xl transition-transform ${shakeCard ? 'translate-x-1 animate-pulse' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white font-serif">
              Teka-Teki Penghalang Gerbang
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakProblem}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700"
              title="Dengarkan teka-teki dibacakan"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Dengarkan Soal</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Tutup Trik Guru' : 'Lihat Trik Jembatan Keledai'}
            </button>
          </div>
        </div>

        {/* Narrative Story Problem */}
        <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed mb-4">
          "{chapter.disguisedChallenge.storyProblem}"
        </p>

        {/* Math Translation Clue */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Mantra Matematika:</span>
            <span className="font-mono text-white font-bold text-sm">{chapter.disguisedChallenge.mathQuestion}</span>
          </span>
          <span className="text-slate-400 italic">
            Petunjuk: {chapter.disguisedChallenge.contextClue}
          </span>
        </div>

        {/* Teacher's Hint Accordion */}
        {showHint && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3 animate-fade-in text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 font-serif">
                📜 {chapter.mnemonicTrick.title}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSpeakRhyme}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-3 h-3" />
                  Dengarkan Pantun
                </button>
                <button
                  onClick={() => onOpenTeacherScroll(
                    chapter.targetNumber === 9 ? 'nineTrick' : chapter.targetNumber === 8 ? 'distributive' : 'jarimatika'
                  )}
                  className="text-[11px] text-amber-400 underline hover:text-amber-300 font-semibold"
                >
                  Buka Kitab Lengkap ➔
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="text-emerald-400 font-semibold block mb-0.5">💡 Kaidah Berhitung:</span>
              {chapter.mnemonicTrick.rule}
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-amber-200 italic font-serif">
              <span className="text-amber-400 font-semibold not-italic block mb-0.5 font-sans">🎵 Rima Pantun:</span>
              "{chapter.mnemonicTrick.rhyme}"
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="text-blue-400 font-semibold block mb-0.5">✋ Metode Jarimatika / Trik Jari:</span>
              {chapter.mnemonicTrick.technique}
            </div>
          </div>
        )}

        {/* Choice Buttons (A, B, C) */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tentukan Pilihan Mantramu (Klik Jawaban):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {chapter.choices.map((choice) => {
              const isSelected = selectedChoice?.id === choice.id;
              let btnStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

              if (selectedChoice) {
                if (choice.isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30';
                } else if (isSelected && !choice.isCorrect) {
                  btnStyle = 'bg-red-950/80 border-red-400 text-red-200 ring-2 ring-red-500/30';
                }
              }

              return (
                <button
                  key={choice.id}
                  disabled={isCurrentChapterSolved}
                  onClick={() => handleSelectChoice(choice)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${btnStyle}`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold font-mono text-xs text-white">
                      {choice.id}
                    </span>
                    {choice.isCorrect && selectedChoice && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {isSelected && !choice.isCorrect && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-sm block">
                      {choice.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      {choice.mathExpression}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Outcome Feedback Card */}
        {selectedChoice && (
          <div className={`mt-6 p-4 rounded-xl border animate-fade-in ${
            selectedChoice.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
              : 'bg-red-950/40 border-red-500/40 text-red-100'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {selectedChoice.isCorrect ? (
                <>
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Mantra Berhasil Dilafalkan! Gerbang Terbuka!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>Mantra Melenceng! Coba Ingat Trik Guru!</span>
                </>
              )}
            </div>
            
            <p className="text-xs sm:text-sm mt-1 leading-relaxed">
              {selectedChoice.outcomeText}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-amber-300 block mb-0.5">Penjelasan Guru SD:</span>
              {selectedChoice.explanation}
            </div>

            {/* Next Chapter or Retry Actions */}
            <div className="mt-4 flex items-center justify-end gap-3">
              {!selectedChoice.isCorrect && playerState.hp > 0 && (
                <button
                  onClick={() => {
                    speech.stop();
                    sound.playClick();
                    setSelectedChoice(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Coba Pilih Ulang
                </button>
              )}

              {selectedChoice.isCorrect && (
                <button
                  onClick={() => {
                    speech.stop();
                    sound.playClick();
                    setSelectedChoice(null);
                    setShowHint(false);
                    onNextChapter();
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-950 whitespace-nowrap"
                >
                  <span>Lanjutkan ke Babak Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
