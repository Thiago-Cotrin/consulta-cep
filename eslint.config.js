const js = require("@eslint/js");
const globals = require("globals");

// Os módulos são carregados por <script> e partilham o escopo global (ver index.html).
const appGlobals = {
  CepValidator: "readonly",
  CepApi: "readonly",
  UI: "readonly",
  HistoryManager: "readonly",
  App: "readonly",
};

module.exports = [
  { ignores: ["node_modules/", "coverage/", "reports/"] },
  js.configs.recommended,
  {
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...appGlobals, module: "readonly" },
    },
    // Cada ficheiro declara o seu próprio módulo global.
    rules: { "no-redeclare": ["error", { builtinGlobals: false }] },
  },
  {
    files: ["tests/**/*.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest, ...globals.browser },
    },
  },
];
