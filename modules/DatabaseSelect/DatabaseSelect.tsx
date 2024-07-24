import { Link } from '../ui/Button/Link';
import { Modal } from '../ui/Modal/Modal';
import { useDisclosure } from '../ui/Modal/useDisclosure/useDisclosure';
import { Text } from '../ui/Text/Text';
import { Button } from '../ui/Button/Button';

const databasesMap = new Map([
  ['Wybrane', 'wybrane'],
  ['Gothic', 'gothic'],
  ['Gothic 2 + NK', 'gothic2'],
  ['Gothic 3', 'gothic3'],
  ['Wszystkie', 'wszystkie'],
]);

type DatabaseSelectProps = {
  currentDatabase: string;
  isEndless?: boolean;
};

export const DatabaseSelect = ({
  currentDatabase,
  isEndless = false,
}: DatabaseSelectProps) => {
  const { isOpen, close, changeOpenState } = useDisclosure();
  const baseURL = `http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=`;

  return (
    <div className='my-2'>
      <Modal
        openVariant='primary'
        title='Wybierz baze danych'
        openText='Wybor bazy danych'
        onClose={close}
        open={isOpen}
        onOpenChange={changeOpenState}
      >
        <div className='m-auto mt-6 flex flex-col justify-center space-y-3 text-center md:max-w-xs '>
          {Array.from(databasesMap).map(([label, value]) => (
            <div key={value}>
              <a href={`${baseURL}${value}`}>
                <Button size='sm' onClick={close}>
                  <Text
                    variant={
                      currentDatabase.toLocaleLowerCase() === value
                        ? 'greenSm'
                        : 'small'
                    }
                  >
                    {label}
                  </Text>
                </Button>
              </a>
              <Text variant='small'>
                {label === 'Wybrane'
                  ? 'Recznie wybrane, rozpoznawalne postacie ze wszystkich gier'
                  : label === 'Gothic'
                    ? 'Wszystkie postacie z gry Gothic'
                    : label === 'Gothic 2 + NK'
                      ? 'Wszystkie postacie z gry Gothic 2 + Nocy Kruka'
                      : label === 'Gothic 3'
                        ? 'Wszystkie postacie z gry Gothic 3'
                        : 'Wszystkie postacie z gier Gothic, Gothic 2 + NK i Gothic 3'}
              </Text>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
