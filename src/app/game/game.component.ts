import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc, DocumentReference, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



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
  gamesCollection = collection(this.firestore, 'games');
  currentGameId: string;
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    // this.newGame();
    this.route.params.subscribe(params => {
      console.log(params['gameId']);
      this.currentGameId = params['gameId'];
    });
    this.games$ = collectionData(this.gamesCollection);
    this.games$.subscribe(games => {
      console.log('Game updated: ', games);
    });
   
  }

  
  async newGame() {
    this.game = new Game();
    let gameInfo = await addDoc(this.gamesCollection, { game: this.game.toJson() });
    console.log(gameInfo);
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
