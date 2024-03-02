import { Footer } from '@/modules/Footer/Footer';
import { MainGameCard } from '@/modules/MainGameCard/MainGameCard';
import { TitleCard } from '@/modules/TitleCard/TitleCard';

export default function Home() {
  return (
    <>
      <main className='flex min-h-screen flex-col items-center space-y-12 pt-12'>
        <TitleCard />
        <MainGameCard />
      </main>
      <Footer />
    </>
  );
}
