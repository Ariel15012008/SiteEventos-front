
"use client";

import { ForgotPasswordForm } from "@/components/forgotPasswordForm";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed inset-0 -z-10 lg:hidden ">
        <img
          src="/img/fundo-cadastro.jpg"
          alt="Imagem de fundo"
          className="h-full w-full object-cover "
        />
        <div className="absolute inset-0 "></div>
      </div>

      <div className="grid min-h-svh lg:grid-cols-2 lg:bg-gradient-to-br from-[#ffffff] to-[#0d0dd5]">
        <div className="flex flex-col gap-6 p-8 md:p-10 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-xl lg:shadow-none mx-auto my-4 lg:my-0 max-w-sm lg:max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-1 items-center justify-center"
            >
              <div className="w-full max-w-sm">
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-2xl font-bold text-black">Envio de redefinição senha</h1>
                  <p className="text-base text-text-black">
                    Digite seu e-mail para receber o link de redefinição
                  </p>
                </div>
                <ForgotPasswordForm />
                <div className="mt-4 text-center text-base">
                  <Link 
                    href="/login" 
                    className="text-[#000000] hover:text-[#ffffff] hover:underline  font-medium "
                  >
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Coluna da Imagem (igual ao login) */}
        <div className="relative hidden lg:block overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src="/img/fundo-cadastro.jpg"
                alt="Imagem de fundo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 lg:bg-[#6561ce]/50"></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}