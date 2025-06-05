
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PartnershipHero from "@/components/partnerships/PartnershipHero";
import PartnershipTypes from "@/components/partnerships/PartnershipTypes";
import PartnershipBenefits from "@/components/partnerships/PartnershipBenefits";
import PartnershipProcess from "@/components/partnerships/PartnershipProcess";
import PartnershipCTA from "@/components/partnerships/PartnershipCTA";

const Partnerships = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-steel-blue hover:text-dusty-rose"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        <PartnershipHero />
        <PartnershipTypes />
        <PartnershipBenefits />
        <PartnershipProcess />
        <PartnershipCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;
