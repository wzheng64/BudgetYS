import { Transaction } from './transaction.model';

export class Category {
  public name: string;
  public transactions: { [s: string]: Transaction };
  public amount: number;
  public id: string;
  public period: string;
  public subCategories: {[s: string]: Category};

  constructor(name: string, transactions: { [s: string]: Transaction }, balance: number, id: string,
              period: string, subs: {[s: string]: Category}) {
    this.name = name;
    this.transactions = transactions;
    this.amount = balance;
    this.period = period;
    this.id = id;
    this.subCategories = subs;
  }

  public formatBalance(): string {
    return this.amount.toFixed(2);
  }
}
