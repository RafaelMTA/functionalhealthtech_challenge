import { IAccount } from '../../types/account.type';

export interface IAccountService {
    getAllAccounts(): Promise<IAccount[]>;
    createAccount(initialBalance: number): Promise<IAccount>;
    getAccount(accountNumber: string): Promise<IAccount | null>;
    deleteAccount(accountNumber: string): Promise<IAccount>;
}