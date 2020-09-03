export class Income {

  constructor(public income: number, public period: string, public accounts: {
    accountID: string,
    proportion: number
  }[],        public remainder: string, public lastPayDate: Date) {}

}
