import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { IAccount } from "../../types/account.type";
import { validateAccountNumber, validateDecimalPlaces, validateExistingAccount, validateFundsFormat, validateNegativeFundsAmount } from "../../validations/services.validations";
import { IAccountService } from "../interfaces/account.service.interface";

/**
 * Serviço responsável por operações de gerenciamento de contas
 * Implementa regras de negócio e validações para operações CRUD
 */
export class AccountService implements IAccountService {
    constructor(private accountRepository: IAccountRepository) { }

    /**
     * Retorna todas as contas cadastradas
     * @returns Lista de contas
     */
    async getAllAccounts(): Promise<IAccount[]> {
        return await this.accountRepository.getAllAccounts();
    }

    /**
     * Cria uma nova conta bancária
     * @param initialBalance Valor inicial da conta
     * @returns Conta criada
     * @throws {InvalidFundsError} Quando formato de valor é inválido
     * @throws {InvalidDecimalPlacesError} Quando número de casas decimais é inválido
     * @throws {NegativeFundsError} Quando valor é negativo
     */
    async createAccount(initialBalance: number): Promise<IAccount> {
        validateFundsFormat(initialBalance);
        validateDecimalPlaces(initialBalance);
        validateNegativeFundsAmount(initialBalance);
        return await this.accountRepository.createAccount(initialBalance);
    }

    /**
     * Busca uma conta pelo número
     * @param accountNumber Número da conta a ser buscada
     * @returns Conta encontrada ou null
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido(ex: não possui 5 dígitos)
     */
    async getAccount(accountNumber: string): Promise<IAccount | null> {
        validateAccountNumber(accountNumber);
        return await this.accountRepository.findByAccountNumber(accountNumber);
    }

    /**
     * Remove uma conta existente
     * @param accountNumber Número da conta a ser removida
     * @returns Conta removida ou null
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido(ex: não possui 5 dígitos)
     */
    async deleteAccount(accountNumber: string): Promise<IAccount> {
        validateAccountNumber(accountNumber);
        const result = await this.accountRepository.deleteByAccountNumber(accountNumber);
        validateExistingAccount(result);
        return result!;
    }
}