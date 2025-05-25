/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionService } from '../../src/services/transaction/transaction.service';
import { mockAccount } from '../mocks/account.mock';
import { InvalidDecimalPlacesError, InvalidFundsError, NegativeFundsError, InsufficientFundsError, NotFoundError } from '../../src/errors/applicationErrors';

describe('TransactionService', () => {
    let service: TransactionService;
    let mockRepository: any;

    beforeEach(() => {
        vi.clearAllMocks();
        let currentSaldo = mockAccount.saldo;

        mockRepository = {
            findByAccountNumber: vi.fn().mockImplementation(() =>
                Promise.resolve({ ...mockAccount, saldo: currentSaldo })),
            updateAccountBalance: vi.fn().mockImplementation((_, novoSaldo) => {
                currentSaldo = novoSaldo;
                return Promise.resolve({ ...mockAccount, saldo: currentSaldo });
            })
        };
        service = new TransactionService(mockRepository);
    });

    describe('Operações de Depósito', () => {
        it('deve realizar depósito com sucesso', async () => {
            const input = { conta: "12345", valor: 500 };
            const result = await service.deposit(input);
            expect(result?.saldo).toBe(1500);
            expect(mockRepository.updateAccountBalance).toHaveBeenCalledWith("12345", 1500);
        });

        it('deve manter precisão decimal no depósito', async () => {
            const input = { conta: "12345", valor: 100.45 };
            const result = await service.deposit(input);
            expect(result?.saldo).toBe(1100.45);
        });

        it('deve rejeitar depósito com mais de 2 casas decimais', async () => {
            const input = { conta: "12345", valor: 100.456 };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidDecimalPlacesError);
        });
    });

    describe('Operações de Saque', () => {
        it('deve realizar saque com sucesso', async () => {
            const input = { conta: "12345", valor: 500 };
            const result = await service.withdraw(input);
            expect(result?.saldo).toBe(500);
        });

        it('deve rejeitar saque maior que saldo', async () => {
            const input = { conta: "12345", valor: 2000 };
            await expect(service.withdraw(input))
                .rejects.toThrow(InsufficientFundsError);
        });

        it('deve rejeitar saque com valor negativo', async () => {
            const input = { conta: "12345", valor: -100 };
            await expect(service.withdraw(input))
                .rejects.toThrow(NegativeFundsError);
        });
    });

    describe('Validações de Conta', () => {
        it('deve rejeitar operação em conta inexistente', async () => {
            mockRepository.findByAccountNumber.mockResolvedValueOnce(null);
            const input = { conta: "99999", valor: 100 };
            await expect(service.deposit(input))
                .rejects.toThrow(NotFoundError);
        });

        it('deve rejeitar erro de banco de dados', async () => {
            mockRepository.updateAccountBalance.mockRejectedValueOnce(new Error('Database error'));
            const input = { conta: "12345", valor: 100 };
            await expect(service.deposit(input)).rejects.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('deve rejeitar valores não numéricos', async () => {
            const input = { conta: "12345", valor: NaN };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve rejeitar valores infinitos', async () => {
            const input = { conta: "12345", valor: Infinity };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve lidar com saque do saldo total', async () => {
            const input = { conta: "12345", valor: 1000 };
            const result = await service.withdraw(input);
            expect(result?.saldo).toBe(0);
        });

        it('deve preservar precisão em operações sequenciais', async () => {
            // Primeira operação: depósito
            const deposit = { conta: "12345", valor: 0.1 };
            await service.deposit(deposit);

            // Segunda operação: saque
            const withdraw = { conta: "12345", valor: 0.05 };
            const result = await service.withdraw(withdraw);

            // Verifica se o saldo final está correto (1000 + 0.1 - 0.05 = 1000.05)
            expect(result?.saldo).toBe(1000.05);
        });
    });
});
