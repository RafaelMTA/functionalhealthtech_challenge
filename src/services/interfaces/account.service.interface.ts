import { CreateAccountInput, IAccount } from '../../types/account.type';

export interface IAccountService {
    getAllAccounts(): Promise<IAccount[]>;
    createAccount(input: CreateAccountInput): Promise<IAccount>;
    getAccount(conta: string): Promise<IAccount | null>;
    deleteAccount(conta: string): Promise<IAccount | null>;
}