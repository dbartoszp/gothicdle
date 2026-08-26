'use client';

import { useState, useRef, MouseEvent, useEffect, useCallback } from 'react';
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
  onGameComplete?: (guesses: number[], totalScore: number, wrongMapIndices: number[]) => void;
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

const MAP_CLICK_ZONES: Record<string, { polygon: [number, number][]; targetMapPath: string }[]> =
  Object.values(MAPS).flatMap((g) => g.maps).reduce((acc, m) => {
    if (m.clickZones) acc[m.path] = m.clickZones;
    return acc;
  }, {} as Record<string, { polygon: [number, number][]; targetMapPath: string }[]>);

function pointInPolygon(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

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
  const [lastScore, setLastScore] = useState(0);
  const [pendingComplete, setPendingComplete] = useState<{ guesses: number[]; totalScore: number; wrongMapIndices: number[] } | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [wrongMapIndices, setWrongMapIndices] = useState<number[]>([]);

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

  const getNaturalPos = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return null;
    const layout = getImageLayout();
    if (!layout) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - layout.leftOffset) / layout.scale;
    const y = (e.clientY - rect.top - layout.topOffset) / layout.scale;
    if (x < 0 || y < 0 || x > layout.naturalWidth || y > layout.naturalHeight) return null;
    return { x, y };
  }, [getImageLayout]);

  const getHitZone = useCallback((x: number, y: number) => {
    if (!currentMap) return null;
    const zones = MAP_CLICK_ZONES[currentMap];
    if (!zones) return null;
    return zones.find((z) => pointInPolygon(x, y, z.polygon)) ?? null;
  }, [currentMap]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (locked || !currentMap) return;
    const pos = getNaturalPos(e);
    if (!pos) { setHoveredZone(null); return; }
    const zone = getHitZone(pos.x, pos.y);
    setHoveredZone(zone ? zone.targetMapPath : null);
  };

  const handleMouseLeave = () => setHoveredZone(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || locked || !currentMap) return;
    const pos = getNaturalPos(e);
    if (!pos) return;

    const zone = getHitZone(pos.x, pos.y);
    if (zone) {
      setCurrentMap(zone.targetMapPath);
      setDotPos(null);
      setPreviewScore(null);
      setHoveredZone(null);
      return;
    }

    setDotPos(pos);
    setPreviewScore(calculateScoreForPosition(pos));
  };

  const handleSelectMap = (mapPath: string) => {
    if (locked) return;
    setCurrentMap(mapPath);
    setDotPos(null);
    setPreviewScore(null);
  };

  const handleLockIn = () => {
    if (!dotPos) return;

    setIsCorrectMap(true);
    const score = calculateScoreForPosition(dotPos);
    const selectedMapId = Number(currentMap?.match(/\/(\d+)_/)?.[1]);
    const isWrongMap = selectedMapId !== currentScreenshot.map_id;
    const newWrongMapIndices = isWrongMap
      ? [...wrongMapIndices, currentScreenshotIndex]
      : wrongMapIndices;
    setWrongMapIndices(newWrongMapIndices);
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
      setPendingComplete({ guesses: newGuesses, totalScore: newTotalScore, wrongMapIndices: newWrongMapIndices });
    }

    setCurrentMap(getMapPathById(currentScreenshot.map_id));
    if (isWrongMap) setDotPos(null);
    setLocked(true);
    setPreviewScore(null);
    setLastScore(score);
  };

  const handleNextRound = () => {
    setDotPos(null);
    setLocked(false);
    setPreviewScore(null);
    setCurrentMap(null);
    setHoveredZone(null);

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

  const getScaledPolygonPoints = useCallback((polygon: [number, number][]) => {
    const layout = getImageLayout();
    if (!layout) return '';
    return polygon
      .map(([x, y]) => `${layout.leftOffset + x * layout.scale},${layout.topOffset + y * layout.scale}`)
      .join(' ');
  }, [getImageLayout]);

  return (
    <div className='flex flex-col w-full'>
      {!gameState.isCompleted && (
        <>
          <MapSelection onSelect={handleSelectMap} />

          <div
            ref={containerRef}
            className='relative overflow-hidden'
            style={{ width: '100%', maxWidth: 900, aspectRatio: '4 / 3', alignSelf: 'center', cursor: hoveredZone ? 'pointer' : 'crosshair' }}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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

            {currentMap && !locked && MAP_CLICK_ZONES[currentMap] && (
              <svg className='pointer-events-none absolute inset-0' width='100%' height='100%'>
                {MAP_CLICK_ZONES[currentMap].map((zone) => (
                  <polygon
                    key={zone.targetMapPath}
                    points={getScaledPolygonPoints(zone.polygon)}
                    fill={hoveredZone === zone.targetMapPath ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.10)'}
                    stroke='none'
                  />
                ))}
              </svg>
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

            {locked && dotPos && currentScreenshot && isCorrectMap && (() => {
              const layout = getImageLayout();
              if (!layout) return null;
              const x1 = layout.leftOffset + dotPos.x * layout.scale;
              const y1 = layout.topOffset + dotPos.y * layout.scale;
              const x2 = layout.leftOffset + currentScreenshot.coordX * layout.scale;
              const y2 = layout.topOffset + currentScreenshot.coordY * layout.scale;
              return (
                <svg
                  className='pointer-events-none absolute inset-0'
                  width='100%'
                  height='100%'
                >
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke='white'
                    strokeWidth={2}
                    strokeDasharray='6 4'
                    strokeOpacity={0.8}
                  />
                </svg>
              );
            })()}
          </div>

          {previewScore !== null && !locked && <Text>{previewScore}</Text>}

          <div className='flex h-12 items-center justify-center'>
            {dotPos && !locked && (
              <Button size='sm' onClick={handleLockIn}>
                <Text>Zgadnij</Text>
              </Button>
            )}
            {locked && (
              <Button
                size='sm'
                onClick={() => {
                  if (pendingComplete) {
                    onGameComplete?.(pendingComplete.guesses, pendingComplete.totalScore, pendingComplete.wrongMapIndices);
                  } else {
                    handleNextRound();
                  }
                }}
              >
                {pendingComplete ? 'Zobacz wyniki' : 'Nastepny screenshot'}
              </Button>
            )}
          </div>

          {locked && (
            <div className='flex flex-col items-center gap-1'>
              <Text variant='subtitle'>
                <span className='text-green-500'>+{lastScore}</span> pkt
              </Text>
              <Text>Lacznie: {totalScore} pkt</Text>
              {!isCorrectMap && <Text variant='danger'>Bledna mapa! (0 pkt)</Text>}
            </div>
          )}
        </>
      )}

    </div>
  );
};
