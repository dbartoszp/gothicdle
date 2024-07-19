import { Text } from '@/modules/ui/Text/Text';
import { useState } from 'react';
import { Button } from '@/modules/ui/Button/Button';
import { NameTips } from './NameTips/NameTips';
import { useDisclosure } from '@/modules/ui/Modal/useDisclosure/useDisclosure';
import { Modal } from '@/modules/ui/Modal/Modal';

const GUESSES_NEEDED = 5;

type CorrectCharacter = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  id: number;
};

type TipsProps = {
  guessesMadeCount: number;
  correctCharacter: CorrectCharacter;
};

export const Tips = ({ guessesMadeCount, correctCharacter }: TipsProps) => {
  const [showTips, setShowTips] = useState(false);
  const { isOpen, close, changeOpenState } = useDisclosure();

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex flex-row'>
        <Button size='sm' onClick={() => setShowTips(!showTips)}>
          <Text variant='small'>
            {showTips ? 'Schowaj' : 'Pokaz'} podpowiedzi
          </Text>
        </Button>
        <Modal
          openVariant='primary'
          title='Podpowiedzi'
          openText='?'
          onClose={close}
          open={isOpen}
          onOpenChange={changeOpenState}
        >
          <div className='flex flex-col justify-center space-y-2'>
            <Text>
              Co {GUESSES_NEEDED} niepoprawnie odgadnietych postaci zostanie
              ujawniona kolejna litera imienia dzisiejszej postaci
            </Text>
          </div>
        </Modal>
      </div>

      {showTips && (
        <NameTips
          lettersUncovered={Math.floor(guessesMadeCount / GUESSES_NEEDED)}
          correctName={correctCharacter.imie}
        />
      )}
    </div>
  );
};
