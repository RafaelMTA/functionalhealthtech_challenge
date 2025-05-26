import { IAccount } from '../../types/account.type';

export interface ITransactionService {
    deposit(accountNumber: string, value: number): Promise<IAccount | null>;
    withdraw(accountNumber: string, value: number): Promise<IAccount | null>;
}