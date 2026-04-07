/**
 * Módulo de API - Comunicação com ViaCEP
 * Responsável pelas requisições HTTP e tratamento de respostas
 *
 * API: https://viacep.com.br/
 * Gratuita, sem necessidade de autenticação
 */

const CepApi = (() => {
  "use strict";

  const BASE_URL = "https://viacep.com.br/ws";
  const TIMEOUT_MS = 8000;

  /**
   * Realiza a consulta de um CEP na API ViaCEP
   * @param {string} cep - CEP sanitizado (8 dígitos)
   * @returns {Promise<object>} Dados do endereço ou erro
   */
  async function fetchAddress(cep) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`${BASE_URL}/${cep}/json/`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // ViaCEP retorna { erro: true } para CEPs não encontrados
      if (data.erro) {
        return {
          success: false,
          error: "CEP não encontrado. Verifique se o número está correto.",
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: {
          cep: data.cep || "",
          logradouro: data.logradouro || "Não disponível",
          bairro: data.bairro || "Não disponível",
          cidade: data.localidade || "Não disponível",
          uf: data.uf || "",
          ddd: data.ddd || "N/A",
          complemento: data.complemento || "",
          ibge: data.ibge || "",
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        return {
          success: false,
          error:
            "A consulta demorou muito. Verifique sua conexão e tente novamente.",
          data: null,
        };
      }

      if (!navigator.onLine) {
        return {
          success: false,
          error: "Sem conexão com a internet. Verifique sua rede.",
          data: null,
        };
      }

      return {
        success: false,
        error: "Erro ao consultar o CEP. Tente novamente em alguns instantes.",
        data: null,
      };
    }
  }

  return {
    fetchAddress,
    BASE_URL,
    TIMEOUT_MS,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = CepApi;
}
