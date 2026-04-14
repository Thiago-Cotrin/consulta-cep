# 📍 Consulta CEP — Qualidade de Software na Prática com CI/CD

![CI/CD Pipeline](https://github.com/SEU_USUARIO/consulta-cep/actions/workflows/ci.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descrição

Aplicação web para **consulta de CEP** que retorna automaticamente o endereço completo (logradouro, bairro, cidade, estado e DDD) a partir de um CEP informado pelo usuário. A aplicação consome a API pública [ViaCEP](https://viacep.com.br/) e foi desenvolvida com foco em **Qualidade de Software**.

### 🎯 Funcionalidades

- ✅ Validação completa do CEP (formato, faixa, dígitos repetidos)
- ✅ Máscara automática de input (XXXXX-XXX)
- ✅ Consulta à API ViaCEP com tratamento de erros
- ✅ Exibição de resultados formatados
- ✅ Histórico de consultas com persistência (localStorage)
- ✅ Copiar endereço para área de transferência
- ✅ Design responsivo (mobile-first)
- ✅ Acessibilidade (WCAG 2.1 - ARIA, skip-link, teclado)
- ✅ Modo escuro automático (prefers-color-scheme)
- ✅ Redução de movimento (prefers-reduced-motion)

---

## 🏗️ Justificativa da Abordagem

### Frontend Estático (Opção 1)

Optamos pela **abordagem de frontend estático** pelos seguintes motivos:

1. **Simplicidade e foco**: A aplicação se concentra em validação, consumo de API e UX — pilares da qualidade de software.
2. **Compatibilidade com GitHub Pages**: Deploy direto sem necessidade de backend.
3. **API pública (ViaCEP)**: Não requer autenticação ou backend intermediário.
4. **Testabilidade**: Módulos JavaScript puros são altamente testáveis com Jest.
5. **Zero dependências em produção**: Apenas HTML, CSS e JavaScript vanilla.

---

## 🏛️ Arquitetura e Decisões Técnicas

### Separação de Responsabilidades (SRP)

```
consulta-cep/
├── index.html                    # Estrutura HTML semântica
├── src/
│   ├── css/
│   │   ├── styles.css           # Estilos visuais (metodologia BEM)
│   │   └── accessibility.css    # Acessibilidade (WCAG 2.1)
│   └── js/
│       ├── validators.js        # Validação de CEP (regras de negócio)
│       ├── api.js               # Comunicação com ViaCEP
│       ├── ui.js                # Manipulação do DOM
│       ├── history.js           # Persistência com localStorage
│       └── app.js               # Orquestrador principal
├── tests/
│   ├── validators.test.js       # Testes de validação (~25 casos)
│   ├── api.test.js              # Testes da API (~10 casos)
│   └── history.test.js          # Testes de histórico (~10 casos)
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline CI/CD (GitHub Actions)
├── package.json                 # Configuração do projeto e Jest
└── README.md                    # Este arquivo
```

### Padrões Aplicados

| Padrão                      | Onde foi aplicado                        |
| --------------------------- | ---------------------------------------- |
| **Module Pattern (IIFE)**   | Todos os módulos JS — encapsulamento     |
| **BEM (CSS)**               | Nomenclatura de classes CSS              |
| **SRP**                     | Cada módulo com responsabilidade única   |
| **Defensive Programming**   | Validação de inputs, tratamento de erros |
| **Progressive Enhancement** | Funciona sem JS (conteúdo acessível)     |
| **Mobile-First**            | CSS responsivo com media queries         |

---

## 🧪 Testes Unitários

### Framework: Jest + jsdom

Os testes cobrem 3 módulos com **~45 casos de teste**:

#### `validators.test.js`

- `sanitize()` — Remoção de caracteres (6 testes)
- `format()` — Formatação de CEP (4 testes)
- `hasValidLength()` — Validação de comprimento (5 testes)
- `isNotAllSameDigits()` — Dígitos repetidos (5 testes)
- `isInValidRange()` — Faixa válida (5 testes)
- `validate()` — Validação completa (9 testes)
- `applyMask()` — Máscara de input (6 testes)

#### `api.test.js`

- Resposta de sucesso com dados completos
- Campos ausentes com valores padrão
- CEP não encontrado (`{ erro: true }`)
- Erros HTTP (500, 404, etc.)
- Timeout (AbortError)
- Erro de rede (offline)

#### `history.test.js`

- CRUD no localStorage
- Controle de duplicatas
- Limite de itens
- Tratamento de JSON inválido

### Executar Testes

```bash
# Instalar dependências
npm install

# Executar testes com cobertura
npm test

# Modo watch (desenvolvimento)
npm run test:watch
```

---

## ⚙️ Pipeline de CI/CD

### GitHub Actions (`.github/workflows/master.yml`)

A pipeline executa automaticamente em:

- **Push na main** → Testes + Deploy
- **Pull Requests para main** → Testes + Comentário de cobertura

#### Jobs:

| Job            | Descrição                                              | Trigger      |
| -------------- | ------------------------------------------------------ | ------------ |
| 🧪 **test**    | Executa testes unitários e gera relatório de cobertura | Push + PR    |
| 🔍 **quality** | Valida estrutura do projeto e HTML semântico           | Push + PR    |
| 🚀 **deploy**  | Publica no GitHub Pages (apenas se testes passarem)    | Push na main |

#### Funcionalidades da Pipeline:

- ✅ Execução de testes com cobertura mínima de 80%
- ✅ Upload de relatórios como artefatos
- ✅ Comentário automático de cobertura em Pull Requests
- ✅ Validação de estrutura e qualidade do HTML
- ✅ Deploy condicional (só após sucesso dos testes)
- ✅ Concorrência controlada (sem deploys simultâneos)

---

## 🔍 Revisão Automatizada de Código

### Configuração do GitHub App

Recomendamos a instalação do **Gemini Code Assist** ou **Qodo** no repositório:

1. Acesse o GitHub Marketplace
2. Busque por "Gemini Code Assist" (ou "Qodo PR Agent")
3. Instale no repositório
4. Crie um Pull Request — a ferramenta analisará automaticamente

### Branch Protection Rules

O repositório deve ser configurado com:

- ✅ Require pull request before merging
- ✅ Require status checks to pass (CI pipeline)
- ✅ Require review from code owners (opcional)

---

## 🚀 Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/consulta-cep.git
cd consulta-cep

# 2. Instale as dependências (apenas para testes)
npm install

# 3. Execute os testes
npm test

# 4. Abra a aplicação no navegador
# Opção A: Abra o index.html diretamente
open index.html

# Opção B: Use um servidor local
npx serve .
# Acesse: http://localhost:3000
```

---

## 🌐 Deploy

A aplicação é publicada automaticamente no **GitHub Pages** via pipeline CI/CD.

**URL**: `https://SEU_USUARIO.github.io/consulta-cep/`

### Configurar GitHub Pages:

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. A pipeline fará o deploy automaticamente

---

## 🔗 API Utilizada

| API        | URL                                  | Autenticação | Limite                 |
| ---------- | ------------------------------------ | ------------ | ---------------------- |
| **ViaCEP** | https://viacep.com.br/ws/{cep}/json/ | Nenhuma      | Sem limite documentado |

### Exemplo de Resposta:

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP",
  "ddd": "11"
}
```

---

## 👥 Equipe

- **Thiago & Iago** — Desenvolvimento e Testes

---

## 📄 Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
