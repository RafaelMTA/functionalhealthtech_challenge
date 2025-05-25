import { IAccountService } from "../../services/interfaces/account.service.interface";
import { CreateAccountInput } from "../../types/account.type";

/**
 * Resolvers para operações de conta
 * @param accountService Serviço de conta injetado
 * @returns Objeto com queries e mutations
 */
export const resolvers = (accountService: IAccountService) => ({
    Query: {
        /**
         * Lista todas as contas cadastradas
         * @returns Array de contas
         */
        listarContas: async () => {
            const accounts = await accountService.getAllAccounts();
            return accounts;
        },

        /**
         * Busca uma conta específica pelo número
         * @param conta Número da conta (5 dígitos)
         * @returns Dados da conta ou null se não encontrada
         */
        buscarConta: async (_: unknown, { conta }: { conta: string }) => {
            const account = await accountService.getAccount(conta);
            return account;
        }
    },
    Mutation: {
        /**
         * Cria uma nova conta
         * @param input Objeto contendo o saldo inicial
         * @returns Nova conta criada
         */
        criarConta: async (_: unknown, { input }: { input: CreateAccountInput }) => {
            const account = await accountService.createAccount(input);
            return account;
        },

        /**
         * Remove uma conta existente
         * @param conta Número da conta a ser removida
         * @returns Conta removida ou null se não encontrada
         */
        deletarConta: async (_: unknown, { conta }: { conta: string }) => {
            const account = await accountService.deleteAccount(conta);
            return account;
        }
    }
});