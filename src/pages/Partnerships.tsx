import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PhotoBackground from "@/components/layout/PhotoBackground";
import PartnershipTypes from "@/components/partnerships/PartnershipTypes";
import PartnershipBenefits from "@/components/partnerships/PartnershipBenefits";
import PartnershipProcess from "@/components/partnerships/PartnershipProcess";
import PartnershipCTA from "@/components/partnerships/PartnershipCTA";
import bicicletaImage from "@/assets/bicicleta-marginal.jpg";

const Partnerships = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-keepla-black">
      <Navigation />

      {/* Hero Section with Photo Background */}
      <PhotoBackground 
        image={bicicletaImage} 
        alt="Bicicleta na marginal"
        overlay="dark"
        className="min-h-[50vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-keepla-white/70 font-georgia italic text-lg mb-4">
            Juntos criamos memórias inesquecíveis
          </p>
          <h1 className="text-4xl md:text-6xl font-inter font-bold text-keepla-white mb-6">
            Parcerias <span className="text-keepla-red">Keepla</span>
          </h1>
          <p className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter">
            Colabora connosco para oferecer experiências únicas aos teus clientes.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mt-8 text-keepla-white hover:text-keepla-red hover:bg-keepla-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Voltar ao Início</span>
          </Button>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white">
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
