/**
 * Testes Unitários - Módulo de API
 *
 * Utiliza mocks do fetch para simular respostas da ViaCEP
 */

const CepApi = require("../src/js/api");

// Mock global do fetch
global.fetch = jest.fn();
global.navigator = { onLine: true };

describe("CepApi", () => {
  beforeEach(() => {
    fetch.mockClear();
    global.navigator.onLine = true;
  });

  // =========================================
  // fetchAddress() - Sucesso
  // =========================================
  describe("fetchAddress() - Cenários de Sucesso", () => {
    test("deve retornar dados completos para CEP válido", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cep: "01001-000",
          logradouro: "Praça da Sé",
          complemento: "lado ímpar",
          bairro: "Sé",
          localidade: "São Paulo",
          uf: "SP",
          ddd: "11",
          ibge: "3550308",
        }),
      });

      const result = await CepApi.fetchAddress("01001000");

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toEqual({
        cep: "01001-000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        cidade: "São Paulo",
        uf: "SP",
        ddd: "11",
        complemento: "lado ímpar",
        ibge: "3550308",
      });
    });

    test("deve tratar campos ausentes com valores padrão", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cep: "12345-678",
          logradouro: "",
          complemento: "",
          bairro: "",
          localidade: "Cidade Teste",
          uf: "TS",
          ddd: "",
          ibge: "",
        }),
      });

      const result = await CepApi.fetchAddress("12345678");

      expect(result.success).toBe(true);
      expect(result.data.logradouro).toBe("Não disponível");
      expect(result.data.bairro).toBe("Não disponível");
      expect(result.data.ddd).toBe("N/A");
    });
  });

  // =========================================
  // fetchAddress() - CEP Não Encontrado
  // =========================================
  describe("fetchAddress() - CEP Não Encontrado", () => {
    test("deve retornar erro para CEP inexistente", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ erro: true }),
      });

      const result = await CepApi.fetchAddress("99999999");

      expect(result.success).toBe(false);
      expect(result.error).toContain("não encontrado");
      expect(result.data).toBeNull();
    });
  });

  // =========================================
  // fetchAddress() - Erros de Rede
  // =========================================
  describe("fetchAddress() - Erros de Rede", () => {
    test("deve tratar erro HTTP 500", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await CepApi.fetchAddress("01001000");

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test("deve tratar timeout (AbortError)", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      fetch.mockRejectedValueOnce(abortError);

      const result = await CepApi.fetchAddress("01001000");

      expect(result.success).toBe(false);
      expect(result.error).toContain("demorou");
    });

    test("deve tratar erro de rede (offline)", async () => {
      // Simula navigator.onLine = false usando Object.defineProperty
      const originalNavigator = global.navigator;
      Object.defineProperty(global, "navigator", {
        value: { onLine: false },
        writable: true,
        configurable: true,
      });

      fetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await CepApi.fetchAddress("01001000");

      expect(result.success).toBe(false);
      expect(result.error).toContain("conexão");

      // Restaura navigator original
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
    });

    test("deve tratar erro genérico de fetch", async () => {
      global.navigator.onLine = true;
      fetch.mockRejectedValueOnce(new Error("Unknown error"));

      const result = await CepApi.fetchAddress("01001000");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Erro ao consultar");
    });
  });

  // =========================================
  // Configurações da API
  // =========================================
  describe("Configurações", () => {
    test("deve usar a URL base correta da ViaCEP", () => {
      expect(CepApi.BASE_URL).toBe("https://viacep.com.br/ws");
    });

    test("deve ter timeout configurado", () => {
      expect(CepApi.TIMEOUT_MS).toBeGreaterThan(0);
      expect(CepApi.TIMEOUT_MS).toBeLessThanOrEqual(15000);
    });
  });
});
