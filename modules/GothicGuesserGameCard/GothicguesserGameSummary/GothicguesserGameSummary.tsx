'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaRegCopy, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useGetDailyStats } from '@/modules/screenshots/hooks/useGetDailyStats/useGetDailyStats';
import { MAPS } from '../utilities/mapPaths/mapPaths';
import type { DotPosition } from '../InteractiveMap/InteractiveMap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const BEZI_PATH = '/imgs/bezi.png';
const MAX_SCORE = 5000;
const TOTAL_MAX = MAX_SCORE * 5;
const HISTOGRAM_BINS = 10;
const BAR_COLOR = '#887952';
const BAR_PLAYER_COLOR = '#eab308';

const MAP_DIMENSIONS: Record<string, { naturalWidth: number; naturalHeight: number }> =
  Object.values(MAPS).flatMap((g) => g.maps).reduce((acc, m) => {
    acc[m.path] = { naturalWidth: m.naturalWidth, naturalHeight: m.naturalHeight };
    return acc;
  }, {} as Record<string, { naturalWidth: number; naturalHeight: number }>);

const scoreToEmoji = (score: number) => {
  const ratio = score / MAX_SCORE;
  if (ratio >= 0.9) return '🟩';
  if (ratio >= 0.5) return '🟧';
  return '🟥';
};

const scoreToColor = (score: number, max: number) => {
  const ratio = score / max;
  if (ratio >= 0.9) return '#22c55e';
  if (ratio >= 0.5) return '#f97316';
  return '#ef4444';
};

const buildHistogram = (values: number[], max: number, bins: number) => {
  const step = max / bins;
  const data = Array.from({ length: bins }, (_, i) => ({
    mid: Math.round(i * step + step / 2),
    label: `${Math.round((i * step) / 1000)}k`,
    count: 0,
  }));
  for (const v of values) {
    const idx = Math.min(Math.floor(v / step), bins - 1);
    data[idx].count += 1;
  }
  return data;
};

const handleCopyToClipboard = (guesses: number[], totalScore: number, wrongMapIndices: number[]) => {
  const lines = guesses.map((score, i) => {
    const isWrongMap = wrongMapIndices.includes(i);
    const emoji = isWrongMap ? '⬛' : scoreToEmoji(score);
    return `${emoji.repeat(5)} ${score} pkt${isWrongMap ? ' (bledna mapa)' : ''}`;
  });
  const clipboardText =
    `GothicGuesser - ${totalScore}/${guesses.length * MAX_SCORE} pkt\n` +
    lines.join('\n') +
    `\nhttps://gothicdle.com/gothicguesser`;
  navigator.clipboard.writeText(clipboardText);
  toast.success('Skopiowano do schowka');
};

type Screenshot = {
  id: number;
  url: string;
  coordX: number;
  coordY: number;
  map_id: number;
};

type MapSlideProps = {
  mapPath: string;
  playerDot: DotPosition;
  correctDot: { x: number; y: number } | null;
  showLine: boolean;
};

const MapSlide = ({ mapPath, playerDot, correctDot, showLine }: MapSlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getLayout = useCallback(() => {
    if (!size) return null;
    const dims = MAP_DIMENSIONS[mapPath];
    if (!dims) return null;
    const scale = Math.min(size.width / dims.naturalWidth, size.height / dims.naturalHeight);
    const leftOffset = (size.width - dims.naturalWidth * scale) / 2;
    const topOffset = (size.height - dims.naturalHeight * scale) / 2;
    return { scale, leftOffset, topOffset };
  }, [size, mapPath]);

  const toPixel = (pos: { x: number; y: number }) => {
    const layout = getLayout();
    if (!layout) return null;
    return {
      px: layout.leftOffset + pos.x * layout.scale,
      py: layout.topOffset + pos.y * layout.scale,
    };
  };

  const playerPx = playerDot ? toPixel(playerDot) : null;
  const correctPx = correctDot ? toPixel(correctDot) : null;

  return (
    <div
      ref={containerRef}
      className='relative w-full overflow-hidden rounded'
      style={{ aspectRatio: '4/3' }}
    >
      <Image src={mapPath} alt='mapa' fill className='pointer-events-none select-none object-contain' />

      {playerPx && (
        <div
          className='pointer-events-none absolute h-4 w-4 rounded-full bg-red-600'
          style={{ left: playerPx.px, top: playerPx.py, transform: 'translate(-50%, -50%)' }}
        />
      )}
      {correctPx && (
        <div
          className='pointer-events-none absolute h-4 w-4 rounded-full bg-green-500'
          style={{ left: correctPx.px, top: correctPx.py, transform: 'translate(-50%, -50%)' }}
        />
      )}
      {showLine && playerPx && correctPx && (
        <svg className='pointer-events-none absolute inset-0' width='100%' height='100%'>
          <line
            x1={playerPx.px} y1={playerPx.py}
            x2={correctPx.px} y2={correctPx.py}
            stroke='white' strokeWidth={2} strokeDasharray='6 4' strokeOpacity={0.8}
          />
        </svg>
      )}
    </div>
  );
};

type CarouselProps = {
  screenshot: Screenshot;
  dotPosition: DotPosition;
  playerMapPath: string | null;
  isWrongMap: boolean;
};

const ScreenshotCarousel = ({ screenshot, dotPosition, playerMapPath, isWrongMap }: CarouselProps) => {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const wheelAccum = useRef(0);

  const correctMapPath = (() => {
    for (const group of Object.values(MAPS)) {
      for (const map of group.maps) {
        const id = Number(map.path.match(/\/(\d+)_/)?.[1]);
        if (id === screenshot.map_id) return map.path;
      }
    }
    return null;
  })();

  type SlideType = 'screenshot' | 'player-map' | 'correct-map' | 'combined-map';

  const slides = (() => {
    const s: { type: SlideType }[] = [{ type: 'screenshot' }];
    if (isWrongMap && playerMapPath) {
      s.push({ type: 'player-map' });
      if (correctMapPath) s.push({ type: 'correct-map' });
    } else if (correctMapPath) {
      s.push({ type: 'combined-map' });
    }
    return s;
  })();

  const total = slides.length;
  const prev = () => setSlide((s) => Math.max(0, s - 1));
  const next = () => setSlide((s) => Math.min(total - 1, s + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    touchStartX.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = false;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    if (Math.abs(e.clientX - mouseStartX.current) > 5) isDragging.current = true;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const delta = mouseStartX.current - e.clientX;
    if (Math.abs(delta) > 40) {
      e.stopPropagation();
      if (delta > 0) next();
      else prev();
    }
    mouseStartX.current = null;
    isDragging.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.stopPropagation();
    wheelAccum.current += e.deltaX;
    if (wheelAccum.current > 40) { next(); wheelAccum.current = 0; }
    else if (wheelAccum.current < -40) { prev(); wheelAccum.current = 0; }
  };

  const currentSlide = slides[slide];

  return (
    <div
      className='flex flex-col gap-2 select-none'
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <div className='relative'>
        {currentSlide.type === 'screenshot' && (
          <div className='relative w-full rounded overflow-hidden' style={{ aspectRatio: '16/9' }}>
            <Image src={screenshot.url} alt='screenshot' fill className='object-cover' />
          </div>
        )}
        {currentSlide.type === 'combined-map' && correctMapPath && (
          <MapSlide
            mapPath={correctMapPath}
            playerDot={dotPosition}
            correctDot={{ x: screenshot.coordX, y: screenshot.coordY }}
            showLine={true}
          />
        )}
        {currentSlide.type === 'player-map' && playerMapPath && (
          <MapSlide
            mapPath={playerMapPath}
            playerDot={dotPosition}
            correctDot={null}
            showLine={false}
          />
        )}
        {currentSlide.type === 'correct-map' && correctMapPath && (
          <MapSlide
            mapPath={correctMapPath}
            playerDot={null}
            correctDot={{ x: screenshot.coordX, y: screenshot.coordY }}
            showLine={false}
          />
        )}

        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          disabled={slide === 0}
          className='absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black bg-opacity-70 text-white hover:bg-opacity-90 disabled:opacity-20'
        >
          <FaChevronLeft size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          disabled={slide === total - 1}
          className='absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black bg-opacity-70 text-white hover:bg-opacity-90 disabled:opacity-20'
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      <div className='flex items-center justify-center gap-2'>
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setSlide(idx); }}
            className='rounded-full transition-all'
            style={{
              width: slide === idx ? 20 : 8,
              height: 8,
              background: slide === idx ? '#887952' : 'rgba(253,247,230,0.35)',
            }}
          />
        ))}
      </div>

      <p className='text-center text-xs' style={{ color: 'rgba(253,247,230,0.55)' }}>
        {currentSlide.type === 'screenshot' && 'Przesun w prawo aby zobaczyc mape'}
        {currentSlide.type === 'combined-map' && 'Twoj guess i prawidlowa lokalizacja'}
        {currentSlide.type === 'player-map' && 'Twoj guess (bledna mapa)'}
        {currentSlide.type === 'correct-map' && 'Prawidlowa lokalizacja'}
      </p>
    </div>
  );
};

type GothicguesserGameSummaryProps = {
  guesses: number[];
  totalScore: number;
  date: string;
  screenshots: Screenshot[];
  wrongMapIndices: number[];
  dotPositions: DotPosition[];
  playerMapPaths: (string | null)[];
};

export const GothicguesserGameSummary = ({
  guesses,
  totalScore,
  date,
  screenshots,
  wrongMapIndices,
  dotPositions,
  playerMapPaths,
}: GothicguesserGameSummaryProps) => {
  const { data: stats } = useGetDailyStats(date);
  const [activeScreenshot, setActiveScreenshot] = useState<number | null>(0);

  const isFirst = stats ? stats.allTotals.length <= 1 : false;
  const diff = stats && !isFirst ? totalScore - stats.avgTotal : null;

  const totalHistogram = !isFirst && stats?.allTotals
    ? buildHistogram(stats.allTotals, TOTAL_MAX, HISTOGRAM_BINS)
    : null;

  const perScreenshotData = guesses.map((score, i) => ({
    name: `#${i + 1}`,
    wysoki: score >= MAX_SCORE * 0.9 ? score : 0,
    sredni: score >= MAX_SCORE * 0.5 && score < MAX_SCORE * 0.9 ? score : 0,
    niski: score < MAX_SCORE * 0.5 ? score : 0,
    ...(stats && !isFirst && stats?.avgGuesses?.[i] !== undefined ? { srednia: stats.avgGuesses[i] } : {}),
  }));

  return (
    <div className='mb-4 mt-8 flex flex-col items-center space-y-8 w-full'>
      <Text variant='subtitle'>Stary, ale jazda!</Text>
      <Image src={BEZI_PATH} width={120} height={120} alt='usmiechniety bezimienny' />

      <div className='flex flex-col items-center gap-1'>
        <Text variant='subtitle'>
          Twoj wynik:{' '}
          <span className='text-green-500'>{totalScore} / {guesses.length * MAX_SCORE}</span> pkt
        </Text>
        {stats && diff !== null && (
          <Text>
            Srednia graczy: {stats.avgTotal} pkt —{' '}
            <span className={diff >= 0 ? 'text-green-500' : 'text-red-500'}>
              {diff >= 0 ? `+${diff}` : diff} pkt
            </span>{' '}
            od sredniej
          </Text>
        )}
        {isFirst && (
          <Text>Wroc pozniej, by zobaczyc srednia punktow jaka zdobyli inni gracze</Text>
        )}
        <div className='mt-2'>
          <Button size='md' onClick={() => handleCopyToClipboard(guesses, totalScore, wrongMapIndices)}>
            <FaRegCopy size={30} />
          </Button>
        </div>
      </div>

      {totalHistogram && (
        <div className='w-full max-w-lg'>
          <p className='text-xs mb-2' style={{ color: '#fdf7e6' }}>Rozklad wynikow graczy</p>
          <ResponsiveContainer width='100%' height={160}>
            <BarChart data={totalHistogram} barSize={28} margin={{ top: 24, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey='mid'
                type='number'
                domain={[0, TOTAL_MAX]}
                tickCount={HISTOGRAM_BINS + 1}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                tick={{ fill: '#fdf7e6', fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #887952', borderRadius: 6 }}
                labelStyle={{ color: '#fdf7e6' }}
                itemStyle={{ color: '#fdf7e6' }}
                formatter={(value) => [`${value} graczy`]}
              />
              <Bar dataKey='count' name='Gracze' radius={[4, 4, 0, 0]} fill={BAR_COLOR} />
              {stats?.avgTotal && (
                <ReferenceLine
                  x={stats.avgTotal}
                  stroke='#acacac'
                  strokeDasharray='4 2'
                  label={{ value: 'Sr.', fill: '#acacac', fontSize: 11, position: 'top' }}
                />
              )}
              <ReferenceLine
                x={totalScore}
                stroke={BAR_PLAYER_COLOR}
                strokeDasharray='4 2'
                label={{ value: 'Ty', fill: BAR_PLAYER_COLOR, fontSize: 11, position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className='w-full max-w-lg'>
        <p className='text-xs mb-2' style={{ color: '#fdf7e6' }}>Twoj wynik vs srednia per screenshot</p>
        <ResponsiveContainer width='100%' height={220}>
          <BarChart data={perScreenshotData} barGap={4}>
            <XAxis dataKey='name' tick={{ fill: '#fdf7e6', fontSize: 12 }} />
            <YAxis domain={[0, MAX_SCORE]} tick={{ fill: '#fdf7e6', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #887952', borderRadius: 6 }}
              labelStyle={{ color: '#fdf7e6' }}
              itemStyle={{ color: '#fdf7e6' }}
              formatter={(value, name) => {
                if (name !== 'Srednia graczy' && value === 0) return null;
                const label = name === 'Srednia graczy' ? 'Srednia graczy' : 'Twoj wynik';
                return [`${value} pkt`, label];
              }}
            />
            <Bar dataKey='wysoki' name='Twoj wynik' stackId='a' fill='#22c55e' radius={[4, 4, 0, 0]} />
            <Bar dataKey='sredni' name='Twoj wynik' stackId='a' fill='#f97316' radius={[4, 4, 0, 0]} />
            <Bar dataKey='niski' name='Twoj wynik' stackId='a' fill='#ef4444' radius={[4, 4, 0, 0]} />
            {stats && <Bar dataKey='srednia' name='Srednia graczy' fill={BAR_COLOR} radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
        <div className='flex justify-center gap-6 mt-2 text-xs' style={{ color: '#fdf7e6' }}>
          <div className='flex items-center gap-1'>
            <span className='inline-block w-3 h-3 rounded-sm bg-green-500' />
            <span>&gt;= 90%</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='inline-block w-3 h-3 rounded-sm' style={{ background: '#f97316' }} />
            <span>&gt;= 50%</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='inline-block w-3 h-3 rounded-sm bg-red-500' />
            <span>&lt; 50%</span>
          </div>
          {stats && (
            <div className='flex items-center gap-1'>
              <span className='inline-block w-3 h-3 rounded-sm' style={{ background: BAR_COLOR }} />
              <span>Srednia</span>
            </div>
          )}
        </div>
      </div>

      <div className='w-full max-w-lg flex flex-col gap-3'>
        <p className='text-xs' style={{ color: '#fdf7e6' }}>Szczegoly per screenshot</p>
        {guesses.map((score, i) => {
          const avg = !isFirst ? stats?.avgGuesses?.[i] : undefined;
          const scrDiff = avg !== undefined ? score - avg : null;
          const histogram = !isFirst && stats?.allGuesses?.[i]
            ? buildHistogram(stats.allGuesses[i], MAX_SCORE, 5)
            : null;
          const isWrongMap = wrongMapIndices.includes(i);

          return (
            <div
              key={i}
              className='rounded-lg overflow-hidden cursor-pointer bg-neutral-950 bg-opacity-60'
              style={{ border: '1px solid #887952' }}
              onClick={() => setActiveScreenshot(activeScreenshot === i ? null : i)}
            >
              <div className='flex items-center justify-between px-4 py-3'>
                <div className='flex items-center gap-3'>
                  <span>{isWrongMap ? '⬛' : scoreToEmoji(score)}</span>
                  <Text>Screenshot {i + 1}</Text>
                </div>
                <div className='flex items-center gap-3'>
                  <span style={{ color: scoreToColor(score, MAX_SCORE), fontSize: 14 }}>
                    {score} pkt
                  </span>
                  {scrDiff !== null && (
                    <span className={`text-xs ${scrDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {scrDiff >= 0 ? `+${scrDiff}` : scrDiff}
                    </span>
                  )}
                  <span className='text-xs' style={{ color: '#fdf7e6' }}>
                    {activeScreenshot === i ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {activeScreenshot === i && (
                <div className='px-4 pb-4 flex flex-col gap-3' onClick={(e) => e.stopPropagation()}>
                  {screenshots[i] && (
                    <ScreenshotCarousel
                      screenshot={screenshots[i]}
                      dotPosition={dotPositions[i] ?? null}
                      playerMapPath={playerMapPaths[i] ?? null}
                      isWrongMap={isWrongMap}
                    />
                  )}
                  <p className='text-xs' style={{ color: '#fdf7e6' }}>
                    Srednia: {avg ?? '—'} pkt
                  </p>
                  {histogram ? (
                    <ResponsiveContainer width='100%' height={100}>
                      <BarChart data={histogram} barSize={30} margin={{ top: 24, right: 0, left: 0, bottom: 0 }}>
                        <XAxis
                          dataKey='mid'
                          type='number'
                          domain={[0, MAX_SCORE]}
                          tickCount={6}
                          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                          tick={{ fill: '#fdf7e6', fontSize: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #887952', borderRadius: 6 }}
                          labelStyle={{ color: '#fdf7e6' }}
                          itemStyle={{ color: '#fdf7e6' }}
                          formatter={(value) => [`${value} graczy`]}
                        />
                        <Bar dataKey='count' name='Gracze' fill={BAR_COLOR} radius={[3, 3, 0, 0]} />
                        {avg !== undefined && (
                          <ReferenceLine
                            x={avg}
                            stroke='#acacac'
                            strokeDasharray='4 2'
                            label={{ value: 'Sr.', fill: '#acacac', fontSize: 10, position: 'top' }}
                          />
                        )}
                        <ReferenceLine
                          x={score}
                          stroke={BAR_PLAYER_COLOR}
                          strokeDasharray='4 2'
                          label={{ value: 'Ty', fill: BAR_PLAYER_COLOR, fontSize: 10, position: 'top' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className='text-xs' style={{ color: '#fdf7e6' }}>Brak danych</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
