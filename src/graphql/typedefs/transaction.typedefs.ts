import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Decimal

  type Account {
    _id: ID!
    accountNumber: String!
    balance: Decimal!
  }

  input EditFundsInput {
    accountNumber: String!,
    balance: Decimal!
  }

  type Mutation {
    depositar(input: EditFundsInput!): Account!
    sacar(input: EditFundsInput!): Account!
  }
`;