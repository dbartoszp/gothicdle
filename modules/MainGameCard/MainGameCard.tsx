import { ChangeEvent, useState } from 'react';
import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';
import { SearchResult } from './SearchResult/SearchResult';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';

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

const storedGameState = localStorage.getItem('gameState');

type MainGameCardProps = {
	correctCharacterId: number;
};

export const MainGameCard = ({ correctCharacterId }: MainGameCardProps) => {
	const correctCharacter = useGetCharacterById(correctCharacterId);

	const [searchInput, setSearchInput] = useState('');
	const [gameState, setGameState] = useState(
		storedGameState &&
			JSON.parse(storedGameState).date === defaultGameState.date
			? JSON.parse(storedGameState)
			: defaultGameState
	);

	const testGetCharactersByName = useGetCharactersByName(searchInput);

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
		console.log(guessId);
		localStorage.setItem(
			'gameState',
			JSON.stringify({
				...gameState,
				guesses: [...gameState.guesses, guessId],
			})
		);
		if (guessId === correctCharacterId) {
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

	if (correctCharacter.isLoading)
		return (
			<Card>
				<Skeleton width={300} height={100} />
			</Card>
		);
	if (!correctCharacter.isSuccess)
		return (
			<ErrorMessage message="Nastapil problem z wczytywaniem gry. Sproboj ponownie pozniej!" />
		);

	return (
		<Card>
			{!gameState.isCorrectlyGuessed && (
				<div className="my-6 text-sm">
					<Text>Wprowadz postac do odgadniecia!</Text>
				</div>
			)}
			{gameState.isCorrectlyGuessed ? (
				<div className="mb-6 mt-2 md:my-8">
					<Text variant="subtitle">
						Gratulacje! Dzisiejsza postac to{' '}
						<span className="text-green-500">
							{correctCharacter.data.imie}
						</span>
						!
					</Text>
				</div>
			) : (
				<div className="relative justify-center">
					<Searchbar
						onChange={handleInputChange}
						value={searchInput}
					/>
					<div className="absolute max-h-36 w-full overflow-y-auto border border-t-0 border-default-border md:max-h-72">
						{searchInput &&
							charactersAvailableToGuess?.map((character, i) => (
								<SearchResult
									onClick={() =>
										handleMakeNewGuess(character.id)
									}
									characterName={character.imie}
									key={character.imie}
								/>
							))}
					</div>
				</div>
			)}
			<div className="mt-4">
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
