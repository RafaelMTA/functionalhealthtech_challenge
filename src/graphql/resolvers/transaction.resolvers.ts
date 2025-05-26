import { ITransactionService } from "../../services/interfaces/transaction.service.interface";
import { EditFundsInput } from "../../types/transaction.type";

/**
 * Resolvers para operações de transação
 * @param transactionService Serviço de transação injetado
 * @returns Objeto com mutations de transações
 */
export const resolvers = (transactionService: ITransactionService) => ({
    Mutation: {
        /**
         * Realiza saque em uma conta
         * @param input Objeto contendo número da conta e valor a ser sacado
         * @returns Conta atualizada após o saque
         * @throws {InsufficientFundsError} Quando saldo é insuficiente
         * @throws {NotFoundError} Quando conta não é encontrada
         */
        sacar: async (_: unknown, { input }: { input: EditFundsInput }) => {
            return await transactionService.withdraw(input);
        },

        /**
         * Realiza depósito em uma conta
         * @param input Objeto contendo número da conta e valor a ser depositado
         * @returns Conta atualizada após o depósito
         * @throws {NotFoundError} Quando conta não é encontrada
         * @throws {InvalidDecimalPlacesError} Quando valor tem mais de 2 casas decimais
         */
        depositar: async (_: unknown, { input }: { input: EditFundsInput }) => {
            return await transactionService.deposit(input);;
        },
    },
});