import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    conta: String!
    saldo: Decimal!
  }

  type Mutation {
    depositar(conta: String!, valor: Decimal!): Account!
    sacar(conta: String!, valor: Decimal!): Account!
  }
`;