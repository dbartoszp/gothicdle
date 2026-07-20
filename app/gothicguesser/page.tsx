import GothicGuesserGameCard from '@/modules/GothicGuesserGameCard/GothicGuesserGameCard';
import { Timer } from '@/modules/TitleHeader/Timer/Timer';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Utilities } from '@/modules/Utilities/Utilities';
import { GoBackButton } from '@/modules/ui/GoBackButton/GoBackButton';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-8 pt-2 md:space-y-12'>
      <Utilities />
      <TitleHeader title='GothicGuesser - demo ' />
      <Timer />
      <GoBackButton />
      <GothicGuesserGameCard />
    </main>
  );
}
