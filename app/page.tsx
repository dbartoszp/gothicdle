import { Footer } from '@/modules/Footer/Footer';
import { Instructions } from '@/modules/MainGameCard/Instructions/Instructions';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleHeader } from '@/modules/MainGameCard/TitleHeader/TitleHeader';
import { TitleCard } from '@/modules/TitleCard/TitleCard';
import { Text } from '@/modules/ui/Text/Text';

export default function Home() {
  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <TitleHeader />

        {/* <TitleCard /> */}
        <MainGameCard />
        <Instructions />
      </main>
      <Footer />
    </>
  );
}
