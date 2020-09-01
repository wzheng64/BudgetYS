import { ActivatedRoute, Router } from '@angular/router';
import { Account } from './../../../shared/account.model';
import { Component, OnInit, Input, } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @Input() account: Account;
  @Input() id: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  onNewTransaction(): void {
    this.router.navigate(['/main', `${this.id}`, 'new']);
  }
}
