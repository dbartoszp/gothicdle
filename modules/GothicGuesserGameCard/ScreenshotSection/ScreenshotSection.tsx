'use client';

import Image from 'next/image';
import { Button } from '@/modules/ui/Button/Button';

type Screenshot = {
  id: number;
  url: string;
  coordX: number;
  coordY: number;
};

type ScreenshotSectionProps = {
  screenshots: Screenshot[];
  currentIndex: number;
  onNext: () => void;
};

export const ScreenshotSection = ({
  screenshots,
  currentIndex,
  onNext,
}: ScreenshotSectionProps) => {
  const currentScreenshot = screenshots[currentIndex];

  return (
    <div className='flex flex-col items-center gap-4'>
      <div>
        <div className='mt-2 text-center text-sm'>
          X: <span>{currentScreenshot.coordX}</span> | Y:{' '}
          <span>{currentScreenshot.coordY}</span>
        </div>

        <Image
          src={currentScreenshot.url}
          alt={`Screenshot ${currentScreenshot.id}`}
          width={800}
          height={800}
        />
      </div>

      <Button size='md' onClick={onNext}>
        Next
      </Button>
    </div>
  );
};
