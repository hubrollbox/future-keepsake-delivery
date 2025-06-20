import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "onboarding_seen";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <img src="/keepla logo.png" alt="Logo Keepla" width={320} height={320} className="opacity-10" />
      </div>
      <Card className="max-w-md w-full shadow-xl relative z-10">
        <CardHeader>
          <CardTitle>Bem-vindo à keepla!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            <li>Crie e agende entregas digitais ou físicas para o futuro.</li>
            <li>Acompanhe o estado das suas entregas no dashboard.</li>
            <li>Receba notificações automáticas na data marcada.</li>
            <li>Em caso de dúvida, consulte a <a href="/contact" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">página de suporte</a>.</li>
          </ul>
          <Button onClick={handleClose} className="w-full mt-4">Começar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
