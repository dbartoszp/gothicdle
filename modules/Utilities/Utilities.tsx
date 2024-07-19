'use client';
import { Link } from '../ui/Button/Link';
import { Modal } from '../ui/Modal/Modal';
import { useDisclosure } from '../ui/Modal/useDisclosure/useDisclosure';
import { Text } from '../ui/Text/Text';
import { GoLinkExternal } from 'react-icons/go';
export const Utilities = () => {
  const { isOpen, close, changeOpenState } = useDisclosure();
  return (
    <div className='flex flex-row space-x-4'>
      <Modal
        openVariant='primary'
        title='19.07.2024'
        openText='Aktualnosci'
        onClose={close}
        open={isOpen}
        onOpenChange={changeOpenState}
      >
        <div className='flex flex-col justify-center space-y-2'>
          <Text>Ostatnie zmiany:</Text>
          <Text variant='greenSm'>
            Dodane zostaly podpowiedzi co 5 niepoprawnych prob
          </Text>
          <Text>Wysoki priorytet:</Text>
          <Text variant='greenSm'>
            Nowy feature: dodanie innych wersji bazy danych do obu trybów gry
          </Text>
          <Text>Niski priorytet:</Text>
          <Text variant='dangerSm'>
            Naprawa bledu: po zgadnieciu postaci, zmiana karty sprawia, ze
            wygenerowane podsumowanie zmienia kolejnosc
          </Text>
        </div>
      </Modal>
      <Link size='sm' href='https://buycoffee.to/dbartoszp' targetBlank={true}>
        <div className='flex flex-row space-x-2'>
          <Text variant='small'>Wesprzyj studentow</Text>
          <GoLinkExternal size={15} />
        </div>
      </Link>
    </div>
  );
};
