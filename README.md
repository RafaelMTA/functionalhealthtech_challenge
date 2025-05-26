# API de Banco Digital

API GraphQL para gerenciamento de contas bancárias desenvolvida com Node.js, TypeScript, MongoDB e Apollo Server.

## 🚀 Tecnologias

- Node.js
- TypeScript
- MongoDB com Mongoose
- Apollo Server (GraphQL)
- Vitest (Testes)
- ESLint

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

### 1. Clone o repositório
```bash
git clone https://github.com/RafaelMTA/functionalhealthtech_challenge.git
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis
PORT=3000
MONGODB_URI=sua-uri-do-mongodb
```

## Criando o banco de dados(Escolha um dos métodos abaixo)
### 1. Local(Via Docker)

#### 1.1. Faça o download e instalação do Docker:
#### - Acesse o site abaixo e siga as instruções de instalação:
```bash
https://www.docker.com/
```
#### 1.2. Abra um terminal e Execute o comando abaixo para baixar e executar a imagem docker:
```bash
docker run --name mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```
#### 1.3. Verifique se o container esta em execução
```bash
docker ps
```
#### 1.4. Acesse o shell do MongoDB
```bash
docker exec -it mongodb mongosh
```
#### 1.5. Crie o banco de dados
```bash
use bankapp
```
#### 1.6. Inclua a url no arquivo .env
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bankapp
```

### 2. Mongo Atlas(Cloud)

#### 2.1. Inclua em seu arquivo .env a URL abaixo:
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

### Acesse o link da aplicação para abrir a API do Apollo Server
```bash
# Exemplo
http://localhost:3000/
```
#### Acesse a seção da Documentação do GraphQL para utilização da API do Apollo Server

## 🗄️ Estrutura do Banco de Dados

### Schema da Conta (Account)
```typescript
{
  conta: String,  // Número único da conta (5 dígitos)
  saldo: Number,       // Saldo com precisão de 2 casas decimais
  timestamps: true      // Registra createdAt e updatedAt
}
```

## 🔍 Testes

O projeto utiliza Vitest para testes unitários:

- Testes de Serviços (Services)
  - Validações de negócio
  - Manipulação de saldo
  - Tratamento de erros

- Testes de Repositórios (Repositories)
  - Operações CRUD
  - Tratamento de erros de banco

- Testes de Modelos (Models)
  - Validações de schema
  - Formatação de dados
  - Casos extremos (edge cases)

## 📝 Documentação GraphQL

### Queries
```graphql
listarContas: [Account!]!
saldo(conta: String!): Account
```

#### Queries Apollo API

##### Listar Contas 
```graphql
# Template para listar todas as contas cadastradas
# Adicione o código abaixo na area de operações(Operation)
query ListarContas {
  listarContas {
    conta
    saldo
  }
}
```

##### Buscar Conta
```graphql
# Template para buscar uma conta
# Adicione o código abaixo na area de operações(Operation)
query Saldo($conta: String!) {
  saldo(conta: $conta) {
    conta
    saldo
  }
}
```

```graphql
# Exemplo para os parametros(JSON)
# Adicione o código abaixo na area de variáveis(Variables)
{
  "conta": "28383"
}
```

### Mutations
```graphql
criarConta(saldo: Decimal!): Account!
deletarConta(conta: String!): Account
depositar(conta: String!, valor: Decimal!): Account!
sacar(conta: String!, valor: Decimal!): Account!
```

#### Mutations Apollo API
##### Criar Conta
```graphql
# Template para criação de uma conta
# Adicione o código abaixo na area de operações(Operation)
mutation CriarConta($saldo: Decimal!) {
  criarConta(saldo: $saldo) {
    conta
    saldo
  }
}
```

```graphql
# Exemplo para os parametros(JSON)
# Adicione o código abaixo na area de variáveis(Variables)
{
  "saldo": 0
}
```

##### Deletar Conta
```graphql
# Template para deletar uma conta
# Adicione o código abaixo na area de operações(Operation)
mutation DeletarConta($conta: String!) {
  deletarConta(conta: $conta) {
    conta
    saldo
  }
}
```

```graphql
# Exemplo para os parametros(JSON)
# Adicione o código abaixo na area de variáveis(Variables)
{
  "conta": "13853"
}
```

##### Depositar
```graphql
# Template para depositar um valor em uma conta
# Adicione o código abaixo na area de operações(Operation)
mutation Depositar($conta: String!, $valor: Decimal!) {
  depositar(conta: $conta, valor: $valor) {
    conta
    saldo    
  }
}
```

```graphql
# Exemplo para os parametros(JSON)
# Adicione o código abaixo na area de variáveis(Variables)
{
  "conta": "20030",
  "valor": 31.23
}
```

##### Sacar
```graphql
# Template para sacar um valor de uma conta
# Adicione o código abaixo na area de operações(Operation)
mutation Sacar($conta: String!, $valor: Decimal!) {
  sacar(conta: $conta, valor: $valor) {
    conta
    saldo
  }
}
```

```graphql
# Exemplo para os parametros(JSON)
# Adicione o código abaixo na area de variáveis(Variables)
{
  "conta": "33070",
  "valor": 100
}

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
- Tipagem Forte (TypeScript)

## ✨ Utilizando ESLint

O projeto utiliza ESLint para garantir qualidade e consistência do código.