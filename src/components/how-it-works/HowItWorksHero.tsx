import EditorialHero from "@/components/layout/EditorialHero";

const HowItWorksHero = () => {
  return (
    <EditorialHero
      eyebrow="Como funciona"
      variant="light"
      size="medium"
      title={
        <>
          Transformamos momentos <br />
          em <span className="italic">memórias eternas.</span>
        </>
      }
      subtitle="Somos o teu Guardião do Tempo — entregamos as tuas palavras, emoções e gestos no momento exato em que mais importam."
    />
  );
};

export default HowItWorksHero;
