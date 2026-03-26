import { Text } from '@/modules/ui/Text/Text';

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

export const GothicguesserGameSummary = () => {
  const getStoredGameState = (param: string) => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(`gameState${param}`) ||
        JSON.stringify(defaultGameState)
      );
    }
    return JSON.stringify(defaultGameState);
  };

  return (
    <div>
      <Text>game sujmmary</Text>
    </div>
  );
};
