import { Text } from '@/modules/ui/Text/Text';
import { GuessBox } from '../GuessBox/GuessBox';
import { Card } from '@/modules/ui/Card/Card';

const correct = {
  correctData: 'Poprawne',
  inputData: 'Poprawne',
};

const partial = {
  correctData: ['Czesciowo poprawne', '2'],
  inputData: ['Czesciowo poprawne'],
};

const incorrect = {
  correctData: 'Poprawne',
  inputData: 'Niepoprawne',
};

export const Instructions = () => {
  return (
    <Card>
      <Text>Instrukcje</Text>
      <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full'>
        <GuessBox
          correctData={correct.correctData}
          inputData={correct.inputData}
          label='Postac'
        />
        <GuessBox
          correctData={partial.correctData}
          inputData={partial.inputData}
          label='Przynaleznosc'
        />
        <GuessBox
          correctData={incorrect.correctData}
          inputData={incorrect.inputData}
          label='Wystepowanie'
        />
      </div>
    </Card>
  );
};
