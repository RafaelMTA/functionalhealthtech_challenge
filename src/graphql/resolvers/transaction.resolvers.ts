import { ITransactionService } from "../../services/interfaces/transaction.service.interface";

/**
 * Resolvers para operações de transação
 * @param transactionService Serviço de transação injetado
 * @returns Objeto com mutations de transações
 */
export const resolvers = (transactionService: ITransactionService) => ({
    Mutation: {
        /**
         * Realiza saque em uma conta
         * @param conta Número da conta
         * @param valor Valor a ser sacado
         * @returns Conta atualizada após o saque
         */
        sacar: async (_: unknown, { conta, valor }: { conta: string, valor: number }) => {
            return await transactionService.withdraw(conta, valor);
        },

        /**
         * Realiza depósito em uma conta
         * @param conta Número da conta
         * @param valor Valor a ser depositado
         * @returns Conta atualizada após o depósito
         */
        depositar: async (_: unknown, { conta, valor }: { conta: string, valor: number }) => {
            return await transactionService.deposit(conta, valor);
        },
    },
});