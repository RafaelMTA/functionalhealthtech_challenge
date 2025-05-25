import { IAccount } from "../../src/types/account.type";

export const mockAccount: IAccount = {
    conta: "12345",
    saldo: 1000
};

export const mockAccounts: IAccount[] = [
    mockAccount,
    { conta: "67890", saldo: 2000 }
];

export const mockAccountEdgeCases: Record<string, IAccount> = {
    zeroBalance: {
        conta: "00000",
        saldo: 0
    },
    maxBalance: {
        conta: "99999",
        saldo: 999999999.99
    },
    minBalance: {
        conta: "11111",
        saldo: 0.01
    },
    exactBalance: {
        conta: "22222",
        saldo: 100.00
    },
    highPrecision: {
        conta: "33333",
        saldo: 100.99
    }
};

export const mockInvalidAccounts: Record<string, Partial<IAccount>> = {
    negativeBalance: {
        conta: "44444",
        saldo: -100
    },
    invalidDecimal: {
        conta: "55555",
        saldo: 100.999
    },
    exceededBalance: {
        conta: "66666",
        saldo: 1000000000.00
    }
};
