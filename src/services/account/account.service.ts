import { InvalidAccountNumberError, InvalidDecimalPlacesError, InvalidFundsError, NotFoundError } from "../../errors/applicationErrors";
import { IAccountRepository } from "../../repositories/interfaces/account.repository.interface";
import { CreateAccountInput, IAccount } from "../../types/account.type";
import { hasMoreThanTwoDecimals } from "../../utils/number.helper";
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
     * @param input.saldo Dados iniciais da conta
     * @returns Conta criada
     */
    async createAccount(input: CreateAccountInput): Promise<IAccount> {
        this.validateFundsFormat(input.saldo);
        this.validateDecimalPlaces(input.saldo);
        return await this.accountRepository.createAccount(input);
    }

    /**
     * Busca uma conta pelo número
     * @param conta Número da conta a ser buscada
     * @returns Conta encontrada ou null
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido
     */
    async getAccount(conta: string): Promise<IAccount | null> {
        this.validateAccountNumber(conta);
        return await this.accountRepository.findByAccountNumber(conta);
    }

    /**
     * Remove uma conta existente
     * @param conta Número da conta a ser removida
     * @returns Conta removida ou null
     * @throws {InvalidAccountNumberError} Quando número da conta é inválido
     */
    async deleteAccount(conta: string): Promise<IAccount | null> {
        this.validateAccountNumber(conta);
        const result =  await this.accountRepository.deleteByAccountNumber(conta);
        this.validateExistingAccount(result);
        return result;
    }

    private validateAccountNumber(conta: string): void {
        if (!conta) {
            throw new InvalidAccountNumberError("Número da conta é inválido");
        }
    }

    private validateExistingAccount(account: IAccount | null): void {
        if (!account) {
            throw new NotFoundError("Transaction Error: Conta não encontrada");
        }
    }

    private validateFundsFormat(value: number): void {
        if (isNaN(value) || !isFinite(value)) {
            throw new InvalidFundsError("Transaction Error: Formato de valor inválido");
        }
    }

    private validateDecimalPlaces(value: number): void {
        if (hasMoreThanTwoDecimals(value)) {
            throw new InvalidDecimalPlacesError("Transaction Error: Valor não pode ter mais que 2 casas decimais");
        }
    }
}