'use client';

import { useState } from 'react';
import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';
import { useGetDailyStats } from '@/modules/screenshots/hooks/useGetDailyStats/useGetDailyStats';
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

const handleCopyToClipboard = (guesses: number[], totalScore: number) => {
  const lines = guesses.map((score) => `${scoreToEmoji(score).repeat(5)} ${score} pkt`);
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

type GothicguesserGameSummaryProps = {
  guesses: number[];
  totalScore: number;
  date: string;
  screenshots: Screenshot[];
};

export const GothicguesserGameSummary = ({
  guesses,
  totalScore,
  date,
  screenshots,
}: GothicguesserGameSummaryProps) => {
  const { data: stats } = useGetDailyStats(date);
  const [activeScreenshot, setActiveScreenshot] = useState<number | null>(null);

  const diff = stats ? totalScore - stats.avgTotal : null;

  const totalHistogram = stats?.allTotals
    ? buildHistogram(stats.allTotals, TOTAL_MAX, HISTOGRAM_BINS)
    : null;

  const perScreenshotData = guesses.map((score, i) => ({
    name: `#${i + 1}`,
    wysoki: score >= MAX_SCORE * 0.9 ? score : 0,
    sredni: score >= MAX_SCORE * 0.5 && score < MAX_SCORE * 0.9 ? score : 0,
    niski: score < MAX_SCORE * 0.5 ? score : 0,
    ...(stats?.avgGuesses?.[i] !== undefined ? { srednia: stats.avgGuesses[i] } : {}),
  }));

  return (
    <div className='mb-4 mt-8 flex flex-col items-center space-y-8 w-full'>
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
                if (name !== 'srednia' && value === 0) return null;
                const label = name === 'srednia' ? 'Srednia graczy' : 'Twoj wynik';
                return [`${value} pkt`, label];
              }}
            />
            <Bar dataKey='wysoki' name='Twoj wynik' stackId='a' fill='#22c55e' radius={[4, 4, 0, 0]} />
            <Bar dataKey='sredni' name='Twoj wynik' stackId='a' fill='#f97316' radius={[4, 4, 0, 0]} />
            <Bar dataKey='niski' name='Twoj wynik' stackId='a' fill='#ef4444' radius={[4, 4, 0, 0]} />
            {stats && <Bar dataKey='srednia' name='Srednia graczy' fill='#acacac' radius={[4, 4, 0, 0]} />}
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
              <span className='inline-block w-3 h-3 rounded-sm' style={{ background: '#acacac' }} />
              <span>Srednia</span>
            </div>
          )}
        </div>
      </div>

      <div className='w-full max-w-lg flex flex-col gap-3'>
        <p className='text-xs' style={{ color: '#fdf7e6' }}>Szczegoly per screenshot</p>
        {guesses.map((score, i) => {
          const avg = stats?.avgGuesses?.[i];
          const scrDiff = avg !== undefined ? score - avg : null;
          const histogram = stats?.allGuesses?.[i]
            ? buildHistogram(stats.allGuesses[i], MAX_SCORE, 5)
            : null;

          return (
            <div
              key={i}
              className='rounded-lg overflow-hidden cursor-pointer bg-neutral-950 bg-opacity-60'
              style={{ border: '1px solid #887952' }}
              onClick={() => setActiveScreenshot(activeScreenshot === i ? null : i)}
            >
              <div className='flex items-center justify-between px-4 py-3'>
                <div className='flex items-center gap-3'>
                  <span>{scoreToEmoji(score)}</span>
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
                <div className='px-4 pb-4 flex flex-col gap-3'>
                  {screenshots[i] && (
                    <div className='relative w-full rounded overflow-hidden' style={{ aspectRatio: '16/9' }}>
                      <Image
                        src={screenshots[i].url}
                        alt={`Screenshot ${i + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
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

      <Button size='sm' onClick={() => handleCopyToClipboard(guesses, totalScore)}>
        <FaRegCopy size={30} />
      </Button>
    </div>
  );
};
