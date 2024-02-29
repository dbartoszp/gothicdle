'use client';

import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { Results } from './Results/Results';

const TEST_CHAR_ID = 2;

export const MainGameCard = () => {
  const character = useGetCharacterById(1);

  if (character.isLoading) return <Text variant='danger'>Loading gierki</Text>;
  if (!character.isSuccess) return <Text variant='danger'>Error message</Text>;
  return (
    <Card>
      <Text variant='danger'>Tu jakis searchbar</Text>
      <Results character={character.data} inputCharacterId={TEST_CHAR_ID} />
      <Text>Dzisiejsza postac to {character.data.imie}</Text>
    </Card>
  );
};
