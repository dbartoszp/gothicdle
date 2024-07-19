import { Text } from '@/modules/ui/Text/Text';
import { GuessBox } from '../GuessBox/GuessBox';
import { useEffect, useState } from 'react';
import { Button } from '@/modules/ui/Button/Button';
import { NameTips } from './NameTips/NameTips';
import { MdQuestionMark } from 'react-icons/md';

type CorrectCharacter = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  id: number;
};

type TipsState = {
  date: string;
  usedAffiliationTip: boolean;
  usedAppearancesTip: boolean;
  usedWeaponsTip: boolean;
  usedArmorsTip: boolean;
  tipsShown: number;
};

type TipsProps = {
  guessesMadeCount: number;
  correctCharacter: CorrectCharacter;
};

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const formattedDate = `${day}-${month}-${year}`;

const defaultTipsState = {
  date: formattedDate,
  usedAffiliationTip: false,
  usedAppearancesTip: false,
  usedWeaponsTip: false,
  usedArmorsTip: false,
  tipsShown: 0,
};

let storedTipsState = JSON.stringify(defaultTipsState);

export const Tips = ({ guessesMadeCount, correctCharacter }: TipsProps) => {
  // if (typeof window !== 'undefined') {
  //   storedTipsState =
  //     localStorage.getItem('tipsState') || JSON.stringify(defaultTipsState);
  // }

  // const [tipsState, setTipsState] = useState(
  //   storedTipsState &&
  //     JSON.parse(storedTipsState).date === defaultTipsState.date
  //     ? JSON.parse(storedTipsState)
  //     : defaultTipsState
  // );

  const [showTips, setShowTips] = useState(false);

  // const handleShowTip = (tipKey: keyof TipsState) => {
  //   if (tipsState[tipKey as keyof TipsState]) {
  //     return;
  //   }

  //   if (tipTokens > 0) {
  //     setTipsState((prevState: TipsState) => ({
  //       ...prevState,
  //       [tipKey]: true,
  //       tipsShown: prevState.tipsShown + 1,
  //     }));

  //     localStorage.setItem(
  //       'tipsState',
  //       JSON.stringify({
  //         ...tipsState,
  //         [tipKey]: true,
  //         tipsShown: tipsState.tipsShown + 1,
  //       })
  //     );
  //   }
  // };

  // let tipTokens = Math.floor(guessesMadeCount / 5) - tipsState.tipsShown;

  return (
    <div>
      <div className='flex flex-row'>
        <Button size='sm' onClick={() => setShowTips(!showTips)}>
          <Text variant='small'>
            {showTips ? 'Schowaj' : 'Pokaz'} podpowiedzi
          </Text>
        </Button>
        <Button size='sm' onClick={() => setShowTips(!showTips)}>
          <Text variant='small'>
            <MdQuestionMark size={20} />
          </Text>
        </Button>
      </div>
      {/* <Button size='sm' onClick={() => setShowTips(!showTips)}>
        {showTips ? 'Schowaj podpowiedzi' : 'Pokaz podpowiedzi'}
      </Button> */}
      {showTips && (
        <>
          {/* <div className='my-2 flex flex-col space-y-4'>
            <Text>
              Kolejna podpowiedz za: {5 - (guessesMadeCount % 5)} niepoprawnych
              prób
            </Text>
            <Text>
              Mozesz ujawnic {tipTokens}{' '}
              {tipTokens === 0 ? 'informacji' : 'informacje'} o postaci
            </Text>
          </div> */}
          <div className='mt-4'>
            {/* <Text variant='small'>
              Co 5 niepoprawnie odgadnietych postaci ujawniona zostanie jedna
              litera imienia poprawnej postaci
            </Text> */}
            <NameTips
              lettersUncovered={Math.floor(guessesMadeCount / 5)}
              correctName={correctCharacter.imie}
            />
          </div>

          {/* <div className='flex flex-col space-y-1 md:flex-row'>
            <Button
              size='sm'
              onClick={() => handleShowTip('usedAffiliationTip')}
            >
              Pokaz przynaleznosc
            </Button>
            <Button
              size='sm'
              onClick={() => handleShowTip('usedAppearancesTip')}
            >
              Pokaz wystepowanie
            </Button>
            <Button size='sm' onClick={() => handleShowTip('usedWeaponsTip')}>
              Pokaz bronie
            </Button>
            <Button size='sm' onClick={() => handleShowTip('usedArmorsTip')}>
              Pokaz zbroje
            </Button>
          </div>
          <div className='flex w-72 flex-row justify-between space-x-2 overflow-auto px-2 py-4 md:w-full md:space-x-12'>
            <GuessBox
              label='Przynaleznosc'
              correctData={correctCharacter.przynaleznosc}
              inputData={
                tipsState.usedAffiliationTip
                  ? correctCharacter.przynaleznosc
                  : '?'
              }
              delay={0}
            />
            <GuessBox
              label='Wystepowanie'
              correctData={correctCharacter.wystepowanie}
              inputData={
                tipsState.usedAppearancesTip
                  ? correctCharacter.wystepowanie
                  : '?'
              }
              delay={0}
            />
            <GuessBox
              label='Bron'
              correctData={correctCharacter.bron}
              inputData={tipsState.usedWeaponsTip ? correctCharacter.bron : '?'}
              delay={0}
            />
            <GuessBox
              label='Zbroja'
              correctData={correctCharacter.zbroja}
              inputData={
                tipsState.usedArmorsTip ? correctCharacter.zbroja : '?'
              }
              delay={0}
            />
          </div> */}
        </>
      )}
    </div>
  );
};
