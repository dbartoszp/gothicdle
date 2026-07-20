'use client';

import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';

const BEZI_PATH = '/imgs/bezi.png';
const MAX_SCORE = 5000;

type GothicguesserGameSummaryProps = {
  guesses: number[];
  totalScore: number;
};

const scoreToEmoji = (score: number) => {
  const ratio = score / MAX_SCORE;
  if (ratio >= 0.9) return '🟩';
  if (ratio >= 0.5) return '🟧';
  return '🟥';
};

const handleCopyToClipboard = (guesses: number[], totalScore: number) => {
  const emojis = guesses.map(scoreToEmoji).join('');
  const clipboardText =
    `Moj wynik w GothicGuesserze: ${totalScore}/${guesses.length * MAX_SCORE} pkt!\n` +
    emojis +
    `\n https://gothicdle.com/gothicguesser`;

  navigator.clipboard.writeText(clipboardText);
  toast.success('Skopiowano do schowka');
};

export const GothicguesserGameSummary = ({
  guesses,
  totalScore,
}: GothicguesserGameSummaryProps) => {
  return (
    <div className='mb-4 mt-8 flex flex-col items-center space-y-4'>
      <Image
        src={BEZI_PATH}
        width={150}
        height={150}
        alt='usmiechniety bezimienny'
      />
      <Text variant='subtitle'>
        Twoj wynik:{' '}
        <span className='text-green-500'>
          {totalScore} / {guesses.length * MAX_SCORE}
        </span>{' '}
        pkt
      </Text>
      <div className='flex flex-col items-start gap-1'>
        {guesses.map((score, i) => (
          <div key={i} className='flex flex-row items-center gap-3'>
            <span>{scoreToEmoji(score)}</span>
            <Text>Screenshot {i + 1}:</Text>
            <Text>{score} pkt</Text>
          </div>
        ))}
      </div>
      <Button size='sm' onClick={() => handleCopyToClipboard(guesses, totalScore)}>
        <FaRegCopy size={30} />
      </Button>
    </div>
  );
};
