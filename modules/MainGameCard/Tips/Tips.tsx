import { Text } from '@/modules/ui/Text/Text';
import { GuessBox } from '../GuessBox/GuessBox';
import { useEffect, useState } from 'react';
import { Button } from '@/modules/ui/Button/Button';

type CorrectCharacter = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  zdjecie: string;
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

export const Tips = ({ guessesMadeCount, correctCharacter }: TipsProps) => {
  let storedTipsState = JSON.stringify(defaultTipsState);

  if (typeof window !== 'undefined') {
    storedTipsState =
      localStorage.getItem('tipsState') || JSON.stringify(storedTipsState);
  }

  const [tipsState, setTipsState] = useState(
    storedTipsState &&
      JSON.parse(storedTipsState).date === defaultTipsState.date
      ? JSON.parse(storedTipsState)
      : defaultTipsState
  );

  const [showTips, setShowTips] = useState(false);

  const handleShowTip = (tipKey: keyof TipsState) => {
    if (tipsState[tipKey as keyof TipsState]) {
      return;
    }

    if (tipTokens > 0) {
      setTipsState((prevState: TipsState) => ({
        ...prevState,
        [tipKey]: true,
        tipsShown: prevState.tipsShown + 1,
      }));

      localStorage.setItem(
        'tipsState',
        JSON.stringify({
          ...tipsState,
          [tipKey]: true,
          tipsShown: tipsState.tipsShown + 1,
        })
      );
    }
  };

  let tipTokens = Math.floor(guessesMadeCount / 5) - tipsState.tipsShown;

  return (
    <div className='my-2'>
      <Button size='sm' onClick={() => setShowTips(!showTips)}>
        {showTips ? 'Schowaj podpowiedzi' : 'Pokaz podpowiedzi'}
      </Button>
      {showTips && (
        <>
          <div className='my-2 flex flex-col space-y-4'>
            <Text>
              Kolejna podpowiedz za: {5 - (guessesMadeCount % 5)} niepoprawnych
              prób
            </Text>
            <Text>Mozesz ujawnic {tipTokens} informacje o postaci</Text>
          </div>

          <div className='flex flex-col space-y-1 md:flex-row'>
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
          </div>
        </>
      )}
    </div>
  );
};
