'use client';
import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { useGetCurrentCorrectCharacter } from '@/modules/characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { useGetPreviousCorrectCharacters } from '@/modules/characters/hooks/useGetPreviousCorrectCharacters/useGetPreviousCorrectCharacters';
import { Button } from '@/modules/ui/Button/Button';
import { useEffect } from 'react';

let correctCharacterId = 1;

export default function Home() {
  const previousCorrectCharacters = useGetPreviousCorrectCharacters();
  const currectCorrectCharacter = useGetCurrentCorrectCharacter();

  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <Button onClick={() => console.log(currectCorrectCharacter)}>
          test
        </Button>
        <TitleHeader />
        <MainGameCard correctCharacterId={correctCharacterId} />
        <Instructions />
      </main>
      <Footer />
    </>
  );
}
