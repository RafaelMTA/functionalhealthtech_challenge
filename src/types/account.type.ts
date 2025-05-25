export interface IAccount {
    accountNumber: string;
    balance: number;
}

export type CreateAccountInput = {
    balance: number;
}
