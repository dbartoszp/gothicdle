'use client';
import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetCurrentCorrectCharacter } from '@/modules/characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { useSetNextNewCurrentCorrectCharacter } from '@/modules/characters/hooks/useSetNextNewCurrentCorrectCharacter/useSetNextNewCurrentCorrectCharacter';
import { Button } from '@/modules/ui/Button/Button';

export default function Home() {
  const currectCorrectCharacter = useGetCurrentCorrectCharacter();
  const setNextCorrectCharacter = useSetNextNewCurrentCorrectCharacter();

  const handleNextNewCharacter = () => {
    setNextCorrectCharacter.mutate();
  };

  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <Button onClick={handleNextNewCharacter}>
          {currectCorrectCharacter.data}
        </Button>
        <TitleHeader />
        {currectCorrectCharacter.data && (
          <MainGameCard correctCharacterId={currectCorrectCharacter.data} />
        )}
        <Instructions />
      </main>
      <Footer />
    </>
  );
}
