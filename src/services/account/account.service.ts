import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { CreateAccountInput, IAccount } from "../../types/account.type";
import { IAccountService } from "../interfaces/account.service.interface";

export class AccountService implements IAccountService {
    constructor(private accountRepository: IAccountRepository) { }

    async getAllAccounts(): Promise<IAccount[]> {
        const accounts = await this.accountRepository.getAllAccounts();
        return accounts;
    }

    async createAccount(input: CreateAccountInput): Promise<IAccount> {
        const account = await this.accountRepository.createAccount(input);
        return account;
    }

    async getAccount(accountNumber: string): Promise<IAccount | null> {
        const result = await this.accountRepository.findByAccountNumber(accountNumber);
        return result;
    }

    async deleteAccount(accountNumber: string): Promise<IAccount | null> {
        const result = await this.accountRepository.deleteByAccountNumber(accountNumber);
        return result;
    }
}