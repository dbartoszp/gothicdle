import { Text } from '@/modules/ui/Text/Text';
import { Timer } from './Timer/Timer';

export const TitleHeader = () => {
  return (
    <div className='mb-4 flex flex-col space-y-4 text-center md:mb-2 md:mt-4'>
      <Text variant='title'>Gothicdle</Text>
    </div>
  );
};
