import { Category } from './category.model';
import { TransactionType } from './enums';

export class Transaction {
  public name: string;
  public date: string;
  public description: string;
  public amount: number;
  public type: TransactionType;
  public id: string;
  public category?: string;

  constructor(name: string, date: string, description: string, amount: number, type: TransactionType, id: string, category?: string) {
    this.name = name;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.type = type;
    this.id = id;
    this.category = category;
  }

}
