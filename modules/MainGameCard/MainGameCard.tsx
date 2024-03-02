'use client';

import { ChangeEvent, useState } from 'react';
import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';
import { SearchResult } from './SearchResult/SearchResult';

const TEST_INPUT_CHAR_ID = 1;
const TEST_CORRECT_CHAR_ID = 1;

export const MainGameCard = () => {
  const correctCharacter = useGetCharacterById(TEST_CORRECT_CHAR_ID);

  const [isGuessed, setIsGuessed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [guessesMade, setGuessesMade] = useState<number[]>([]);

  const testGetCharactersByName = useGetCharactersByName(searchInput);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleMakeNewGuess = (guessId: number) => {
    const newGuesses = [...guessesMade, guessId];
    setGuessesMade(newGuesses);
    setSearchInput('');
    if (guessId === TEST_CORRECT_CHAR_ID) setIsGuessed(true);
  };

  const charactersAvailableToGuess = testGetCharactersByName?.data?.filter(
    (character) => !guessesMade.includes(character.id)
  );

  if (correctCharacter.isLoading)
    return <Text variant='danger'>Loading gierki</Text>;
  if (!correctCharacter.isSuccess)
    return <Text variant='danger'>Error message</Text>;

  return (
    <Card>
      {isGuessed ? (
        <div className='mb-6 mt-2 md:my-8'>
          <Text variant='subtitle'>
            Gratulacje! Dzisiejsza postac to{' '}
            <span className='text-green-500'>{correctCharacter.data.imie}</span>
            !
          </Text>
        </div>
      ) : (
        <div className='relative justify-center'>
          <Searchbar onChange={handleInputChange} value={searchInput} />
          <div className='absolute max-h-36 w-full overflow-y-auto border border-t-0 border-default-border md:max-h-72'>
            {searchInput &&
              charactersAvailableToGuess?.map((character, i) => (
                <SearchResult
                  onClick={() => handleMakeNewGuess(character.id)}
                  characterName={character.imie}
                  key={character.imie}
                />
              ))}
          </div>
        </div>
      )}
      {!isGuessed && guessesMade.length === 0 && (
        <div className='my-6 text-sm'>
          <Text>Wprowadz pierwsza postac do odgadniecia!</Text>
        </div>
      )}
      {guessesMade && (
        <div className='mt-4'>
          {guessesMade
            .slice()
            .reverse()
            .map((id) => (
              <GuessResults
                key={id}
                character={correctCharacter.data}
                inputCharacterId={id}
              />
            ))}
        </div>
      )}
    </Card>
  );
};
