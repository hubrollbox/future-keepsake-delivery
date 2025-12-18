import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section com identidade Keepla */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black/30 via-black/20 to-black/25">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Logo Keepla */}
            <div className="mb-8 mt-16">
              <img 
                src="/keepla-logo-white.png?v=3" 
                alt="Keepla" 
                className="mx-auto w-28 h-28 object-contain"
                loading="eager"
                decoding="async"
                onError={(e) => { e.currentTarget.src = '/keepla-logo-white.png'; }}
              />
            </div>

            {/* Headline alinhada com marca */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              E se pudesses enviar uma memória...
              <span className="block text-keepla-red italic">para o futuro?</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-normal max-w-2xl mx-auto leading-relaxed">
              Estamos a abrir inscrições limitadas para clientes piloto.
            </p>

            {/* CTA principal */}
            <Button 
              variant="brand"
              size="lg"
              onClick={scrollToForm}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg font-semibold"
            >
              Quero ser cliente piloto
            </Button>
          </div>
        </div>
      </section>

      {/* Explicação curta com identidade visual */}
      <section className="py-16 md:py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl text-keepla-gray-light font-fraunces leading-relaxed mb-8">
            Alguns momentos merecem chegar na altura certa. Guarda mensagens e memórias — e recebe-as no futuro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
            <div className="emotion-card p-6">
              <p className="text-keepla-gray-dark font-fraunces font-semibold">Mensagem</p>
            </div>
            <div className="emotion-card p-6">
              <p className="text-keepla-gray-dark font-fraunces font-semibold">Tempo</p>
            </div>
            <div className="emotion-card p-6">
              <p className="text-keepla-gray-dark font-fraunces font-semibold">Emoção</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de inscrição dentro de Card */}
      <section id="signup-form" className="py-16 md:py-24 bg-white">
        <div className="max-w-md mx-auto px-4">
          <Card className="emotion-card">
            <CardHeader>
              <CardTitle className="text-keepla-gray-dark font-fraunces">Inscreve-te agora</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-keepla-gray-dark font-medium">Nome *</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-2 rounded-xl border-gray-200"
                    placeholder="O teu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-keepla-gray-dark font-medium">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-2 rounded-xl border-gray-200"
                    placeholder="o.teu.email@exemplo.com"
                  />
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  disabled={isSubmitting}
                  className="w-full text-lg py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'A processar...' : 'Inscreve-me'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;