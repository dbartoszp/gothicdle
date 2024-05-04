import { useGetMultipleCharactersByIds } from '@/modules/characters/hooks/useGetMultipleCharactersByIds/useGetMultipleCharactersByIds';
import { arraysHaveCommonItems } from '@/modules/characters/utils/arraysHaveCommonItems';
import { arraysHaveSameItems } from '@/modules/characters/utils/arraysHaveSameItems';
import { Button } from '@/modules/ui/Button/Button';
import { ErrorMessage } from '@/modules/ui/ErrorMessage/ErrorMessage';
import { Text } from '@/modules/ui/Text/Text';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';

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

const compareData = (
	correctData: string | string[],
	inputData: string | string[]
) => {
	const areArrays = Array.isArray(correctData) && Array.isArray(inputData);

	const isInputDataCorrect =
		(!areArrays && inputData === correctData) ||
		(areArrays && arraysHaveSameItems(inputData, correctData));

	const haveCommonElements =
		areArrays && arraysHaveCommonItems(inputData, correctData);

	if (isInputDataCorrect) {
		return '🟩';
	} else if (haveCommonElements && !isInputDataCorrect) {
		return '🟧';
	} else {
		return '🟥';
	}
};

const handleCopyToClipboard = (rows: string[][]) => {
	const formattedText = rows
		.map((singleRow) => singleRow.join(''))
		.join('\n');

	const clipboardText =
		`Udalo mi sie zgadnac postac w #Gothicdle za ${rows.length} razem!\n` +
		formattedText +
		`\n (tu bedzie link do stronki)`;

	navigator.clipboard.writeText(clipboardText);
	toast.success('Skopiowano do schowka');
};

export const GameSummary = ({
	guesses,
	correctCharacter,
}: GameSummaryProps) => {
	const characters = useGetMultipleCharactersByIds(guesses);
	// let mockup = '';
	let allRows: string[][] = [];
	let singleRow: string[] = [];

	if (!characters.isSuccess)
		return (
			<ErrorMessage message="Nie udalo sie wczytac podsumowania. Sprobuj ponownie pozniej!" />
		);
	characters.data
		.slice()
		.reverse()
		.forEach((character) => {
			singleRow.push(compareData(correctCharacter.imie, character.imie));
			singleRow.push(
				compareData(
					correctCharacter.przynaleznosc,
					character.przynaleznosc
				)
			);
			singleRow.push(
				compareData(
					correctCharacter.wystepowanie,
					character.wystepowanie
				)
			);
			singleRow.push(compareData(correctCharacter.bron, character.bron));
			singleRow.push(
				compareData(correctCharacter.zbroja, character.zbroja)
			);
			// mockup += compareData(correctCharacter.imie, character.imie);
			// mockup += compareData(
			// 	correctCharacter.przynaleznosc,
			// 	character.przynaleznosc
			// );
			// mockup += compareData(
			// 	correctCharacter.wystepowanie,
			// 	character.wystepowanie
			// );
			// mockup += compareData(correctCharacter.bron, character.bron);
			// mockup += compareData(correctCharacter.zbroja, character.zbroja);
			allRows.push(singleRow);
			singleRow = [];
		});

	return (
		<div className="mt-8 mb-4 flex flex-col space-y-4">
			<Text>
				Udalo ci sie zgadnac postac w #Gothicdle za {allRows.length}{' '}
				razem!
			</Text>
			<div>
				{allRows
					.slice()
					.reverse()
					.map((guess, i) => (
						//idk jak zrobic bez uzycia indeksu
						<Text key={guess.join('') + i}>{guess.join('')}</Text>
					))}
			</div>
			<div>
				<Button
					size="sm"
					onClick={() =>
						handleCopyToClipboard(allRows.slice().reverse())
					}
				>
					<FaRegCopy size={30} />
				</Button>
			</div>
		</div>
	);
};
