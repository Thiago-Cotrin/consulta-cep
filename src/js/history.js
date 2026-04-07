/**
 * Módulo de Histórico - Persistência com localStorage
 * Gerencia o histórico de consultas realizadas
 */

const HistoryManager = (() => {
  "use strict";

  const STORAGE_KEY = "cep_history";
  const MAX_ITEMS = 10;

  /**
   * Obtém o histórico do localStorage
   * @returns {Array} Lista de consultas anteriores
   */
  function getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Salva uma nova consulta no histórico
   * @param {object} entry - Dados da consulta { cep, cidade, uf }
   */
  function add(entry) {
    try {
      let history = getAll();

      // Remove duplicata se existir
      history = history.filter((item) => item.cep !== entry.cep);

      // Adiciona no início
      history.unshift({
        cep: entry.cep,
        cidade: entry.cidade,
        uf: entry.uf,
        timestamp: new Date().toISOString(),
      });

      // Limita tamanho
      if (history.length > MAX_ITEMS) {
        history = history.slice(0, MAX_ITEMS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Silenciosamente ignora erros de localStorage (modo privado, etc.)
    }
  }

  /**
   * Limpa todo o histórico
   */
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora erros silenciosamente
    }
  }

  return {
    getAll,
    add,
    clear,
    STORAGE_KEY,
    MAX_ITEMS,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = HistoryManager;
}
