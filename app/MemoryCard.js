//MemoryCard.js

//const MemoryCard = require("./MemoryCard")

class MemoryCard {
    constructor(id, gameController, config) {
        this.id = id;

        this.state = config.CARD_STATE_IN_GAME;
        this.gameController = gameController;
        this.config = config;

        //"card-x", where x is the card number
        this.iconClass = "";
    }
    onClickHandler(e) { //kutsutaan evenhandleria GameControllerista
        let id = this.id.substr(5); //get id from "card-x"

        console.log("OnClickHandler called"+this.id);

        let gs = this.gameController.getGameState();
        if(gs == this.config.GAME_STATE_2_TURNED_CARD || gs == this.config.GAME_STATE_GAME_OVER)
        {
            return;
        }
        if(this.state != this.config.CARD_STATE_PAIR_FOUND) {
         this.gameController.turnCard(id);
        }
    }

    getState() 
    {
        return this.state;
    }

    setState(state) 
    {
        this.state = state;
    }

    getIconClass() {
         return this.iconClass;
    }

    setIconClass(iconClass) {
        this.iconClass = iconClass;
    }
    turnVisible()
    {
        let id = this.id.substr(5);
        document.getElementById("span-"+id).className = this.iconClass;
    }
    turnInVisible()
    {
        let id = this.id.substr(5);
        document.getElementById("span-"+id).className = this.config.CARD_INVISIBLE;
    }
    turnCardGameOver()
    {
        let id = this.id.substr(5);
        document.getElementById("span-"+id).className = this.config.CARD_PAIR_FOUND;
    }
}

module.exports = MemoryCard;