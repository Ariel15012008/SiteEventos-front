"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import whatsappIcon from "../../public/img/whatsapp-footer.png";
import instagramIcon from "../../public/img/instagram-footer.png";
import facebookIcon from "../../public/img/facebook-footer.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            UniEvents
          </h3>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Conectando você aos melhores eventos acadêmicos desde 2023.
          </p>
          <div className="flex gap-4 sm:gap-5 mt-4 sm:mt-5">
            {/* WhatsApp */}
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src={whatsappIcon}
                alt="WhatsApp"
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </Link>
            
            {/* Instagram */}
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src={instagramIcon}
                alt="Instagram"
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </Link>
            
            {/* Facebook */}
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Image
                src={facebookIcon}
                alt="Facebook"
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Links Rápidos
          </h3>
          <ul className="space-y-3">
            {[
              "Eventos",
              "Criar Evento",
              "Universidades Parceiras",
              "Termos de Uso",
            ].map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Newsletter
          </h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4">
            Receba as últimas atualizações no seu email
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Seu email"
              className="px-4 py-3 sm:px-5 sm:py-3 rounded-l-lg text-gray-800 w-full text-sm sm:text-base"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-l-none px-5 py-6 sm:px-6 text-sm sm:text-base">
              Assinar
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 sm:mt-12 pt-6 text-center">
        <p className="text-sm sm:text-base text-gray-400">
          © 2023 UniEvents. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}