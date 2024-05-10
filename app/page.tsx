'use client';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { MainGameCardSkeleton } from '@/modules/MainGameCard/MainGameCardSkeleton/MainGameCardSkeleton';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetCurrentCorrectCharacter } from '@/modules/characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { useGetCurrentCorrectCharacterTesting } from '@/modules/characters/testing/useGetCurrentCorrectCharacterTesting/useGetCurrentCharacterTesting';
import { Card } from '@/modules/ui/Card/Card';
import { ErrorMessage } from '@/modules/ui/ErrorMessage/ErrorMessage';

const ERROR_MSG =
  'Wystapil problem z ladowaniem gry. Sprobuj ponownie pozniej!';

export default function Home() {
  const currentCorrectCharacter = useGetCurrentCorrectCharacter();
  // const currentCorrectCharacter = useGetCurrentCorrectCharacterTesting();

  if (currentCorrectCharacter.isLoading) {
    return <MainGameCardSkeleton />;
  }

  if (!currentCorrectCharacter.isSuccess) {
    return (
      <Card>
        <ErrorMessage message={ERROR_MSG} />;
      </Card>
    );
  }

  const currentCorrectCharacterData = currentCorrectCharacter.data;

  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <TitleHeader />
        {currentCorrectCharacterData && (
          <MainGameCard
            correctCharacterId={currentCorrectCharacterData.characterId}
          />
        )}
        <Instructions />
      </main>
    </>
  );
}
