import { useGetCharacterById } from '@/modules/characters/hooks/useGetCharacterById/useGetCharacterById';
import { GuessBox } from '../GuessBox/GuessBox';
import { Text } from '@/modules/ui/Text/Text';

type Character = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  zdjecie: string;
};

type ResultsProps = {
  character: Character;
  inputCharacterId: number;
};

export const GuessResults = ({ character, inputCharacterId }: ResultsProps) => {
  const inputCharacterData = useGetCharacterById(inputCharacterId);

  if (inputCharacterData.isLoading)
    return <Text variant='danger'>Loading gierki</Text>;
  if (!inputCharacterData.isSuccess)
    return <Text variant='danger'>Error message</Text>;

  const inputCharacter = inputCharacterData.data;

  return (
    <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full'>
      <GuessBox
        label='Postac'
        correctData={character.imie}
        inputData={inputCharacter.imie}
        delay={0}
      />
      <GuessBox
        label='Przynaleznosc'
        correctData={character.przynaleznosc}
        inputData={inputCharacter.przynaleznosc}
        delay={500}
      />
      <GuessBox
        label='Wystepowanie'
        correctData={character.wystepowanie}
        inputData={inputCharacter.wystepowanie}
        delay={1000}
      />
      <GuessBox
        label='Bron'
        correctData={character.bron}
        inputData={inputCharacter.bron}
        delay={1500}
      />
      <GuessBox
        label='Zbroja'
        correctData={character.zbroja}
        inputData={inputCharacter.zbroja}
        delay={2000}
      />
    </div>
  );
};
