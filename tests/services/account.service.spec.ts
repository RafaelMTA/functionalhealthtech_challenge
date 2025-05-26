/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountService } from '../../src/services/account/account.service';
import { mockAccount, mockAccounts } from '../mocks/account.mock';
import { InvalidAccountNumberError, NegativeFundsError } from '../../src/errors/applicationErrors';

describe('AccountService', () => {
    let service: AccountService;
    let mockRepository: any;

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do repositório de contas
        mockRepository = {
            getAllAccounts: vi.fn().mockResolvedValue(mockAccounts),
            createAccount: vi.fn().mockResolvedValue(mockAccount),
            findByAccountNumber: vi.fn().mockResolvedValue(mockAccount),
            deleteByAccountNumber: vi.fn().mockResolvedValue(mockAccount)
        };
        // Cria uma instância do serviço com o repositório mockado
        service = new AccountService(mockRepository);
    });

    describe('Operações de Conta', () => {
        it('deve listar todas as contas', async () => {
            const result = await service.getAllAccounts();
            expect(result).toEqual(mockAccounts);
            expect(mockRepository.getAllAccounts).toHaveBeenCalled();
        });

        it('deve criar uma nova conta', async () => {
            const saldo = 1000;
            const result = await service.createAccount(saldo);
            expect(result).toEqual(mockAccount);
            expect(mockRepository.createAccount).toHaveBeenCalledWith(saldo);
        });

        it('deve buscar conta por número', async () => {
            const result = await service.getAccount("12345");
            expect(result).toEqual(mockAccount);
            expect(mockRepository.findByAccountNumber).toHaveBeenCalledWith("12345");
        });

        it('deve deletar conta existente', async () => {
            const result = await service.deleteAccount("12345");
            expect(result).toEqual(mockAccount);
            expect(mockRepository.deleteByAccountNumber).toHaveBeenCalledWith("12345");
        });
    });

    describe('Edge Cases', () => {
        it('deve retornar null para conta não encontrada', async () => {
            mockRepository.findByAccountNumber.mockResolvedValueOnce(null);
            const result = await service.getAccount("99999");
            expect(result).toBeNull();
        });
    });

    describe('Validação do Número da Conta', () => {
        it('deve rejeitar número de conta vazio', async () => {
            await expect(service.getAccount('')).rejects.toThrow(InvalidAccountNumberError);
        });

        it('deve rejeitar número de conta undefined', async () => {
            await expect(service.getAccount(undefined as any)).rejects.toThrow(InvalidAccountNumberError);
        });

        it('deve rejeitar número de conta null', async () => {
            await expect(service.getAccount(null as any)).rejects.toThrow(InvalidAccountNumberError);
        });

        it('deve rejeitar deleção com número de conta inválido', async () => {
            await expect(service.deleteAccount('')).rejects.toThrow(InvalidAccountNumberError);
        });
    });

    describe('Validação de Valores', () => {
        it('deve rejeitar valores NaN', async () => {
            await expect(service.createAccount(NaN))
                .rejects.toThrow('Transaction Error: Formato de valor inválido');
        });

        it('deve rejeitar valores Infinity', async () => {
            await expect(service.createAccount(Infinity))
                .rejects.toThrow('Transaction Error: Formato de valor inválido');
        });

        it('deve rejeitar valores com mais de 2 casas decimais', async () => {
            await expect(service.createAccount(100.123))
                .rejects.toThrow('Transaction Error: Valor não pode ter mais que 2 casas decimais');
        });

        it('deve aceitar valores com até 2 casas decimais', async () => {
            await service.createAccount(100.12);
            expect(mockRepository.createAccount).toHaveBeenCalledWith(100.12);
        });

        it('deve rejeitar criação de conta com saldo negativo', async () => {
            await expect(service.createAccount(-100))
                .rejects.toThrow(NegativeFundsError);
        });

        it('deve rejeitar valores negativos com decimais', async () => {
            await expect(service.createAccount(-100.50))
                .rejects.toThrow(NegativeFundsError);
        });

        it('deve aceitar valor zero na criação da conta', async () => {
            const result = await service.createAccount(0);
            expect(result).toBeDefined();
            expect(mockRepository.createAccount).toHaveBeenCalledWith(0);
        });
    });

    describe('Validação de Conta Existente', () => {
        it('deve lançar erro ao deletar conta inexistente', async () => {
            mockRepository.deleteByAccountNumber.mockResolvedValueOnce(null);
            await expect(service.deleteAccount("99999"))
                .rejects.toThrow('Transaction Error: Conta não encontrada');
        });

        it('deve lançar erro ao deletar com número de conta undefined', async () => {
            await expect(service.deleteAccount(undefined as any))
                .rejects.toThrow('Número da conta é inválido');
        });

        it('deve lançar erro ao deletar com número de conta null', async () => {
            await expect(service.deleteAccount(null as any))
                .rejects.toThrow('Número da conta é inválido');
        });
    });
});
