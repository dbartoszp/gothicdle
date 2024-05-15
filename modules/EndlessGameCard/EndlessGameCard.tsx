'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import { useGetCharacterTestingById } from '../characters/testing/useGetCharacterTestingById/useGetCharacterTestingById';
import { useGetCharactersTestingByName } from '../characters/testing/useGetCharactersTestingByName/useGetCharactersTestingByName';
import { useGetCurrentCorrectCharacterTesting } from '../characters/testing/useGetCurrentCorrectCharacterTesting/useGetCurrentCharacterTesting';
import { useGetCurrentCorrectCharacter } from '../characters/hooks/useGetCurrentCorrectCharacter/useGetCurrentCorrectCharacter';
import { GameSummary } from '../MainGameCard/GameSummary/GameSummary';
import { Searchbar } from '../MainGameCard/Searchbar/Searchbar';
import { SearchResult } from '../MainGameCard/SearchResult/SearchResult';
import { GuessResults } from '../MainGameCard/GuessResults/GuessResults';
import { Button } from '../ui/Button/Button';
import { useGetAllCharactersClassic } from '../characters/hooks/useGetAllCharactersClassic/useGetAllCharacters';
import { getAllCharactersClassic } from '../characters/hooks/useGetAllCharactersClassic/apiUseGetAllCharactersClassic';
import { usePathname } from 'next/navigation';

// const currentDate = new Date();
// const day = currentDate.getDate();
// const month = currentDate.getMonth() + 1;
// const year = currentDate.getFullYear();

// const formattedDate = `${day}-${month}-${year}`;

const defaultGameState = {
  //   charactersGuessed: 0,
  guesses: [],
  isCorrectlyGuessed: false,
};

const CHARACTERS_COUNT = 121;

let storedGameState = JSON.stringify(defaultGameState);

export const EndlessGameCard = () => {
  if (typeof window !== 'undefined') {
    storedGameState =
      localStorage.getItem('gameStateEndless') ||
      JSON.stringify(defaultGameState);
  }

  const pathName = usePathname();
  const [searchInput, setSearchInput] = useState('');
  const [gameState, setGameState] = useState(
    storedGameState ? JSON.parse(storedGameState) : defaultGameState
  );
  const [correctCharacterIndex, setCorrectCharacterIndex] = useState(
    Math.floor(Math.random() * (CHARACTERS_COUNT + 1))
  );
  const [showSearchbar, setShowSearchbar] = useState(true);
  const [showCongratulatoryMessage, setShowCongratulatoryMessage] =
    useState(false);

  const getCharactersByName = useGetCharactersByName(searchInput);
  const allCharactersClassic = useGetAllCharactersClassic();

  useEffect(() => {
    if (gameState.isCorrectlyGuessed) {
      const timeoutId = setTimeout(() => {
        setShowCongratulatoryMessage(true);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.isCorrectlyGuessed]);

  useEffect(() => {
    console.log(`Route changed to: ${pathName}`);
    localStorage.removeItem('gameStateEndless');
  }, [pathName]);

  if (!allCharactersClassic.isSuccess) {
    return (
      <ErrorMessage message='Nastapil problem z wczytywaniem postaci. Sprobuj ponownie pozniej!' />
    );
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleNextCharacter = () => {
    setShowCongratulatoryMessage(false);
    setShowSearchbar(true);
    setGameState(defaultGameState);
    setCorrectCharacterIndex(
      Math.floor(Math.random() * (CHARACTERS_COUNT + 1))
    );
  };

  const handleMakeNewGuess = (guessId: number) => {
    if (allCharactersClassic.data) {
      setSearchInput('');
      setGameState({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
      });
      localStorage.setItem(
        'gameStateEndless',
        JSON.stringify({
          ...gameState,
          guesses: [...gameState.guesses, guessId],
        })
      );
      if (guessId === allCharactersClassic.data[correctCharacterIndex].id) {
        setShowSearchbar(false);
        setGameState({
          ...gameState,
          guesses: [...gameState.guesses, guessId],
          isCorrectlyGuessed: true,
        });
        localStorage.setItem(
          'gameStateEndless',
          JSON.stringify({
            ...gameState,
            guesses: [...gameState.guesses, guessId],
            isCorrectlyGuessed: true,
          })
        );
      }
    }
  };

  const charactersAvailableToGuess = getCharactersByName?.data?.filter(
    (character) => !gameState.guesses.includes(character.id)
  );

  //   if (correctCharacter.isLoading) {
  //     return (
  //       <Card>
  //         <Skeleton width={300} height={100} />
  //       </Card>
  //     );
  //   }
  //   if (!correctCharacter.isSuccess) {
  //     return (
  //       <>
  //         <ErrorMessage message='Nastapil problem z wczytywaniem gry. Sprobuj ponownie pozniej!' />
  //       </>
  //     );
  //   }

  return (
    <Card>
      {!gameState.isCorrectlyGuessed && (
        <div className='my-6 text-sm'>
          <Text>Wprowadz postac do odgadniecia!</Text>
          {allCharactersClassic.data[correctCharacterIndex].imie}
        </div>
      )}
      {showCongratulatoryMessage && (
        <div className='mb-6 mt-2 flex flex-col space-y-2 md:my-8'>
          <Text variant='subtitle'>
            Gratulacje! Szukana postac to{' '}
            <span className='text-green-500'>
              {allCharactersClassic.data[correctCharacterIndex].imie}
            </span>
            !
          </Text>
          <Button size='sm' onClick={handleNextCharacter}>
            Wylosuj kolejna postac
          </Button>
          <GameSummary
            guesses={gameState.guesses}
            correctCharacter={allCharactersClassic.data[correctCharacterIndex]}
            isEndless={true}
          />
        </div>
      )}

      <div className='relative justify-center'>
        {showSearchbar && !gameState.isCorrectlyGuessed && (
          <>
            <Searchbar
              onChange={handleInputChange}
              value={searchInput}
              onSubmit={() => {
                if (
                  searchInput &&
                  charactersAvailableToGuess &&
                  charactersAvailableToGuess.length > 0
                ) {
                  handleMakeNewGuess(charactersAvailableToGuess[0].id);
                }
              }}
            />
            <div className='absolute max-h-36 w-full overflow-y-auto border border-t-0 border-default-border md:max-h-72'>
              {searchInput &&
                charactersAvailableToGuess?.map((character) => (
                  <SearchResult
                    onClick={() => handleMakeNewGuess(character.id)}
                    characterName={character.imie}
                    key={character.imie}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      <div className='mt-4'>
        {allCharactersClassic.data[correctCharacterIndex] &&
          gameState.guesses.length > 0 &&
          gameState.guesses
            .slice()
            .reverse()
            .map((id: number) => (
              <GuessResults
                key={id}
                character={allCharactersClassic.data[correctCharacterIndex]}
                inputCharacterId={id}
              />
            ))}
      </div>
    </Card>
  );
};
