import { BugReport } from '@/modules/BugReport/BugReport';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Utilities } from '@/modules/Utilities/Utilities';

const ERROR_MSG =
  'Wystapil problem z ladowaniem gry. Sprobuj ponownie pozniej!';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-12 pt-2'>
      <Utilities />
      <TitleHeader />
      <MainGameCard />
      <BugReport />
      <Instructions />
    </main>
  );
}
