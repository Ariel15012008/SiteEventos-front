"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header"; // Import the Header component

export default function HomePage() {
  // Controle do carrossel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Slides do carrossel
  const heroSlides = [
    {
      title: "Encontro de Jovens",
      description: "Conecte-se com os melhores eventos universitários.",
      image: "/img/fundo-cadastro.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se"
    },
    {
      title: "Feira de Profissões",
      description: "Descubra oportunidades com as maiores empresas.",
      image: "/img/fundo-cadastro.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se"
    },
    {
      title: "Festival Cultural",
      description: "Viva experiências artísticas inesquecíveis.",
      image: "/img/Group 34.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se"
    }
  ];

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlaying) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  // Navegação
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Dados dos eventos
  const eventos = [
    {
      id: 1,
      titulo: "Congresso Acadêmico",
      data: "14 Dez - CSE Department",
      local: "University of Microverse",
      imagem: "/img/fundo-cadastro.jpg",
    },
    {
      id: 2,
      titulo: "Feira de Inovação",
      data: "15 Dez - Hall Central",
      local: "Instituto de Tecnologia",
      imagem: "/img/fundo-cadastro.jpg",
    },
    {
      id: 3,
      titulo: "Semana do Jovem Cristão",
      data: "18 Dez - Auditório Azul",
      local: "Faculdade de Teologia",
      imagem: "/img/fundo-cadastro.jpg",
    },
    {
      id: 4,
      titulo: "Festival Cultural",
      data: "20 Dez - Pátio Externo",
      local: "Universidade Aberta",
      imagem: "/img/fundo-cadastro.jpg",
    },
    {
      id: 5,
      titulo: "Palestra Motivacional",
      data: "21 Dez - Sala 204",
      local: "Bloco B",
      imagem: "/img/fundo-cadastro.jpg",
    },
    {
      id: 6,
      titulo: "Oficina de Teatro",
      data: "22 Dez - Espaço Cultural",
      local: "Centro Universitário",
      imagem: "/img/fundo-cadastro.jpg",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-700 text-white">
      {/* Header Component */}
      <Header />

      {/* Carrossel Hero */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden ">
        {/* Slides */}
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover brightness-50"
                priority={index === currentSlide}
              />
              <div className="z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                <div className="flex justify-center gap-4">
                  <Button variant="secondary" className="px-6 py-3">
                    {slide.ctaPrimary}
                  </Button>
                  <Button className="bg-white text-purple-700 px-6 py-3 hover:bg-gray-100">
                    {slide.ctaSecondary}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-all"
          aria-label="Slide anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-all"
          aria-label="Próximo slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Seção de Eventos */}
      <section className="py-12 px-4 md:px-6 bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-700 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Próximos Eventos</h2>
            <p className="text-white">Descubra e participe das melhores experiências universitárias</p>
          </div>

          <Tabs defaultValue="eventos">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#07070722] p-1 rounded-lg">
                <TabsTrigger 
                  value="eventos" 
                  className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]"
                >
                  Lista de Eventos
                </TabsTrigger>
                <TabsTrigger 
                  value="calendario" 
                  className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]"
                >
                  Visualização em Calendário
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="eventos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {eventos.map((evento) => (
                  <Card key={evento.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                    <div className="relative h-48">
                      <Image
                        src={evento.imagem}
                        alt={evento.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">{evento.data}</p>
                      <h3 className="text-xl font-bold mt-1">{evento.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-2">{evento.local}</p>
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3">
                  Carregar Mais Eventos
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="calendario">
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Calendário de Eventos</h3>
                  <p className="text-gray-600 mb-6">Visualize todos os eventos em um calendário interativo</p>
                  <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-3">
                    Ativar Visualização
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UniEvents</h3>
            <p className="text-gray-400">Conectando você aos melhores eventos acadêmicos desde 2023.</p>
            <div className="flex gap-4 mt-4">
              <Link href="#">
                <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
              </Link>
              <Link href="#">
                <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
              </Link>
              <Link href="#">
                <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Eventos</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Criar Evento</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Universidades Parceiras</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Receba as últimas atualizações no seu email</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu email" 
                className="px-4 py-2 rounded-l-lg text-gray-800 w-full" 
              />
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-l-none px-4 py-2">
                Assinar
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-400">© 2023 UniEvents. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}