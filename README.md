# Consulta CEP

[![CI](https://github.com/Thiago-Cotrin/consulta-cep/actions/workflows/ci.yml/badge.svg)](https://github.com/Thiago-Cotrin/consulta-cep/actions/workflows/ci.yml)
![Cobertura de linhas](https://img.shields.io/badge/cobertura%20de%20linhas-100%25-brightgreen)
![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

Aplicação web que recebe um CEP e devolve o endereço completo (logradouro, bairro, cidade, UF e DDD) pela API pública [ViaCEP](https://viacep.com.br/).
É feita em HTML, CSS e JavaScript puro, sem dependências em produção. Foi criada na disciplina de Qualidade de Software (Sistemas de Informação, UEMG): o foco está em validação, tratamento de erros, testes automatizados e integração contínua.

**Demonstração:** https://thiago-cotrin.github.io/consulta-cep/

## Funcionalidades

- Validação do CEP antes da consulta: formato, 8 dígitos, dígitos todos iguais e faixa válida
- Máscara automática no campo (`00000-000`)
- Consulta ao ViaCEP com tempo limite de 8 s (`AbortController`) e mensagens próprias para CEP inexistente, erro HTTP, tempo esgotado e falta de rede
- Histórico das últimas 10 consultas no `localStorage`, sem duplicados e protegido contra JSON corrompido
- Botão para copiar o endereço
- Layout responsivo
- Acessibilidade: link "pular para o conteúdo", atributos ARIA, navegação por teclado e suporte a `prefers-reduced-motion`, `prefers-contrast` e `prefers-color-scheme` (modo escuro)

## Estrutura

```
index.html                 HTML semântico; carrega os módulos na ordem abaixo
src/js/validators.js       regras de validação e máscara do CEP
src/js/api.js              chamada ao ViaCEP, tempo limite e tratamento de erros
src/js/ui.js               atualização do DOM
src/js/history.js          histórico no localStorage
src/js/app.js              liga os módulos e os eventos da página
src/css/styles.css         estilos (nomes de classes no padrão BEM)
src/css/accessibility.css  skip link, foco visível e preferências do sistema
tests/                     testes Jest dos módulos de validação, API e histórico
```

Cada módulo é uma IIFE com uma responsabilidade só e expõe uma API pequena. Os módulos também exportam via `module.exports`, para que o Jest possa testá-los sem navegador.

## Testes

Jest com ambiente `jsdom`: **59 testes** em 3 suítes.

| Suíte | O que cobre |
|---|---|
| `validators.test.js` (40) | limpeza, formatação, comprimento, dígitos repetidos, faixa, validação completa e máscara |
| `api.test.js` (9) | resposta completa, campos ausentes, CEP inexistente, erros HTTP, tempo esgotado e falha de rede (`fetch` simulado) |
| `history.test.js` (10) | gravação e leitura, duplicados, limite de itens e JSON inválido |

Cobertura atual: 100% das linhas e 89,6% dos ramos dos módulos testados (`validators`, `api`, `history`). O `package.json` exige no mínimo 80% em cada métrica. `ui.js` e `app.js` mexem diretamente no DOM e ainda não têm testes.

```bash
npm ci            # instala as dependências de desenvolvimento
npm test          # testes com relatório de cobertura
npm run lint      # ESLint
```

## Integração contínua

Workflow `.github/workflows/ci.yml` (GitHub Actions):

1. **Lint e testes**, em cada push e pull request para `main`: `npm ci`, ESLint e Jest com cobertura. O relatório de cobertura fica guardado como artefato da execução.
2. **Publicação**, só em push para `main` e só se o passo anterior passar: o site é publicado no GitHub Pages.

## Executar localmente

```bash
git clone https://github.com/Thiago-Cotrin/consulta-cep.git
cd consulta-cep
npm ci && npm test
npx serve .        # ou abrir o index.html no navegador
```

## Autores

Thiago Cotrin e Iago, trabalho em dupla da disciplina de Qualidade de Software (2026).

## Licença

[MIT](LICENSE)
