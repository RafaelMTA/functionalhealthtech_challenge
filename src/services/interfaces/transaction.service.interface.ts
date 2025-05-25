import { IAccount } from '../../types/account.type';
import { EditFundsInput } from '../../types/transaction.type';

export interface ITransactionService {
    deposit(input: EditFundsInput): Promise<IAccount | null>;
    withdraw(input: EditFundsInput): Promise<IAccount | null>;
}