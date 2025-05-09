"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  // Carousel control
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Slides data
  const heroSlides = [
    {
      title: "Encontro de Jovens",
      description: "Conecte-se com os melhores eventos universitários.",
      image: "/img/fundo-cadastro.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se",
    },
    {
      title: "Feira de Profissões",
      description: "Descubra oportunidades com as maiores empresas.",
      image: "/img/fundo-cadastro.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se",
    },
    {
      title: "Festival Cultural",
      description: "Viva experiências artísticas inesquecíveis.",
      image: "/img/Group 34.jpg",
      ctaPrimary: "Saiba Mais",
      ctaSecondary: "Inscreva-se",
    },
  ];

  // Events data
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
    },
  ];

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlaying) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-700 text-white">
      {/* Header */}
      <Header />

      {/* Hero Carousel */}
      <section className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover brightness-50"
                priority={index === currentSlide}
              />
              <div className="z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                  {slide.title}
                </h2>
                <p className="text-xs xs:text-sm sm:text-base md:text-lg mb-3 xs:mb-4 sm:mb-6 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <div className="flex flex-col xs:flex-row justify-center gap-2 sm:gap-3">
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs sm:text-sm w-auto min-w-[100px]"
                  >
                    {slide.ctaPrimary}
                  </Button>
                  <Button className="bg-white text-purple-700 px-3 py-1 hover:bg-gray-100 text-xs sm:text-sm w-auto min-w-[100px]">
                    {`${slide.ctaSecondary} olá`}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-1 sm:p-2 transition-all"
          aria-label="Slide anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-1 sm:p-2 transition-all"
          aria-label="Próximo slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1 sm:gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white sm:w-6"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-700 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
              Próximos Eventos
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl mx-auto">
              Descubra e participe das melhores experiências universitárias
            </p>
          </div>

          <Tabs defaultValue="eventos">
            <div className="flex justify-center mb-4 sm:mb-6">
              <TabsList className="bg-[#07070722] p-0.5 sm:p-1 rounded-md sm:rounded-lg">
                <TabsTrigger
                  value="eventos"
                  className="px-2 xs:px-3 sm:px-4 py-1 text-xs sm:text-sm data-[state=active]:bg-white"
                >
                  Lista de Eventos
                </TabsTrigger>
                <TabsTrigger
                  value="calendario"
                  className="px-2 xs:px-3 sm:px-4 py-1 text-xs sm:text-sm data-[state=active]:bg-white"
                >
                  Calendário
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="eventos">
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {eventos.map((evento) => (
                  <Card
                    key={evento.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="relative h-32 xs:h-36 sm:h-40 md:h-44">
                      <Image
                        src={evento.imagem}
                        alt={evento.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <p className="text-xs text-gray-500">{evento.data}</p>
                      <h3 className="text-sm sm:text-base font-bold mt-1 line-clamp-2">
                        {evento.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {evento.local}
                      </p>
                      <Button className="w-full mt-2 sm:mt-3 bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm"
                >
                  Carregar Mais Eventos
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="calendario">
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-purple-500 mb-2 sm:mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Calendário de Eventos
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Visualize todos os eventos em um calendário interativo
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                    Ativar Visualização
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}