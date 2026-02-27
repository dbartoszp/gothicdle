'use client';

import { useState, useRef, MouseEvent, useLayoutEffect } from 'react';
import Image from 'next/image';
import { MAP_PATHS } from '../mapPaths/mapPaths';
import { MapSelection } from './MapSelection/MapSelection';
import { calculateExponentialScore } from '../utilities/calculateExponentialScore';
import { Button } from '@/modules/ui/Button/Button';

type Screenshot = {
  id: number;
  url: string;
  coordX: number;
  coordY: number;
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

  const [currentMap, setCurrentMap] = useState(MAP_PATHS.g2nk[3]);
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);
  const [locked, setLocked] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [currentMap]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || locked) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * containerRef.current.clientWidth;
    const y = ((e.clientY - rect.top) / rect.height) * containerRef.current.clientHeight;

    setDotPos({ x, y });
  };

  const handleSelectMap = (mapPath: string) => {
    setCurrentMap(mapPath);
    setDotPos(null);
    setLocked(false);
  };

  const handleLockIn = () => {
    if (!dotPos || !containerRef.current) return;

    const currentScreenshot = screenshots[currentScreenshotIndex];
    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return;

    const mapIdFromPath = Number(currentMap.match(/\/(\d+)_/)?[1]);
    let score = 0;

    if (mapIdFromPath === currentScreenshot.map_id) {
      const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
      const leftOffset = (rect.width - img.naturalWidth * scale) / 2;
      const topOffset = (rect.height - img.naturalHeight * scale) / 2;

      const guessX = (dotPos.x - leftOffset) / scale;
      const guessY = (dotPos.y - topOffset) / scale;

      const dx = guessX - currentScreenshot.coordX;
      const dy = guessY - currentScreenshot.coordY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      score = calculateExponentialScore(distance, img.naturalWidth, img.naturalHeight);
    }

    setTotalScore(prev => prev + score);
    setLocked(true);
  };

  const handleNextRound = () => {
    setDotPos(null);
    setLocked(false);
    onNextRound?.();
  };

  const currentScreenshot = screenshots[currentScreenshotIndex];

  const getDotStyle = (pos: { x: number; y: number }) => {
    if (!containerRef.current) return {};
    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return {};

    const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const leftOffset = (rect.width - img.naturalWidth * scale) / 2;
    const topOffset = (rect.height - img.naturalHeight * scale) / 2;

    return {
      left: leftOffset + pos.x * scale,
      top: topOffset + pos.y * scale,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className='flex flex-col gap-4'>
      <MapSelection onSelect={handleSelectMap} />

      <div
        ref={containerRef}
        className='relative cursor-crosshair overflow-hidden border border-neutral-700'
        style={{ width: 600, height: 600 }}
        onClick={handleClick}
      >
        <Image
          src={currentMap}
          alt='current map'
          fill
          className='pointer-events-none select-none object-contain'
          draggable={false}
        />

        {dotPos && (
          <div
            className='pointer-events-none absolute h-4 w-4 rounded-full bg-red-600'
            style={getDotStyle(dotPos)}
          />
        )}

        {locked && currentScreenshot && (
          <div
            className='pointer-events-none absolute h-4 w-4 rounded-full bg-green-600'
            style={getDotStyle(currentScreenshot)}
          />
        )}
      </div>

      <div className='mt-2 text-sm text-neutral-300 space-y-2'>
        {dotPos && !locked && (
          <button
            className='px-3 py-1 bg-blue-600 rounded hover:bg-blue-700'
            onClick={handleLockIn}
          >
            Lock-in!
          </button>
        )}

        {locked && currentScreenshot && (
          <>
            <div>
              Points this round:{' '}
              <span className='text-red-400 font-semibold'>
                {(() => {
                  const mapIdFromPath = Number(currentMap.match(/\/(\d+)_/)?.[1]);
                  if (mapIdFromPath !== currentScreenshot.map_id) return 0;

                  const img = containerRef.current!.querySelector('img')!;
                  const scale = Math.min(
                    containerRef.current!.clientWidth / img.naturalWidth,
                    containerRef.current!.clientHeight / img.naturalHeight
                  );
                  const leftOffset = (containerRef.current!.clientWidth - img.naturalWidth * scale) / 2;
                  const topOffset = (containerRef.current!.clientHeight - img.naturalHeight * scale) / 2;

                  const guessX = (dotPos!.x - leftOffset) / scale;
                  const guessY = (dotPos!.y - topOffset) / scale;
                  const dx = guessX - currentScreenshot.coordX;
                  const dy = guessY - currentScreenshot.coordY;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  return calculateExponentialScore(distance, img.naturalWidth, img.naturalHeight);
                })()}
              </span>
            </div>

            {currentScreenshotIndex < screenshots.length - 1 ? (
              <Button
                onClick={handleNextRound}
              >
                Next
              </Button>
            ) : (
              <div className='mt-2 text-yellow-400 font-bold text-lg'>
                gg
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};