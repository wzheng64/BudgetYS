import { transactionType } from './enums';

export class Transaction {
  public name: string;
  public date: Date;
  public description: string;
  public amount: number;
  public type: transactionType;

  constructor(name: string, date: Date, description: string, amount: number, type: transactionType) {
    this.name = name;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.type = type;
  }
}
