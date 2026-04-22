import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EditorialHero from "@/components/layout/EditorialHero";
import PartnershipTypes from "@/components/partnerships/PartnershipTypes";
import PartnershipBenefits from "@/components/partnerships/PartnershipBenefits";
import PartnershipProcess from "@/components/partnerships/PartnershipProcess";
import PartnershipCTA from "@/components/partnerships/PartnershipCTA";

const Partnerships = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-foreground">
      <Navigation />

      {/* Hero Editorial */}
      <EditorialHero
        eyebrow="Parcerias"
        variant="dark"
        size="medium"
        title={
          <>
            Parcerias <span className="italic">Keepla.</span>
          </>
        }
        subtitle="Junta-te à nossa rede e ajuda-nos a transformar a forma como as pessoas experienciam o tempo e as memórias."
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-white hover:text-[#E63946] hover:bg-white/5 px-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Voltar ao Início</span>
        </Button>
      </EditorialHero>

      <main className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <PartnershipTypes />
          <PartnershipBenefits />
          <PartnershipProcess />
          <PartnershipCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;
