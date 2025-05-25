import { Schema, model } from 'mongoose';
import { IAccount } from '../types/account.type';
import { hasMoreThanTwoDecimals, truncateToTwoDecimals } from '../utils/number.helper';

const AccountSchema = new Schema<IAccount>({
  accountNumber: {
    type: String,
    required: [true, 'Número da conta é obrigatório'],
    unique: true,
    validate: {
      validator: v => /^\d{5}$/.test(v),
      message: "Numero da conta deve ter exatamente 5 dígitos"
    }
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Valor não pode ser negativo'],
    validate: {
      validator: (v: number) => !hasMoreThanTwoDecimals(v),
      message: 'Valor não pode ter mais que 2 casas decimais'
    },
    get: (v: number) => truncateToTwoDecimals(v),
    set: (v: number) => truncateToTwoDecimals(v)
  },
}, {
  timestamps: true,
  id: false,
});

export const Account = model<IAccount>('Account', AccountSchema);
