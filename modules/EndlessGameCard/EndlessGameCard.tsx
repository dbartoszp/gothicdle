'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import { GameSummary } from '../MainGameCard/GameSummary/GameSummary';
import { Searchbar } from '../MainGameCard/Searchbar/Searchbar';
import { SearchResult } from '../MainGameCard/SearchResult/SearchResult';
import { GuessResults } from '../MainGameCard/GuessResults/GuessResults';
import { Button } from '../ui/Button/Button';
import { useGetAllCharactersClassic } from '../characters/hooks/useGetAllCharactersClassic/useGetAllCharacters';
import { Tips } from '../MainGameCard/Tips/Tips';
import { useSearchParams } from 'next/navigation';
import { capitalizeFirstLetterOfWord } from '../characters/utils/capitalizeFirstLetterOfWord';
import { useGetCharactersByDatabaseAndName } from '../characters/hooks/useGetCharactersByDatabaseAndName/useGetCharactersByDatabaseAndName';
import { DatabaseSelect } from '../DatabaseSelect/DatabaseSelect';
import { useGetAllCharactersByDatabase } from '../characters/hooks/useGetAllCharactersByDatabase/useGetAllCharactersByDatabase';

const defaultGameState = {
  guesses: [] as number[],
  isCorrectlyGuessed: false,
};

const CHARACTERS_COUNT = 124;

export const EndlessGameCard = () => {
  const searchParams = useSearchParams();
  const searchParam = capitalizeFirstLetterOfWord(
    searchParams.get('database') || 'wybrane'
  );
  const [searchInput, setSearchInput] = useState('');

  const getCharactersByName = useGetCharactersByDatabaseAndName({
    name: searchInput,
    database: searchParam,
  });

  const allCharactersByDatabase = useGetAllCharactersByDatabase(searchParam);

  const [gameState, setGameState] = useState(defaultGameState);
  const [correctCharacterIndex, setCorrectCharacterIndex] = useState(
    Math.floor(Math.random() * (getCharactersByName.data?.length || 0))
  );

  const [showSearchbar, setShowSearchbar] = useState(true);
  const [showCongratulatoryMessage, setShowCongratulatoryMessage] =
    useState(false);

  useEffect(() => {
    if (gameState.isCorrectlyGuessed) {
      const timeoutId = setTimeout(() => {
        setShowCongratulatoryMessage(true);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.isCorrectlyGuessed]);

  if (allCharactersByDatabase.isLoading) {
    return (
      <Card>
        <Skeleton width={300} height={100} />
      </Card>
    );
  }

  if (!allCharactersByDatabase.isSuccess) {
    return (
      <>
        <ErrorMessage message='Nastapil problem z wczytywaniem gry. Sprobuj ponownie pozniej!' />
      </>
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
      Math.floor(Math.random() * (getCharactersByName.data?.length || 0))
    );
  };

  const handleMakeNewGuess = (guessId: number) => {
    if (allCharactersByDatabase.data) {
      setSearchInput('');
      setGameState({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
      });
      if (guessId === allCharactersByDatabase.data[correctCharacterIndex].id) {
        setShowSearchbar(false);
        setGameState({
          ...gameState,
          guesses: [...gameState.guesses, guessId],
          isCorrectlyGuessed: true,
        });
      }
    }
  };

  const charactersAvailableToGuess = getCharactersByName?.data
    ?.filter((character) => !gameState.guesses.includes(character.id))
    ?.sort((a, b) => a.imie.localeCompare(b.imie));

  if (allCharactersByDatabase.isLoading) {
    return (
      <Card>
        <Skeleton width={300} height={100} />
      </Card>
    );
  }
  if (!allCharactersByDatabase.isSuccess) {
    return (
      <>
        <ErrorMessage message='Nastapil problem z wczytywaniem gry. Sprobuj ponownie pozniej!' />
      </>
    );
  }
  return (
    <Card>
      <DatabaseSelect isEndless={true} currentDatabase={searchParam} />
      {getCharactersByName.data?.length}
      {allCharactersByDatabase.data[correctCharacterIndex]?.imie}
      {!gameState.isCorrectlyGuessed && (
        <>
          <div>
            <Tips
              guessesMadeCount={gameState.guesses.length}
              correctCharacter={
                allCharactersByDatabase.data[correctCharacterIndex]
              }
            />
          </div>
          <div className='my-6 text-sm'>
            <Text>Wprowadz postac do odgadniecia!</Text>
          </div>
        </>
      )}
      {showCongratulatoryMessage && (
        <div className='mb-6 mt-2 flex flex-col space-y-2 md:my-8 md:space-y-6'>
          <Text variant='subtitle'>
            Gratulacje! Szukana postac to{' '}
            <span className='text-green-500'>
              {allCharactersByDatabase.data[correctCharacterIndex]?.imie}
            </span>
            !
          </Text>
          <div>
            <Button size='md' onClick={handleNextCharacter}>
              Wylosuj kolejna postac
            </Button>
          </div>
          <GameSummary
            guesses={gameState.guesses}
            correctCharacter={
              allCharactersByDatabase.data[correctCharacterIndex]
            }
            isEndless={true}
            database={searchParam}
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
        {allCharactersByDatabase.data[correctCharacterIndex] &&
          gameState.guesses.length > 0 &&
          gameState.guesses
            .slice()
            .reverse()
            .map((id: number) => (
              <GuessResults
                key={id}
                character={allCharactersByDatabase.data[correctCharacterIndex]}
                inputCharacterId={id}
                database={searchParam}
              />
            ))}
      </div>
    </Card>
  );
};
