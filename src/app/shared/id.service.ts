import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({providedIn: 'root'})
export class IdService {
  private accs: string[] = [];
  private trans: string[] = [];

  public generateAcc(): string {
    let id = uuidv4();
    let unique = false;
    while (!unique) {
      if (this.accs.indexOf(id) === -1) {
        unique = true;
      }
      else {
        id = uuidv4();
      }
    }
    this.accs.push(id);
    return id;
  }

  public generateTrans(): string {
    let id = uuidv4();
    let unique = false;
    while (!unique) {
      if (this.trans.indexOf(id) === -1) {
        unique = true;
      }
      else {
        id = uuidv4();
      }
    }
    this.trans.push(id);
    return id;
  }

  public setKnownIds(accs: Account[]): void {
    this.accs = [];
    this.trans = [];
    accs.forEach((acc) => {
      this.accs.push(acc.id);
      if (acc.transactions) {
        acc.transactions.forEach((t) => {
          this.trans.push(t.id);
        });
      }
    });
    console.log(this.accs);
  }

  public deleteAcc(id: string): void {
    this.accs.splice(this.accs.indexOf(id), 1);
  }

  public deleteTrans(id: string): void {
    this.trans.splice(this.trans.indexOf(id), 1);
  }
}
