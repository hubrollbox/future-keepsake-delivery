
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";
import RegisterForm from "@/components/auth/RegisterForm";

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
          <div className="flex items-center justify-center space-x-3 mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <SeloDoTempoIcon size={40} />
            <h1 className="text-2xl font-bold text-steel-blue font-fraunces">
              keeplar
            </h1>
          </div>
          <p className="text-misty-gray">Presente no futuro</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
