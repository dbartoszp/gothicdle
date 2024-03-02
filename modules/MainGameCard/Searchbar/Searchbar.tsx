import { Button } from '@/modules/ui/Button/Button';
import { Text } from '@/modules/ui/Text/Text';
import React, { ChangeEvent, MouseEvent } from 'react';

type Character = {
  imie: string;
  bron: string[];
  zbroja: string[];
  przynaleznosc: string[];
  wystepowanie: string[];
  zdjecie: string;
};

type SearchbarProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
  //   searchResults: Character[];
  value: string;
};

export const Searchbar: React.FC<SearchbarProps> = ({
  onChange,
  onSubmit,
  value = '',
}) => {
  return (
    <div>
      <input
        type='text'
        onChange={onChange}
        placeholder='Search'
        value={value}
        className='border border-default-border bg-neutral-950 px-2 py-1 opacity-80'
        autoComplete='off'
      />
      {/* <Button size='md' onClick={onSubmit}>
        <Text>Submit</Text>
      </Button> */}
    </div>
  );
};
