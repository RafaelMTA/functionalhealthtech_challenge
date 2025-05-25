import { CreateAccountInput, IAccount } from '../../types/account.type';

export interface IAccountRepository {
    getAllAccounts(): Promise<IAccount[]>;
    createAccount(input: CreateAccountInput): Promise<IAccount>;
    findByAccountNumber(accountNumber: string): Promise<IAccount | null>;
    updateAccountBalance(accountNumber: string, newBalance: number): Promise<IAccount | null>;
    deleteByAccountNumber(accountNumber: string): Promise<IAccount | null>;
}