"use strict";

// Interfaces para tipagem
interface RefreshTokenResponse {
  access_token?: string;
  expires_in?: number;
  // Adicione outros campos que sua API retorna, se necessário
}

/**
 * Fetch wrapper que automaticamente renova o token de acesso quando necessário
 * @param input RequestInfo - URL ou objeto Request
 * @param init RequestInit - Opções da requisição
 * @returns Promise<Response> - Resposta da requisição
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  // Verifica expiração do token
  const expirationStr = localStorage.getItem("access_token_expiration");
  const expirationTime = expirationStr ? parseInt(expirationStr) : 0;
  const now = Date.now();

  // Buffer de 10 segundos antes da expiração
  const buffer = 10 * 1000; 
  const shouldRefresh = expirationTime && (now >= (expirationTime - buffer));

  // Renovação do token se necessário
  if (shouldRefresh) {
    try {
      console.log("[authFetch] Token quase expirando, tentando renovar...");
      const refreshResponse = await fetch("http://localhost:8000/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Importante para enviar o refresh token cookie
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers || {}) // Mantém headers adicionais
        }
      });

      if (refreshResponse.ok) {
        const data: RefreshTokenResponse = await refreshResponse.json();
        console.log("[authFetch] Token renovado com sucesso");

        // Atualiza o token e sua expiração no localStorage
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
        }

        // Calcula nova expiração (2 minutos a partir de agora)
        const newExpiration = Date.now() + (data.expires_in || 120) * 1000;
        localStorage.setItem("access_token_expiration", newExpiration.toString());
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("[authFetch] Falha ao renovar o token:", error);
      
      // Limpa os tokens inválidos
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_expiration");
      
      // Opcional: redirecionar para login ou lançar erro
      throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
    }
  }

  // Configura headers padrão para a requisição principal
  const headers = new Headers(init.headers || {});
  
  // Adiciona o token de autenticação se existir
  const token = localStorage.getItem("access_token");
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Faz a requisição original com as credenciais
  return fetch(input, {
    ...init,
    headers,
    credentials: "include" // Importante para cookies
  });
}