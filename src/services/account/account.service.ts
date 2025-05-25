import { InvalidAccountNumberError } from "../../errors/applicationErrors";
import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { CreateAccountInput, IAccount } from "../../types/account.type";
import { IAccountService } from "../interfaces/account.service.interface";

export class AccountService implements IAccountService {
    constructor(private accountRepository: IAccountRepository) { }

    async getAllAccounts(): Promise<IAccount[]> {
        return await this.accountRepository.getAllAccounts();
    }

    async createAccount(input: CreateAccountInput): Promise<IAccount> {
        return await this.accountRepository.createAccount(input);
    }

    async getAccount(accountNumber: string): Promise<IAccount | null> {
        this.validateAccountNumber(accountNumber);
        return await this.accountRepository.findByAccountNumber(accountNumber);
    }

    async deleteAccount(accountNumber: string): Promise<IAccount | null> {
        this.validateAccountNumber(accountNumber);
        return await this.accountRepository.deleteByAccountNumber(accountNumber);
    }

    private validateAccountNumber(accountNumber: string): void {
        if (!accountNumber) {
            throw new InvalidAccountNumberError("Account number é invalido");
        }
    }
}