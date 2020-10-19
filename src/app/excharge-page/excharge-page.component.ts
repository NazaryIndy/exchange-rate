import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValCurs, Valute } from '../models/data.interface';
import { ExchargeService } from './excharge.service';

@Component({
  selector: 'app-excharge-page',
  templateUrl: './excharge-page.component.html',
  styleUrls: ['./excharge-page.component.scss']
})
export class ExchargePageComponent implements OnInit {

  public subscription: Subscription;
  public valute: Valute;

  constructor(private exchargeService: ExchargeService) {}

  ngOnInit(): void {
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.exchargeService.getData())
    ).subscribe((result: ValCurs | Valute) => {
      this.getCorrectData(result);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  private getCorrectData(data) {
    if (data['ValCurs']) {
      this.valute = data['ValCurs']['Valute']['EUR'];
    } else {
      this.valute = data['Valute']['EUR'];
    }
  }

}
