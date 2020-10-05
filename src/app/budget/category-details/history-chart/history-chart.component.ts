import { HelperService } from './../../../shared/helper.service';
import { Category } from 'src/app/shared/category.model';
import { BudgetService } from 'src/app/shared/budget.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})
export class HistoryChartComponent implements OnInit {
  historyData: {
    numbers: ChartDataSets[],
    labels: Label[],
    options: ChartOptions
  };
  dates: { beginDate: string, endDate: string };
  categoryid: string;
  category: Category;

  constructor(private route: ActivatedRoute, private router: Router, private budgetService: BudgetService,
              private help: HelperService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if ('categoryid' in params) {
        this.categoryid = params.categoryid;
        this.category = this.budgetService.getCategory(this.categoryid);
        this.dates = JSON.parse(localStorage.getItem(params.categoryid + '-historyDates'));
        if (!this.dates) {
          const endDate = new Date().toLocaleString('sv-SE').split(' ')[0];
          const beginDate = new Date();
          beginDate.setMonth(new Date().getUTCMonth() - 1);
          this.dates = { beginDate: beginDate.toLocaleString('sv-SE').split(' ')[0], endDate };
        }
        this.onDateChange();
      }
    });
  }

  onDateChange(): void {
    localStorage.setItem(this.categoryid + '-historyDates', JSON.stringify(this.dates));
    if (this.dates.beginDate <= this.dates.endDate) {
      let week1 = this.help.getWeek(this.dates.beginDate);
      const lastWeek = this.help.getWeek(this.dates.endDate);
      const bd = new Date(this.dates.beginDate);
      const ed = new Date(this.dates.endDate);
      const formattedBeginDate = (bd.getUTCMonth() + 1) + '/' + bd.getUTCDate() + '/' + bd.getUTCFullYear();
      const formattedEndDate = (ed.getUTCMonth() + 1) + '/' + ed.getUTCDate() + '/' + ed.getUTCFullYear();
      const weeks = [week1];
      while (week1 < lastWeek) {
        week1 += 604800000;
        weeks.push(week1);
      }
      if (weeks[weeks.length - 1] !== lastWeek) {
        weeks.pop();
      }
      // let week = weeks[0];
      // if (week in this.category.transactions) {
      //   for (const transactionid in this.category.transactions[week]) {
      //     if (transactionid in this.category.transactions[week]) {
      //       const transaction = this.category.transactions[week][transactionid];
      //       const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
      //         new Date(transaction.date).getUTCMonth(),
      //         new Date(transaction.date).getUTCDate());
      //       if (transactionDate >= beginningOfMonthms) {
      //         transactions.push(this.category.transactions[week][transactionid]);
      //       }
      //     }
      //   }
      // }
      // for (let index = 1; index < weeks.length - 1; index++) {
      //   week = weeks[index];
      //   if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
      //     for (const transactionid in this.category.transactions[week]) {
      //       if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
      //         transactions.push(this.category.transactions[week][transactionid]);
      //       }
      //     }
      //   }
      // }
      // week = weeks[weeks.length - 1];
      // if (Object.prototype.hasOwnProperty.call(this.category.transactions, week)) {
      //   for (const transactionid in this.category.transactions[week]) {
      //     if (Object.prototype.hasOwnProperty.call(this.category.transactions[week], transactionid)) {
      //       const transaction = this.category.transactions[week][transactionid];
      //       const transactionDate = Date.UTC(new Date(transaction.date).getUTCFullYear(),
      //         new Date(transaction.date).getUTCMonth(),
      //         new Date(transaction.date).getUTCDate());
      //       if (transactionDate < endOfMonthms) {
      //         transactions.push(this.category.transactions[week][transactionid]);
      //       }
      //     }
      //   }
      // }
      if (this.category.period === 'Week') {
        // The category already has transactions organized by the week
        // The only thing that needs to be done is to filter the first and last week
        const transactionsByWeek = {};
        if (weeks.length === 1) {
          // If there is only one week in the case of only one day or just one week selected
          if (weeks[0] in this.category.transactions) {
            transactionsByWeek[weeks[0]] = {
              sum: 0,
              pastBudget: this.category.budgetHistories[weeks[0]] !== undefined ?
                this.category.budgetHistories[weeks[0]] : this.category.amount,
              dateRange: formattedBeginDate + ' - ' + formattedEndDate
            };
            for (const transactionid in this.category.transactions[weeks[0]]) {
              if (transactionid in this.category.transactions[weeks[0]]) {
                if (this.category.transactions[weeks[0]][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[weeks[0]][transactionid].date <= this.dates.endDate) {
                  transactionsByWeek[weeks[0]].sum += this.category.transactions[weeks[0]][transactionid].amount;
                }
              }
            }
          }
        }
        else {
          let week = weeks[0];
          if (week in this.category.transactions) {
            transactionsByWeek[week] = {
              sum: 0,
              pastBudget: this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount,
              dateRange: formattedBeginDate + ' - ' + this.getDateRange(week).split(' ')[2]
            };
            for (const transactionid in this.category.transactions[week]) {
              if (transactionid in this.category.transactions[week]) {
                if (this.category.transactions[week][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[week][transactionid].date <= this.dates.endDate) {
                  transactionsByWeek[week].sum += this.category.transactions[week][transactionid].amount;
                }
              }
            }
          }
          for (let index = 1; index < weeks.length - 1; index++) {
            week = weeks[index];
            transactionsByWeek[week] = {
              sum: 0,
              pastBudget: this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount,
              dateRange: this.getDateRange(week)
            };
            for (const transactionid in this.category.transactions[week]) {
              if (transactionid in this.category.transactions[week]) {
                transactionsByWeek[week].sum += this.category.transactions[week][transactionid].amount;
              }
            }
          }
          week = weeks[weeks.length - 1];
          transactionsByWeek[week] = {
            sum: 0,
            pastBudget: this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount,
            dateRange: this.getDateRange(week).split(' ')[0] + ' - ' + formattedEndDate
          };
          for (const transactionid in this.category.transactions[week]) {
            if (transactionid in this.category.transactions[week]) {
              if (this.category.transactions[week][transactionid].date >= this.dates.beginDate &&
                this.category.transactions[week][transactionid].date <= this.dates.endDate) {
                transactionsByWeek[week].sum += this.category.transactions[week][transactionid].amount;
              }
            }
          }
        }
        this.historyData = {
          numbers: [{ barPercentage: 0.8, minBarLength: 2, backgroundColor: [], hoverBackgroundColor: [], data: [] }],
          labels: [],
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: { display: true, labelString: 'Dates', fontColor: 'white', fontSize: 20 },
                  ticks: { fontColor: 'white', fontSize: 16 }
                }
              ],
              yAxes: [
                {
                  display: true,
                  ticks: { beginAtZero: true, fontColor: 'white' },
                  scaleLabel: { display: true, labelString: 'How much you have saved', fontColor: 'white', fontSize: 20 }
                }
              ]
            }
          }
        };
        const sums = [];
        for (const week in transactionsByWeek) {
          if (week in transactionsByWeek) {
            if (transactionsByWeek[week].pastBudget - transactionsByWeek[week].sum > 0) {
              (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(72, 207, 83)');
              (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(72, 207, 83)');
            }
            else {
              (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(237, 102, 92)');
              (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(237, 102, 92)');
            }
            this.historyData.numbers[0].data.push(transactionsByWeek[week].pastBudget - transactionsByWeek[week].sum);
            this.historyData.labels.push(transactionsByWeek[week].dateRange);
            sums.push(transactionsByWeek[week].sum);
          }
        }
        this.historyData.options.tooltips = {};
        this.historyData.options.tooltips.callbacks = {
          label(toolttipItems, numbers): string {
            return 'Spent $' + sums[toolttipItems.index] + ' and saved $' + toolttipItems.value;
          }
        };
      }
      else if (this.category.period === '2 Weeks') {
        const transactionsBy2Weeks = {};
        if (weeks.length <= 2) {
          // If there is only two weeks
          if (weeks[0] in this.category.transactions) {
            transactionsBy2Weeks[weeks[0]] = {
              sum: 0,
              pastBudget1: this.category.budgetHistories[weeks[0]] !== undefined ?
                this.category.budgetHistories[weeks[0]] : this.category.amount,
              pastBudget2: this.category.budgetHistories[weeks[1]] !== undefined ?
                this.category.budgetHistories[weeks[1]] : this.category.amount,
              dateRange: formattedBeginDate + ' - ' + formattedEndDate
            };
            for (const transactionid in this.category.transactions[weeks[0]]) {
              if (transactionid in this.category.transactions[weeks[0]]) {
                if (this.category.transactions[weeks[0]][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[weeks[0]][transactionid].date <= this.dates.endDate) {
                  transactionsBy2Weeks[weeks[0]].sum += this.category.transactions[weeks[0]][transactionid].amount;
                }
              }
            }
          }
          if (weeks.length === 2 && weeks[1] in this.category.transactions) {
            for (const transactionid in this.category.transactions[weeks[1]]) {
              if (transactionid in this.category.transactions[weeks[1]]) {
                if (this.category.transactions[weeks[1]][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[weeks[1]][transactionid].date <= this.dates.endDate) {
                  transactionsBy2Weeks[weeks[0]].sum += this.category.transactions[weeks[1]][transactionid].amount;
                }
              }
            }
          }
        }
        else {
          let week = weeks[0];
          let biWeek = weeks[0];
          transactionsBy2Weeks[biWeek] = {
            sum: 0,
            pastBudget1: this.category.budgetHistories[weeks[0]] !== undefined ?
              this.category.budgetHistories[weeks[0]] : this.category.amount,
            pastBudget2: this.category.budgetHistories[weeks[1]] !== undefined ?
              this.category.budgetHistories[weeks[1]] : this.category.amount,
            dateRange: formattedBeginDate + ' - ' + this.getDateRange(week).split(' ')[2]
          };
          if (week in this.category.transactions) {
            for (const transactionid in this.category.transactions[weeks[0]]) {
              if (transactionid in this.category.transactions[weeks[0]]) {
                if (this.category.transactions[weeks[0]][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[weeks[0]][transactionid].date <= this.dates.endDate) {
                  transactionsBy2Weeks[biWeek].sum += this.category.transactions[weeks[0]][transactionid].amount;
                }
              }
            }
          }
          if (weeks[1] in this.category.transactions) {
            for (const transactionid in this.category.transactions[weeks[1]]) {
              if (transactionid in this.category.transactions[weeks[1]]) {
                if (this.category.transactions[weeks[1]][transactionid].date >= this.dates.beginDate &&
                  this.category.transactions[weeks[1]][transactionid].date <= this.dates.endDate) {
                  transactionsBy2Weeks[biWeek].sum += this.category.transactions[weeks[1]][transactionid].amount;
                }
              }
            }
          }
          console.log(transactionsBy2Weeks);
          for (let index = 2; index < weeks.length - 2; index += 2) {
            week = weeks[index];
            biWeek = weeks[index];
            transactionsBy2Weeks[biWeek] = {
              sum: 0,
              pastBudget1: this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount,
              dateRange: this.getDateRange(week)
            };
            for (const transactionid in this.category.transactions[week]) {
              if (transactionid in this.category.transactions[week]) {
                transactionsBy2Weeks[biWeek].sum += this.category.transactions[week][transactionid].amount;
              }
            }
            week = weeks[index + 1];
            transactionsBy2Weeks[biWeek].pastBudget2 =
              this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount;
            for (const transactionid in this.category.transactions[week]) {
              if (transactionid in this.category.transactions[week]) {
                transactionsBy2Weeks[biWeek].sum += this.category.transactions[week][transactionid].amount;
              }
            }
          }
          week = weeks[weeks.length - 2];
          biWeek = weeks[weeks.length - 2];
          transactionsBy2Weeks[biWeek] = {
            sum: 0,
            pastBudget1: this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount,
            dateRange: this.getDateRange(week).split(' ')[0] + ' - ' + formattedEndDate
          };
          for (const transactionid in this.category.transactions[week]) {
            if (transactionid in this.category.transactions[week]) {
              if (this.category.transactions[week][transactionid].date >= this.dates.beginDate &&
                this.category.transactions[week][transactionid].date <= this.dates.endDate) {
                transactionsBy2Weeks[biWeek].sum += this.category.transactions[week][transactionid].amount;
              }
            }
          }
          week = weeks[weeks.length - 1];
          transactionsBy2Weeks[biWeek].pastBudget2 =
            this.category.budgetHistories[week] !== undefined ? this.category.budgetHistories[week] : this.category.amount;
          for (const transactionid in this.category.transactions[week]) {
            if (transactionid in this.category.transactions[week]) {
              if (this.category.transactions[week][transactionid].date >= this.dates.beginDate &&
                this.category.transactions[week][transactionid].date <= this.dates.endDate) {
                transactionsBy2Weeks[biWeek].sum += this.category.transactions[week][transactionid].amount;
              }
            }
          }
        }
        this.historyData = {
          numbers: [{ barPercentage: 0.8, minBarLength: 2, backgroundColor: [], hoverBackgroundColor: [], data: [] }],
          labels: [],
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: { display: true, labelString: 'Dates', fontColor: 'white', fontSize: 20 },
                  ticks: { fontColor: 'white', fontSize: 16 }
                }
              ],
              yAxes: [
                {
                  display: true,
                  ticks: { beginAtZero: true, fontColor: 'white' },
                  scaleLabel: { display: true, labelString: 'How much you have saved', fontColor: 'white', fontSize: 20 }
                }
              ]
            }
          }
        };
        const sums = [];
        for (const week in transactionsBy2Weeks) {
          if (week in transactionsBy2Weeks) {
            if (transactionsBy2Weeks[week].pastBudget2 - transactionsBy2Weeks[week].sum > 0) {
              (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(72, 207, 83)');
              (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(72, 207, 83)');
            }
            else {
              (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(237, 102, 92)');
              (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(237, 102, 92)');
            }
            this.historyData.numbers[0].data.push(transactionsBy2Weeks[week].pastBudget2 - transactionsBy2Weeks[week].sum);
            this.historyData.labels.push(transactionsBy2Weeks[week].dateRange);
            sums.push(transactionsBy2Weeks[week].sum);
          }
        }
        this.historyData.options.tooltips = {};
        this.historyData.options.tooltips.callbacks = {
          label(toolttipItems, numbers): string {
            return 'Spent $' + sums[toolttipItems.index] + ' and saved $' + toolttipItems.value;
          }
        };
      }
      else if (this.category.period === 'Month') {
        const firstMonth = Date.UTC(new Date(this.dates.beginDate).getUTCFullYear(), new Date(this.dates.beginDate).getUTCMonth());
        const lastMonth = Date.UTC(new Date(this.dates.endDate).getUTCFullYear(), new Date(this.dates.endDate).getUTCMonth());
        let month = firstMonth;
        let i = 0;
        const months = [];
        while (month < lastMonth) {
          month = Date.UTC(new Date(this.dates.beginDate).getUTCFullYear(), new Date(this.dates.beginDate).getUTCMonth() + i);
          i++;
          months.push(month);
        }
        const transactionsByMonth = {};
        months.forEach((mo: number) => {
          transactionsByMonth[mo] = {
            sum: 0,
            pastBudget: this.category.budgetHistories[this.help.getWeek(new Date(mo))] !== undefined ?
              this.category.budgetHistories[this.help.getWeek(new Date(mo))] : this.category.amount,
            dateRange: this.getMonthDateRange(mo)
          };
          this.getWeeksOfAMonth(months[0]).forEach((week: number) => {
            if (week in this.category.transactions) {
              for (const transactionid in this.category.transactions[week]) {
                if (transactionid in this.category.transactions[week]) {
                  if (this.category.transactions[week][transactionid].date >= this.dates.beginDate &&
                    this.category.transactions[week][transactionid].date <= this.dates.endDate) {
                    transactionsByMonth[months[0]].sum += this.category.transactions[week][transactionid].amount;
                  }
                }
              }
            }
            if (this.category.budgetHistories[week] !== undefined) {
              transactionsByMonth[mo].pastBudget = this.category.budgetHistories[week];
            }
            else {
              transactionsByMonth[mo].pastBudget = this.category.amount;
            }
          });
        });
        if (months.length === 1) {
          transactionsByMonth[months[0]].dateRange = formattedBeginDate + ' - ' + formattedEndDate;
        }
        else {
          transactionsByMonth[months[0]].dateRange = formattedBeginDate + ' - ' + this.getMonthDateRange(months[0]).split(' ')[2];
          transactionsByMonth[months[months.length - 1]].dateRange =
            this.getMonthDateRange(months[months.length - 1]).split(' ')[0] + ' - ' + formattedEndDate;
        }
        this.historyData = {
          numbers: [{ barPercentage: 0.8, minBarLength: 2, backgroundColor: [], hoverBackgroundColor: [], data: [] }],
          labels: [],
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: { display: true, labelString: 'Dates', fontColor: 'white', fontSize: 20 },
                  ticks: { fontColor: 'white', fontSize: 16 }
                }
              ],
              yAxes: [
                {
                  display: true,
                  ticks: { beginAtZero: true, fontColor: 'white' },
                  scaleLabel: { display: true, labelString: 'How much you have saved', fontColor: 'white', fontSize: 20 }
                }
              ]
            }
          }
        };
        const sums = [];
        for (const mo in transactionsByMonth) {
          if (month in transactionsByMonth) {
            if (transactionsByMonth[mo].pastBudget - transactionsByMonth[mo].sum > 0) {
              (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(72, 207, 83)');
              (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(72, 207, 83)');
          }
          else {
            (this.historyData.numbers[0].backgroundColor as string[]).push('rgb(237, 102, 92)');
            (this.historyData.numbers[0].hoverBackgroundColor as string[]).push('rgb(237, 102, 92)');
          }
            this.historyData.numbers[0].data.push(transactionsByMonth[mo].pastBudget - transactionsByMonth[mo].sum);
            this.historyData.labels.push(transactionsByMonth[mo].dateRange);
            sums.push(transactionsByMonth[mo].sum);
          }
        }
        this.historyData.options.tooltips = {};
        this.historyData.options.tooltips.callbacks = {
          label(toolttipItems, numbers): string {
            return 'Spent $' + sums[toolttipItems.index] + ' and saved $' + toolttipItems.value;
          }
        };
      }
    }
  }

  private getDateRange(week: number): string {
    let dateString = '';
    if (this.category.period === 'Week') {
      const beginningOfWeek = new Date(week);
      const endOfWeek = new Date(week + 518400000);
      dateString = beginningOfWeek.getUTCMonth() + 1 + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
        + ' - ' + (endOfWeek.getUTCMonth() + 1) + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    else if (this.category.period === '2 Weeks') {
      const beginningOfWeek = new Date(week);
      const endOfWeek = new Date(week + 1123200000);
      console.log(new Date(endOfWeek));
      dateString = beginningOfWeek.getUTCMonth() + 1 + '/' + beginningOfWeek.getUTCDate() + '/' + beginningOfWeek.getUTCFullYear()
        + ' - ' + (endOfWeek.getUTCMonth() + 1) + '/' + endOfWeek.getUTCDate() + '/' + endOfWeek.getUTCFullYear();
    }
    // else {
    //   const beginningOfMonth = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth()));
    //   const endOfMonth = new Date(Date.UTC(beginningOfMonth.getUTCFullYear(), beginningOfMonth.getUTCMonth() + 1));
    //   dateString = beginningOfMonth.getUTCMonth() + 1 + '/' + beginningOfMonth.getUTCDate() + '/' + beginningOfMonth.getUTCFullYear()
    //     + ' - ' + (endOfMonth.getUTCMonth() + 1) + '/' + endOfMonth.getUTCDate() + '/' + endOfMonth.getUTCFullYear();
    // }
    return dateString;
  }

  private getWeeksOfAMonth(month: number): number[] {
    const weeks = [];
    const firstWeek = this.help.getWeek(new Date(month));
    const lastWeek = this.help.getWeek(new Date(Date.UTC(new Date(month).getUTCFullYear(), new Date(month).getUTCMonth() + 1)));
    for (let index = 0; index < 6; index++) {
      weeks.push(firstWeek + 604800000 * index);
    }
    if (weeks[weeks.length - 1] !== lastWeek) {
      weeks.pop();
    }
    return weeks;
  }

  private getMonthDateRange(month: number): string {
    let dateString = '';
    const monthDate = new Date(month);
    const beginningOfMonth = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth()));
    const endOfMonth = new Date(Date.UTC(monthDate.getUTCFullYear(), (monthDate.getUTCMonth() + 1), 0));
    dateString = beginningOfMonth.getUTCMonth() + 1 + '/' + beginningOfMonth.getUTCDate() + '/' + beginningOfMonth.getUTCFullYear()
      + ' - ' + (endOfMonth.getUTCMonth() + 1) + '/' + endOfMonth.getUTCDate() + '/' + endOfMonth.getUTCFullYear();
    return dateString;
  }
}
