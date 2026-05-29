
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import StorySection from "@/components/home/StorySection";
import ProductsSection from "@/components/home/ProductsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";
import OnboardingModal from "@/components/OnboardingModal";
import SEOHead from "@/components/SEOHead";
import ImageBlock from "@/components/layout/ImageBlock";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

import timeCapsule from "@/assets/time-capsule.jpg";
import maoBebe from "@/assets/mao-bebe.jpg";
import sealedMemory from "@/assets/sealed-memory.jpg";
import carroClassico from "@/assets/carro-classico.jpg";
import heroMemory from "@/assets/hero-memory.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Memórias que ficam, entregues para sempre"
        description="Guarda hoje, entrega amanhã. Plataforma para agendar entregas de keepsakes digitais e físicos para datas futuras. Porque há memórias que merecem chegar no momento certo."
        keywords="keepsake, cápsula do tempo, memórias, presentes futuros, entrega programada, keepla, portugal"
      />
      <Navigation />
      <OnboardingModal />

      <main>
        <HeroSection />

        <ImageBlock image={timeCapsule} alt="Cápsula do tempo" caption="Cada palavra, uma promessa." />

        <Suspense fallback={<LoadingSpinner size="lg" text="A carregar secções..." className="py-20" />}>
          <StorySection />

          <ImageBlock image={maoBebe} alt="Mão de bebé sobre mão de adulto" caption="Pequenos gestos, memórias eternas." />

          <ProductsSection />

          <ImageBlock image={sealedMemory} alt="Cápsula selada à espera do tempo" caption="Selado hoje. Aberto no momento certo." />

          <HowItWorksSection />

          <ImageBlock image={carroClassico} alt="Carro clássico — memórias que viajam no tempo" caption="O que guardas com amor, vive para sempre." />

          <TestimonialsSection />
          <TrustSection />

          <ImageBlock image={heroMemory} alt="Memória preservada" caption="Para os momentos que não queres esquecer." />

          <FinalCTA />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
