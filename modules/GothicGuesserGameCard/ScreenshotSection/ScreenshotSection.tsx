'use client';

import Image from 'next/image';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';

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
      <Text variant='subtitle'>Gdzie zostal wykonany ten screenshot?</Text>
      <div>
        <div className='mt-2 text-center text-sm'>
          <Text>
            X: {currentScreenshot.coordX}
            Y: {currentScreenshot.coordY}
          </Text>
        </div>

        <Image
          src={currentScreenshot.url}
          alt={`Screenshot ${currentScreenshot.id}`}
          width={600}
          height={600}
        />
      </div>

      {/* <Button size='md' onClick={onNext}>
        Next
      </Button> */}
    </div>
  );
};
