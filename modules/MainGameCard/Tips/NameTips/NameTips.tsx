import { Text } from '@/modules/ui/Text/Text';
import React from 'react';

type NameTipsProps = {
  lettersUncovered: number;
  correctName: string;
};

export const NameTips = ({ lettersUncovered, correctName }: NameTipsProps) => {
  const validLettersUncovered = Math.min(lettersUncovered, correctName.length);

  const uncoveredPart = correctName.slice(0, validLettersUncovered);
  const hiddenPart = 'X'.repeat(correctName.length - validLettersUncovered);

  return (
    <div>
      <Text variant='subtitle'>{uncoveredPart + hiddenPart}</Text>
    </div>
  );
};
