export type CharacterVoice = 'bubo' | 'golem' | 'marina' | 'ferrum' | 'phoenix' | 'hero' | 'boss';

class SpeechManager {
  public enabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  public subscribe(cb: (isSpeaking: boolean) => void) {
    this.onStateChangeListeners.push(cb);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== cb);
    };
  }

  private notify(isSpeaking: boolean) {
    this.onStateChangeListeners.forEach((l) => l(isSpeaking));
  }

  public speak(text: string, voiceType: CharacterVoice = 'bubo') {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian voice

      // Voice modulation for character roles
      switch (voiceType) {
        case 'bubo':
          utterance.pitch = 0.95;
          utterance.rate = 0.95;
          break;
        case 'golem':
          utterance.pitch = 0.65;
          utterance.rate = 0.85;
          break;
        case 'marina':
          utterance.pitch = 1.2;
          utterance.rate = 1.0;
          break;
        case 'ferrum':
          utterance.pitch = 0.7;
          utterance.rate = 0.9;
          break;
        case 'phoenix':
          utterance.pitch = 1.25;
          utterance.rate = 1.05;
          break;
        case 'hero':
          utterance.pitch = 1.15;
          utterance.rate = 1.05;
          break;
        case 'boss':
          utterance.pitch = 0.55;
          utterance.rate = 0.8;
          break;
      }

      // Try to find Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.startsWith('in'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.notify(false);
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        this.notify(false);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.notify(false);
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const speech = new SpeechManager();
