import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import { MouseEvent } from 'react';

type SearchResultProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  characterName: string;
};

export const SearchResult = ({ onClick, characterName }: SearchResultProps) => {
  return (
    <button
      className='w-full border border-default-border bg-neutral-950 py-2 opacity-90'
      onClick={onClick}
    >
      <Text>{characterName}</Text>
    </button>
  );
};
