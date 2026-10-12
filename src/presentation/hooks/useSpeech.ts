'use client';

import { useState, useCallback } from 'react';
import { SpeechSynthesisService } from '@/infrastructure/services/speech-synthesis.service';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);

  const speak = useCallback((text: string) => {
    setIsPlaying(true);
    setPlayingText(text);

    SpeechSynthesisService.speak(text, () => {
      setIsPlaying(false);
      setPlayingText(null);
    });
  }, []);

  const stop = useCallback(() => {
    SpeechSynthesisService.cancel();
    setIsPlaying(false);
    setPlayingText(null);
  }, []);

  return {
    isPlaying,
    playingText,
    speak,
    stop,
  };
}
