import { InvalidFundsError, NegativeFundsError, InvalidDecimalPlacesError, InsufficientFundsError, NotFoundError } from "../../errors/applicationErrors";
import { IAccount } from "../../types/account.type";
import { EditFundsInput } from "../../types/transaction.type";
import { ITransactionService } from "../interfaces/transaction.service.interface";
import { hasMoreThanTwoDecimals, truncateToTwoDecimals } from '../../utils/number.helper';
import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";

export class TransactionService implements ITransactionService {
    constructor(private accountRepository: IAccountRepository) { }

    async deposit(input: EditFundsInput): Promise<IAccount | null> {
        this.validateFundsFormat(input.balance);
        this.validateFundsAmount(input.balance);
        this.validateDecimalPlaces(input.balance);

        const account = await this.accountRepository.findByAccountNumber(input.accountNumber);
        this.validateExistingAccount(account);

        const newBalance = truncateToTwoDecimals(account!.balance + input.balance);
        return await this.accountRepository.updateAccountBalance(account!.accountNumber, newBalance);
    }

    async withdraw(input: EditFundsInput): Promise<IAccount | null> {
        this.validateFundsFormat(input.balance);
        this.validateFundsAmount(input.balance);
        this.validateDecimalPlaces(input.balance);

        const account = await this.accountRepository.findByAccountNumber(input.accountNumber);
        this.validateExistingAccount(account);
        this.validateSufficientFunds(account!, input.balance);

        const newBalance = truncateToTwoDecimals(account!.balance - input.balance);
        return await this.accountRepository.updateAccountBalance(account!.accountNumber, newBalance);
    }

    private validateExistingAccount(account: IAccount | null): void {
        if (!account) {
            throw new NotFoundError("Transaction Error: Conta não encontrada");
        }
    }

    private validateSufficientFunds(account: IAccount, value: number): void {
        if (account.balance < value) {
            throw new InsufficientFundsError("Transaction Error: Saldo insuficiente");
        }
    }

    private validateFundsFormat(value: number): void {
        if (isNaN(value) || !isFinite(value)) {
            throw new InvalidFundsError("Transaction Error: Formato de valor inválido");
        }
    }

    private validateFundsAmount(value: number): void {
        if (value <= 0) {
            throw new NegativeFundsError("Transaction Error: Valor deve ser maior que zero");
        }
    }

    private validateDecimalPlaces(value: number): void {
        if (hasMoreThanTwoDecimals(value)) {
            throw new InvalidDecimalPlacesError("Transaction Error: Valor não pode ter mais que 2 casas decimais");
        }
    }
}
