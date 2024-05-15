import { BugReport } from '@/modules/BugReport/BugReport';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { Timer } from '@/modules/TitleHeader/Timer/Timer';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Utilities } from '@/modules/Utilities/Utilities';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-12 pt-2'>
      <Utilities />
      <TitleHeader />
      <Timer />
      <MainGameCard />
      <BugReport />
      <Instructions />
    </main>
  );
}
