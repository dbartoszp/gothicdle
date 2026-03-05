'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card/Card';
import { InteractiveMap } from './InteractiveMap/InteractiveMap';
import { ScreenshotSection } from './ScreenshotSection/ScreenshotSection';
import { useGetScreenshotsTesting } from '@/modules/screenshots/hooks/useGetScreenshotsTesting/useGetScreenshotsTesting';
import { Text } from '../ui/Text/Text';

export default function GothicGuesserGameCard() {
  const { data, isLoading, error } = useGetScreenshotsTesting();
  const [currentIndex, setCurrentIndex] = useState(0);

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
