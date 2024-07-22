import { Link } from '../ui/Button/Link';
import { Modal } from '../ui/Modal/Modal';
import { useDisclosure } from '../ui/Modal/useDisclosure/useDisclosure';
import { Text } from '../ui/Text/Text';

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
  return (
    <>
      <Modal
        openVariant='primary'
        title='Wybierz baze danych'
        openText='Wybor bazy danych'
        onClose={close}
        open={isOpen}
        onOpenChange={changeOpenState}
      >
        <div className='flex flex-col text-center'>
          <>
            <Link
              size='sm'
              href={`http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=wybrane`}
            >
              <Text
                variant={
                  currentDatabase.toLocaleLowerCase() === 'wybrane'
                    ? 'greenSm'
                    : 'small'
                }
              >
                Wybrane
              </Text>
            </Link>
            <Text>
              Recznie wybrane, rozpoznawalne postacie ze wszystkich gier
            </Text>
          </>
        </div>
      </Modal>
    </>
  );
};
