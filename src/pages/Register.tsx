
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SecureRegisterForm from "@/components/auth/SecureRegisterForm";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lavender-mist flex items-center justify-center px-4">
      <div className="w-full max-w-md">
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
        <div className="text-center mb-8">
          <img src="/keepla logo.png" alt="Keepla Logo" className="h-20 mx-auto mb-4" />
        </div>
        <SecureRegisterForm />
      </div>
    </div>
  );
};

export default Register;
