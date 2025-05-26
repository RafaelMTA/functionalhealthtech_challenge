import { IAccount } from "../../src/types/account.type";

export const mockAccount: IAccount = {
    conta: "12345",
    saldo: 1000
};

export const mockAccounts: IAccount[] = [
    mockAccount,
    { conta: "67890", saldo: 2000 },
    { conta: "47290", saldo: 4000 }
];

