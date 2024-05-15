import { Link } from '../ui/Button/Link';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';

export const MainMenu = () => {
  return (
    <div className='flex flex-col items-center space-y-8 pt-6'>
      <Card>
        <div className='flex flex-col space-y-6 md:max-w-sm'>
          <Link size='md' href='/classic'>
            KLASYCZNY
          </Link>
          <Text>
            Zgaduj codziennie jedna postac sposrod selekcji wybranych!
          </Text>
        </div>
      </Card>
      <Card>
        <div className='flex flex-col space-y-6 md:max-w-sm'>
          <Link size='md' href='/endless'>
            ENDLESS
          </Link>
          <Text>
            Przetestuj swoje umiejetnosci poprzez nieskonczone zgadywanie
            postaci
          </Text>
        </div>
      </Card>
    </div>
  );
};
