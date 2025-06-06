
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      text: "Enviei uma carta para o meu futuro aniversário. A ideia de receber algo especial de mim mesma é fantástica! Mal posso esperar.",
      rating: 5
    },
    {
      name: "João Santos", 
      text: "Criei a minha primeira entrega para surprender a minha namorada no nosso aniversário. O conceito é revolucionário!",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Adorei a ideia de criar uma cápsula do tempo para a minha filha. Será uma surpresa incrível quando ela crescer!",
      rating: 5
    }
  ];

  return (
    <div className="mb-16 md:mb-20 animate-fade-in">
      <h2 className="text-section-title-sm md:text-section-title text-black mb-4 md:mb-6 text-center">Primeiros Guardiões do Tempo</h2>
      <p className="text-body md:text-body-large text-gray-600 mb-8 md:mb-12 text-center max-w-4xl mx-auto leading-relaxed">
        Os nossos primeiros utilizadores já estão a criar memórias especiais. Estas são algumas das suas experiências.
      </p>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 md:p-8 bg-white border-2 border-gold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4 md:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 md:h-6 md:w-6 text-gold fill-current group-hover:animate-bounce-gentle" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4 md:mb-6 leading-relaxed text-sm md:text-base">"{testimonial.text}"</p>
              <p className="font-semibold text-gold text-base md:text-lg">— {testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
