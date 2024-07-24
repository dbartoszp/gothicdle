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
        <div className='m-auto mt-6 flex flex-col justify-center space-y-3 text-center md:max-w-xs '>
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
          <Text variant='small'>
            Recznie wybrane, rozpoznawalne postacie ze wszystkich gier
          </Text>
          <Link
            size='sm'
            href={`http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=gothic`}
          >
            <Text
              variant={
                currentDatabase.toLocaleLowerCase() === 'gothic'
                  ? 'greenSm'
                  : 'small'
              }
            >
              Gothic
            </Text>
          </Link>
          <Text variant='small'>Wszystkie postacie z gry Gothic</Text>
          <Link
            size='sm'
            href={`http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=gothic2`}
          >
            <Text
              variant={
                currentDatabase.toLocaleLowerCase() === 'gothic2'
                  ? 'greenSm'
                  : 'small'
              }
            >
              Gothic 2 + NK
            </Text>
          </Link>
          <Text variant='small'>
            Wszystkie postacie z gry Gothic 2 + Nocy Kruka
          </Text>
          <Link
            size='sm'
            href={`http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=gothic3`}
          >
            <Text
              variant={
                currentDatabase.toLocaleLowerCase() === 'gothic3'
                  ? 'greenSm'
                  : 'small'
              }
            >
              Gothic 3
            </Text>
          </Link>
          <Text variant='small'>Wszystkie postacie z gry Gothic 3</Text>
          <Link
            size='sm'
            href={`http://localhost:3000/${isEndless ? 'endless' : 'classic'}?database=wszystkie`}
          >
            <Text
              variant={
                currentDatabase.toLocaleLowerCase() === 'wszystkie'
                  ? 'greenSm'
                  : 'small'
              }
            >
              Wszystkie
            </Text>
          </Link>
          <Text variant='small'>
            Wszystkie postacie z gier Gothic, Gothic 2 + NK i Gothic 3
          </Text>
        </div>
      </Modal>
    </>
  );
};
