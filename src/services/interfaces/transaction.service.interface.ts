import { IAccount } from '../../types/account.type';

export interface ITransactionService {
    deposit(accountNumber: string, value: number): Promise<IAccount>;
    withdraw(accountNumber: string, value: number): Promise<IAccount>;
}