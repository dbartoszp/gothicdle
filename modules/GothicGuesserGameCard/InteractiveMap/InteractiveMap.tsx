'use client';

import { useState, useRef, MouseEvent, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { MapSelection } from './MapSelection/MapSelection';
import { calculateExponentialScore } from '../utilities/calculateExponentialScore';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import { MAPS } from '../utilities/mapPaths/mapPaths';
import { getMapPathById } from '../utilities/getMapPathById/getMapyPathById';
import { insertGameSummaryPlayer } from '@/modules/MainGameCard/GameSummary/hooks/gameSummaryPlayer/apiInsertGameSummaryPlayer';

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
  onGameComplete?: (guesses: number[], totalScore: number) => void;
};

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const formattedDate = `${day}-${month}-${year}`;
const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const defaultGameStateGothicGuesser = {
  date: formattedDate,
  guesses: [] as number[],
  totalPoints: 0,
  isCompleted: false,
};

const MAP_DIMENSIONS: Record<string, { naturalWidth: number; naturalHeight: number }> =
  Object.values(MAPS).flatMap((g) => g.maps).reduce((acc, m) => {
    acc[m.path] = { naturalWidth: m.naturalWidth, naturalHeight: m.naturalHeight };
    return acc;
  }, {} as Record<string, { naturalWidth: number; naturalHeight: number }>);

export const InteractiveMap = ({
  screenshots,
  currentScreenshotIndex,
  onNextRound,
  onGameComplete,
}: InteractiveMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  const [currentMap, setCurrentMap] = useState<string | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);
  const [locked, setLocked] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [previewScore, setPreviewScore] = useState<number | null>(null);
  const [gameState, setGameState] = useState(defaultGameStateGothicGuesser);
  const [isCorrectMap, setIsCorrectMap] = useState(true);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  const currentScreenshot = screenshots[currentScreenshotIndex];

  useEffect(() => {
    setGameState(
      getStoredGameState() &&
        JSON.parse(getStoredGameState()).date === defaultGameStateGothicGuesser.date
        ? JSON.parse(getStoredGameState())
        : defaultGameStateGothicGuesser
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getImageLayout = useCallback(() => {
    if (!containerSize || !currentMap) return null;
    const dims = MAP_DIMENSIONS[currentMap];
    if (!dims) return null;

    const scale = Math.min(
      containerSize.width / dims.naturalWidth,
      containerSize.height / dims.naturalHeight
    );
    const leftOffset = (containerSize.width - dims.naturalWidth * scale) / 2;
    const topOffset = (containerSize.height - dims.naturalHeight * scale) / 2;

    return { scale, leftOffset, topOffset, naturalWidth: dims.naturalWidth, naturalHeight: dims.naturalHeight };
  }, [containerSize, currentMap]);

  const calculateScoreForPosition = useCallback((pos: { x: number; y: number }) => {
    if (!currentScreenshot || !currentMap) return 0;

    const mapIdFromPath = Number(currentMap.match(/\/(\d+)_/)?.[1]);
    if (mapIdFromPath !== currentScreenshot.map_id) {
      setIsCorrectMap(false);
      return 0;
    }

    const layout = getImageLayout();
    if (!layout) return 0;

    const dx = pos.x - currentScreenshot.coordX;
    const dy = pos.y - currentScreenshot.coordY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return calculateExponentialScore(distance, layout.naturalWidth, layout.naturalHeight);
  }, [currentScreenshot, currentMap, getImageLayout]);

  const getStoredGameState = () => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(`gameStateGothicGuesser`) ||
        JSON.stringify(defaultGameStateGothicGuesser)
      );
    }
    return JSON.stringify(defaultGameStateGothicGuesser);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || locked || !currentMap) return;

    const layout = getImageLayout();
    if (!layout) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xOnImage = (e.clientX - rect.left - layout.leftOffset) / layout.scale;
    const yOnImage = (e.clientY - rect.top - layout.topOffset) / layout.scale;

    if (
      xOnImage < 0 ||
      yOnImage < 0 ||
      xOnImage > layout.naturalWidth ||
      yOnImage > layout.naturalHeight
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

    setIsCorrectMap(true);
    const score = calculateScoreForPosition(dotPos);
    const newTotalScore = totalScore + score;
    const newGuesses = [...gameState.guesses, score];

    setTotalScore(newTotalScore);
    setGameState({ ...gameState, guesses: newGuesses, totalPoints: newTotalScore });
    localStorage.setItem(
      `gameStateGothicGuesser`,
      JSON.stringify({ ...gameState, guesses: newGuesses, totalPoints: newTotalScore })
    );

    if (currentScreenshotIndex === screenshots.length - 1) {
      insertGameSummaryPlayer({
        guesses: newGuesses,
        totalScore: newTotalScore,
        date: isoDate,
      });
      onGameComplete?.(newGuesses, newTotalScore);
    }

    setCurrentMap(getMapPathById(currentScreenshot.map_id));
    setLocked(true);
    setPreviewScore(null);
    setLastScore(score);
    setScoreModalOpen(true);
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
    const layout = getImageLayout();
    if (!layout) return {};

    return {
      left: layout.leftOffset + pos.x * layout.scale,
      top: layout.topOffset + pos.y * layout.scale,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className='flex flex-col w-full'>
      {!gameState.isCompleted && (
        <>
          <MapSelection onSelect={handleSelectMap} />

          <div
            ref={containerRef}
            className='relative overflow-hidden'
            style={{ width: '100%', maxWidth: 900, aspectRatio: '4 / 3', alignSelf: 'center' }}
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
          {locked && !isCorrectMap && (
            <div>
              <Text variant='danger'>Bledna mapa!</Text>
            </div>
          )}
        </>
      )}

      <Dialog.Root open={scoreModalOpen} onOpenChange={setScoreModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-neutral-950 opacity-50' />
          <Dialog.Content className='fixed left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md border border-default-border bg-neutral-950 px-10 pb-10 pt-6 shadow-md md:w-5/12'>
            <Dialog.Title className='mb-4 text-center text-2xl font-semibold'>
              Wynik
            </Dialog.Title>
            <div className='flex flex-col items-center gap-4'>
              <Text variant='subtitle'>
                <span className='text-green-500'>+{lastScore}</span> pkt
              </Text>
              <Text>Lacznie: {totalScore} pkt</Text>
              {!isCorrectMap && (
                <Text variant='danger'>Bledna mapa! (0 pkt)</Text>
              )}
              <Button
                size='sm'
                onClick={() => {
                  setScoreModalOpen(false);
                  if (currentScreenshotIndex < screenshots.length - 1) {
                    handleNextRound();
                  }
                }}
              >
                {currentScreenshotIndex < screenshots.length - 1
                  ? 'Nastepny screenshot'
                  : 'Zobacz wyniki'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
