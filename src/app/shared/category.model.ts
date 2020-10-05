import { Transaction } from './transaction.model';

export class Category {
  public name: string;
  public transactions: {[date: number]: {[transactionid: string]: Transaction}};
  public amount: number;
  public id: string;
  public period: string;
  public subCategories: {[categoryid: string]: Category};
  public budgetHistories: { [week: number]: number };

  constructor(name: string, transactions: {[date: number]: {[s: string]: Transaction}}, balance: number, id: string,
              period: string, subs: {[s: string]: Category}, budgetHistories: { [week: number]: number }) {
    this.name = name;
    this.transactions = transactions;
    this.amount = balance;
    this.period = period;
    this.id = id;
    this.subCategories = subs;
    this.budgetHistories = budgetHistories;
  }

  public formatBalance(): string {
    return this.amount.toFixed(2);
  }
}
