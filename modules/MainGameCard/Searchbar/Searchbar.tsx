import React, { ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';

type SearchbarProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
};

export const Searchbar: React.FC<SearchbarProps> = ({
  onChange,
  value = '',
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <input
      ref={inputRef}
      type='text'
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder='Wyszukaj imie postaci'
      value={value}
      className='w-72 border border-default-border bg-neutral-950 px-3 py-2 opacity-95 md:min-w-96'
      autoComplete='off'
    />
  );
};
