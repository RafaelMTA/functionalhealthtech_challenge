/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from '../../../src/graphql/resolvers/account.resolvers';
import { mockAccount, mockAccounts } from '../../mocks/account.mock';

describe('Account Resolvers', () => {
    let mockService: any;
    let resolver: any;

    beforeEach(() => {
        mockService = {
            getAllAccounts: vi.fn().mockResolvedValue(mockAccounts),
            createAccount: vi.fn().mockResolvedValue(mockAccount),
            getAccount: vi.fn().mockResolvedValue(mockAccount),
            deleteAccount: vi.fn().mockResolvedValue(mockAccount)
        };
        resolver = resolvers(mockService);
    });

    describe('Query', () => {
        it('deve listar todas as contas', async () => {
            const result = await resolver.Query.listarContas();
            expect(result).toEqual(mockAccounts);
            expect(mockService.getAllAccounts).toHaveBeenCalled();
        });

        it('deve buscar conta por número', async () => {
            const result = await resolver.Query.saldo(null, { conta: "12345" });
            expect(result).toEqual(mockAccount);
            expect(mockService.getAccount).toHaveBeenCalledWith("12345");
        });
    });

    describe('Mutation', () => {
        it('deve criar conta com sucesso', async () => {
            const result = await resolver.Mutation.criarConta(null, { saldo: 1000 });
            expect(result).toEqual(mockAccount);
            expect(mockService.createAccount).toHaveBeenCalledWith(1000);
        });

        it('deve deletar conta com sucesso', async () => {
            const result = await resolver.Mutation.deletarConta(null, { conta: "12345" });
            expect(result).toBe(result);
            expect(mockService.deleteAccount).toHaveBeenCalledWith("12345");
        });
    });
});
