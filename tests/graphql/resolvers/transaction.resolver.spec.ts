/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from '../../../src/graphql/resolvers/transaction.resolvers';
import { mockAccount } from '../../mocks/account.mock';

describe('Transaction Resolvers', () => {
    let mockService: any;
    let resolver: any;

    beforeEach(() => {
        mockService = {
            deposit: vi.fn().mockResolvedValue({ ...mockAccount, balance: 1500 }),
            withdraw: vi.fn().mockResolvedValue({ ...mockAccount, balance: 500 })
        };
        resolver = resolvers(mockService);
    });

    describe('Mutation', () => {
        it('deve realizar depósito com sucesso', async () => {
            const input = { accountNumber: "12345", balance: 500 };
            const result = await resolver.Mutation.depositar(null, { input });
            expect(result.balance).toBe(1500);
            expect(mockService.deposit).toHaveBeenCalledWith(input);
        });

        it('deve realizar saque com sucesso', async () => {
            const input = { accountNumber: "12345", balance: 500 };
            const result = await resolver.Mutation.sacar(null, { input });
            expect(result.balance).toBe(500);
            expect(mockService.withdraw).toHaveBeenCalledWith(input);
        });

        it('deve propagar erros do serviço', async () => {
            const input = { accountNumber: "12345", balance: 5000 };
            mockService.withdraw.mockRejectedValueOnce(new Error('Insufficient funds'));
            await expect(resolver.Mutation.sacar(null, { input }))
                .rejects.toThrow('Insufficient funds');
        });
    });
});
