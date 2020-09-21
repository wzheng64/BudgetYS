import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HelperService {
  public getWeek(date: Date | string): number {
    const offset = new Date(date).getUTCDay();
    return new Date(date).setDate(new Date(date).getDate() - offset);
  }

  public periodRatio(selected: string, actual: string): number {
    let den = 0;
    let num = 0;
    if (actual === 'Weekly' || actual === 'Week') {
      den = 1;
    }
    else if (actual === 'Bi-Weekly' || actual === '2 Weeks') {
      den = 2;
    }
    else if (actual === 'Monthly' || actual === 'Month') {
      den = 4;
    }
    if (selected === 'Weekly' || selected === 'Week') {
      num = 1;
    }
    else if (selected === 'Bi-Weekly' || selected === '2 Weeks') {
      num = 2;
    }
    else if (selected === 'Monthly' || selected === 'Month') {
      num = 4;
    }
    return num / den;
  }
}
