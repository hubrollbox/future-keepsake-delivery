import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SecureRegisterForm from "@/components/auth/SecureRegisterForm";
import bicicletaImage from "@/assets/bicicleta-marginal.jpg";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center py-8">
      {/* Background fotográfico */}
      <div className="absolute inset-0">
        <img 
          src={bicicletaImage} 
          alt="Bicicleta na marginal - liberdade e memórias" 
          className="w-full h-full object-cover grayscale contrast-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <img 
            src="/keepla-logo-white.png" 
            alt="keepla Logo" 
            className="h-20 mx-auto mb-4" 
            loading="eager" 
            decoding="async" 
            onError={(e) => { e.currentTarget.src = '/keepla-logo-red.png'; }}
          />
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
          <SecureRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
