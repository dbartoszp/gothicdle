import { BugReport } from '@/modules/BugReport/BugReport';
import { EndlessGameCard } from '@/modules/EndlessGameCard/EndlessGameCard';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { Maintenance } from '@/modules/Maintenance/Maintenance';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { GoBackButton } from '@/modules/ui/GoBackButton/GoBackButton';
import { Suspense } from 'react';

export default function Endless() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-12 pt-2'>
      <Suspense>
        {/* <Maintenance /> */}
        <GoBackButton />
        <TitleHeader />
        <EndlessGameCard />
        <Instructions />
        <BugReport />
      </Suspense>
    </main>
  );
}
