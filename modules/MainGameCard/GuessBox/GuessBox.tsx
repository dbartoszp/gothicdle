import { Text } from '@/modules/ui/Text/Text';
import clsx from 'clsx';

type GuessBoxProps = {
  label: string;
  correctData: string | string[] | null | (string | null)[];
  inputData: string | string[] | null | (string | null)[];
};

export const GuessBox = ({ label, correctData, inputData }: GuessBoxProps) => {
  const isArrayCorrectData = Array.isArray(correctData);
  const inputDataArray = Array.isArray(inputData)
    ? inputData
    : inputData?.split(',');
  const correctDataArray = Array.isArray(correctData)
    ? correctData
    : correctData?.split(',');
  const boxClasses = clsx(
    'aspect-square w-24 h-24 border border-default-border flex items-center justify-center',
    {
      'bg-green-700': isArrayCorrectData
        ? inputDataArray?.every((item) => correctDataArray?.includes(item))
        : correctData === inputData,
      'bg-red-700': isArrayCorrectData
        ? inputDataArray?.every((item) => !correctDataArray?.includes(item))
        : correctData !== inputData,
      'bg-orange-700':
        isArrayCorrectData &&
        correctDataArray?.some((item) => inputDataArray?.includes(item)) &&
        !correctDataArray?.every((item) => inputDataArray?.includes(item)),
    }
  );

  return (
    <div className='flex flex-col items-center justify-center space-y-2'>
      <Text>{label}</Text>
      <div className={boxClasses}>
        <Text>{correctData}</Text>
      </div>
      <Text variant='green'>{inputDataArray}</Text>
      <Text variant='danger'>{correctData}</Text>
    </div>
  );
};
