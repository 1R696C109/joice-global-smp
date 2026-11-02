import React, { useState } from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive';
}

export const TeacherScrollModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'jarimatika',
}) => {
  const [activeTab, setActiveTab] = useState<'jarimatika' | 'nineTrick' | 'rhymes' | 'distributive'>(initialTab);

  // Jarimatika interactive state
  const [leftNumber, setLeftNumber] = useState<number>(7);
  const [rightNumber, setRightNumber] = useState<number>(8);

  // 9 Trick interactive finger state (1 to 10)
  const [foldFingerNine, setFoldFingerNine] = useState<number>(7); // 9 x 7

  if (!isOpen) return null;

  // Jarimatika calculation
  // Base 5 representation: 6 -> 1 open, 4 folded; 7 -> 2 open, 3 folded; 8 -> 3 open, 2 folded; 9 -> 4 open, 1 folded
  const leftOpen = leftNumber - 5;
  const leftFolded = 5 - leftOpen;
  const rightOpen = rightNumber - 5;
  const rightFolded = 5 - rightOpen;

  const totalOpen = leftOpen + rightOpen;
  const tens = totalOpen * 10;
  const units = leftFolded * rightFolded;
  const totalJarimatika = tens + units;

  // 9 trick calculation
  const leftFingers9 = foldFingerNine - 1;
  const rightFingers9 = 10 - foldFingerNine;
  const totalNine = leftFingers9 * 10 + rightFingers9;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header with Scholar Aesthetic */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300 font-serif tracking-wide">
                Kitab Rahasia Matematika SD
              </h2>
              <p className="text-xs text-slate-400">
                Koleksi Jembatan Keledai, Rima, & Trik Cepat Perkalian 6–9 oleh Guru Matematika
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup Kitab"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('jarimatika');
            }}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'jarimatika'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            ✋ Jarimatika Interaktif (6–9)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('nineTrick');
            }}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'nineTrick'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            ✨ Keajaiban 10 Jari Angka 9
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('rhymes');
            }}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'rhymes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            🎵 Pantun & Jembatan Keledai
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('distributive');
            }}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'distributive'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            ⚡ Trik Pecah & Gandakan
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: JARIMATIKA INTERAKTIF */}
          {activeTab === 'jarimatika' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-slate-200 leading-relaxed">
                <span className="font-bold text-amber-300">Konsep Guru SD: </span>
                Anak-anak tidak perlu menghafal mati! Kedua tangan kita adalah kalkulator tercanggih. Jari tangan mewakili angka 6, 7, 8, dan 9.
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-emerald-400 font-semibold block">1. Jari Tegak = Puluhan</span>
                    Tiap jari yang berdiri bernilai 10. Jumlahkan jari tegak tangan kiri & kanan.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-amber-400 font-semibold block">2. Jari Ditekuk = Satuan</span>
                    Hitung jari yang ditekuk di kiri dan kanan, lalu kalikan keduanya.
                  </div>
                </div>
              </div>

              {/* Number Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Tangan Kiri (Angka Pertama)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          sound.playClick();
                          setLeftNumber(n);
                        }}
                        className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                          leftNumber === n
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Tangan Kanan (Angka Kedua)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          sound.playClick();
                          setRightNumber(n);
                        }}
                        className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                          rightNumber === n
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-950'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Hands Simulation */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>Visualisasi Jari ({leftNumber} × {rightNumber})</span>
                  <span className="text-amber-400 font-mono">Hasil: {totalJarimatika}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left hand details */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-semibold text-emerald-400 mb-2">
                      Tangan Kiri: Angka {leftNumber}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400">Jari Tegak:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: leftOpen }).map((_, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            👆 1 Jari (10)
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Jari Ditekuk:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: leftFolded }).map((_, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                            ✊ 1
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right hand details */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-semibold text-blue-400 mb-2">
                      Tangan Kanan: Angka {rightNumber}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400">Jari Tegak:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: rightOpen }).map((_, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            👆 1 Jari (10)
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Jari Ditekuk:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: rightFolded }).map((_, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                            ✊ 1
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Formula Output */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-slate-700">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                    Langkah Perhitungan Cepat:
                  </div>
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>1. Puluhan = ({leftOpen} + {rightOpen}) jari tegak × 10</span>
                      <span className="font-mono font-bold text-emerald-400">= {tens}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>2. Satuan = {leftFolded} jari ditekuk × {rightFolded} jari ditekuk</span>
                      <span className="font-mono font-bold text-blue-400">= {units}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-white font-bold text-sm sm:text-base">
                      <span>Total ({leftNumber} × {rightNumber}) = {tens} + {units}</span>
                      <span className="font-mono text-amber-300 text-lg">{totalJarimatika}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEAJAIBAN ANGKA 9 */}
          {activeTab === 'nineTrick' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-slate-200 leading-relaxed">
                <span className="font-bold text-purple-300">Trik Sulap 10 Jari Angka 9: </span>
                Rentangkan 10 jarimu menghadap wajahmu (nomor 1 dari kelingking kiri sampai nomor 10 kelingking kanan).
                Tekuk jari sesuai angka pengali. Jari di kiri jari yang ditekuk adalah <strong className="text-purple-300">PULUHAN</strong>, dan jari di sebelah kanan adalah <strong className="text-pink-300">SATUAN</strong>!
              </div>

              {/* Finger selector 1 to 10 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 block mb-3">
                  Pilih Angka Pengali untuk 9 × N (Klik Nomor Jari yang Ditekuk):
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        sound.playClick();
                        setFoldFingerNine(n);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
                        foldFingerNine === n
                          ? 'bg-purple-600 border-purple-300 text-white shadow-lg shadow-purple-950 scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-base mb-1">{foldFingerNine === n ? '👇' : '👆'}</span>
                      <span className="font-bold">Jari {n}</span>
                      <span className="text-[10px] text-slate-400">9 × {n}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result explanation */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-300 font-serif">
                    Hasil Analisis: 9 × {foldFingerNine} = {totalNine}
                  </h3>
                  <span className="text-xs text-purple-400 font-mono">
                    Digit ({leftFingers9} + {rightFingers9} = 9)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/40">
                    <span className="text-xs text-purple-300 block mb-1">Sebelah Kiri Jari Tertekuk</span>
                    <span className="text-2xl font-bold font-mono text-purple-300">{leftFingers9}</span>
                    <span className="text-xs text-slate-400 block mt-1">Jari (Puluhan = {leftFingers9 * 10})</span>
                  </div>

                  <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-800/40">
                    <span className="text-xs text-pink-300 block mb-1">Jari yang Ditekuk</span>
                    <span className="text-2xl font-bold font-mono text-pink-300">#{foldFingerNine}</span>
                    <span className="text-xs text-slate-400 block mt-1">(Pemisah Angka)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40">
                    <span className="text-xs text-amber-300 block mb-1">Sebelah Kanan Jari Tertekuk</span>
                    <span className="text-2xl font-bold font-mono text-amber-300">{rightFingers9}</span>
                    <span className="text-xs text-slate-400 block mt-1">Jari (Satuan = {rightFingers9})</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-emerald-400">✨ Pola Super Angka 9:</p>
                  <p>• Puluhan selalu berkurang 1 dari angka pengali: ({foldFingerNine} - 1 = {leftFingers9}).</p>
                  <p>• Jumlah digit hasil selalu sama dengan 9: ({leftFingers9} + {rightFingers9} = 9).</p>
                  <p>• Jadi jika puluhannya {leftFingers9}, satuannya pasti {9 - leftFingers9}! Mudah sekali bukan?</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PANTUN & JEMBATAN KELEDAI */}
          {activeTab === 'rhymes' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300">
                💡 <strong className="text-blue-300">Metode Memori Auditori:</strong> Otak anak-anak sangat mudah mengingat irama dan rima sajak. Coba ucapkan pantun-pantun ini berulang kali saat santai!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    calc: '6 × 6 = 36',
                    rhyme: 'Enam kali enam tiga puluh enam, katak melompat ke danau yang tenang!',
                    tip: 'Batu Zamrud Angka 6',
                    badgeColor: 'border-emerald-500/40 text-emerald-300',
                  },
                  {
                    calc: '6 × 7 = 42',
                    rhyme: 'Enam kali tujuh empat puluh dua, makan pisang goreng manis berdua!',
                    tip: 'Pecah 5: (5 × 7) + 7 = 35 + 7 = 42',
                    badgeColor: 'border-emerald-500/40 text-emerald-300',
                  },
                  {
                    calc: '6 × 8 = 48',
                    rhyme: 'Enam kali delapan empat puluh delapan, burung berkicau riang di waktu sarapan!',
                    tip: 'Pecah 5: (5 × 8) + 8 = 40 + 8 = 48',
                    badgeColor: 'border-emerald-500/40 text-emerald-300',
                  },
                  {
                    calc: '7 × 7 = 49',
                    rhyme: 'Tujuh kali tujuh empat puluh sembilan, ksatria melangkah gagah di bawah rembulan!',
                    tip: 'Bilangan kuadrat angka 7',
                    badgeColor: 'border-blue-500/40 text-blue-300',
                  },
                  {
                    calc: '7 × 8 = 56',
                    rhyme: 'Urutan Emas: 5, 6, 7, 8! Lima Enam Tujuh Delapan ➔ 56 = 7 × 8!',
                    tip: 'Trik paling viral & paling cepat di dunia!',
                    badgeColor: 'border-blue-500/40 text-blue-300',
                  },
                  {
                    calc: '8 × 8 = 64',
                    rhyme: 'Delapan kali delapan enam puluh empat, ksatria berlari gesit dan sangat cepat!',
                    tip: 'Lipat 3: 8 ➔ 16 ➔ 32 ➔ 64',
                    badgeColor: 'border-purple-500/40 text-purple-300',
                  },
                  {
                    calc: '9 × 6 = 54',
                    rhyme: 'Sembilan kali enam lima puluh empat, api unggun menghangatkan ksatria hebat!',
                    tip: 'Digit 5 + 4 = 9',
                    badgeColor: 'border-amber-500/40 text-amber-300',
                  },
                  {
                    calc: '9 × 7 = 63',
                    rhyme: 'Sembilan kali tujuh enam puluh tiga, buah mangga manis dipetik di kebun warga!',
                    tip: 'Digit 6 + 3 = 9',
                    badgeColor: 'border-amber-500/40 text-amber-300',
                  },
                  {
                    calc: '9 × 8 = 72',
                    rhyme: 'Sembilan kali delapan tujuh puluh dua, damai abadi menyelimuti kerajaan kita semua!',
                    tip: 'Digit 7 + 2 = 9',
                    badgeColor: 'border-amber-500/40 text-amber-300',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                        {item.calc}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.tip}</span>
                    </div>
                    <p className="text-sm text-amber-200 font-serif italic">
                      "{item.rhyme}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: METODE PECAH & GANDAKAN */}
          {activeTab === 'distributive' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-slate-200">
                <span className="font-bold text-emerald-300">Trik Nalar Matematika (Sifat Distributif): </span>
                Anak-anak kelas 3–5 SD sangat mahir perkalian 2 dan 5! Manfaatkan modal itu untuk menyelesaikan perkalian besar tanpa menghafal membosankan.
              </div>

              {/* Trick 1: Angka 6 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 1. Trik Pecah 5 untuk Perkalian 6
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Angka 6 adalah gabungan dari <span className="text-emerald-400 font-bold">5 + 1</span>. Karena perkalian 5 sangat mudah (angka belakang 0 atau 5), kalikan dengan 5 dulu, lalu tambahkan sisa 1 kali angkanya!
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
                  <span className="text-slate-400">Contoh:</span> 6 × 8 = (5 × 8) + (1 × 8) = 40 + 8 = <span className="text-amber-300 font-bold">48</span>
                  <br />
                  <span className="text-slate-400">Contoh:</span> 6 × 7 = (5 × 7) + (1 × 7) = 35 + 7 = <span className="text-amber-300 font-bold">42</span>
                </div>
              </div>

              {/* Trick 2: Angka 8 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 2. Trik Double-Double-Double untuk Perkalian 8
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Angka 8 adalah <span className="text-blue-400 font-bold">2 × 2 × 2</span>. Cukup gandakan (tambahkan ke dirinya sendiri) sebanyak 3 kali berturut-turut!
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
                  <span className="text-slate-400">Contoh:</span> 8 × 7
                  <br />• Gandakan ke-1: 7 + 7 = 14
                  <br />• Gandakan ke-2: 14 + 14 = 28
                  <br />• Gandakan ke-3: 28 + 28 = <span className="text-amber-300 font-bold">56</span>!
                </div>
              </div>

              {/* Trick 3: Angka 7 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 3. Jembatan Keledai 5, 6, 7, 8
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Perkalian yang paling sering membuat anak SD bingung adalah <span className="text-amber-400 font-bold">7 × 8</span>. Cukup ajarkan mereka menghitung maju:
                </p>
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-center font-mono text-base text-amber-300 font-bold">
                  5, 6, 7, 8  ➔  56 = 7 × 8
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Ksatria dapat membuka Kitab ini kapan saja saat bertualang.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Tutup & Lanjutkan Petualangan
          </button>
        </div>

      </div>
    </div>
  );
};
