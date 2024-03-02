import { arraysHaveCommonItems } from '@/modules/characters/utils/arraysHaveCommonItems';
import { arraysHaveSameItems } from '@/modules/characters/utils/arraysHaveSameItems';
import { Text } from '@/modules/ui/Text/Text';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type GuessBoxProps = {
  label: string;
  correctData: string | string[];
  inputData: string | string[];
  delay: number;
};

export const GuessBox = ({
  label,
  correctData,
  inputData,
  delay,
}: GuessBoxProps) => {
  const areArrays = Array.isArray(correctData) && Array.isArray(inputData);

  const isInputDataCorrect =
    (!areArrays && inputData === correctData) ||
    (areArrays && arraysHaveSameItems(inputData, correctData));

  const haveCommonElements =
    areArrays && arraysHaveCommonItems(inputData, correctData);
  const boxClasses = clsx(
    'aspect-square md:w-32 md:h-32 w-24 h-24 border border-default-border flex items-center justify-center',
    {
      'bg-green-700': isInputDataCorrect,
      'bg-orange-700': haveCommonElements && !isInputDataCorrect,
      'bg-red-700': !isInputDataCorrect && !haveCommonElements,
    }
  );

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 text-xs md:text-sm`}
    >
      <Text>{label}</Text>
      <div className={boxClasses} style={{ animationDelay: `${delay}ms` }}>
        <Text>{areArrays ? inputData.join(', ') : inputData}</Text>
      </div>
    </div>
  );
};
