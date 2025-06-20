import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";
import React, { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nomeIdade: "",
    agendamento: "",
    aceitaBeta: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Aqui você pode adicionar lógica para enviar os dados
  };

  return (
    <section
      id="main-content"
      className="relative min-h-screen flex items-center justify-center px-4 py-10 md:py-20 bg-gradient-to-br from-lavender-mist via-sand-beige/30 to-lavender-mist"
      aria-label="Introdução e chamada inicial - keepla"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-16 left-4 w-24 h-24 border-2 border-dusty-rose rounded-full md:top-20 md:left-10 md:w-32 md:h-32"></div>
        <div className="absolute bottom-16 right-4 w-16 h-16 border-2 border-earthy-burgundy rounded-full md:bottom-20 md:right-10 md:w-24 md:h-24"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-6 md:mb-12">
          {/* Logo */}
          <div className="flex justify-center mb-5 md:mb-8">
            <img src="/keepla logo.png" alt="Logo" width={120} height={120} />
          </div>
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-fraunces font-bold text-steel-blue mb-3 md:mb-6 leading-tight" style={{ textShadow: "0 1px 0 #ECE5DA" }}>
            Futuro
            <span className="text-earthy-burgundy">Presente</span>
          </h1>
          <p className="text-xl md:text-3xl text-dusty-rose font-fraunces italic mb-4 md:mb-8">
            Presente no futuro
          </p>
          {/* Story Introduction */}
          <div className="max-w-4xl mx-auto mb-5 md:mb-12">
            <p className="text-base md:text-xl text-steel-blue mb-3 md:mb-6 leading-relaxed font-medium" style={{ textShadow: "0 1px 0 #ECE5DA" }}>
              Nascemos de um gesto íntimo: <span className="text-earthy-burgundy font-semibold">uma mensagem escrita por um pai para a filha, 
              para ser lida aos 18 anos.</span>
            </p>
            <p className="text-base md:text-xl text-misty-gray leading-relaxed">
              Mais do que uma aplicação tecnológica, somos um espaço de memória, sensibilidade e presença. 
              Guardamos emoções para o tempo certo.
            </p>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center mb-6 md:mb-12">
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[60px] border-2 border-earthy-burgundy text-earthy-burgundy hover:bg-dusty-rose/20 hover:text-earthy-burgundy transition-all duration-200 focus-visible:ring-2 focus-visible:ring-dusty-rose underline underline-offset-2 decoration-dusty-rose"
              onClick={() => navigate('/about')}
              aria-label="Conheça a história do keepla"
            >
              <span className="text-earthy-burgundy font-semibold">Conhecer a Nossa História</span>
            </Button>
            <a
              href="https://bit.ly/keepla-beta-tester"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[60px] bg-gradient-to-r from-earthy-burgundy to-dusty-rose text-white shadow-lg border-2 border-earthy-burgundy animate-pulse rounded-lg flex items-center justify-center font-semibold focus-visible:ring-2 focus-visible:ring-dusty-rose"
              aria-label="Experimente a versão piloto (grátis)"
            >
              Experimente a versão piloto (grátis)
            </a>
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[60px] border-2 border-dusty-rose text-earthy-burgundy hover:bg-dusty-rose/20 hover:text-earthy-burgundy transition-all duration-200 focus-visible:ring-2 focus-visible:ring-dusty-rose"
              onClick={() => navigate('/register')}
              aria-label="Registar e criar conta gratuitamente"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce-gentle" />
              Começar a Minha Jornada
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center text-misty-gray">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">100% Português</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">Segurança Garantida</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">Entregas Precisas</span>
            </div>
          </div>
        </div>
        {/* Modal and Form inside component scope */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setShowForm(false)} aria-label="Fechar">×</button>
              <h2 className="text-2xl font-bold mb-4 text-earthy-burgundy">Formulário de Interesse</h2>
              {submitted ? (
                <div className="text-green-700 font-semibold text-center">Obrigado pelo interesse! Entraremos em contato.</div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Qual o nome e idade do seu filho(a)?</label>
                  <input type="text" name="nomeIdade" value={form.nomeIdade} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Para quando gostaria de agendar esta mensagem? (ex: 18º aniversário, formatura...)</label>
                  <input type="text" name="agendamento" value={form.agendamento} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Você aceita testar a versão beta e dar feedback honesto?</label>
                  <select name="aceitaBeta" value={form.aceitaBeta} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Email para contato:</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <button type="submit" className="w-full bg-earthy-burgundy text-white py-2 rounded font-semibold hover:bg-dusty-rose transition">Enviar</button>
              </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
