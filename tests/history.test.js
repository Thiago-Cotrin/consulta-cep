/**
 * Testes Unitários - Módulo de Histórico
 *
 * Testa persistência com localStorage (mockado)
 */

const HistoryManager = require("../src/js/history");

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    _getStore: () => store,
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("HistoryManager", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  // =========================================
  // getAll()
  // =========================================
  describe("getAll()", () => {
    test("deve retornar array vazio quando não há histórico", () => {
      expect(HistoryManager.getAll()).toEqual([]);
    });

    test("deve retornar itens salvos", () => {
      const items = [
        {
          cep: "01001-000",
          cidade: "São Paulo",
          uf: "SP",
          timestamp: "2024-01-01",
        },
      ];
      localStorageMock.setItem(
        HistoryManager.STORAGE_KEY,
        JSON.stringify(items),
      );

      expect(HistoryManager.getAll()).toEqual(items);
    });

    test("deve retornar array vazio para JSON inválido", () => {
      localStorageMock.getItem.mockReturnValueOnce("invalid-json{{{");
      expect(HistoryManager.getAll()).toEqual([]);
    });
  });

  // =========================================
  // add()
  // =========================================
  describe("add()", () => {
    test("deve adicionar uma entrada ao histórico", () => {
      HistoryManager.add({ cep: "01001-000", cidade: "São Paulo", uf: "SP" });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(1);
      expect(history[0].cep).toBe("01001-000");
      expect(history[0].cidade).toBe("São Paulo");
      expect(history[0].timestamp).toBeDefined();
    });

    test("deve adicionar no início da lista (mais recente primeiro)", () => {
      HistoryManager.add({ cep: "01001-000", cidade: "São Paulo", uf: "SP" });
      HistoryManager.add({
        cep: "20040-020",
        cidade: "Rio de Janeiro",
        uf: "RJ",
      });

      const history = HistoryManager.getAll();
      expect(history[0].cep).toBe("20040-020");
      expect(history[1].cep).toBe("01001-000");
    });

    test("deve remover duplicatas e mover para o início", () => {
      HistoryManager.add({ cep: "01001-000", cidade: "São Paulo", uf: "SP" });
      HistoryManager.add({
        cep: "20040-020",
        cidade: "Rio de Janeiro",
        uf: "RJ",
      });
      HistoryManager.add({ cep: "01001-000", cidade: "São Paulo", uf: "SP" });

      const history = HistoryManager.getAll();
      expect(history).toHaveLength(2);
      expect(history[0].cep).toBe("01001-000");
    });

    test("deve limitar ao máximo de itens configurado", () => {
      for (let i = 1; i <= 15; i++) {
        HistoryManager.add({
          cep: `${String(i).padStart(5, "0")}-000`,
          cidade: `Cidade ${i}`,
          uf: "XX",
        });
      }

      const history = HistoryManager.getAll();
      expect(history.length).toBeLessThanOrEqual(HistoryManager.MAX_ITEMS);
    });
  });

  // =========================================
  // clear()
  // =========================================
  describe("clear()", () => {
    test("deve limpar todo o histórico", () => {
      HistoryManager.add({ cep: "01001-000", cidade: "São Paulo", uf: "SP" });
      HistoryManager.clear();

      expect(HistoryManager.getAll()).toEqual([]);
    });
  });

  // =========================================
  // Constantes
  // =========================================
  describe("Constantes", () => {
    test("deve ter chave de storage definida", () => {
      expect(HistoryManager.STORAGE_KEY).toBe("cep_history");
    });

    test("deve ter limite máximo razoável de itens", () => {
      expect(HistoryManager.MAX_ITEMS).toBeGreaterThanOrEqual(5);
      expect(HistoryManager.MAX_ITEMS).toBeLessThanOrEqual(50);
    });
  });
});
