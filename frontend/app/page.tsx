import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";
import { Footer } from "@/components/Footer/Footer";
import { FooterData } from "@/components/Footer/FooterData";
export default function Home() {
  return (
    <main className="">
      <Appbar />
      <Hero />
      <HeroVideo />
      <Footer data={FooterData} />
    </main>
  );
}
