
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Gem, Book, Video, Headphones, PenTool } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProductsSection = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const products = [
    {
      id: "caixa-capsula",
      title: "Caixa Cápsula – Tempo de Guardar",
      description: "Uma pequena caixa, feita à mão, pensada para guardar segredos com data marcada. Quando escrevemos algo para o futuro, fazemos uma promessa de reencontro com quem seremos. Esta cápsula é o abraço que fica fechado até ser hora de abrir.",
      icon: Package,
      category: "físico",
      price: 49.99,
      includes: [
        "Caixa em madeira clara sustentável",
        "Interior com espaço para cartas, objetos, pen drives ou lembranças",
        "Fecho metálico e gravação opcional do nome/data"
      ]
    },
    {
      id: "bau-memoria",
      title: "Baú da Memória – Edição Especial",
      description: "O tempo passa, mas o que tocamos e sentimos fica. Este baú é feito para guardar os momentos que marcam uma vida inteira — o dia do nascimento, o último verão com os avós, ou a carta que nunca teve resposta. É mais do que uma caixa: é um lugar onde o tempo repousa.",
      icon: Gem,
      category: "físico",
      price: 149.99,
      includes: [
        "Baú em madeira nobre com gravação personalizada",
        "Compartimentos internos",
        "Selo oficial \"Futuro Presente\" + certificado"
      ]
    },
    {
      id: "caderno-cartas",
      title: "Caderno \"Cartas para o Futuro\"",
      description: "Escrever uma carta para alguém que ainda não existe, ou que ainda não está pronto para ouvir, é um gesto de fé. Este caderno tem envelopes para diferentes idades, datas ou momentos. Como um calendário de emoções que só se abre no tempo certo.",
      icon: Book,
      category: "físico",
      price: 29.99,
      includes: [
        "Caderno de capa dura com embossing dourado",
        "12 envelopes internos numerados",
        "Sugestões de temas + capa de proteção"
      ]
    },
    {
      id: "edicao-video",
      title: "Edição de Vídeo Emocional",
      description: "Grava um vídeo hoje para te veres daqui a 10 anos. Ou para deixares uma mensagem de amor, força ou despedida. Nós tratamos da edição com música, legendas e sensibilidade — para que o teu presente chegue ao futuro com a mesma emoção com que foi criado.",
      icon: Video,
      category: "digital",
      price: 79.99,
      includes: [
        "Edição de vídeo com trilha sonora",
        "Legendas e personalização de capa",
        "Opção de upload seguro e armazenamento"
      ]
    },
    {
      id: "tratamento-audio",
      title: "Tratamento de Áudio com Música",
      description: "A tua voz, limpa e embalada em som suave, para que cada palavra ressoe como uma memória. Ideal para mensagens íntimas, histórias de vida ou despedidas sussurradas. Porque o som, como o amor, nunca envelhece.",
      icon: Headphones,
      category: "digital",
      price: 59.99,
      includes: [
        "Tratamento de áudio (limpeza de ruído, equalização)",
        "Música de fundo emocional",
        "Exportação em formato seguro"
      ]
    },
    {
      id: "escrita-assistida",
      title: "Escrita Assistida – Cartas com IA",
      description: "Nem sempre é fácil escrever o que sentimos. Às vezes, só precisamos de um empurrão. Com a ajuda da nossa inteligência emocional artificial, construímos contigo uma carta para o futuro que seja tua — verdadeira, tocante e com as palavras certas no tempo certo.",
      icon: PenTool,
      category: "digital",
      price: 39.99,
      includes: [
        "Roteiro guiado para escrever",
        "Sugestões automáticas com IA",
        "Versões para revisão e aprovação"
      ]
    }
  ];

  const handleAddToCart = async (product: typeof products[0]) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    await addToCart(product.id, product.title, product.price);
  };

  return (
    <div className="min-h-screen bg-lavanda-palida">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-title text-azul-petroleo mb-6 font-fraunces font-bold">
            Presentes com Alma
          </h1>
          <p className="text-body-text text-azul-petroleo/80 max-w-3xl mx-auto leading-relaxed font-fraunces">
            Cada produto e serviço é pensado para criar conexões emocionais através do tempo. 
            Escolhe a forma perfeita de guardar e entregar os teus sentimentos no momento certo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="hover:shadow-soft-lg transition-all duration-300 hover:scale-105 border-rosa-antigo/20 bg-bege-areia card-soft">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-rosa-antigo/20 rounded-full">
                      <Icon className="h-8 w-8 text-rosa-antigo" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-fraunces font-bold text-azul-petroleo mb-2">
                    {product.title}
                  </CardTitle>
                  <div className="text-2xl font-fraunces font-bold text-rosa-antigo">
                    €{product.price}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-azul-petroleo/80 leading-relaxed text-sm font-fraunces">
                    {product.description}
                  </p>
                  
                  <div>
                    <h4 className="font-fraunces font-semibold text-azul-petroleo mb-2">Inclui:</h4>
                    <ul className="space-y-1">
                      {product.includes.map((item, index) => (
                        <li key={index} className="text-sm text-azul-petroleo/70 flex items-start font-fraunces">
                          <span className="text-rosa-antigo mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    {product.category === "físico" ? (
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-azul-meia-noite text-lavanda-palida hover:bg-azul-meia-noite/90 font-fraunces font-semibold shadow-soft"
                      >
                        Adicionar ao Carrinho
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddToCart(product)}
                        className="w-full border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 font-fraunces font-semibold"
                      >
                        Adicionar ao Carrinho
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-bege-areia rounded-xl p-8 max-w-4xl mx-auto shadow-soft">
            <h3 className="text-xl font-fraunces font-bold text-azul-petroleo mb-4">
              Tens alguma ideia especial?
            </h3>
            <p className="text-azul-petroleo/80 mb-6 font-fraunces">
              Cada história é única. Se precisas de algo personalizado ou tens uma ideia diferente 
              para a tua cápsula do tempo, vamos conversar e criar algo especial para ti.
            </p>
            <Button 
              onClick={() => navigate("/contact")}
              className="bg-azul-meia-noite text-lavanda-palida hover:bg-azul-meia-noite/90 font-fraunces font-semibold px-8 shadow-soft"
            >
              Contacta-nos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
