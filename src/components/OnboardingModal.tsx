import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ONBOARDING_KEY = "onboarding_seen";

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
    if (seen !== "1") {
      setOpen(true);
    }
  }, [seen]);

  const handleClose = () => {
    setSeen("1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="max-w-md w-full shadow-xl relative z-10 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center w-full">Bem-vindo à keepla!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 text-muted-foreground text-sm">
            <li>Crie e agende entregas digitais ou físicas para o futuro.</li>
            <li>Acompanhe o estado das suas entregas no dashboard.</li>
            <li>Receba notificações automáticas na data marcada.</li>
            <li>Em caso de dúvida, consulte a <Link to="/contact" className="text-primary underline">página de suporte</Link>.</li>
          </ul>
          <Button onClick={handleClose} className="w-full mt-4">Começar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
