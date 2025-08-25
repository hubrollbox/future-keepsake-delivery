import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ONBOARDING_KEY = "onboarding_seen";

// Hook customizado para localStorage
function useLocalStorage(key: string, initial: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) || initial);
  const setStored = (val: string) => {
    localStorage.setItem(key, val);
    setValue(val);
  };
  return [value, setStored] as const;
}

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useLocalStorage(ONBOARDING_KEY, "0");

  useEffect(() => {
    console.log('OnboardingModal useEffect - seen:', seen, 'open:', open);
    if (seen !== "1") {
      setOpen(true);
      console.log('OnboardingModal - Setting open to true');
    }
  }, [seen, open]);

  const handleClose = () => {
    setSeen("1");
    setOpen(false);
  };

  if (!open) {
    console.log('OnboardingModal not open');
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <img src="/keepla%20logo%20monocromatico.png" alt="Logo" className="w-96 h-96 object-contain" />
      </div>
      <Card className="max-w-md w-full shadow-xl relative z-10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none z-0">
          <img src="/keepla%20logo%20monocromatico.png" alt="Logo" className="w-96 h-96 object-contain" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-center w-full">Bem-vindo à keepla!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Crie e agende entregas digitais ou físicas para o futuro.</li>
            <li>Acompanhe o estado das suas entregas no dashboard.</li>
            <li>Receba notificações automáticas na data marcada.</li>
            <li>Em caso de dúvida, consulte a <Link to="/contact" className="text-blue-600 underline">página de suporte</Link>.</li>
          </ul>
          <Button onClick={handleClose} className="w-full mt-4">Começar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
