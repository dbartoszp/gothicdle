import React, { useState, useEffect, ChangeEvent } from 'react';
import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';
import { SearchResult } from './SearchResult/SearchResult';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import { GameSummary } from './GameSummary/GameSummary';
import { useGetCharacterTestingById } from '../characters/testing/useGetCharacterTestingById/useGetCharacterById';
import { useGetCharactersTestingByName } from '../characters/testing/useGetCharactersTestingByName/useGetCharactersTestingByName';

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

// const storedGameState = localStorage.getItem('gameState');
let storedGameState = JSON.stringify(defaultGameState);

type MainGameCardProps = {
  correctCharacterId: number;
};

export const MainGameCard = ({ correctCharacterId }: MainGameCardProps) => {
  // const correctCharacter = useGetCharacterById(correctCharacterId);
  const correctCharacter = useGetCharacterTestingById(correctCharacterId);

  if (typeof window !== 'undefined') {
    storedGameState =
      localStorage.getItem('gameState') || JSON.stringify(defaultGameState);
  }

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

  // const testGetCharactersByName = useGetCharactersByName(searchInput);
  const testGetCharactersByName = useGetCharactersTestingByName(searchInput);

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
      'gameState',
      JSON.stringify({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
      })
    );
    if (guessId === correctCharacterId) {
      setShowSearchbar(false);
      setGameState({
        ...gameState,
        guesses: [...gameState.guesses, guessId],
        isCorrectlyGuessed: true,
      });
      localStorage.setItem(
        'gameState',
        JSON.stringify({
          ...gameState,
          guesses: [...gameState.guesses, guessId],
          isCorrectlyGuessed: true,
        })
      );
    }
  };

  const charactersAvailableToGuess = testGetCharactersByName?.data?.filter(
    (character) => !gameState.guesses.includes(character.id)
  );

  useEffect(() => {
    if (gameState.isCorrectlyGuessed) {
      const timeoutId = setTimeout(() => {
        setShowCongratulatoryMessage(true);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.isCorrectlyGuessed]);

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
        {correctCharacter.data?.id}
        <ErrorMessage message='Nastapil problem z wczytywaniem gry. Sprobuj ponownie pozniej!' />
      </>
    );
  }

  return (
    <Card>
      {!gameState.isCorrectlyGuessed && (
        <div className='my-6 text-sm'>
          <Text>Wprowadz postac do odgadniecia!</Text>
        </div>
      )}

      {showCongratulatoryMessage && (
        <div className='mb-6 mt-2 md:my-8'>
          <Text variant='subtitle'>
            Gratulacje! Dzisiejsza postac to{' '}
            <span className='text-green-500'>{correctCharacter.data.imie}</span>
            !
          </Text>
          <GameSummary
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
              />
            ))}
      </div>
    </Card>
  );
};
