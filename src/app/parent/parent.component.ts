import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, interval, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { MoneyService } from '../service/money.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit, OnDestroy {
  children = [
    { name: 'Jack', money: 10 },
    { name: 'Jill', money: 15 },
  ];
  direction = 'column';
  destroyed$ = new Subject();

  constructor(private moneyService: MoneyService) {}

  ngOnInit() {
    this.moneyService.sendMoneyToChild('Jack', 10);
    //Send money to all childern Automatically after every 1 minute
    this.sendMoneyAutomatically();

    this.moneyService.sendMoneyToChildSource
      .pipe(
        filter((source) => !!source), // ignore initial null value
        tap(({ childName, amount }) => {
          const child = this.children.find((c) => c.name === childName);
          child && (child.money += amount);
        })
      )
      .subscribe();
  }

  onMoneyChanged(data: any) {
    // We are Receiving money from child component and updating in the parent
    this.children.map((x) =>
      x.name == data.name ? (x.money = data.money) : ''
    );
  }

  sendMoney(child: { money: number }) {
    //Sending direct money to specific child
    child.money += 10;
  }

  getMoney(child: { money: number }) {
    //Getting direct money from specific child
    child.money -= 10;
  }

  getMoneyFromAll() {
    //Getting direct money from all child
    this.children.map((x) => (x.money = x.money - 10));
  }

  calculateFlex(child: { money: number }): string {
    //Calculating the flex direction
    const totalMoney = this.children.reduce((acc, curr) => acc + curr.money, 0);
    const childMoneyRatio = child.money / totalMoney;
    return `${childMoneyRatio * 100}%`;
  }

  onDirectionChange(event: any) {
    console.log(this.direction, event);
  }

  sendMoneyAutomatically() {
    interval(60000) // emit a value every 1 minute
      .pipe(
        mergeMap(() => {
          // send money to all child components
          return this.children.map((child) => {
            return this.moneyService.sendMoneyToChild(child.name, 10);
          });
        }),
        takeUntil(this.destroyed$) // complete the Observable when the component is destroyed
      )
      .subscribe(() => console.log('Money sent automatically.'));
  }

  ngOnDestroy() {
    this.destroyed$.next('');
  }
}
