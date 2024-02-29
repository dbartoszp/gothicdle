import { GuessBox } from '../GuessBox/GuessBox';

export const Results = () => {
  return (
    <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full'>
      <GuessBox result='correct' />
      <GuessBox result='correct' />
      <GuessBox result='partial' />
      <GuessBox result='partial' />
      <GuessBox result='incorrect' />
    </div>
  );
};
