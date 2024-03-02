import { Text } from '@/modules/ui/Text/Text';

export const TitleHeader = () => {
  return (
    <div className='mb-4 mt-6 flex flex-col space-y-4 text-center md:mb-2 md:mt-16'>
      <Text variant='title'>Gothicdle</Text>
      <Text variant='danger'>Nowa postac za:</Text>
    </div>
  );
};
