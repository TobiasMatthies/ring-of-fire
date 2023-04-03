import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerAmountService {
  amountPlayer = new Subject<number>();

  constructor() { }

  ngOnInit() { }


  triggerPlayerSubject(numberPlayers: number) {
    this.amountPlayer.next(numberPlayers);
    console.log('Number of players: ', numberPlayers);
  }
}
