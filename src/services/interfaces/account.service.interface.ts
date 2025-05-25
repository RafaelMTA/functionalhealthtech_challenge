import { IAccount, CreateAccountInput } from '../../types/account.type';

export interface IAccountService {
    getAllAccounts(): Promise<IAccount[]>;
    createAccount(input: CreateAccountInput): Promise<IAccount>;
    getAccount(accountNumber: string): Promise<IAccount | null>;
    deleteAccount(accountNumber: string): Promise<IAccount | null>;
}