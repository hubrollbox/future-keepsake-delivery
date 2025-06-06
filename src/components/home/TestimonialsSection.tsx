
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      text: "Enviei uma carta para o meu futuro aniversário. A ideia de receber algo especial de mim mesma é fantástica! Mal posso esperar.",
      rating: 5,
      location: "Porto"
    },
    {
      name: "João Santos", 
      text: "Criei a minha primeira entrega para surprender a minha namorada no nosso aniversário. O conceito é revolucionário!",
      rating: 5,
      location: "Lisboa"
    },
    {
      name: "Ana Costa",
      text: "Adorei a ideia de criar uma cápsula do tempo para a minha filha. Será uma surpresa incrível quando ela crescer!",
      rating: 5,
      location: "Braga"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fraunces font-bold text-steel-blue mb-6">
              Primeiros <span className="text-earthy-burgundy">Guardiões do Tempo</span>
            </h2>
            <p className="text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
              Os nossos primeiros utilizadores já estão a criar memórias especiais. 
              Estas são algumas das suas experiências.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="emotion-card p-8 hover:scale-105 transition-all duration-300 border border-dusty-rose/20 group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <Quote className="h-8 w-8 text-earthy-burgundy" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-misty-gray italic mb-6 leading-relaxed text-lg">
                      "{testimonial.text}"
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 text-earthy-burgundy fill-current group-hover:animate-bounce-gentle" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                      />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="font-semibold text-steel-blue text-lg font-fraunces">— {testimonial.name}</p>
                    <p className="text-earthy-burgundy text-sm">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
