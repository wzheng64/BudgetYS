import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HelperService {
  public getWeek(date: Date | string): number {
    const offset = new Date(date).getDay();
    return new Date(date).setDate(new Date(date).getDate() - offset);
  }
}
