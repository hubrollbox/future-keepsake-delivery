import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import memorialImage from "@/assets/memorial-pc.jpg";
import { motion, Variants } from "framer-motion";

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Background com imagem - mobile fix */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <img 
          src={memorialImage} 
          alt="" 
          className="absolute top-0 left-0 w-full h-full object-cover grayscale"
          style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="section-tagline">O que dizem de nós</p>
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Primeiros <span className="text-primary">Guardiões do Tempo</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Os nossos primeiros utilizadores já estão a criar memórias especiais. 
              Estas são algumas das suas experiências.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-card border border-border rounded-2xl p-8 hover:shadow-keepla hover:scale-105 transition-all duration-300 group h-full">
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
