import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import { MouseEvent } from 'react';

type SearchResultProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  characterName: string;
};

export const SearchResult = ({ onClick, characterName }: SearchResultProps) => {
  return (
    <Button onClick={onClick}>
      <Text>{characterName}</Text>
    </Button>
  );
};
