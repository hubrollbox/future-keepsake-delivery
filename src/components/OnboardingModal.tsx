import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

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

  // Bloqueia o scroll do body enquanto o modal está aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = () => {
    setSeen("1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <Card
        className="max-w-md w-full shadow-2xl relative z-10 overflow-hidden border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <CardHeader>
          <CardTitle id="onboarding-title" className="text-center w-full">
            Bem-vindo à keepla!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 text-foreground/80 text-sm space-y-1">
            <li>Cria e agenda entregas digitais ou físicas para o futuro.</li>
            <li>Acompanha o estado das tuas entregas no dashboard.</li>
            <li>Recebe notificações automáticas na data marcada.</li>
            <li>
              Em caso de dúvida, consulta a{" "}
              <Link to="/contact" className="text-primary underline underline-offset-4">
                página de suporte
              </Link>
              .
            </li>
          </ul>
          <Button onClick={handleClose} variant="brand" className="w-full mt-4">
            Começar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
