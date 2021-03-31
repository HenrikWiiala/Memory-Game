//GameController.js

const MemoryCard = require("./MemoryCard");

class GameController {
constructor (config) {
    //configuration
this.config = config;
this.nbrOfCards = config.BOARD_SIZE;
this.cardsPerRow = config.CARDS_PER_ROW;

//game state
this.gameState = config.GAME_STATE_NO_TURNED_CARD;

//Documents
this.modal = document.getElementById("endModal"); //Modal window
this.button = document.getElementById("button"); //Modal close mutton
this.span = document.getElementsByClassName("close")[0]; //Modal close x
this.gameResult = document.querySelector(".modal-body p");
this.hiscores = document.querySelector(".modal-footer h3");

//turned cards
this.firstCard = -1;
this.secondCard = -1;

//statistics
this.turnCount = 0;
this.pairsFound = 0;
this.progr = 0;
this.time = 0;

//cards
this.cards = [];

//localstorage array
this.storage = [];

//string of items for localstorage array
this.aString = "";
}

setEventListeners() {
    let i;
    let id = ""; 

    for(i = 0; i < this.nbrOfCards; i++)
    {
        id = "card-"+i;

        let mc = new MemoryCard(id, this, this.config); //memorycard olio
        this.cards[i] = mc;

        document.getElementById(id).addEventListener("click", (e) => {
            mc.onClickHandler(e); //asetetaan event handler, e = event, ja kutsutaan memorycard onclickhandleriä
        });
    }
}

//TODO: create gameboard next
initialize() {
    this.cardsPerCol = this.nbrOfCards/this.cardsPerRow;
    console.log(`Initializing the game...${this.cardsPerRow} rows and ${this.cardsPerCol} cols`,)
    this.timer++;
    console.log(this.timer);
    
    this.createDivs();
    this.setEventListeners();  
    this.setIconClassToCards();
}

getNextUninitializedIconClassIndex(idx) {
let i;
for(i = 0; i < this.nbrOfCards; i++) 
{
    if(this.cards[(idx+i) % this.nbrOfCards].getIconClass() === "") {
        return (idx+i) % this.nbrOfCards;
    }
}
return 0; //never here
}      

setIconClassToCards() {
    let i;
    let x;
    let y;
    let icon;

    for( i = 0; i < this.nbrOfCards/2; i++) {
        icon = Math.floor(Math.random() * this.config.ICONNAMES.length);
        
        x = Math.floor(Math.random() * this.nbrOfCards);
        y = Math.floor(Math.random() * this.nbrOfCards);

        x = this.getNextUninitializedIconClassIndex(x);
        this.cards[x].setIconClass(this.config.ICONNAMES[icon]);

        y = this.getNextUninitializedIconClassIndex(y);
        this.cards[y].setIconClass(this.config.ICONNAMES[icon]);

        console.log(`Icon ${icon} set to ${x} and ${y} items`);
    }
}

createRow(id) {
    let divRow;
    divRow = document.createElement('div');
    divRow.className = 'row';
    divRow.id ='row-'+id;
    return divRow;
}

createCard(id) {
    let divCell;
    divCell = document.createElement('div');
    divCell.className = 'col-sm card';
    divCell.id ='card-'+id;
    divCell.style.backgroundImage = 'url(buttonimage.jpg)'; 
    divCell.style.backgroundSize = '100% 100%';
    return divCell;
}
createCardBody() {
    let divCell;
    divCell = document.createElement('div');
    divCell.className = 'card-body';
    divCell.style.margin = 'auto';

    return divCell;
}
createIcon(id) {
    let e;
    e = document.createElement('span');
    e.className = this.config.CARD_INVISIBLE;
    e.id = 'span-'+id;
    e.setAttribute('aria-hidden','true');

    return e;
}
createDivs() {
    let i, j;//2 sisäkkäistä for silmukkaa, ulompi silmukka käy läpi rivit
   let cardId;
   
    let rowElement; //tehtävänä luoda 1 rivielementti
    let cardElement;
    let cardBodyElement;
    let iconElement;

    for( i = 0; i < this.nbrOfCards/this.cardsPerRow; i++)
    {
        rowElement = this.createRow(i);

        for(j = 0; j < this.cardsPerRow; j++)
        {
            cardId = (j + (i * this.cardsPerRow));

            cardElement = this.createCard(cardId);
            cardBodyElement = this.createCardBody();
            iconElement = this.createIcon(cardId);

            cardBodyElement.appendChild(iconElement);
            cardElement.appendChild(cardBodyElement);
            rowElement.appendChild(cardElement);
            
        }
        document.getElementById('game-content').appendChild(rowElement)
    }
}
getGameState() {
    return this.gameState;
}
isGameOver() {
    let i;
    for(i = 0; i < this.nbrOfCards; i++)
    {
        if(this.cards[i].getState() != this.config.CARD_STATE_PAIR_FOUND)
        {
            return false;
        }
    }
    return true;
}
turnCard(id) {
    //first turn if turnCount is zero
    const bar = document.getElementById("progress-bar");
    
    this.turnCount++;
    if(this.gameState == this.config.GAME_STATE_NO_TURNED_CARD) 
    {
        //1st card should be turned
        this.firstCard = id;
        this.cards[id].turnVisible();
        this.gameState = this.config.GAME_STATE_1_TURNED_CARD
    }
    else if(this.gameState == this.config.GAME_STATE_1_TURNED_CARD)
    {
        if(id == this.firstCard)
        return;

        //2nd card should be turned
        this.secondCard = id;
        this.cards[id].turnVisible();
        this.gameState = this.config.GAME_STATE_2_TURNED_CARD;

        if(this.cards[this.firstCard].getIconClass() == this.cards[this.secondCard].getIconClass()) {
            //pair found

            this.cards[this.firstCard].setState(this.config.CARD_STATE_PAIR_FOUND);
            this.cards[this.secondCard].setState(this.config.CARD_STATE_PAIR_FOUND);
            this.pairsFound++;
            this.progr += (this.nbrOfCards/2); //There are 20 cards and 10 pairs total, progress bar increases 10% every time pair is found
            bar.style.width = this.progr +"%"; //Updates HTML progress bar with the value of progr
            bar.innerHTML = this.progr +"%"; //Updates HTML progress bar with the value of progr
            console.log("Pari löydetty ja progress on: " + this.progr);

            if(this.isGameOver()) 
            {
                this.gameState = this.config.GAME_STATE_GAME_OVER;

                setTimeout(() => {
                    this.cards[this.firstCard].turnInVisible();
                    this.cards[this.secondCard].turnInVisible();
                    //this.gameState = this.config.GAME_STATE_NO_TURNED_CARD;
                    //alert(`Game over\n

                    this.aString = `Turns: ${this.turnCount}, Time: ${this.time}, TurnsAverage: ${this.turnCount/10}`;
                    this.storage.push(this.aString);
                    localStorage.setItem('highscoreArray', this.storage);
                    //console.log(this.storage);
                    this.scores = localStorage.getItem('hiscoresArray');
                      
                        this.gameResult.innerHTML = "You used " + this.turnCount + " turns and " + this.time + " seconds to complete the game\n " +
                        "and needed " +  this.turnCount/(this.nbrOfCards/2) + " turns on average to find a pair";
                        //this.hiscores.innerHTML = "1. " + localStorage.getItem(this.storage[0]) + "\n" + "2. " + localStorage.getItem(this.storage[1]);
                        this.modal.style.display = "block";

                        this.button.onclick = () => {
                            this.modal.style.display = "none";
                        }
        
                        this.span.onclick = () => {
                            this.modal.style.display = "none";
                        }
                }, this.config.TURN_INVISIBLE_DELAY);

                

            }

            else 
            {
                setTimeout(() => {
                    this.cards[this.firstCard].turnCardGameOver();
                    this.cards[this.secondCard].turnCardGameOver();
                    this.gameState = this.config.GAME_STATE_NO_TURNED_CARD;
                }, this.config.TURN_INVISIBLE_DELAY);
            }

            
        } else {
            //No pairs
            setTimeout(() => {
                this.cards[this.firstCard].turnInVisible();
                this.cards[this.secondCard].turnInVisible();
                this.gameState = this.config.GAME_STATE_NO_TURNED_CARD;
            }, this.config.TURN_INVISIBLE_DELAY);
        }

        this.gameState = this.config.GAME_STATE_NO_TURNED_CARD
    }
}
getTurnCount()
{
    //this.turnCount;
    return this.turnCount;
}
getPairsFound() {
    return this.pairsFound;
}
}



module.exports = GameController;