/**
 * Testes Unitários - Módulo de Validação de CEP
 *
 * Cobre: sanitize, format, hasValidLength, isNotAllSameDigits,
 *        isInValidRange, validate, applyMask
 */

const CepValidator = require("../src/js/validators");

describe("CepValidator", () => {
  // =========================================
  // sanitize()
  // =========================================
  describe("sanitize()", () => {
    test("deve remover hífen do CEP", () => {
      expect(CepValidator.sanitize("01001-000")).toBe("01001000");
    });

    test("deve remover pontos e espaços", () => {
      expect(CepValidator.sanitize("01.001 000")).toBe("01001000");
    });

    test("deve remover letras", () => {
      expect(CepValidator.sanitize("abc01001def000")).toBe("01001000");
    });

    test("deve retornar string vazia para input vazio", () => {
      expect(CepValidator.sanitize("")).toBe("");
    });

    test("deve retornar string vazia para input não-string", () => {
      expect(CepValidator.sanitize(null)).toBe("");
      expect(CepValidator.sanitize(undefined)).toBe("");
      expect(CepValidator.sanitize(123)).toBe("");
    });

    test("deve manter apenas dígitos", () => {
      expect(CepValidator.sanitize("!@#01$%^001&*()000")).toBe("01001000");
    });
  });

  // =========================================
  // format()
  // =========================================
  describe("format()", () => {
    test("deve formatar CEP com 8 dígitos corretamente", () => {
      expect(CepValidator.format("01001000")).toBe("01001-000");
    });

    test("deve formatar CEP que já contém hífen", () => {
      expect(CepValidator.format("01001-000")).toBe("01001-000");
    });

    test("deve retornar valor limpo se não tem 8 dígitos", () => {
      expect(CepValidator.format("01001")).toBe("01001");
    });

    test("deve formatar corretamente CEP com caracteres especiais", () => {
      expect(CepValidator.format("01.001-000")).toBe("01001-000");
    });
  });

  // =========================================
  // hasValidLength()
  // =========================================
  describe("hasValidLength()", () => {
    test("deve retornar true para CEP com 8 dígitos", () => {
      expect(CepValidator.hasValidLength("01001000")).toBe(true);
    });

    test("deve retornar true para CEP formatado com hífen", () => {
      expect(CepValidator.hasValidLength("01001-000")).toBe(true);
    });

    test("deve retornar false para CEP com menos de 8 dígitos", () => {
      expect(CepValidator.hasValidLength("0100100")).toBe(false);
    });

    test("deve retornar false para CEP com mais de 8 dígitos", () => {
      expect(CepValidator.hasValidLength("010010001")).toBe(false);
    });

    test("deve retornar false para string vazia", () => {
      expect(CepValidator.hasValidLength("")).toBe(false);
    });
  });

  // =========================================
  // isNotAllSameDigits()
  // =========================================
  describe("isNotAllSameDigits()", () => {
    test("deve retornar false para 00000000", () => {
      expect(CepValidator.isNotAllSameDigits("00000000")).toBe(false);
    });

    test("deve retornar false para 11111111", () => {
      expect(CepValidator.isNotAllSameDigits("11111111")).toBe(false);
    });

    test("deve retornar false para 99999999", () => {
      expect(CepValidator.isNotAllSameDigits("99999999")).toBe(false);
    });

    test("deve retornar true para CEP válido", () => {
      expect(CepValidator.isNotAllSameDigits("01001000")).toBe(true);
    });

    test("deve retornar true para CEP com dígitos repetidos parciais", () => {
      expect(CepValidator.isNotAllSameDigits("11111112")).toBe(true);
    });
  });

  // =========================================
  // isInValidRange()
  // =========================================
  describe("isInValidRange()", () => {
    test("deve retornar true para CEP de São Paulo", () => {
      expect(CepValidator.isInValidRange("01001000")).toBe(true);
    });

    test("deve retornar true para CEP do limite superior", () => {
      expect(CepValidator.isInValidRange("99999999")).toBe(true);
    });

    test("deve retornar true para CEP do limite inferior", () => {
      expect(CepValidator.isInValidRange("01000000")).toBe(true);
    });

    test("deve retornar false para CEP abaixo do limite", () => {
      expect(CepValidator.isInValidRange("00000000")).toBe(false);
    });

    test("deve retornar false para CEP com todos zeros", () => {
      expect(CepValidator.isInValidRange("00999999")).toBe(false);
    });
  });

  // =========================================
  // validate() - Validação Completa
  // =========================================
  describe("validate()", () => {
    test("deve validar CEP correto", () => {
      const result = CepValidator.validate("01001000");
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.sanitized).toBe("01001000");
    });

    test("deve validar CEP formatado com hífen", () => {
      const result = CepValidator.validate("01001-000");
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("deve rejeitar input vazio", () => {
      const result = CepValidator.validate("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("informe");
    });

    test("deve rejeitar CEP com menos de 8 dígitos", () => {
      const result = CepValidator.validate("0100");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("8 dígitos");
    });

    test("deve rejeitar CEP com mais de 8 dígitos", () => {
      const result = CepValidator.validate("010010001");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("8 dígitos");
    });

    test("deve rejeitar CEP com dígitos todos iguais", () => {
      const result = CepValidator.validate("11111111");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("repetidos");
    });

    test("deve rejeitar CEP fora da faixa válida", () => {
      const result = CepValidator.validate("00000001");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("faixa válida");
    });

    test("deve retornar o CEP sanitizado", () => {
      const result = CepValidator.validate("01.001-000");
      expect(result.sanitized).toBe("01001000");
    });

    test("deve validar vários CEPs reais de capitais brasileiras", () => {
      const cepsReais = [
        "01001000", // SP
        "20040020", // RJ
        "70040010", // Brasília
        "30130000", // BH
        "80010000", // Curitiba
        "40015970", // Salvador
        "60060440", // Fortaleza
      ];

      cepsReais.forEach((cep) => {
        const result = CepValidator.validate(cep);
        expect(result.valid).toBe(true);
      });
    });
  });

  // =========================================
  // applyMask()
  // =========================================
  describe("applyMask()", () => {
    test("deve aplicar máscara para CEP completo", () => {
      expect(CepValidator.applyMask("01001000")).toBe("01001-000");
    });

    test("deve aplicar máscara parcial (5 dígitos)", () => {
      expect(CepValidator.applyMask("01001")).toBe("01001");
    });

    test("deve aplicar máscara parcial (6 dígitos)", () => {
      expect(CepValidator.applyMask("010010")).toBe("01001-0");
    });

    test("deve limitar a 8 dígitos", () => {
      expect(CepValidator.applyMask("010010001")).toBe("01001-000");
    });

    test("deve lidar com input vazio", () => {
      expect(CepValidator.applyMask("")).toBe("");
    });

    test("deve remover caracteres não numéricos antes de aplicar máscara", () => {
      expect(CepValidator.applyMask("01a001b000")).toBe("01001-000");
    });
  });
});
