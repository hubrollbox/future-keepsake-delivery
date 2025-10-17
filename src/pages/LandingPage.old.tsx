import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Por favor, preenche todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pilot_users')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim()
          }
        ]);

      if (error) {
        console.error('Erro ao inserir dados:', error);
        toast.error('Erro ao processar a inscrição. Tenta novamente.');
        return;
      }

      toast.success('Inscrição realizada com sucesso! Serás contactado em breve.');
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tenta novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('signup-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23333333;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23bg)'/%3E%3Cg opacity='0.1'%3E%3Ccircle cx='300' cy='200' r='100' fill='%23ffffff'/%3E%3Ccircle cx='900' cy='600' r='150' fill='%23ffffff'/%3E%3Cpath d='M400,400 Q600,200 800,400 T1200,400' stroke='%23ffffff' stroke-width='2' fill='none'/%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3">
              <div className="text-4xl sm:text-5xl font-bold text-white font-inter">
                Keepla
                <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-[#E63946] rounded-full ml-1 mb-2"></span>
                <span className="text-lg sm:text-xl font-normal">pt</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 font-georgia leading-tight">
            E se pudesses enviar uma memória...
            <br />
            <span className="text-[#E63946]">para o futuro?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter leading-relaxed">
            Keepla.pt é a cápsula do tempo digital e emocional. 
            <br className="hidden sm:block" />
            Estamos a abrir inscrições limitadas para clientes piloto.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={scrollToForm}
            className="bg-[#C6282E] hover:bg-[#A01E24] text-white font-semibold py-4 px-8 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Quero ser cliente piloto
          </Button>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-georgia leading-relaxed mb-8">
              Alguns momentos merecem chegar na altura certa.
              <br />
              Com a Keepla podes guardar mensagens, memórias e recordações — e recebê-las no futuro.
            </p>
          </div>

          {/* Icons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-4">📩</div>
              <p className="text-gray-600 font-inter font-medium">Mensagem</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 font-inter font-medium">Tempo</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-gray-600 font-inter font-medium">Emoção</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Before Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={scrollToForm}
            className="bg-[#C6282E] hover:bg-[#A01E24] text-white font-semibold py-4 px-8 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Quero ser cliente piloto
          </Button>
        </div>
      </section>

      {/* Signup Form Section */}
      <section id="signup-form" className="py-16 sm:py-24 bg-white">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-inter">
              Inscreve-te agora
            </h2>
            <p className="text-gray-600 font-inter">
              Inscrição gratuita. Serás dos primeiros a experimentar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Nome *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6282E] focus:border-transparent"
                placeholder="O teu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Email *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6282E] focus:border-transparent"
                placeholder="o.teu.email@exemplo.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C6282E] hover:bg-[#A01E24] text-white font-semibold py-4 px-6 text-lg rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'A processar...' : 'Inscreve-me'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-400 font-inter">
                  Keepla.pt
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <p className="text-gray-400 font-inter">
                <a href="mailto:info@keepla.pt" className="hover:text-white transition-colors">
                  info@keepla.pt
                </a>
              </p>
            </div>

            {/* Legal Notice */}
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500 font-inter">
                © Keepla.pt 2025 – Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;