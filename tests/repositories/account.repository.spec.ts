/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountRepository } from '../../src/repositories/account/account.repository';
import { AppError, DatabaseError } from '../../src/errors/applicationErrors';
import { mockAccount, mockAccounts } from '../mocks/account.mock';

describe('AccountRepository', () => {
    let repository: AccountRepository;
    let mockModel: any;

    beforeEach(() => {
        // Reseta todas as funções mockadas antes de cada teste
        vi.clearAllMocks();

        // Esse mock simula as operações de banco de dados que o repositório irá chamar
        mockModel = {
            find: vi.fn().mockResolvedValue(mockAccounts),
            findOne: vi.fn().mockResolvedValue(mockAccount),
            findOneAndDelete: vi.fn().mockResolvedValue(mockAccount),
            create: vi.fn().mockImplementation((data) => ({
                ...mockAccount,
                ...data
            }))
        };
        // Cria uma instância do repositório com o modelo mockado
        repository = new AccountRepository(mockModel);
    });

    describe('getAllAccounts', () => {
        it('deve retornar todos os contas com sucesso', async () => {
            const result = await repository.getAllAccounts();
            expect(result).toEqual(mockAccounts);
            expect(mockModel.find).toHaveBeenCalled();
        });

        it('deve lidar com erro de banco de dados', async () => {
            mockModel.find.mockRejectedValueOnce(new Error('Database error'));
            await expect(repository.getAllAccounts())
                .rejects.toThrow(DatabaseError);
        });

        it('deve propagar AppError de operações do banco', async () => {
            const appError = new AppError('Custom app error', 400);
            mockModel.find.mockRejectedValueOnce(appError);
            await expect(repository.getAllAccounts())
                .rejects.toThrow(appError);
        });
    });

    describe('createAccount', () => {
        it('deve criar conta com sucesso', async () => {
            const saldo = 1000;
            const result = await repository.createAccount(saldo);
            expect(result.saldo).toBe(saldo);
            expect(result.conta).toBeDefined();
            expect(mockModel.create).toHaveBeenCalled();
        });

        it('deve lidar com erro ao criar conta', async () => {
            const saldo = 1000;
            mockModel.create.mockRejectedValueOnce(new Error('Create failed'));
            await expect(repository.createAccount(saldo))
                .rejects.toThrow(DatabaseError);
        });

        it('deve criar conta com saldo zero', async () => {
            const saldo = 0;
            const result = await repository.createAccount(saldo);
            expect(result.saldo).toBe(0);
        });

        it('deve criar conta com saldo decimal', async () => {
            const saldo = 100.50;
            const result = await repository.createAccount(saldo);
            expect(result.saldo).toBe(100.50);
        });

        it('deve propagar AppError na criação', async () => {
            const appError = new AppError('Custom app error', 400);
            mockModel.create.mockRejectedValueOnce(appError);
            await expect(repository.createAccount(1000))
                .rejects.toThrow(appError);
        });
    });

    describe('findByAccountNumber', () => {
        it('deve encontrar conta pelo número', async () => {
            const result = await repository.findByAccountNumber("12345");
            expect(result).toEqual(mockAccount);
            expect(mockModel.findOne).toHaveBeenCalledWith({ conta: "12345" });
        });

        it('deve retornar null se a conta não for encontrada', async () => {
            mockModel.findOne.mockResolvedValueOnce(null);
            const result = await repository.findByAccountNumber("99999");
            expect(result).toBeNull();
        });

        it('deve lidar com erro ao buscar conta', async () => {
            mockModel.findOne.mockRejectedValueOnce(new Error('Database error'));
            await expect(repository.findByAccountNumber("12345"))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe('deleteByAccountNumber', () => {
        it('deve deletar a conta com sucesso', async () => {
            const result = await repository.deleteByAccountNumber("12345");
            expect(result).toEqual(mockAccount);
            expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({ conta: "12345" });
        });

        it('deve retornar null se a conta não for encontrada', async () => {
            mockModel.findOneAndDelete.mockResolvedValueOnce(null);
            const result = await repository.deleteByAccountNumber("99999");
            expect(result).toBeNull();
        });

        it('deve lidar com erro ao deletar conta', async () => {
            mockModel.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));
            await expect(repository.deleteByAccountNumber("12345"))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe('updateAccountBalance', () => {
        beforeEach(() => {
            mockModel.findOneAndUpdate = vi.fn().mockResolvedValue({
                ...mockAccount,
                saldo: 2000
            });
        });

        it('deve atualizar saldo com sucesso', async () => {
            const result = await repository.updateAccountBalance("12345", 2000);
            expect(result?.saldo).toBe(2000);
            expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
                { conta: "12345" },
                { saldo: 2000 },
                { new: true }
            );
        });

        it('deve retornar null se a conta não existir', async () => {
            mockModel.findOneAndUpdate.mockResolvedValueOnce(null);
            const result = await repository.updateAccountBalance("99999", 1000);
            expect(result).toBeNull();
        });

        it('deve lidar com erro de banco de dados', async () => {
            mockModel.findOneAndUpdate.mockRejectedValueOnce(new Error('Database error'));
            await expect(repository.updateAccountBalance("12345", 1000))
                .rejects.toThrow(DatabaseError);
        });

        it('deve propagar AppError ao atualizar saldo', async () => {
            const appError = new AppError('Custom app error', 400);
            mockModel.findOneAndUpdate.mockRejectedValueOnce(appError);
            await expect(repository.updateAccountBalance("12345", 1000))
                .rejects.toThrow(appError);
        });
    });
});




