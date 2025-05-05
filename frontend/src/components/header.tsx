"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulando verificação de autenticação
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-10 md:py-6 bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-700 text-white">
      {/* Logo como texto */}
      <h1 className="text-2xl font-bold">UniEvents</h1>
      
      {/* Links de navegação */}
      <nav className="flex gap-4 md:gap-8 items-center">
        <Link 
          href="/events" 
          className="hover:underline text-sm md:text-base  hover:text-white transition-colors"
        >
          Eventos
        </Link>
        <Link 
          href="/about" 
          className="hover:underline text-sm md:text-base  hover:text-white transition-colors"
        >
          Sobre
        </Link>
        <Link 
          href="/contact" 
          className="hover:underline text-sm md:text-base hover:text-white transition-colors"
        >
          Contato
        </Link>
        
        {/* Botão de login */}
        <Button 
          onClick={handleLogin}
          className="bg-white text-purple-700 font-bold hover:bg-gray-100 px-4 py-2 text-sm md:text-base border border-purple-700"
        >
          {isAuthenticated ? 'Minha Conta' : 'Entrar'}
        </Button>
      </nav>
    </header>
  );
}