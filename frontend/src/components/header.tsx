"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BiLogOut } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiCalendar, HiInformationCircle, HiMail } from "react-icons/hi";

export function Header() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error("Não autenticado");
        }
        
        const data = await res.json();
        setUser({ name: data.nome, email: data.email });
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
      
    } catch (error) {
      console.error("Erro durante logout:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-700 text-white shadow-md flex items-center justify-between p-4 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold">UniEvents</h1>
      </Link>

      {/* Links centrais (desktop) */}
      <nav className="hidden md:flex space-x-6 text-lg font-medium ">
        <Link href="/events" className="hover:text-white/80 transition-colors flex items-center">
          <HiCalendar className="mr-1" />
          Eventos
        </Link>
        <Link href="/about" className="hover:text-white/80 transition-colors flex items-center">
          <HiInformationCircle className="mr-1" />
          Sobre
        </Link>
        <Link href="/contact" className="hover:text-white/80 transition-colors flex items-center">
          <HiMail className="mr-1" />
          Contato
        </Link>
      </nav>

      {/* Menu do usuário (desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <IoPersonCircle className="text-2xl" />
                <span className="font-medium">{user?.name || "Usuário"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-xl rounded-md border-0 p-1 min-w-[200px]">
              <DropdownMenuItem>
                <Link href="/user" className="flex items-center w-full">
                  <IoPersonCircle className="mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/my-events" className="flex items-center w-full">
                  <HiCalendar className="mr-2" />
                  Meus Eventos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600"
              >
                <BiLogOut className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="text-lg font-medium hover:text-white/80 px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            Entrar
          </Link>
        )}
      </div>

      {/* Menu Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden p-2 hover:bg-white/10">
            <RxHamburgerMenu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-gradient-to-b from-purple-700 to-indigo-700 text-white w-64 border-l-0">
          <SheetHeader className="border-b border-white/20 pb-4 mb-4">
            <SheetTitle className="text-xl font-semibold">Menu</SheetTitle>
          </SheetHeader>
          
          <div className="h-full flex flex-col">
            <nav className="space-y-4 flex-1">
              <Link
                href="/events"
                className="flex items-center space-x-3 text-lg py-2 hover:bg-white/10 rounded px-2"
              >
                <HiCalendar />
                <span>Eventos</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 text-lg py-2 hover:bg-white/10 rounded px-2"
              >
                <HiInformationCircle />
                <span>Sobre</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-3 text-lg py-2 hover:bg-white/10 rounded px-2"
              >
                <HiMail />
                <span>Contato</span>
              </Link>
            </nav>

            <div className="border-t border-white/20 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 mb-4 px-2">
                    <IoPersonCircle className="text-2xl" />
                    <span className="font-medium">{user?.name || "Usuário"}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-lg py-2 hover:bg-white/10 rounded px-2 w-full text-red-300"
                  >
                    <BiLogOut />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center space-x-3 text-lg py-2 hover:bg-white/10 rounded px-2 w-full"
                >
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}