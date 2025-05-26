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
            return await accountService.getAllAccounts();
        },

        /**
         * Busca uma conta específica pelo número
         * @param conta Número da conta (5 dígitos)
         * @returns Dados da conta ou null se não encontrada
         */
        buscarConta: async (_: unknown, { conta }: { conta: string }) => {
            return await accountService.getAccount(conta);
        }
    },
    Mutation: {
        /**
         * Cria uma nova conta
         * @param input Objeto contendo o saldo inicial
         * @returns Nova conta criada
         */
        criarConta: async (_: unknown, { input }: { input: CreateAccountInput }) => {
            return await accountService.createAccount(input);
        },

        /**
         * Remove uma conta existente
         * @param conta Número da conta a ser removida
         * @returns Conta removida ou null se não encontrada
         */
        deletarConta: async (_: unknown, { conta }: { conta: string }) => {
            return await accountService.deleteAccount(conta);
        }
    }
});