import { AccountType } from './enums';
import { Transaction } from './transaction.model';

export class Account {
  public name: string;
  public type: AccountType;
  public transactions: Transaction[];
  // This will either be the amount of money in the account
  // or for credit cards, will be the current amount owed
  public balance: number;
  public id: string;

  constructor(name: string, type: AccountType, transactions: Transaction[], balance: number, id: string) {
    this.name = name;
    this.type = type;
    this.transactions = transactions;
    this.balance = balance;
    this.id = id;
  }

  public formatBalance(): string {
    return this.balance.toFixed(2);
  }

  public formatType(): string {
    if (this.type === 'CC') {
      return 'Credit Card';
    }
    else {
      return `${this.type} Account`;
    }
  }
}
