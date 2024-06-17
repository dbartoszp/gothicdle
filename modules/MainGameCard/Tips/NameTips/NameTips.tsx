import { Text } from '@/modules/ui/Text/Text';
import React from 'react';

type NameTipsProps = {
  lettersUncovered: number;
  correctName: string;
};

export const NameTips = ({ lettersUncovered, correctName }: NameTipsProps) => {
  const uncoveredPart = correctName.slice(0, lettersUncovered);
  const hiddenPart = 'X'.repeat(correctName.length - lettersUncovered);

  return (
    <div>
      <Text variant='subtitle'>{uncoveredPart + hiddenPart}</Text>
    </div>
  );
};
