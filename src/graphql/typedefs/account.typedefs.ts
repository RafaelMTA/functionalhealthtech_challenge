import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    accountNumber: String!
    balance: Decimal!
    createdAt: String!
  }

  input CreateAccountInput {
    balance: Decimal!
  }

  type Query {
    listarContas: [Account!]!
    buscarConta(accountNumber: String!): Account
  }

  type Mutation {
    criarConta(input: CreateAccountInput!): Account!
    deletarConta(accountNumber: String!): Account
  }
`;