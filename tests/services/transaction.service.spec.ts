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
            findByAccountNumber: vi.fn().mockResolvedValue(mockAccount),
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
            const result = await service.deposit(input.conta, input.valor);
            expect(result?.saldo).toBe(1500);
            expect(mockRepository.updateAccountBalance).toHaveBeenCalledWith("12345", 1500);
        });

        it('deve manter precisão decimal no depósito', async () => {
            const input = { conta: "12345", valor: 100.45 };
            const result = await service.deposit(input.conta, input.valor);
            expect(result?.saldo).toBe(1100.45);
        });

        it('deve rejeitar depósito com mais de 2 casas decimais', async () => {
            const input = { conta: "12345", valor: 100.456 };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(InvalidDecimalPlacesError);
        });
    });

    describe('Operações de Saque', () => {
        it('deve realizar saque com sucesso', async () => {
            const input = { conta: "12345", valor: 500 };
            const result = await service.withdraw(input.conta, input.valor);
            expect(result?.saldo).toBe(500);
        });

        it('deve rejeitar saque maior que saldo', async () => {
            const input = { conta: "12345", valor: 2000 };
            await expect(service.withdraw(input.conta, input.valor))
                .rejects.toThrow(InsufficientFundsError);
        });

        it('deve rejeitar saque com valor negativo', async () => {
            const input = { conta: "12345", valor: -100 };
            await expect(service.withdraw(input.conta, input.valor))
                .rejects.toThrow(NegativeFundsError);
        });
    });

    describe('Validações de Conta', () => {
        it('deve rejeitar operação em conta inexistente', async () => {
            mockRepository.findByAccountNumber.mockResolvedValueOnce(null);
            const input = { conta: "99999", valor: 100 };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('Edge Cases', () => {
        it('deve rejeitar valores não numéricos', async () => {
            const input = { conta: "12345", valor: NaN };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve rejeitar valores infinitos', async () => {
            const input = { conta: "12345", valor: Infinity };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(InvalidFundsError);
        });

        it('deve lidar com saque do saldo total', async () => {
            const input = { conta: "12345", valor: 1000 };
            const result = await service.withdraw(input.conta, input.valor);
            expect(result?.saldo).toBe(0);
        });

        it('deve rejeitar depósito com valor negativo', async () => {
            const input = { conta: "12345", valor: -100 };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(NegativeFundsError);
        });

        it('deve rejeitar depósito negativo com decimais', async () => {
            const input = { conta: "12345", valor: -100.50 };
            await expect(service.deposit(input.conta, input.valor))
                .rejects.toThrow(NegativeFundsError);
        });
    });
});
