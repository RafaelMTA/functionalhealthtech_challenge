# API de Banco Digital

API GraphQL para gerenciamento de contas bancárias desenvolvida com Node.js, TypeScript, MongoDB e Apollo Server.

## 🚀 Tecnologias

- Node.js
- TypeScript
- MongoDB com Mongoose
- Apollo Server (GraphQL)
- Vitest (Testes)

## 📋 Funcionalidades

- Criar conta bancária
- Listar todas as contas
- Buscar conta por número
- Realizar depósito
- Realizar saque
- Deletar conta

## 💻 Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB (local ou Atlas)
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis
PORT=3000
MONGODB_URI=sua-uri-do-mongodb
```

## Criando o banco de dados
1. Local(Via Docker)

1.1. Faça o download e instalação do Docker:
# Acesse o site abaixo e siga as instruções de instalação:
# https://www.docker.com/

1.2. Abra um terminal e Execute o comando abaixo para baixar e executar a imagem docker:
```bash
docker run --name my-mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```
1.3. Verifique se o container esta em execução
```bash
docker ps
```
1.4. Inclua a url no arquivo .env
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bankapp
```

2. Mongo Atlas(Cloud)
2.1. Inclua em seu arquivo .env a URL abaixo:
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis, usuário temporario apenas para avaliação do desafio
PORT=3000
MONGODB_URI=mongodb+srv://openuser:V1YvYcNGBpQVPkda@bankapp.hdjczyu.mongodb.net/?retryWrites=true&w=majority&appName=bankapp
```

## 🏃‍♂️ Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Testes
npm test

# Cobertura de testes
npm run test:coverage
```

## 🗄️ Estrutura do Banco de Dados

### Schema da Conta (Account)
```typescript
{
  accountNumber: String,  // Número único da conta (5 dígitos)
  balance: Number,       // Saldo com precisão de 2 casas decimais
  timestamps: true      // Registra createdAt e updatedAt
}
```

## 🔍 Testes

O projeto utiliza Vitest para testes unitários e de integração:

- Testes de Serviços (Services)
  - Validações de negócio
  - Manipulação de saldo
  - Tratamento de erros

- Testes de Repositórios (Repositories)
  - Operações CRUD
  - Interações com MongoDB
  - Tratamento de erros de banco

- Testes de Modelos (Models)
  - Validações de schema
  - Formatação de dados
  - Casos extremos (edge cases)

## 📝 Documentação GraphQL

### Queries
```graphql
listarContas: [Account!]!
buscarConta(accountNumber: String!): Account
```

### Mutations
```graphql
criarConta(input: CreateAccountInput!): Account!
deletarConta(accountNumber: String!): Accout
depositar(input: EditFundsInput!): Account!
sacar(input: EditFundsInput!): Account!
```

## 🔒 Validações Implementadas

- Número da conta deve ter exatamente 5 dígitos
- Saldo não pode ser negativo
- Valores monetários limitados a 2 casas decimais
- Verificação de saldo suficiente para saques
- Validação de conta existente
- Tratamento de erros de banco de dados

## 🛠️ Desenvolvimento

### Padrões de Projeto
- Repository Pattern
- Service Layer
- Dependency Injection
- Error Handling Centralizado

### Boas Práticas
- Clean Code
- SOLID Principles
- Testes Automatizados
- Validações Robustas
- Tipagem Forte (TypeScript)


