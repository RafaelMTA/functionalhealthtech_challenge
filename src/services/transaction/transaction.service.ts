import { IAccount } from "../../types/account.type";
import { ITransactionService } from "../interfaces/transaction.service.interface";
import { truncateToTwoDecimals } from '../../utils/number.helper';
import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { validateAccountNumber, validateDecimalPlaces, validateExistingAccount, validateFundsFormat, validateNegativeFundsAmount, validateSufficientFunds, validateZeroFundsAmount } from "../../validations/services.validations";
export class TransactionService implements ITransactionService {
    constructor(private accountRepository: IAccountRepository) { }

    /**
     * Realiza depósito em uma conta
     * @param accountNumber Número da conta
     * @param value Valor a ser depositado
     * @return Conta atualizada após o depósito
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido
     * @throws {InvalidDecimalPlacesError} Quando valor tem mais de 2 casas decimais
     * @throws {InvalidFundsError} Quando valor é inválido
     * @throws {NegativeFundsError} Quando valor é menor ou igual a zero
     * @throws {InvalidFundsAmountError} Quando valor é zero
     * @throws {NotFoundError} Quando conta não existe  
     */
    async deposit(accountNumber: string, value: number): Promise<IAccount> {
        validateAccountNumber(accountNumber);
        validateDecimalPlaces(value);
        validateFundsFormat(value);
        validateNegativeFundsAmount(value);
        validateZeroFundsAmount(value);

        const account = await this.accountRepository.findByAccountNumber(accountNumber);
        validateExistingAccount(account);

        const novoSaldo = truncateToTwoDecimals(account!.saldo + value);
        const updatedAccount = await this.accountRepository.updateAccountBalance(account!.conta, novoSaldo);
        validateExistingAccount(updatedAccount);
        return updatedAccount!;
    }

    /**
     * Realiza saque em uma conta
     * @param accountNumber Número da conta
     * @param value Valor a ser sacado
     * @return Conta atualizada após o saque
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido
     * @throws {InvalidDecimalPlacesError} Quando valor tem mais de 2 casas decimais
     * @throws {InvalidFundsError} Quando valor é inválido
     * @throws {NegativeFundsError} Quando valor é menor ou igual a zero
     * @throws {InvalidFundsAmountError} Quando valor é zero
     * @throws {NotFoundError} Quando conta não existe
     * @throws {InsufficientFundsError} Quando saldo é insuficiente   
     */
    async withdraw(accountNumber: string, value: number): Promise<IAccount> {
        validateAccountNumber(accountNumber);
        validateDecimalPlaces(value);
        validateFundsFormat(value);
        validateNegativeFundsAmount(value);
        validateZeroFundsAmount(value);

        const account = await this.accountRepository.findByAccountNumber(accountNumber);
        validateExistingAccount(account);
        validateSufficientFunds(account!, value);

        const newBalance = truncateToTwoDecimals(account!.saldo - value);
        const updatedAccount = await this.accountRepository.updateAccountBalance(account!.conta, newBalance);
        validateExistingAccount(updatedAccount);
        return updatedAccount!;
    }
}
