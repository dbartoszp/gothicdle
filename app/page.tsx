'use client';
import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetPreviousCorrectCharacters } from '@/modules/characters/hooks/useGetPreviousCorrectCharacters/useGetPreviousCorrectCharacters';
import { Button } from '@/modules/ui/Button/Button';

const TEST_CORRECT_CHARACTER_ID = 1;

export default function Home() {
  const previousCorrectCharacters = useGetPreviousCorrectCharacters();

  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <Button onClick={() => console.log(previousCorrectCharacters.data)}>
          test
        </Button>
        <TitleHeader />
        <MainGameCard correctCharacterId={TEST_CORRECT_CHARACTER_ID} />
        <Instructions />
      </main>
      <Footer />
    </>
  );
}
