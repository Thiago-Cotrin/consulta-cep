/**
 * Módulo de UI - Manipulação do DOM
 * Responsável por atualizar a interface do usuário
 *
 * Princípio: Separação de responsabilidades
 * Este módulo NÃO contém lógica de negócio
 */

const UI = (() => {
  "use strict";

  // Cache de elementos DOM (performance)
  const elements = {
    form: () => document.getElementById("cep-form"),
    input: () => document.getElementById("cep-input"),
    searchBtn: () => document.getElementById("search-btn"),
    btnText: () => document.querySelector(".btn__text"),
    btnLoader: () => document.querySelector(".btn__loader"),
    errorDiv: () => document.getElementById("cep-error"),
    resultSection: () => document.getElementById("result-section"),
    resultCep: () => document.getElementById("result-cep"),
    resultLogradouro: () => document.getElementById("result-logradouro"),
    resultBairro: () => document.getElementById("result-bairro"),
    resultCidade: () => document.getElementById("result-cidade"),
    resultUf: () => document.getElementById("result-uf"),
    resultDdd: () => document.getElementById("result-ddd"),
    copyBtn: () => document.getElementById("copy-btn"),
    clearBtn: () => document.getElementById("clear-btn"),
    historySection: () => document.getElementById("history-section"),
    historyList: () => document.getElementById("history-list"),
    clearHistoryBtn: () => document.getElementById("clear-history-btn"),
  };

  /**
   * Exibe mensagem de erro no formulário
   * @param {string} message - Mensagem de erro
   */
  function showError(message) {
    const errorDiv = elements.errorDiv();
    const input = elements.input();

    errorDiv.textContent = message;
    errorDiv.hidden = false;
    input.classList.add("form-input--error");
    input.classList.remove("form-input--success");
    input.setAttribute("aria-invalid", "true");
  }

  /**
   * Limpa a mensagem de erro
   */
  function clearError() {
    const errorDiv = elements.errorDiv();
    const input = elements.input();

    errorDiv.textContent = "";
    errorDiv.hidden = true;
    input.classList.remove("form-input--error");
    input.setAttribute("aria-invalid", "false");
  }

  /**
   * Indica sucesso visual no input
   */
  function showInputSuccess() {
    const input = elements.input();
    input.classList.add("form-input--success");
    input.classList.remove("form-input--error");
  }

  /**
   * Alterna o estado de carregamento do botão
   * @param {boolean} loading - Se está carregando
   */
  function setLoading(loading) {
    const btn = elements.searchBtn();
    const text = elements.btnText();
    const loader = elements.btnLoader();
    const input = elements.input();

    btn.disabled = loading;
    input.readOnly = loading;
    text.hidden = loading;
    loader.hidden = !loading;

    if (loading) {
      btn.setAttribute("aria-busy", "true");
      btn.setAttribute("aria-label", "Buscando endereço...");
    } else {
      btn.removeAttribute("aria-busy");
      btn.setAttribute("aria-label", "Buscar endereço pelo CEP");
    }
  }

  /**
   * Exibe os dados do resultado na tela
   * @param {object} data - Dados do endereço retornados pela API
   */
  function showResult(data) {
    elements.resultCep().textContent = data.cep;
    elements.resultLogradouro().textContent = data.logradouro;
    elements.resultBairro().textContent = data.bairro;
    elements.resultCidade().textContent = data.cidade;
    elements.resultUf().textContent = data.uf;
    elements.resultDdd().textContent = data.ddd;

    const section = elements.resultSection();
    section.hidden = false;
    section.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Esconde a seção de resultado
   */
  function hideResult() {
    elements.resultSection().hidden = true;
  }

  /**
   * Limpa todos os campos e reseta o formulário
   */
  function resetForm() {
    const input = elements.input();
    input.value = "";
    input.classList.remove("form-input--error", "form-input--success");
    input.setAttribute("aria-invalid", "false");
    clearError();
    hideResult();
    input.focus();
  }

  /**
   * Exibe notificação toast
   * @param {string} message - Mensagem
   * @param {'success'|'error'} type - Tipo do toast
   */
  function showToast(message, type = "success") {
    // Remove toast existente
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Copia texto para a área de transferência
   * @param {object} data - Dados do endereço
   */
  async function copyAddress(data) {
    const text = [
      `CEP: ${data.cep}`,
      `Logradouro: ${data.logradouro}`,
      `Bairro: ${data.bairro}`,
      `Cidade: ${data.cidade}`,
      `UF: ${data.uf}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showToast("✅ Endereço copiado com sucesso!", "success");
    } catch {
      showToast("❌ Não foi possível copiar.", "error");
    }
  }

  /**
   * Renderiza a lista de histórico
   * @param {Array} items - Itens do histórico
   * @param {Function} onClickItem - Callback ao clicar em um item
   */
  function renderHistory(items, onClickItem) {
    const section = elements.historySection();
    const list = elements.historyList();

    if (!items || items.length === 0) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    list.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "history-item";
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      li.setAttribute("aria-label", `Consultar CEP ${item.cep} novamente`);
      li.innerHTML = `
        <span class="history-item__cep">${item.cep}</span>
        <span class="history-item__address">${item.cidade} - ${item.uf}</span>
      `;

      li.addEventListener("click", () => onClickItem(item.cep));
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClickItem(item.cep);
        }
      });

      list.appendChild(li);
    });
  }

  return {
    elements,
    showError,
    clearError,
    showInputSuccess,
    setLoading,
    showResult,
    hideResult,
    resetForm,
    showToast,
    copyAddress,
    renderHistory,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = UI;
}
