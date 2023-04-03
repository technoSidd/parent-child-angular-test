import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MoneyService } from '../service/money.service';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
})
export class ChildComponent {
  @Input()
  money!: number;
  @Input()
  name!: string;
  @Output() moneyChanged = new EventEmitter<{ name: string; money: number }>();

  constructor(private moneyService: MoneyService) {}

  getMoney() {
    //get money and updating the parent using Input/Output
    this.money -= 10;
    this.moneyChanged.emit({ name: this.name, money: this.money });
  }

  sendMoney() {
    // Sending money to specific children via service using rxjs
    this.moneyService.sendMoneyToChild(this.name, 10);
  }
}
