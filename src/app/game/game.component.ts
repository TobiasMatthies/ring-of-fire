import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string;
  game: Game = new Game;
  games$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);
  

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.newGame();
    const gamesCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(gamesCollection);
    this.games$.subscribe(games => {
      console.log('Game updated: ', games);
    });
  }

  
  newGame() {
    this.game = new Game();
    // console.log(this.game);
  }
  
  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log('Picked Card is: ' + this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1250);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 3) {
      this.game.players.push(name);
      }
    });
  
  }
}

function playerName(value: any): void {
  throw new Error('Function not implemented.');
}
