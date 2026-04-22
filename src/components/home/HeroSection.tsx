import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import EditorialHero from "@/components/layout/EditorialHero";
import ImageBlock from "@/components/layout/ImageBlock";
import heroImage from "@/assets/carta-escrita.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <EditorialHero
        eyebrow="Keepla — Guardiões do tempo"
        size="large"
        variant="dark"
        title={
          <>
            Guarda o que <br />
            o tempo <br />
            <span className="italic">não pode levar.</span>
          </>
        }
        subtitle="Mensagens, cartas e cápsulas para o futuro. Cria memórias que serão entregues no momento certo — porque há palavras que merecem chegar amanhã."
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleStartJourney}
            size="lg"
            className="bg-[#E63946] hover:bg-[#c92d3a] text-white px-8 py-6 text-base font-inter font-semibold rounded-none shadow-none transition-colors"
          >
            {user ? "Ir para o Dashboard" : "Criar memória"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/how-it-works")}
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-6 text-base font-inter font-semibold rounded-none transition-colors"
          >
            Ver como funciona
          </Button>
        </div>
      </EditorialHero>

      <ImageBlock
        image={heroImage}
        alt="Mãos a segurar uma carta — uma memória Keepla"
        caption="Uma carta para o futuro é uma ponte entre quem somos hoje e quem seremos amanhã."
      />
    </>
  );
};

export default HeroSection;
