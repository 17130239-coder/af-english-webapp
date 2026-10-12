/**
 * Browser Web Speech API Audio Synthesis Utility
 */

export function speakEnglish(
  text: string,
  onEnd?: () => void,
  rate: number = 0.95
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate; // Support customizable speaking rate (e.g. 1.0x, 0.75x)

  // Select high-quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice =
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
    voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
