import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import memorialImage from "@/assets/memorial-pc.jpg";

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
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Background com imagem */}
      <div className="absolute inset-0 opacity-5">
        <img src={memorialImage} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-tagline">O que dizem de nós</p>
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Primeiros <span className="text-primary">Guardiões do Tempo</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Os nossos primeiros utilizadores já estão a criar memórias especiais. 
              Estas são algumas das suas experiências.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border border-border rounded-2xl p-8 hover:shadow-keepla hover:scale-105 transition-all duration-300 group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <Quote className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="testimonial-quote mb-6">
                      "{testimonial.text}"
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 text-primary fill-current group-hover:animate-bounce" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                      />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-lg font-inter">— {testimonial.name}</p>
                    <p className="text-primary text-sm font-georgia italic">{testimonial.location}</p>
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
