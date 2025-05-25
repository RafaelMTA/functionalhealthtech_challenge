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
        let currentBalance = mockAccount.balance;

        mockRepository = {
            findByAccountNumber: vi.fn().mockImplementation(() =>
                Promise.resolve({ ...mockAccount, balance: currentBalance })),
            updateAccountBalance: vi.fn().mockImplementation((_, newBalance) => {
                currentBalance = newBalance;
                return Promise.resolve({ ...mockAccount, balance: currentBalance });
            })
        };
        service = new TransactionService(mockRepository);
    });

    describe('Operações de Depósito', () => {
        it('deve realizar depósito com sucesso', async () => {
            const input = { accountNumber: "12345", balance: 500 };
            const result = await service.deposit(input);
            expect(result?.balance).toBe(1500);
            expect(mockRepository.updateAccountBalance).toHaveBeenCalledWith("12345", 1500);
        });

        it('deve manter precisão decimal no depósito', async () => {
            const input = { accountNumber: "12345", balance: 100.45 };
            const result = await service.deposit(input);
            expect(result?.balance).toBe(1100.45);
        });

        it('deve rejeitar depósito com mais de 2 casas decimais', async () => {
            const input = { accountNumber: "12345", balance: 100.456 };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidDecimalPlacesError);
        });
    });

    describe('Operações de Saque', () => {
        it('deve realizar saque com sucesso', async () => {
            const input = { accountNumber: "12345", balance: 500 };
            const result = await service.withdraw(input);
            expect(result?.balance).toBe(500);
        });

        it('deve rejeitar saque maior que saldo', async () => {
            const input = { accountNumber: "12345", balance: 2000 };
            await expect(service.withdraw(input))
                .rejects.toThrow(InsufficientFundsError);
        });

        it('deve rejeitar saque com valor negativo', async () => {
            const input = { accountNumber: "12345", balance: -100 };
            await expect(service.withdraw(input))
                .rejects.toThrow(NegativeFundsError);
        });
    });

    describe('Validações de Conta', () => {
        it('deve rejeitar operação em conta inexistente', async () => {
            mockRepository.findByAccountNumber.mockResolvedValueOnce(null);
            const input = { accountNumber: "99999", balance: 100 };
            await expect(service.deposit(input))
                .rejects.toThrow(NotFoundError);
        });

        it('deve rejeitar erro de banco de dados', async () => {
            mockRepository.updateAccountBalance.mockRejectedValueOnce(new Error('Database error'));
            const input = { accountNumber: "12345", balance: 100 };
            await expect(service.deposit(input)).rejects.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('deve rejeitar valores não numéricos', async () => {
            const input = { accountNumber: "12345", balance: NaN };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve rejeitar valores infinitos', async () => {
            const input = { accountNumber: "12345", balance: Infinity };
            await expect(service.deposit(input))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve lidar com saque do saldo total', async () => {
            const input = { accountNumber: "12345", balance: 1000 };
            const result = await service.withdraw(input);
            expect(result?.balance).toBe(0);
        });

        it('deve preservar precisão em operações sequenciais', async () => {
            // Primeira operação: depósito
            const deposit = { accountNumber: "12345", balance: 0.1 };
            await service.deposit(deposit);

            // Segunda operação: saque
            const withdraw = { accountNumber: "12345", balance: 0.05 };
            const result = await service.withdraw(withdraw);

            // Verifica se o saldo final está correto (1000 + 0.1 - 0.05 = 1000.05)
            expect(result?.balance).toBe(1000.05);
        });
    });
});
