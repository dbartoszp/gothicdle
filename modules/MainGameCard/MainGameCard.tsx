'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';
import { SearchResult } from './SearchResult/SearchResult';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import { GameSummary } from './GameSummary/GameSummary';
import { Tips } from './Tips/Tips';
import { useSearchParams } from 'next/navigation';
import { useGetCurrentCorrectCharacterByDatabase } from '../characters/hooks/useGetCurrentCorrectCharacterByDatabase/useGetCurrentCorrectCharacterByDatabase';
import { useGetCharactersByDatabaseAndName } from '../characters/hooks/useGetCharactersByDatabaseAndName/useGetCharactersByDatabaseAndName';
import { capitalizeFirstLetterOfWord } from '../characters/utils/capitalizeFirstLetterOfWord';
import { DatabaseSelect } from '../DatabaseSelect/DatabaseSelect';

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const formattedDate = `${day}-${month}-${year}`;

const defaultGameState = {
  date: formattedDate,
  guesses: [],
  isCorrectlyGuessed: false,
};

let storedGameState = JSON.stringify(defaultGameState);

export const MainGameCard = () => {
  const searchParams = useSearchParams();
  const searchParam = capitalizeFirstLetterOfWord(
    searchParams.get('database') || 'wybrane'
  );

  const correctCharacter = useGetCurrentCorrectCharacterByDatabase(
    searchParam || 'Wybrane'
  );

  const getStoredGameState = (param: string) => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(`gameState${param}`) ||
        JSON.stringify(defaultGameState)
      );
    }
    return JSON.stringify(defaultGameState);
  };

  const [searchInput, setSearchInput] = useState('');
  const [gameState, setGameState] = useState(
    storedGameState &&
      JSON.parse(storedGameState).date === defaultGameState.date
      ? JSON.parse(storedGameState)
      : defaultGameState
  );

  const [showSearchbar, setShowSearchbar] = useState(true);
  const [showCongratulatoryMessage, setShowCongratulatoryMessage] =
    useState(false);

  const getCharactersByName = useGetCharactersByDatabaseAndName({
    name: searchInput,
    database: searchParam,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleMakeNewGuess = (guessId: number) => {
    setSearchInput('');
    setGameState({
      ...gameState,
      guesses: [...gameState.guesses, guessId],
    });
    localStorage.setItem(
      `gameState${searchParam}`,
      JSON.stringify({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
      })
    );
    if (guessId === correctCharacter.data?.id) {
      setShowSearchbar(false);
      setGameState({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
        isCorrectlyGuessed: true,
      });
      localStorage.setItem(
        `gameState${searchParam}`,
        JSON.stringify({
          ...gameState,
          guesses: [...gameState.guesses, guessId],
          isCorrectlyGuessed: true,
        })
      );
    }
  };

  const charactersAvailableToGuess = getCharactersByName?.data
    ?.filter((character) => !gameState.guesses.includes(character.id))
    ?.sort((a, b) => a.imie.localeCompare(b.imie));

  useEffect(() => {
    if (gameState.isCorrectlyGuessed) {
      const timeoutId = setTimeout(() => {
        setShowCongratulatoryMessage(true);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.isCorrectlyGuessed]);

  useEffect(() => {
    setGameState(
      getStoredGameState(searchParam) &&
        JSON.parse(getStoredGameState(searchParam)).date ===
          defaultGameState.date
        ? JSON.parse(getStoredGameState(searchParam))
        : defaultGameState
    );
  }, [searchParam]);
  if (correctCharacter.isLoading) {
    return (
      <Card>
        <Skeleton width={300} height={100} />
      </Card>
    );
  }
  if (!correctCharacter.isSuccess) {
    return (
      <>
        <ErrorMessage message='Nastapil problem z wczytywaniem gry. Sprobuj ponownie pozniej!' />
      </>
    );
  }

  return (
    <Card>
      <DatabaseSelect currentDatabase={searchParam} />
      {!gameState.isCorrectlyGuessed && (
        <>
          <div>
            <Tips
              guessesMadeCount={gameState.guesses.length}
              correctCharacter={correctCharacter.data}
            />
          </div>
          <div className='my-6 text-sm'>
            <Text>Wprowadz postac do odgadniecia!</Text>
          </div>
        </>
      )}

      {showCongratulatoryMessage && (
        <div className='mb-6 mt-2 md:my-8'>
          <Text variant='subtitle'>
            Gratulacje! Dzisiejsza postac to{' '}
            <span className='text-green-500'>{correctCharacter.data.imie}</span>
            !
          </Text>
          <GameSummary
            database={searchParam}
            guesses={gameState.guesses}
            correctCharacter={correctCharacter.data}
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
        {gameState.guesses.length > 0 &&
          gameState.guesses
            .slice()
            .reverse()
            .map((id: number) => (
              <GuessResults
                key={id}
                character={correctCharacter.data}
                inputCharacterId={id}
                database={searchParam}
              />
            ))}
      </div>
    </Card>
  );
};
