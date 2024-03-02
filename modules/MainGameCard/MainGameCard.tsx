'use client';

import { ChangeEvent, useState } from 'react';
import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Button } from '../ui/Button/Button';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';

const TEST_INPUT_CHAR_ID = 1;
const TEST_CORRECT_CHAR_ID = 2;

export const MainGameCard = () => {
  const character = useGetCharacterById(TEST_CORRECT_CHAR_ID);
  const [searchInput, setSearchInput] = useState('');
  const [guessesMade, setGuessesMade] = useState([]);
  const testGetCharactersByName = useGetCharactersByName(searchInput);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (character.isLoading) return <Text variant='danger'>Loading gierki</Text>;
  if (!character.isSuccess) return <Text variant='danger'>Error message</Text>;

  return (
    <Card>
      <Searchbar
        onChange={handleInputChange}
        onSubmit={() => console.log(testGetCharactersByName.data)}
        value={searchInput}
        // searchResults={testGetCharactersByName.data}
      />
      {searchInput &&
        testGetCharactersByName?.data?.map((character) => (
          <Text key={character.imie}>{character.imie}</Text>
        ))}

      <GuessResults
        character={character.data}
        inputCharacterId={TEST_INPUT_CHAR_ID}
      />
      <Text>Dzisiejsza postac to {character.data.imie}</Text>
    </Card>
  );
};
