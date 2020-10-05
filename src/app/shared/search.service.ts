import { Transaction } from 'src/app/shared/transaction.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchChanged = new Subject<string>();
  dateChanged = new Subject<string[]>();
  sortChanged = new Subject<string>();
  categoryDateChanged = new Subject<Transaction[]>();

  constructor(){}

}
