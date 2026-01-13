# Apollo Solutions Frontend

Interface visual desenvolvida com **React**, **Vite** e **TailwindCSS**. A aplicação consome a API RESTful para fornecer dashboards, relatórios e gerenciamento de dados.

## Stack

* [React]
* [Vite] - Build tool
* [TypeScript] - Linguagem tipada.
* [TailwindCSS v4] - Estilização.
* [ShadcnUI] - Componentes.
* [Recharts] - Biblioteca de gráficos para visualização de dados.
* [Lucide React] - Ícones.
* [Node/npm] 


---

## Inicializando o Projeto

### 1. Pré-requisitos

Certifique-se de que seguiu o processo de inicialização do **Backend** da aplicação e que ele já esteja rodando. A porta padrão é `http://127.0.0.1:8000`, se optou por outra porta, será necessário atualizar dentro dos arquivos do frontend. Você também precisará do **Node.js** instalado.

### 2. Clonar o Repositório

```bash
git clone https://github.com/luan-services/apollo-solutions-frontend-task.git
cd apollo-solutions-frontend-task

```

### 3. Instalar Dependências

Instale as bibliotecas necessárias listadas no `package.json`:

```bash
npm install

```

### 4. Rodar a Aplicação

Para iniciar o servidor de desenvolvimento local:

```bash
npm run dev

```

O terminal exibirá o link de acesso local, geralmente: **http://localhost:5173/**

---

## Funcionalidades

A interface é intuitiva e dividida em quatro seções principais acessíveis pela barra lateral.

### Dashboard

Tela inicial que apresenta uma visão geral do negócio, com gráficos e detalhes sobre as vendas.

### 🛍️ Produtos, Categorias e Vendas

Telas dedicadas ao gerenciamento das tabelas (CRUD):

* **Listagem:** Tabelas com dados atualizados.
* **Adicionar/Editar:** Formulários modais para inserir ou alterar registros.
* **Excluir:** Remoção de registros com confirmação de segurança.
* **Importação CSV:** Botão dedicado para fazer upload em massa de dados, integrado diretamente aos endpoints de importação da API.

---

## Estrutura do Projeto

A organização das pastas segue o padrão de features e componentes:

```
├── src/
│   ├── assets/
│   ├── components/
│   ├── layout/
│   │   └── Layout.tsx    # Navbar e estrutura da página.
│   ├── lib/
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   └── SalesPage.tsx
│   ├── types.ts          # Definições de tipagem TypeScript do backend
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts          # Definições de tipagem TypeScript do backend
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

## Configuração de API

Por padrão, o frontend está configurado para buscar dados em `http://127.0.0.1:8000`.
Caso precise alterar a URL da API, verifique as chamadas `fetch` dentro da pasta `src/pages/`.

---