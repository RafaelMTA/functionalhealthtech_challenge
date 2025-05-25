import { AppError, DatabaseError } from "../../errors/applicationErrors";
import { Account } from "../../models/account.model";
import { CreateAccountInput, IAccount } from "../../types/account.type";
import { generateAccountNumber } from "../../utils/account.helper";
import { IAccountRepository } from "../interfaces/account.repository.interface";

export class AccountRepository implements IAccountRepository {
    constructor(private accountModel = Account) { }

    async getAllAccounts(): Promise<IAccount[]> {
        try {
            return await this.accountModel.find();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao buscar contas: ${error}`);
        }
    }

    async createAccount(input: CreateAccountInput): Promise<IAccount> {
        try {
            const accountNumber = generateAccountNumber();
            const newAccount = await this.accountModel.create({
                accountNumber: accountNumber,
                balance: input.balance,
            });

            return newAccount;
        }
        catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao criar uma conta: ${error}`);
        }
    }

    async findByAccountNumber(accountNumber: string): Promise<IAccount | null> {
        try {
            const account = await this.accountModel.findOne({ accountNumber });
            return account;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao buscar a conta: ${error}`);
        }
    }

    async updateAccountBalance(accountNumber: string, newBalance: number): Promise<IAccount | null> {
        try {
            const account = await this.accountModel.findOneAndUpdate(
                { accountNumber },
                { balance: newBalance },
                { new: true }
            );

            return account;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao atualizar o saldo da conta: ${error}`);
        }
    }

    async deleteByAccountNumber(accountNumber: string): Promise<IAccount | null> {
        try {
            const account = await this.accountModel.findOneAndDelete({ accountNumber });
            return account;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError(`Database Error: Erro ao deletar a conta: ${error}`);
        }
    }
}