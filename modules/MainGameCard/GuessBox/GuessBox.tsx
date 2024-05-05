import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Text } from '@/modules/ui/Text/Text';
import { arraysHaveCommonItems } from '@/modules/characters/utils/arraysHaveCommonItems';
import { arraysHaveSameItems } from '@/modules/characters/utils/arraysHaveSameItems';

type GuessBoxProps = {
  label: string;
  correctData: string | string[];
  inputData: string | string[];
  variant?: string;
  delay: number;
};

export const GuessBox: React.FC<GuessBoxProps> = ({
  label,
  correctData,
  inputData,
  delay,
  variant,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [delay]);

  const areArrays = Array.isArray(correctData) && Array.isArray(inputData);
  const isInputDataCorrect =
    (!areArrays && inputData === correctData) ||
    (areArrays && arraysHaveSameItems(inputData, correctData));

  const haveCommonElements =
    areArrays && arraysHaveCommonItems(inputData, correctData);

  const boxClasses = clsx(
    'aspect-square md:w-40 md:h-40 w-32 h-32 border border-default-border flex items-center justify-center transition-opacity duration-500',
    {
      'bg-green-700': isInputDataCorrect || variant === 'correct',
      'bg-orange-700':
        (haveCommonElements && !isInputDataCorrect) || variant === 'partial',
      'bg-red-700':
        (!isInputDataCorrect && !haveCommonElements) || variant === 'incorrect',
      'opacity-0': !isVisible,
      'animate-flipFadeIn': isVisible,
    }
  );

  return (
    <div className='flex flex-col items-center justify-center space-y-2 text-xs'>
      <Text>{label}</Text>
      <div className={boxClasses}>
        <Text variant='small'>
          {areArrays ? inputData.join(', ') : inputData}
        </Text>
      </div>
    </div>
  );
};
