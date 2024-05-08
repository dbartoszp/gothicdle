import React, { ChangeEvent, MouseEvent } from 'react';

type SearchbarProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export const Searchbar: React.FC<SearchbarProps> = ({
  onChange,
  value = '',
}) => {
  return (
    <input
      type='text'
      onChange={onChange}
      placeholder='Wyszukaj imie postaci'
      value={value}
      className=' w-72 border border-default-border bg-neutral-950 px-3 py-2 opacity-95 md:min-w-96'
      autoComplete='off'
    />
  );
};
