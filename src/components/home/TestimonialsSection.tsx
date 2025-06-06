
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ana Sofia",
      age: "28 anos",
      location: "Porto",
      text: "Enviei uma carta para mim própria há dois anos. Quando a recebi na semana passada, chorei de emoção. Era exatamente o que precisava de ouvir naquele momento.",
      rating: 5,
      type: "Mensagem pessoal"
    },
    {
      name: "Carlos e Maria",
      age: "Casal há 15 anos",
      location: "Lisboa",
      text: "Guardámos as nossas alianças de noivado para entregar à nossa filha no dia do seu casamento. O FuturoPresente tornou este sonho possível.",
      rating: 5,
      type: "Presente físico"
    },
    {
      name: "João Pedro",
      age: "42 anos",
      location: "Braga",
      text: "Criei uma cápsula do tempo com fotos e uma mensagem para o meu filho receber aos 18 anos. É a forma mais bonita de mostrar amor através do tempo.",
      rating: 5,
      type: "Cápsula completa"
    }
  ];

  return (
    <div className="emotional-spacing">
      <div className="text-center mb-12">
        <h2 className="text-section-title text-steel-blue mb-4 font-fraunces">
          Histórias que Tocam
          <span className="text-earthy-burgundy"> o Coração</span>
        </h2>
        <p className="text-body-large text-misty-gray leading-relaxed max-w-3xl mx-auto">
          Cada entrega é uma história única, um momento especial que transforma vidas. 
          <span className="text-earthy-burgundy font-medium"> Estas são algumas das nossas favoritas.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20 hover:border-earthy-burgundy/40 gentle-hover group relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <Quote className="h-8 w-8 text-earthy-burgundy/20" />
            </div>
            
            <CardContent className="p-6 pt-12">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-earthy-burgundy text-earthy-burgundy" />
                ))}
              </div>
              
              <p className="text-misty-gray leading-relaxed mb-6 italic font-fraunces">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-dusty-rose/20 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-steel-blue font-fraunces">{testimonial.name}</p>
                    <p className="text-sm text-misty-gray">{testimonial.age} • {testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-earthy-burgundy/10 text-earthy-burgundy text-xs rounded-full font-medium">
                      {testimonial.type}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
