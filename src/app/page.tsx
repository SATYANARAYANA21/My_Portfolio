import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Preloader from '@/components/Preloader';
import Hero from '@/components/Hero';
import FilmLine from '@/components/FilmLine';
import Drop from '@/components/Drop';
import Manifesto from '@/components/Manifesto';
import Series from '@/components/Series';
import Exp04Placeholder from '@/components/Exp04Placeholder';
import Carousel from '@/components/Carousel';
import SayHello from '@/components/SayHello';
import Reel from '@/components/Reel';

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <MobileNav />
      <main>
        <Hero />
        <FilmLine exposure="01" kanji="&#x843D;" />
        <Drop />
        <FilmLine exposure="02" kanji="&#x9593;" />
        <Reel />
        <FilmLine exposure="03" kanji="&#x5149;" />
        <Series />

        {/* EXP 04 — Project Arcade */}
        <FilmLine exposure="04" kanji="&#x7A7A;" />
        <Exp04Placeholder />

        {/* EXP 05 — Contact Sheet */}
        <FilmLine exposure="05" kanji="&#x87BA;" />
        <Carousel />

        {/* EXP 06 — Say Hello (was EXP07) */}
        <FilmLine exposure="06" kanji="&#x8A71;" />
        <SayHello />

        {/* EXP 07 — Final Frame (was EXP08) */}
        <FilmLine exposure="07" kanji="&#x5DFB;" />
        <Manifesto />
      </main>
    </>
  );
}
