/**
 * Speech Synthesis Service Adapter
 */
export class SpeechSynthesisService {
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static cancel(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  static speak(text: string, onEnd?: () => void, rate: number = 0.95): void {
    if (!this.isSupported()) {
      console.warn('Text-to-speech is not supported in this browser.');
      onEnd?.();
      return;
    }

    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }
}
