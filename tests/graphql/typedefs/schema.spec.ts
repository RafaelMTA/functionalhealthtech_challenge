import { describe, it, expect } from 'vitest';
import { print } from 'graphql';
import { typeDefs as accountTypeDefs } from '../../../src/graphql/typedefs/account.typedefs';
import { typeDefs as transactionTypeDefs } from '../../../src/graphql/typedefs/transaction.typedefs';

describe('GraphQL Schema', () => {
    describe('Account TypeDefs', () => {
        it('deve definir tipos corretamente', () => {
            const schema = print(accountTypeDefs);
            expect(schema).toBeDefined();
            expect(schema).toContain('type Account {');
            expect(schema).toContain('type Query {');
            expect(schema).toContain('type Mutation {');
        });

        it('deve incluir campos obrigatórios', () => {
            const schema = print(accountTypeDefs);
            expect(schema).toMatch(/conta:\s*String!/);
            expect(schema).toMatch(/saldo:\s*Decimal!/);
        });
    });

    describe('Transaction TypeDefs', () => {
        it('deve definir inputs corretamente', () => {
            const schema = print(transactionTypeDefs);
            expect(schema).toContain('input EditFundsInput {');
            expect(schema).toMatch(/conta:\s*String!/);
            expect(schema).toMatch(/saldo:\s*Decimal!/);
        });

        it('deve definir mutations corretamente', () => {
            const schema = print(transactionTypeDefs);
            expect(schema).toContain('depositar(input: EditFundsInput!)');
            expect(schema).toContain('sacar(input: EditFundsInput!)');
        });
    });
});
