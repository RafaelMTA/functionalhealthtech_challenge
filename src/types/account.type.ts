export interface IAccount {
    conta: string;
    saldo: number;
}

export type CreateAccountInput = {
    saldo: number;
}
