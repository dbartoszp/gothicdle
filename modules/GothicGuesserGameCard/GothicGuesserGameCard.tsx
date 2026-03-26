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

const defaultGameStateGothicGuesser = {
  date: formattedDate,
  guesses: [],
  totalPoints: 0,
  isCompleted: false,
};
let storedGameState = JSON.stringify(defaultGameStateGothicGuesser);

export default function GothicGuesserGameCard() {
  const { data, isLoading, error } = useGetScreenshotsTesting();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState(
    storedGameState &&
      JSON.parse(storedGameState).date === defaultGameStateGothicGuesser.date
      ? JSON.parse(storedGameState)
      : defaultGameStateGothicGuesser
  );

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
    setGameState(
      getStoredGameState() &&
        JSON.parse(getStoredGameState()).date ===
          defaultGameStateGothicGuesser.date
        ? JSON.parse(getStoredGameState())
        : defaultGameStateGothicGuesser
    );
  }, []);

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

  return (
    <Card type='flex-col' size='lg'>
      {gameState.isCompleted ? (
        <GothicguesserGameSummary />
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
          />
        </>
      )}
      {/* <ScreenshotSection
        screenshots={data}
        currentIndex={currentIndex}
        onNext={goNext}
      />
      <InteractiveMap
        screenshots={data}
        currentScreenshotIndex={currentIndex}
        onNextRound={goNext}
      /> */}
    </Card>
  );
}
