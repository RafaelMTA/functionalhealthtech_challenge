import { IAccount } from "../../src/types/account.type";

export const mockAccount: IAccount = {
    accountNumber: "12345",
    balance: 1000
};

export const mockAccounts: IAccount[] = [
    { accountNumber: "12345", balance: 1000 },
    { accountNumber: "67890", balance: 2000 },
    { accountNumber: "11111", balance: 0 }
];

export const mockAccountEdgeCases: Record<string, IAccount> = {
    zeroBalance: {
        accountNumber: "00000",
        balance: 0
    },
    maxBalance: {
        accountNumber: "99999",
        balance: 999999999.99
    },
    minBalance: {
        accountNumber: "11111",
        balance: 0.01
    },
    exactBalance: {
        accountNumber: "22222",
        balance: 100.00
    },
    highPrecision: {
        accountNumber: "33333",
        balance: 100.99
    }
};

export const mockInvalidAccounts: Record<string, Partial<IAccount>> = {
    negativeBalance: {
        accountNumber: "44444",
        balance: -100
    },
    invalidDecimal: {
        accountNumber: "55555",
        balance: 100.999
    },
    exceededBalance: {
        accountNumber: "66666",
        balance: 1000000000.00
    }
};
