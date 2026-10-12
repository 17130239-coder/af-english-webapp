'use client';

import { useState, useCallback, useEffect } from 'react';
import { SubtitleCard } from '@/core/entities/card.entity';

export function useFlashcards(cards: SubtitleCard[], isOpen: boolean) {
  const [deck, setDeck] = useState<SubtitleCard[]>(() => cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev < deck.length - 1 ? prev + 1 : prev));
    setIsFlipped(false);
  }, [deck.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsFlipped(false);
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const shuffleDeck = useCallback(() => {
    setDeck((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const updateCardInDeck = useCallback((id: string, updates: Partial<SubtitleCard>) => {
    setDeck((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleFlip, nextCard, prevCard]);

  const currentCard = deck[currentIndex] || deck[0] || null;
  const progressPercent = deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === deck.length - 1;

  return {
    deck,
    currentCard,
    currentIndex,
    isFlipped,
    progressPercent,
    isFirst,
    isLast,
    nextCard,
    prevCard,
    toggleFlip,
    shuffleDeck,
    updateCardInDeck,
  };
}
