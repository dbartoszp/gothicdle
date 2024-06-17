import { BugReport } from '@/modules/BugReport/BugReport';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { Maintenance } from '@/modules/Maintenance/Maintenance';
import { Timer } from '@/modules/TitleHeader/Timer/Timer';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { GoBackButton } from '@/modules/ui/GoBackButton/GoBackButton';

export default function Classic() {
  return (
    <main className='pt flex min-h-screen flex-col items-center space-y-8 pt-2 md:space-y-12'>
      {/* <Maintenance /> */}

      <GoBackButton />
      <TitleHeader />
      <Timer />
      <MainGameCard />
      <Instructions />
      <BugReport />
    </main>
  );
}
