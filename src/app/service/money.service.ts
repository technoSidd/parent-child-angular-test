import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  public sendMoneyToChildSource = new BehaviorSubject<{
    childName: string;
    amount: number;
  }>({ childName: 'jill', amount: 0 });

  constructor() {}

  sendMoneyToChild(childName: string, amount: number) {
    this.sendMoneyToChildSource.next({ childName, amount });
  }
}
