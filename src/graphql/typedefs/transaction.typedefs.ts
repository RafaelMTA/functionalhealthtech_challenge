import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    conta: String!
    saldo: Decimal!
  }

  input EditFundsInput {
    conta: String!,
    valor: Decimal!
  }

  type Mutation {
    depositar(input: EditFundsInput!): Account!
    sacar(input: EditFundsInput!): Account!
  }
`;