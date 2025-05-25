import { AppError, DatabaseError } from "../../errors/applicationErrors";
import { Account } from "../../models/account.model";
import { CreateAccountInput, IAccount } from "../../types/account.type";
import { generateAccountNumber } from "../../utils/account.helper";
import { IAccountRepository } from "../interfaces/account.repository.interface";

/**
 * Repositório para gerenciamento de contas no MongoDB
 * Responsável por todas as operações de persistência de dados
 */
export class AccountRepository implements IAccountRepository {
    constructor(private accountModel = Account) { }

    /**
     * Busca todas as contas cadastradas
     * @returns Array de contas
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async getAllAccounts(): Promise<IAccount[]> {
        try {
            return await this.accountModel.find();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao buscar contas: ${error}`);
        }
    }

    /**
     * Cria uma nova conta
     * @param input Objeto contendo valor inicial da conta
     * @returns A conta criada
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async createAccount(input: CreateAccountInput): Promise<IAccount> {
        try {
            const conta = generateAccountNumber();
            const newAccount = await this.accountModel.create({
                conta,
                saldo: input.saldo,
            });

            return newAccount;
        }
        catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao criar uma conta: ${error}`);
        }
    }

    /**
     * Busca uma conta pelo número da conta
     * @param conta Número da conta a ser buscada
     * @returns A conta encontrada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async findByAccountNumber(conta: string): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOne({ conta });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao buscar a conta: ${error}`);
        }
    }

    /**
     * Atualiza o saldo de uma conta
     * @param conta Número da conta a ser atualizada
     * @param novoSaldo Novo saldo da conta
     * @returns A conta atualizada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async updateAccountBalance(conta: string, novoSaldo: number): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOneAndUpdate(
                { conta },
                { saldo: novoSaldo },
                { new: true }
            );
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao atualizar o saldo da conta: ${error}`);
        }
    }

    /**
     * Deleta uma conta pelo número da conta
     * @param conta Número da conta a ser deletada
     * @returns A conta deletada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async deleteByAccountNumber(conta: string): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOneAndDelete({ conta });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao deletar a conta: ${error}`);
        }
    }
}