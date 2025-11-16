import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Gallery from '@/components/home/Gallery';
import Services from '@/components/home/Services';
import Contact from '@/components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Gallery />
      <Services />
      <Contact />
    </>
  );
}
