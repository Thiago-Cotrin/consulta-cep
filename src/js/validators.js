/**
 * Módulo de Validação de CEP
 * Responsável por todas as regras de validação do input
 *
 * Princípio: Separação de Responsabilidades (SRP)
 * Cada função tem uma única responsabilidade clara
 */

const CepValidator = (() => {
  "use strict";

  /**
   * Remove caracteres não numéricos do CEP
   * @param {string} cep - CEP com possíveis caracteres especiais
   * @returns {string} CEP apenas com dígitos
   */
  function sanitize(cep) {
    if (typeof cep !== "string") return "";
    return cep.replace(/\D/g, "");
  }

  /**
   * Formata o CEP no padrão XXXXX-XXX
   * @param {string} cep - CEP com 8 dígitos
   * @returns {string} CEP formatado
   */
  function format(cep) {
    const clean = sanitize(cep);
    if (clean.length !== 8) return clean;
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }

  /**
   * Verifica se o CEP possui exatamente 8 dígitos
   * @param {string} cep - CEP a ser validado
   * @returns {boolean}
   */
  function hasValidLength(cep) {
    return sanitize(cep).length === 8;
  }

  /**
   * Verifica se o CEP não contém apenas dígitos repetidos (ex: 00000000)
   * CEPs com todos os dígitos iguais são inválidos
   * @param {string} cep - CEP a ser validado
   * @returns {boolean}
   */
  function isNotAllSameDigits(cep) {
    const clean = sanitize(cep);
    return !/^(\d)\1{7}$/.test(clean);
  }

  /**
   * Verifica se o CEP está dentro de faixas válidas de UF brasileiras
   * Faixas oficiais dos Correios: 01000-000 a 99999-999
   * @param {string} cep - CEP a ser validado
   * @returns {boolean}
   */
  function isInValidRange(cep) {
    const clean = sanitize(cep);
    const num = parseInt(clean, 10);
    return num >= 1000000 && num <= 99999999;
  }

  /**
   * Validação completa do CEP com mensagem de erro específica
   * @param {string} cep - CEP informado pelo usuário
   * @returns {{ valid: boolean, error: string|null, sanitized: string }}
   */
  function validate(cep) {
    const sanitized = sanitize(cep);

    if (!sanitized) {
      return { valid: false, error: "Por favor, informe um CEP.", sanitized };
    }

    if (!hasValidLength(sanitized)) {
      return {
        valid: false,
        error: "O CEP deve conter exatamente 8 dígitos.",
        sanitized,
      };
    }

    if (!isNotAllSameDigits(sanitized)) {
      return {
        valid: false,
        error: "CEP inválido. Não utilize apenas dígitos repetidos.",
        sanitized,
      };
    }

    if (!isInValidRange(sanitized)) {
      return {
        valid: false,
        error: "CEP fora da faixa válida de endereços brasileiros.",
        sanitized,
      };
    }

    return { valid: true, error: null, sanitized };
  }

  /**
   * Aplica máscara de CEP em tempo real (XXXXX-XXX)
   * @param {string} value - Valor do input
   * @returns {string} Valor com máscara aplicada
   */
  function applyMask(value) {
    let clean = sanitize(value);
    if (clean.length > 8) clean = clean.slice(0, 8);
    if (clean.length > 5) {
      return `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    return clean;
  }

  // API pública do módulo
  return {
    sanitize,
    format,
    hasValidLength,
    isNotAllSameDigits,
    isInValidRange,
    validate,
    applyMask,
  };
})();

// Suporte a CommonJS (para testes com Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = CepValidator;
}
