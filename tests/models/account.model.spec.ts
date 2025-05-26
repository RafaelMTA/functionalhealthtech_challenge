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
            expect(validationError?.errors?.conta).toBeDefined();
            expect(validationError?.errors?.conta?.kind).toBe('required');
        });

        it('deve definir o saldo padrão como 0', () => {
            const account = new model({ conta: '12345' });
            expect(account.saldo).toBe(0);
        });

        describe('Validação do atributo Conta', () => {
            it('deve rejeitar número de conta com menos de 5 dígitos', () => {
                const account = new model({ conta: '1234', saldo: 0 });
                const validationError = account.validateSync();

                // Checa se a validação do número da conta foi definida(5 dígitos)
                expect(validationError?.errors?.conta).toBeDefined();
                expect(validationError?.errors?.conta?.message)
                    .toBe('Numero da conta deve ter exatamente 5 dígitos');
            });

            it('deve rejeitar número de conta com mais de 5 dígitos', () => {
                const account = new model({ conta: '123456', saldo: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.conta).toBeDefined();
                expect(validationError?.errors?.conta?.message)
                    .toBe('Numero da conta deve ter exatamente 5 dígitos');
            });

            it('deve aceitar número de conta com exatamente 5 dígitos', () => {
                const account = new model({ conta: '12345', saldo: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.conta).toBeUndefined();
            });

            it('deve rejeitar número de conta não numérico', () => {
                const account = new model({ conta: '1234a', saldo: 0 });
                const validationError = account.validateSync();

                expect(validationError?.errors?.conta).toBeDefined();
            });
        });
    });

    describe('Manipulação de Saldo', () => {
        it('deve truncar o saldo para 2 casas decimais ao definir', () => {
            const account = new model({
                conta: '12345',
                saldo: 100.999
            });

            const savedBalance = account.saldo;
            expect(savedBalance).toBe(100.99);
            expect(account.toJSON().saldo).toBe(100.99);
        });

        it('deve tratar corretamente o saldo zero', () => {
            const account = new model({
                conta: '12345',
                saldo: 0
            });
            expect(account.saldo).toBe(0.00);
        });

        it('deve lidar com o número inteiro seguro máximo', () => {
            const account = new model({
                conta: '12345',
                saldo: Number.MAX_SAFE_INTEGER
            });
            expect(account.saldo).toBeDefined();
            expect(isFinite(account.saldo)).toBe(true);
        });

        it('deve lidar com o valor mínimo positivo', () => {
            const account = new model({
                conta: '12345',
                saldo: 0.01
            });
            expect(account.saldo).toBe(0.01);
        });
    });

    describe('Edge Cases', () => {
        it('deve rejeitar saldo negativo', () => {
            const account = new model({
                conta: '12345',
                saldo: -100
            });
            const validationError = account.validateSync();
            expect(validationError).toBeDefined();
        });

        it('deve lidar com a precisão de ponto flutuante', () => {
            const account = new model({
                conta: '12345',
                saldo: 0.1 + 0.2
            });
            expect(account.saldo).toBe(0.30);
        });

        it('deve rejeitar saldo não numérico', () => {
            const account = new model({
                conta: '12345',
                saldo: 'invalid' as any
            });
            const validationError = account.validateSync();
            expect(validationError).toBeDefined();
        });

        it('deve lidar com saldo indefinido', () => {
            const account = new model({
                conta: '12345',
                saldo: undefined
            });
            expect(account.saldo).toBe(0);
        });
    });

    describe('Transformação de Dados', () => {
        it('deve converter para JSON com saldo formatado', () => {
            const account = new model({
                conta: '12345',
                saldo: 100.999
            });
            const json = account.toJSON();
            expect(json.saldo).toBe(100.99);
        });

        it('deve preservar a precisão do saldo em operações', () => {
            const account = new model({
                conta: '12345',
                saldo: 100.45
            });
            account.saldo += 0.01;
            expect(account.saldo).toBe(100.46);
        });
    });
});
