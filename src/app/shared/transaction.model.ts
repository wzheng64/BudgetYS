import { transactionType } from './enums';

export class Transaction {
  public name: string;
  public date: Date;
  public amount: number;
  public type: transactionType;

  constructor(name: string, date: Date, amount: number, type: transactionType) {
    this.name = name;
    this.date = date;
    this.amount = amount;
    this.type = type;
  }
}
