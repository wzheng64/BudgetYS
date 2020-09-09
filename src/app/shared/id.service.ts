import { Account } from './account.model';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({providedIn: 'root'})
export class IdService {
  private accs: string[] = [];
  private trans: { [s: string]: number};
  private cat: string[] = [];

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
    while (!(id in this.trans)) {
      id = uuidv4();
    }
    this.trans[id] = 1;
    return id;
  }

  public generateCategory(): string {
    let id = uuidv4();
    let unique = false;
    while (!unique) {
      if (this.cat.indexOf(id) === -1) {
        unique = true;
      }
      else {
        id = uuidv4();
      }
    }
    this.cat.push(id);
    return id;
  }

  public setKnownIds(accs: {[s: string]: Account}): void {
    this.accs = [];
    this.trans = {};
    for (const id in accs) {
      if (Object.prototype.hasOwnProperty.call(accs, id)) {
        const acc = accs[id];
        this.accs.push(acc.id);
        if (acc.transactions) {
          acc.transactions.forEach((t) => {
            this.trans[t.id] = 1;
          });
        }
      }
    }
  }

  public deleteAcc(id: string): void {
    this.accs.splice(this.accs.indexOf(id), 1);
  }

  public deleteTrans(id: string): void {
    delete this.trans[id];
  }

  public deleteCat(id: string): void {
    this.cat.splice(this.cat.indexOf(id), 1);
  }
}
