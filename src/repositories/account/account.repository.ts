import { AppError, DatabaseError } from "../../errors/applicationErrors";
import { Account } from "../../models/account.model";
import { IAccount } from "../../types/account.type";
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
     * @param initialBalance Valor inicial da conta
     * @returns A conta criada
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async createAccount(initialBalance: number): Promise<IAccount> {
        try {
            const accountNumber = generateAccountNumber();
            return await this.accountModel.create({
                conta: accountNumber,
                saldo: initialBalance,
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao criar uma conta: ${error}`);
        }
    }

    /**
     * Busca uma conta pelo número da conta
     * @param accountNumber Número da conta a ser buscada
     * @returns A conta encontrada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async findByAccountNumber(accountNumber: string): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOne({ conta: accountNumber });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao buscar a conta: ${error}`);
        }
    }

    /**
     * Atualiza o saldo de uma conta
     * @param accountNumber Número da conta a ser atualizada
     * @param newBalance Novo saldo da conta
     * @returns A conta atualizada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async updateAccountBalance(accountNumber: string, newBalance: number): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOneAndUpdate(
                { conta: accountNumber },
                { saldo: newBalance },
                { new: true }
            );
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao atualizar o saldo da conta: ${error}`);
        }
    }

    /**
     * Deleta uma conta pelo número da conta
     * @param accountNumber Número da conta a ser deletada
     * @returns A conta deletada ou null se não existir
     * @throws {AppError} Em caso de erro na aplicação
     * @throws {DatabaseError} Em caso de erro no banco
     */
    async deleteByAccountNumber(accountNumber: string): Promise<IAccount | null> {
        try {
            return await this.accountModel.findOneAndDelete({ conta: accountNumber });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao deletar a conta: ${error}`);
        }
    }
}