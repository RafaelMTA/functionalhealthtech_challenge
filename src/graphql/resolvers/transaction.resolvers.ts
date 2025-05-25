import { ITransactionService } from "../../services/interfaces/transaction.service.interface";
import { EditFundsInput } from "../../types/transaction.type";

export const resolvers = (transactionService: ITransactionService) => ({
    Mutation: {
        sacar: async (_: unknown, { input }: { input: EditFundsInput }) => {
            const transaction = await transactionService.withdraw(input);
            return transaction;
        },
        depositar: async (_: unknown, { input }: { input: EditFundsInput }) => {
            const transaction = await transactionService.deposit(input);
            return transaction;
        },
    },
});