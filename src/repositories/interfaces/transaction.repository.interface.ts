import { IAccount } from "../../types/account.type";
import { EditFundsInput } from "../../types/transaction.type";

export interface ITransactionRepository {
    withdraw(input: EditFundsInput): Promise<IAccount | null>;
    deposit(input: EditFundsInput): Promise<IAccount | null>;
}