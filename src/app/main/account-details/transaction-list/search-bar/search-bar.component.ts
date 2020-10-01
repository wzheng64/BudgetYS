import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../../../shared/search.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchData: { search: string, begindate: string, enddate: string, sortString: string };
  onAccount: boolean;
  id: string;

  sortOptions: string[] =
    [ 'Name (A-Z)', 'Name (Z-A)',
      'Date (Most Recent)', 'Date (Least Recent)',
      '+Amount (Big-Small)', '+Amount (Small-Big)',
      '-Amount (Big-Small)', '-Amount (Small-Big)'];

  constructor(private search: SearchService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if ('accountid' in params) {
        this.onAccount = true;
        this.id = params.accountid;
        if (localStorage.getItem(this.id + '-searchData')) {
          this.searchData = JSON.parse(localStorage.getItem(this.id + '-searchData'));
        }
        else {
          this.searchData = { search: '', begindate: '', enddate: '', sortString: '' };
        }
      }
      if ('categoryid' in params) {
        this.onAccount = false;
        this.id = params.categoryid;
        if (localStorage.getItem(this.id + '-searchData')) {
          this.searchData = JSON.parse(localStorage.getItem(this.id + '-searchData'));
        }
        else {
          this.searchData = { search: '', begindate: '', enddate: '', sortString: '' };
        }
      }
    });
  }

  onSearch(searchString: string): void {
    this.searchData.search = searchString;
    localStorage.setItem(this.id + '-searchData', JSON.stringify(this.searchData));
    this.search.searchChanged.next(searchString);
  }

  onDateChange(): void {
    if ( this.searchData.begindate <= this.searchData.enddate) {
      localStorage.setItem(this.id + '-searchData', JSON.stringify(this.searchData));
      this.search.dateChanged.next([this.searchData.begindate, this.searchData.enddate]);
    }
  }

  onSortChange(sortString: string): void {
    this.searchData.sortString = sortString;
    localStorage.setItem(this.id + '-searchData', JSON.stringify(this.searchData));
    this.search.sortChanged.next(sortString);
  }
}
