import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainMenu } from '@/modules/MainMenu/MainMenu';
import { Timer } from '@/modules/TitleHeader/Timer/Timer';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Utilities } from '@/modules/Utilities/Utilities';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-8 pt-2 md:space-y-12'>
      <Utilities />
      <TitleHeader />
      <Timer />
      <MainMenu />
      <Instructions />
    </main>
  );
}
