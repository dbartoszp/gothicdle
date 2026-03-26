'use client';

import { useState, useRef, MouseEvent, useEffect } from 'react';
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
};

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
  const [gameState, setGameState] = useState(
    storedGameState &&
      JSON.parse(storedGameState).date === defaultGameStateGothicGuesser.date
      ? JSON.parse(storedGameState)
      : defaultGameStateGothicGuesser
  );
  const [isCorrectMap, setIsCorrectMap] = useState(true);

  const currentScreenshot = screenshots[currentScreenshotIndex];

  useEffect(() => {
    setGameState(
      getStoredGameState() &&
        JSON.parse(getStoredGameState()).date ===
          defaultGameStateGothicGuesser.date
        ? JSON.parse(getStoredGameState())
        : defaultGameStateGothicGuesser
    );
  }, []);

  const calculateScoreForPosition = (pos: { x: number; y: number }) => {
    if (!containerRef.current || !currentScreenshot || !currentMap) return 0;

    const mapIdFromPath = Number(currentMap.match(/\/(\d+)_/)?.[1]);
    if (mapIdFromPath !== currentScreenshot.map_id) {
      setIsCorrectMap(false);
      return 0;
    }

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
    const newTotalScore = totalScore + score;

    setTotalScore(newTotalScore);
    setGameState({
      ...gameState,
      guesses: [...gameState.guesses, score],
      totalScore: newTotalScore,
    });
    localStorage.setItem(
      `gameStateGothicGuesser`,
      JSON.stringify({
        ...gameState,
        guesses: [...gameState.guesses, score],
        totalScore: newTotalScore,
      })
    );

    //!! TUTAJ KONIEC GRY
    if (currentScreenshotIndex === screenshots.length - 1) {
      setGameState({
        ...gameState,
        guesses: [...gameState.guesses, score],
        totalScore: newTotalScore,
      });
      localStorage.setItem(
        `gameStateGothicGuesser`,
        JSON.stringify({
          ...gameState,
          guesses: [...gameState.guesses, score],
          totalScore: newTotalScore,
          isCompleted: true,
        })
      );
      insertGameSummaryPlayer({
        guesses: [...gameState.guesses, score],
        totalScore: gameState.totalScore,
        date: formattedDate,
      });
    }
    setCurrentMap(getMapPathById(currentScreenshot.map_id));
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
      {!gameState.isCompleted && (
        <>
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
          {locked && !isCorrectMap && (
            <div>
              <Text variant='danger'>Bledna mapa!</Text>
            </div>
          )}
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
        </>
      )}
    </div>
  );
};
