'use client';
import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetCurrentCorrectCharacter } from '@/modules/characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { Text } from '@/modules/ui/Text/Text';

export default function Home() {
  const currentCorrectCharacter = useGetCurrentCorrectCharacter();

  if (!currentCorrectCharacter.isSuccess) {
    return <Text>ERROR</Text>;
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
      <Footer />
    </>
  );
}
