import { IAccountService } from "../../services/interfaces/account.service.interface";
import { CreateAccountInput } from "../../types/account.type";

export const resolvers = (accountService: IAccountService) => ({
    Query: {
        listarContas: async () => {
            const accounts = await accountService.getAllAccounts();
            return accounts;
        },
        buscarConta: async (_: unknown, { accountNumber }: { accountNumber: string }) => {
            const account = await accountService.getAccount(accountNumber);
            return account;
        }
    },
    Mutation: {
        criarConta: async (_: unknown, { input }: { input: CreateAccountInput }) => {
            const account = await accountService.createAccount(input);
            return account;
        },
        deletarConta: async (_: unknown, { accountNumber }: { accountNumber: string }) => {
            const account = await accountService.deleteAccount(accountNumber);
            return account;
        }
    }
});