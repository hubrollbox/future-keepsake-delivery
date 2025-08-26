import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { plans, storageServices, digitalServices, physicalServices, timeCapsules } from "@/lib/pricingData";
import React, { useState } from "react";

// Ensure React is used to avoid TS6133 error

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users } from "lucide-react";

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'storage' | 'digital' | 'physical' | 'capsule'>('all');

  const getServicesByCategory = () => {
    if (selectedCategory === 'all') {
      return [...storageServices, ...digitalServices, ...physicalServices, ...timeCapsules];
    }
    switch (selectedCategory) {
      case 'storage': return storageServices;
      case 'digital': return digitalServices;
      case 'physical': return physicalServices;
      case 'capsule': return timeCapsules;
      default: return [];
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="w-6 h-6" />;
      case 'personal': return <Star className="w-6 h-6" />;
      case 'timekeeper': return <Shield className="w-6 h-6" />;
      case 'family': return <Users className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-mist via-white to-sage-green/10">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <div className="py-20 px-4 md:px-0">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4 text-earthy-burgundy border-earthy-burgundy">
              ✨ Novos Preços Premium
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-earthy-burgundy mb-6 font-fraunces">
              Preserve Memórias com
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-earthy-burgundy to-steel-blue">
                Qualidade Premium
              </span>
            </h1>
            <p className="text-xl text-steel-blue max-w-2xl mx-auto leading-relaxed">
              Escolha o plano perfeito para guardar e entregar suas memórias mais preciosas no momento exato. 
              Qualidade premium, preços justos, experiência inesquecível.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingCycle('monthly')}
                className="rounded-full px-6"
              >
                Mensal
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingCycle('yearly')}
                className="rounded-full px-6"
              >
                Anual
                <Badge variant="secondary" className="ml-2 text-xs">-20%</Badge>
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-20">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'ring-2 ring-earthy-burgundy shadow-xl scale-105' 
                    : 'hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-earthy-burgundy to-steel-blue text-white text-center py-2 text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="flex justify-center mb-4 text-earthy-burgundy">
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-earthy-burgundy">
                    {plan.name}
                  </CardTitle>
                  {plan.badge && !plan.popular && (
                    <Badge variant="outline" className="mx-auto">
                      {plan.badge}
                    </Badge>
                  )}
                  <div className="text-center">
                    <span className="text-4xl font-bold text-earthy-burgundy">
                      {plan.price}
                    </span>
                    <span className="text-steel-blue">{plan.period}</span>
                  </div>
                  <CardDescription className="text-steel-blue">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-sage-green mt-0.5 flex-shrink-0" />
                        <span className="text-steel-blue text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-earthy-burgundy hover:bg-earthy-burgundy/90 text-white"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services Section */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-earthy-burgundy mb-4 font-fraunces">
                Serviços Adicionais Premium
              </h2>
              <p className="text-lg text-steel-blue max-w-2xl mx-auto">
                Complemente sua experiência com nossos serviços especializados
              </p>
            </div>

            {/* Service Categories */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'storage', label: 'Armazenamento' },
                  { id: 'digital', label: 'Digitais' },
                  { id: 'physical', label: 'Físicos' },
                  { id: 'capsule', label: 'Cápsulas' }
                ].map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="rounded-full"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getServicesByCategory().map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-earthy-burgundy">
                        {service.name}
                      </CardTitle>
                      {service.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-earthy-burgundy">
                      {service.price}
                      {service.yearlyPrice && (
                        <span className="text-sm text-steel-blue block">
                          ou {service.yearlyPrice}/ano
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-steel-blue text-sm mb-4">
                      {service.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Pricing;
