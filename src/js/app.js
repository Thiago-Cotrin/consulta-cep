/**
 * Módulo Principal da Aplicação
 * Orquestra os módulos e gerencia eventos
 *
 * Ponto de entrada da aplicação
 */

const App = (() => {
  "use strict";

  let lastResult = null;

  /**
   * Realiza a busca do CEP
   * @param {string} cepValue - Valor do CEP
   */
  async function searchCep(cepValue) {
    UI.clearError();
    UI.hideResult();

    // Validação local
    const validation = CepValidator.validate(cepValue);
    if (!validation.valid) {
      UI.showError(validation.error);
      return;
    }

    // Busca na API
    UI.setLoading(true);

    try {
      const result = await CepApi.fetchAddress(validation.sanitized);

      if (!result.success) {
        UI.showError(result.error);
        return;
      }

      // Exibe resultado
      lastResult = result.data;
      UI.showInputSuccess();
      UI.showResult(result.data);

      // Salva no histórico
      HistoryManager.add({
        cep: result.data.cep,
        cidade: result.data.cidade,
        uf: result.data.uf,
      });

      // Atualiza histórico na UI
      UI.renderHistory(HistoryManager.getAll(), handleHistoryClick);
    } catch (error) {
      UI.showError("Erro inesperado. Tente novamente.");
      console.error("[App] Erro:", error);
    } finally {
      UI.setLoading(false);
    }
  }

  /**
   * Handler do clique em item do histórico
   * @param {string} cep - CEP do item clicado
   */
  function handleHistoryClick(cep) {
    const input = UI.elements.input();
    input.value = CepValidator.applyMask(cep);
    searchCep(cep);
  }

  /**
   * Inicializa todos os event listeners
   */
  function bindEvents() {
    const form = UI.elements.form();
    const input = UI.elements.input();
    const copyBtn = UI.elements.copyBtn();
    const clearBtn = UI.elements.clearBtn();
    const clearHistoryBtn = UI.elements.clearHistoryBtn();

    // Submit do formulário
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      searchCep(input.value);
    });

    // Máscara em tempo real
    input.addEventListener("input", (e) => {
      const cursorPos = e.target.selectionStart;
      const oldValue = e.target.value;
      e.target.value = CepValidator.applyMask(e.target.value);

      // Ajuste de cursor ao adicionar hífen
      if (
        e.target.value.length > oldValue.length &&
        e.target.value.includes("-")
      ) {
        e.target.setSelectionRange(cursorPos + 1, cursorPos + 1);
      }

      // Limpa erro ao digitar
      UI.clearError();
    });

    // Copiar endereço
    copyBtn.addEventListener("click", () => {
      if (lastResult) {
        UI.copyAddress(lastResult);
      }
    });

    // Nova consulta
    clearBtn.addEventListener("click", () => {
      lastResult = null;
      UI.resetForm();
    });

    // Limpar histórico
    clearHistoryBtn.addEventListener("click", () => {
      HistoryManager.clear();
      UI.renderHistory([], handleHistoryClick);
      UI.showToast("🗑️ Histórico limpo!", "success");
    });
  }

  /**
   * Inicializa a aplicação
   */
  function init() {
    bindEvents();
    UI.renderHistory(HistoryManager.getAll(), handleHistoryClick);
    console.log("[App] Consulta CEP inicializada com sucesso.");
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    searchCep,
    init,
    handleHistoryClick,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = App;
}
