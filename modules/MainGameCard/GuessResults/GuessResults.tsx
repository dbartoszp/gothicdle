import { useGetCharacterById } from '@/modules/characters/hooks/useGetCharacterById/useGetCharacterById';
import { GuessBox } from '../GuessBox/GuessBox';
import { ErrorMessage } from '@/modules/ui/ErrorMessage/ErrorMessage';
import { GuessResultsSkeleton } from './GuessResultsSkeleton/GuessResultsSkeleton';
import { useGetCharacterTestingById } from '@/modules/characters/testing/useGetCharacterTestingById/useGetCharacterTestingById';
import { useGetCharacterByIdAndDatabase } from '@/modules/characters/hooks/useGetCharacterByIdAndDatabase/useGetCharacterByIdAndDatabase';

type Character = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  zdjecie: string | null;
};

type ResultsProps = {
  character: Character;
  inputCharacterId: number;
  database: string;
};

export const GuessResults = ({
  character,
  inputCharacterId,
  database,
}: ResultsProps) => {
  const inputCharacterData = useGetCharacterByIdAndDatabase({
    id: inputCharacterId,
    database,
  });
  // const inputCharacterData = useGetCharacterTestingById(inputCharacterId);

  if (inputCharacterData.isLoading) return <GuessResultsSkeleton />;
  if (!inputCharacterData.isSuccess)
    return (
      <ErrorMessage message='Nie udalo sie wczytac postaci. Sprobuj ponownie pozniej!' />
    );

  const inputCharacter = inputCharacterData.data;

  return (
    <>
      <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full md:space-x-12'>
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
    </>
  );
};
