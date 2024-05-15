import { BugReport } from '@/modules/BugReport/BugReport';
import { EndlessGameCard } from '@/modules/EndlessGameCard/EndlessGameCard';
import { RouteChangeListener } from '@/modules/EndlessGameCard/RouteChangeListener';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { GoBackButton } from '@/modules/ui/GoBackButton/GoBackButton';

export default function Endless() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-12 pt-2'>
      <RouteChangeListener />
      <GoBackButton />
      <TitleHeader />
      <EndlessGameCard />
      <BugReport />
      <Instructions />
    </main>
  );
}
