import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cagnotte from "@/components/Cagnotte";
import Cake from "@/components/Cake";
import Guestbook from "@/components/Guestbook";
import Gallery from "@/components/Gallery";
import EasterEgg from "@/components/EasterEgg";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  return (
    <main>
      <EasterEgg />
      <ShareButton />
      <Nav />
      <Hero />
      <Cagnotte />
      <Cake />
      <Guestbook />
      <Gallery />
    </main>
  );
}
