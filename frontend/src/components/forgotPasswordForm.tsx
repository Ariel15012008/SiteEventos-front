"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiMail, FiClock } from "react-icons/fi";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (emailSent && countdown === 0) {
      router.push("/login");
    }
  }, [emailSent, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/request-password-reset", { email });
      
      if (response.status === 200) {
        toast.success("E-mail enviado com sucesso!");
        setEmailSent(true);
      }
    } catch (error: unknown) {
      const errorMessage = (error as ApiErrorResponse)?.response?.data?.message || "Tente novamente mais tarde.";
      toast.error("Erro ao enviar e-mail", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="bg-[#f9f9f9] border border-gray-300 focus:ring-0 transition-all text-base"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#be10b6] to-[#0badcd] text-white hover:opacity-90 h-11" 
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-6 p-4 border border-[#09bc8a]/30 rounded-lg bg-[#09bc8a]/10">
          <div className="flex justify-center">
            <FiMail className="text-[#09bc8a] text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Verifique seu e-mail</h3>
          <p className="text-gray-600">
            Enviamos um link de redefinição para <span className="font-medium">{email}</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <FiClock />
            <span>Redirecionando em {countdown} segundos...</span>
          </div>
        </div>
      )}
    </div>
  );
}