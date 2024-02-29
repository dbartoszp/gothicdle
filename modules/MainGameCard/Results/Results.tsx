import { useGetCharacterById } from '@/modules/characters/hooks/useGetCharacterById/useGetCharacterById';
import { GuessBox } from '../GuessBox/GuessBox';
import { Text } from '@/modules/ui/Text/Text';
import { joinArray } from '@/modules/characters/utils/joinArray';

type Character = {
  imie: string | null;
  przynaleznosc: (string | null)[];
  wystepowanie: (string | null)[];
  bron: (string | null)[];
  zbroja: (string | null)[];
  zdjecie: string | null;
};

type ResultsProps = {
  character: Character;
  inputCharacterId: number;
};

export const Results = ({ character, inputCharacterId }: ResultsProps) => {
  const inputCharacter = useGetCharacterById(inputCharacterId);

  if (inputCharacter.isLoading)
    return <Text variant='danger'>Loading gierki</Text>;
  if (!inputCharacter.isSuccess)
    return <Text variant='danger'>Error message</Text>;

  const inputCharacterStringified = {
    ...inputCharacter.data,
    przynaleznosc: joinArray(inputCharacter.data.przynaleznosc),
    wystepowanie: joinArray(inputCharacter.data.wystepowanie),
    bron: joinArray(inputCharacter.data.bron),
    zbroja: joinArray(inputCharacter.data.zbroja),
  };
  const correctCharacterStringified = {
    ...character,
    przynaleznosc: joinArray(character.przynaleznosc),
    wystepowanie: joinArray(character.wystepowanie),
    bron: joinArray(character.bron),
    zbroja: joinArray(character.zbroja),
  };

  return (
    <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full'>
      <GuessBox
        label='Postac'
        correctData={correctCharacterStringified.imie}
        inputData={inputCharacterStringified.imie}
      />
      <GuessBox
        label='Przynaleznosc'
        correctData={correctCharacterStringified.przynaleznosc}
        inputData={inputCharacterStringified.przynaleznosc}
      />
      <GuessBox
        label='Wystepowanie'
        correctData={correctCharacterStringified.wystepowanie}
        inputData={inputCharacterStringified.wystepowanie}
      />
      <GuessBox
        label='Bron'
        correctData={correctCharacterStringified.bron}
        inputData={inputCharacterStringified.bron}
      />
      <GuessBox
        label='Zbroja'
        correctData={correctCharacterStringified.zbroja}
        inputData={inputCharacterStringified.zbroja}
      />
    </div>
  );
};
