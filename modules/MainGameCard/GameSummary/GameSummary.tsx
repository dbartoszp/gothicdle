import { useGetMultipleCharactersByIds } from '@/modules/characters/hooks/useGetMultipleCharactersByIds/useGetMultipleCharactersByIds';
import { ErrorMessage } from '@/modules/ui/ErrorMessage/ErrorMessage';

type Character = {
	imie: string;
	przynaleznosc: string[];
	wystepowanie: string[];
	bron: string[];
	zbroja: string[];
	zdjecie: string;
};

type GameSummaryProps = {
	guesses: number[];
	correctCharacter: Character;
};

export const GameSummary = ({
	guesses,
	correctCharacter,
}: GameSummaryProps) => {
	const characters = useGetMultipleCharactersByIds(guesses);

	if (!characters.isSuccess)
		return (
			<ErrorMessage message="Nie udalo sie wczytac podsumowania. Sprobuj ponownie pozniej!" />
		);

	console.log(characters.data);
	return <div>{guesses}</div>;
};
