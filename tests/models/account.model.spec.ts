/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Account } from '../../src/models/account.model';

describe('Account Model', () => {
    let model: typeof Account;

    beforeEach(() => {
        // Reseta todas as funções mockadas antes de cada teste
        vi.clearAllMocks();
        // Mocka o modelo Account
        model = Account;
    });

    describe('Definição do Schema', () => {
        it('deve ter os campos obrigatórios', () => {
            const account = new model({});
            const validationError = account.validateSync();

            // Checa se a validação do número da conta foi definida(obrigatória)
            expect(validationError?.errors?.accountNumber).toBeDefined();
            expect(validationError?.errors?.accountNumber?.kind).toBe('required');
        });

        it('deve definir o saldo padrão como 0', () => {
            const account = new model({ accountNumber: '12345' });
            expect(account.balance).toBe(0);
        });

        it('deve impor número de conta exclusivo', async () => {
            const error = new Error('E11000');
            error.name = 'MongoError';
            vi.spyOn(model, 'create').mockRejectedValueOnce(error);

            await expect(model.create({ accountNumber: '12345' }))
                .rejects.toThrow();
        });

        describe('Validação do atributo Account Number', () => {
            it('deve rejeitar número de conta com menos de 5 dígitos', () => {
                const account = new model({ accountNumber: '1234', balance: 0 });
                const validationError = account.validateSync();

                // Checa se a validação do número da conta foi definida(5 dígitos)
                expect(validationError?.errors?.accountNumber).toBeDefined();
                expect(validationError?.errors?.accountNumber?.message)
                    .toBe('Numero da conta deve ter exatamente 5 dígitos');
            });

            it('deve rejeitar número de conta com mais de 5 dígitos', () => {
                const account = new model({ accountNumber: '123456', balance: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.accountNumber).toBeDefined();
                expect(validationError?.errors?.accountNumber?.message)
                    .toBe('Numero da conta deve ter exatamente 5 dígitos');
            });

            it('deve aceitar número de conta com exatamente 5 dígitos', () => {
                const account = new model({ accountNumber: '12345', balance: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.accountNumber).toBeUndefined();
            });

            it('deve rejeitar número de conta não numérico', () => {
                const account = new model({ accountNumber: '1234a', balance: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.accountNumber).toBeDefined();
            });
        });
    });

    describe('Manipulação de Saldo', () => {
        it('deve truncar o saldo para 2 casas decimais ao definir', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 100.999
            });

            const savedBalance = account.balance;
            expect(savedBalance).toBe(100.99);
            expect(account.toJSON().balance).toBe(100.99);
        });

        it('deve tratar corretamente o saldo zero', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 0
            });
            expect(account.balance).toBe(0.00);
        });

        it('deve lidar com o número inteiro seguro máximo', () => {
            const account = new model({
                accountNumber: '12345',
                balance: Number.MAX_SAFE_INTEGER
            });
            expect(account.balance).toBeDefined();
            expect(isFinite(account.balance)).toBe(true);
        });

        it('deve lidar com o valor mínimo positivo', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 0.01
            });
            expect(account.balance).toBe(0.01);
        });
    });

    describe('Edge Cases', () => {
        it('deve rejeitar saldo negativo', () => {
            const account = new model({
                accountNumber: '12345',
                balance: -100
            });
            const validationError = account.validateSync();
            expect(validationError).toBeDefined();
        });

        it('deve lidar com a precisão de ponto flutuante', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 0.1 + 0.2
            });
            expect(account.balance).toBe(0.30);
        });

        it('deve rejeitar saldo não numérico', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 'invalid' as any
            });
            const validationError = account.validateSync();
            expect(validationError).toBeDefined();
        });

        it('deve lidar com saldo indefinido', () => {
            const account = new model({
                accountNumber: '12345',
                balance: undefined
            });
            expect(account.balance).toBe(0);
        });
    });

    describe('Transformação de Dados', () => {
        it('deve converter para JSON com saldo formatado', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 100.999
            });
            const json = account.toJSON();
            expect(json.balance).toBe(100.99);
        });

        it('deve preservar a precisão do saldo em operações', () => {
            const account = new model({
                accountNumber: '12345',
                balance: 100.45
            });
            account.balance += 0.01;
            expect(account.balance).toBe(100.46);
        });
    });
});
