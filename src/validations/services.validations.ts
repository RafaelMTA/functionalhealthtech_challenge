import { InsufficientFundsError, InvalidAccountNumberError, InvalidDecimalPlacesError, InvalidFundsAmountError, InvalidFundsError, NegativeFundsError, NotFoundError } from "../errors/applicationErrors";
import { IAccount } from "../types/account.type";
import { hasMoreThanTwoDecimals } from "../utils/number.helper";

export function validateAccountNumber(accountNumber: string): void {
    if (!accountNumber || typeof accountNumber !== 'string' || accountNumber.trim() === '' || !/^\d{5}$/.test(accountNumber)) {
        throw new InvalidAccountNumberError("Número da conta é inválido");
    }
}

export function validateExistingAccount(account: IAccount | null): void {
    if (!account) {
        throw new NotFoundError("Transaction Error: Conta não encontrada");
    }
};

export function validateSufficientFunds(account: IAccount, value: number): void {
    if (account.saldo < value) {
        throw new InsufficientFundsError("Transaction Error: Saldo insuficiente");
    }
};

export function validateFundsFormat(value: number): void {
    if (isNaN(value) || !isFinite(value)) {
        throw new InvalidFundsError("Transaction Error: Formato de valor inválido");
    }
}

export function validateNegativeFundsAmount(value: number): void {
    if (value < 0) {
        throw new NegativeFundsError("Transaction Error: Valor deve ser maior que zero");
    }
}

export function validateZeroFundsAmount(value: number): void {
    if (value == 0) {
        throw new InvalidFundsAmountError("Transaction Error: Valor não pode ser zero");
    }
}

export function validateDecimalPlaces(value: number): void {
    if (hasMoreThanTwoDecimals(value)) {
        throw new InvalidDecimalPlacesError("Transaction Error: Valor não pode ter mais que 2 casas decimais");
    }
}
