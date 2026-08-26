'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card/Card';
import { InteractiveMap } from './InteractiveMap/InteractiveMap';
import { ScreenshotSection } from './ScreenshotSection/ScreenshotSection';
import { useGetScreenshotsTesting } from '@/modules/screenshots/hooks/useGetScreenshotsTesting/useGetScreenshotsTesting';
import { Text } from '../ui/Text/Text';
import { GothicguesserGameSummary } from './GothicguesserGameSummary/GothicguesserGameSummary';

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const formattedDate = `${day}-${month}-${year}`;

const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const defaultGameStateGothicGuesser = {
  date: formattedDate,
  guesses: [] as number[],
  totalScore: 0,
  isCompleted: false,
  wrongMapIndices: [] as number[],
};

export default function GothicGuesserGameCard() {
  const { data, isLoading, error } = useGetScreenshotsTesting();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState(defaultGameStateGothicGuesser);

  const getStoredGameState = () => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(`gameStateGothicGuesser`) ||
        JSON.stringify(defaultGameStateGothicGuesser)
      );
    }
    return JSON.stringify(defaultGameStateGothicGuesser);
  };

  useEffect(() => {
    const stored = getStoredGameState();
    const parsed = JSON.parse(stored);
    if (parsed.date === defaultGameStateGothicGuesser.date) {
      setGameState(parsed);
      setCurrentIndex(parsed.isCompleted ? 0 : Math.min(parsed.guesses.length, data ? data.length - 1 : 0));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card type='flex-row'>
        <Text>Ladowanie...</Text>
      </Card>
    );
  }

  if (error instanceof Error) {
    return (
      <Card type='flex-row'>
        <div className='text-red-600'>
          <Text variant='danger'>Blad ladowania gry</Text>
          <Text variant='danger'>{error.message}</Text>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card type='flex-row'>
        <Text>Nie znaleziono screenshotow</Text>
      </Card>
    );
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? prev : prev + 1));
  };

  const handleGameComplete = (guesses: number[], totalScore: number, wrongMapIndices: number[]) => {
    const newState = { ...defaultGameStateGothicGuesser, guesses, totalScore, isCompleted: true, wrongMapIndices };
    setGameState(newState);
    localStorage.setItem('gameStateGothicGuesser', JSON.stringify(newState));
  };

  return (
    <Card type='flex-col' size='lg'>
      {gameState.isCompleted ? (
        <GothicguesserGameSummary guesses={gameState.guesses} totalScore={gameState.totalScore} date={isoDate} screenshots={data} wrongMapIndices={gameState.wrongMapIndices} />
      ) : (
        <>
          <ScreenshotSection
            screenshots={data}
            currentIndex={currentIndex}
            onNext={goNext}
          />
          <InteractiveMap
            screenshots={data}
            currentScreenshotIndex={currentIndex}
            onNextRound={goNext}
            onGameComplete={handleGameComplete}
          />
        </>
      )}
    </Card>
  );
}
