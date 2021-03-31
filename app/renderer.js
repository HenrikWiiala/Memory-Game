//renderer.js



let $ = require('jquery');
      require('popper.js')
      require('bootstrap')

      window.jQuery = $;
      window.$ = $;

      let config = require('./config');
      let GameController = require('./GameController');

      console.log('renderer.js started...');

      let gameController = new GameController(config)
      gameController.initialize();

      //statistics update
      let turnCountElement = document.getElementById('turn-count');//html elementti html sivulta
      setInterval(() => {
            turnCountElement.innerHTML = "Turns: "+gameController.getTurnCount();
            
            //Do this every second, add 1 more to the sum of this.time and update Playtime in-game.
            gameController.time += 1;
            //console.log("Time: "+this.time);   
            document.getElementById("play-time").textContent = "Playtime: "+gameController.time+" s"; 
      } , 1000);