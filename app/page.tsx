import { Footer } from "@/modules/Footer/Footer";
import { MainGameCard } from "@/modules/MainGameCard/MainGameCard";
import { TitleCard } from "@/modules/TitleCard/TitleCard";

export default function Home() {
  return (
    <>
    <main className="flex min-h-screen flex-col pt-12 space-y-12 items-center">
      <TitleCard />
      <MainGameCard/>
      </main>
      <Footer/>
    </>
  );
}
