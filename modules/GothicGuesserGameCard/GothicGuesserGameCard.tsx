'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card/Card';
import { InteractiveMap } from './InteractiveMap/InteractiveMap';
import { ScreenshotSection } from './ScreenshotSection/ScreenshotSection';
import { useGetScreenshotsTesting } from '@/modules/screenshots/hooks/useGetScreenshotsTesting/useGetScreenshotsTesting';

export default function GothicGuesserGameCard() {
  const { data, isLoading, error } = useGetScreenshotsTesting();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return <Card type='flex-row'>Loading game...</Card>;
  }

  if (error instanceof Error) {
    return (
      <Card type='flex-row'>
        <div className='text-red-600'>
          <p className='font-bold'>Error loading game</p>
          <p>{error.message}</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return <Card type='flex-row'>No screenshots found</Card>;
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? prev : prev + 1));
  };

  const currentScreenshot = data[currentIndex];

  return (
    <Card type='flex-col'>
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
    </Card>
  );
}
