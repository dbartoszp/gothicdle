import { MainMenu } from '@/modules/MainMenu/MainMenu';
import { TitleHeader } from '@/modules/TitleHeader/TitleHeader';
import { Utilities } from '@/modules/Utilities/Utilities';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center space-y-12 pt-2'>
      <Utilities />
      <TitleHeader />
      <MainMenu />
    </main>
  );
}
