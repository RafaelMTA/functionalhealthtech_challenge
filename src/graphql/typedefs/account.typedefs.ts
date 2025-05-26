import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    conta: String!
    saldo: Decimal!
  }

  type Query {
    listarContas: [Account!]!
    saldo(conta: String!): Account
  }

  type Mutation {
    criarConta(saldo: Decimal!): Account!
    deletarConta(conta: String!): Account
  }
`;