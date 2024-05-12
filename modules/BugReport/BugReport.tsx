import { GoLinkExternal } from 'react-icons/go';
import { Link } from '../ui/Button/Link';
import { Text } from '../ui/Text/Text';

export const BugReport = () => {
  return (
    <Link
      size='sm'
      href='https://docs.google.com/spreadsheets/d/1n61Nrzr-HKY2JP35V4mF_JKpHAMyMvihZ8l0Rilm9cE/edit?usp=sharing'
    >
      <div className='flex flex-row space-x-2'>
        <Text variant='small'>Zglos bledy w bazie danych</Text>
        <GoLinkExternal size={15} />
      </div>
    </Link>
  );
};
