import { InvalidFundsError, NegativeFundsError, InvalidDecimalPlacesError, InsufficientFundsError, NotFoundError } from "../../errors/applicationErrors";
import { IAccount } from "../../types/account.type";
import { ITransactionService } from "../interfaces/transaction.service.interface";
import { hasMoreThanTwoDecimals, truncateToTwoDecimals } from '../../utils/number.helper';
import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { EditFundsInput } from "../../types/transaction.type";

export class TransactionService implements ITransactionService {
    constructor(private accountRepository: IAccountRepository) { }

    /**
     * Realiza depósito em uma conta
     * @param input Objeto contendo número da conta e valor a ser depositado
     * @throws {InvalidFundsError} Quando valor é inválido
     * @throws {NegativeFundsError} Quando valor é menor ou igual a zero
     * @throws {InvalidDecimalPlacesError} Quando valor tem mais de 2 casas decimais
     * @throws {NotFoundError} Quando conta não existe
     */
    async deposit(input: EditFundsInput): Promise<IAccount | null> {
        this.validateDecimalPlaces(input.valor);
        this.validateFundsFormat(input.valor);
        this.validateFundsAmount(input.valor);

        const account = await this.accountRepository.findByAccountNumber(input.conta);
        this.validateExistingAccount(account);

        const novoSaldo = truncateToTwoDecimals(account!.saldo + input.valor);
        return await this.accountRepository.updateAccountBalance(account!.conta, novoSaldo);
    }

    /**
     * Realiza saque em uma conta
     * @param input Objeto contendo número da conta e valor a ser sacado
     * @throws {InvalidFundsError} Quando valor é inválido
     * @throws {NegativeFundsError} Quando valor é menor ou igual a zero
     * @throws {InsufficientFundsError} Quando saldo é insuficiente
     * @throws {NotFoundError} Quando conta não existe
     */
    async withdraw(input: EditFundsInput): Promise<IAccount | null> {
        this.validateDecimalPlaces(input.valor);
        this.validateFundsFormat(input.valor);
        this.validateFundsAmount(input.valor);

        const account = await this.accountRepository.findByAccountNumber(input.conta);
        this.validateExistingAccount(account);
        this.validateSufficientFunds(account!, input.valor);

        const novoSaldo = truncateToTwoDecimals(account!.saldo - input.valor);
        return await this.accountRepository.updateAccountBalance(account!.conta, novoSaldo);
    }

    private validateExistingAccount(account: IAccount | null): void {
        if (!account) {
            throw new NotFoundError("Transaction Error: Conta não encontrada");
        }
    }

    private validateSufficientFunds(account: IAccount, valor: number): void {
        if (account.saldo < valor) {
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
