import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    conta: String!
    saldo: Decimal!
    createdAt: String!
  }

  input CreateAccountInput {
    saldo: Decimal!
  }

  type Query {
    listarContas: [Account!]!
    buscarConta(conta: String!): Account
  }

  type Mutation {
    criarConta(input: CreateAccountInput!): Account!
    deletarConta(conta: String!): Account
  }
`;