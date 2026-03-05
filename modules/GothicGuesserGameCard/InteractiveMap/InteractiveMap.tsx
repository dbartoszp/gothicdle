'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { MapSelection } from './MapSelection/MapSelection';
import { calculateExponentialScore } from '../utilities/calculateExponentialScore';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';

type Screenshot = {
  id: number;
  url: string;
  coordX: number;
  coordY: number;
  map_id: number;
};

type InteractiveMapProps = {
  screenshots: Screenshot[];
  currentScreenshotIndex: number;
  onNextRound?: () => void;
};

export const InteractiveMap = ({
  screenshots,
  currentScreenshotIndex,
  onNextRound,
}: InteractiveMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentMap, setCurrentMap] = useState<string | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);
  const [locked, setLocked] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [previewScore, setPreviewScore] = useState<number | null>(null);

  const currentScreenshot = screenshots[currentScreenshotIndex];

  const calculateScoreForPosition = (pos: { x: number; y: number }) => {
    if (!containerRef.current || !currentScreenshot || !currentMap) return 0;

    const mapIdFromPath = Number(currentMap.match(/\/(\d+)_/)?.[1]);
    if (mapIdFromPath !== currentScreenshot.map_id) return 0;

    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return 0;

    const dx = pos.x - currentScreenshot.coordX;
    const dy = pos.y - currentScreenshot.coordY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return calculateExponentialScore(
      distance,
      img.naturalWidth,
      img.naturalHeight
    );
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || locked || !currentMap) return;

    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return;

    const scale = Math.min(
      rect.width / img.naturalWidth,
      rect.height / img.naturalHeight
    );

    const leftOffset = (rect.width - img.naturalWidth * scale) / 2;
    const topOffset = (rect.height - img.naturalHeight * scale) / 2;

    const xOnImage = (e.clientX - rect.left - leftOffset) / scale;
    const yOnImage = (e.clientY - rect.top - topOffset) / scale;

    if (
      xOnImage < 0 ||
      yOnImage < 0 ||
      xOnImage > img.naturalWidth ||
      yOnImage > img.naturalHeight
    ) {
      return;
    }

    const naturalPos = { x: xOnImage, y: yOnImage };

    setDotPos(naturalPos);
    setPreviewScore(calculateScoreForPosition(naturalPos));
  };

  const handleSelectMap = (mapPath: string) => {
    setCurrentMap(mapPath);
    setDotPos(null);
    setLocked(false);
    setPreviewScore(null);
  };

  const handleLockIn = () => {
    if (!dotPos) return;

    const score = calculateScoreForPosition(dotPos);

    setTotalScore((prev) => prev + score);
    setLocked(true);
    setPreviewScore(null);
  };

  const handleNextRound = () => {
    setDotPos(null);
    setLocked(false);
    setPreviewScore(null);
    setCurrentMap(null);

    window.scrollTo({
      top: 250,
      behavior: 'smooth',
    });

    onNextRound?.();
  };

  const getDotStyle = (pos: { x: number; y: number }) => {
    if (!containerRef.current) return {};

    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return {};

    const scale = Math.min(
      rect.width / img.naturalWidth,
      rect.height / img.naturalHeight
    );

    const leftOffset = (rect.width - img.naturalWidth * scale) / 2;
    const topOffset = (rect.height - img.naturalHeight * scale) / 2;

    return {
      left: leftOffset + pos.x * scale,
      top: topOffset + pos.y * scale,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className='flex flex-col'>
      <MapSelection onSelect={handleSelectMap} />

      <div
        ref={containerRef}
        className='relative overflow-hidden'
        style={{ width: 800, height: 800 }}
        onClick={handleClick}
      >
        {currentMap ? (
          <Image
            src={currentMap}
            alt='current map'
            fill
            className='pointer-events-none select-none object-contain'
            draggable={false}
          />
        ) : (
          <div className='items-center'>
            <Text>Wybierz mape</Text>
          </div>
        )}

        {dotPos && (
          <div
            className='pointer-events-none absolute h-4 w-4 rounded-full bg-red-600'
            style={getDotStyle(dotPos)}
          />
        )}

        {locked && currentScreenshot && (
          <div
            className='pointer-events-none absolute h-4 w-4 rounded-full bg-green-600'
            style={getDotStyle({
              x: currentScreenshot.coordX,
              y: currentScreenshot.coordY,
            })}
          />
        )}
      </div>

      {previewScore !== null && !locked && <Text>{previewScore}</Text>}

      <div className='flex h-12 items-center justify-center'>
        {dotPos && !locked && (
          <Button size='sm' onClick={handleLockIn}>
            <Text>Zgadnij</Text>
          </Button>
        )}
      </div>

      {locked && (
        <div className='flex flex-col items-center gap-2'>
          <Text variant='green'>Punkty: {totalScore}</Text>

          {currentScreenshotIndex < screenshots.length - 1 ? (
            <Button size='sm' onClick={handleNextRound}>
              Nastepny screenshot
            </Button>
          ) : (
            <Text>gg</Text>
          )}
        </div>
      )}
    </div>
  );
};
