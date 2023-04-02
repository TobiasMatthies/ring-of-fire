import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc, DocumentReference, doc, docData, getFirestore, getDoc, setDoc, onSnapshot } from '@angular/fire/firestore';
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
  game: Game; 
  firestore: Firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');
  gameId: string= '';
  db = getFirestore();
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }
  

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(params => { 
      this.gameId = params['id'];
      this.getGameData(params);
    });
  }


   newGame() {
    this.game = new Game();
  }


  async getGameData(params: any) {
    onSnapshot(this.gamesCollection, (docSnap) => {
      docSnap.forEach(doc => {
        if(doc.id == this.gameId) {
         this.game.players = doc.data()['players'];
        this.game.currentPlayer = doc.data()['currentPlayer'];
        this.game.playedCards = doc.data()['playedCards'];
        this.game.stack = doc.data()['stack'];  
        }
      });
    });
    console.log('Game update: ', this.game);
    console.log('Number of players: ', this.game.players.length);
    
  }

  
  pickCard() {
    if (!this.pickCardAnimation && this.game.players.length > 1) {
      this.currentCard = this.game.stack.pop();
      console.log('Picked Card is: ' + this.currentCard);
      this.pickCardAnimation = true;
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.updateGame();
        this.pickCardAnimation = false;
      }, 1250);
    } else {
      alert('Lorem Ipsum');
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 3) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }


  updateGame() { 
    const docRef = doc(this.db, "games", this.gameId);
    const gameData = this.game.toJson();
    setDoc(docRef, gameData).then(() => {
      console.log("Document successfully written!", this.game);
    });
  }


  playerName(value: any): void {
    throw new Error('Function not implemented.');
  }
}