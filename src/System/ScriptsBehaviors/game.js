export const Events = {
  pauseGame: new Event("pauseGame"),
  unPauseGame: new Event("unPauseGame"),

};
export const EventsHandle = {
  exe: function (e) {
    document.dispatchEvent(e);
  },
  add: function (e, fn) {
    document.removeEventListener(e.type, fn);
    document.addEventListener(e.type, fn);
  },
  rm: function (e, fn) { document.removeEventListener(e.type, fn); }
}

export const Game = {
  get pauseGame() {
    return this._pauseGame;
  },
  set pauseGame(value) {
    console.log("Set game pause acionado!");
    if (value) {
      EventsHandle.exe(Events.pauseGame);
    } else {
      EventsHandle.exe(Events.unPauseGame);
    }


    this._pauseGame = value;
  }
};

import { TimeLeft } from "./module/timeLeft.js";
import { StatusBar, Events as EventsStatusBar } from "./module/statusBar.js";
import { Enemy, Events as EventsEnemy } from "./module/enemy.js";
import { Squares } from "./module/squares.js";
import { Engine } from "../UsingEngine.js";
import { AudioSystem } from "../AudioSystem.js";
import { CreateService } from "../CreateService.js";

console.log("-*/-*/Carregado todas importaçoes de game.js-*/-*/");

const actionGameMenu = {
  SetGameVelocity(value) {
    if (!Game.pauseGame)
      Engine.velocity = value;

    Engine.initialVelocity = value;

  },
  PlayGame() {
    console.log("jogo despausado")
    Game.pauseGame = false;
    Engine.velocity = Engine.initialVelocity;
  },
  PauseGame() {
    console.log("jogo pausado")
    Game.pauseGame = true;
    Engine.initialVelocity = Engine.velocity;
    Engine.velocity = 0;
  },
  StartGame() {
    console.log("StartGame");
    actionGameMenu.PlayGame();
  },
  RestartGame() {
    console.log("RestartGame");
    actionGameMenu.PauseGame();
    Engine.restart = true;
  },

}
export const audios = (() => {
  return {
    PlaySoundCoin: AudioSystem.PreparePlaySoundPool("coin.m4a", 3, 0.2),
    PlaySoundHitMirror: AudioSystem.PreparePlaySoundPool("hit-mirror.wav", 3, 0.2),
    PlaySoundEndGame: AudioSystem.PreparePlaySoundPool("end-game.wav", 1, 0),
    PlaySoundFinish: AudioSystem.PreparePlaySoundPool("finish.wav", 1, 0),
  }
})()

const action = {
  EndGame() {
    console.log("EndGame ", StatusBar.timeLeft, TimeLeft.currentTimeLeft);
    Game.pauseGame = true;
    alert("Game Over! O seu resultado foi ->>: " + StatusBar.score);
    audios.PlaySoundEndGame();
    audios.PlaySoundFinish();
    actionGameMenu.RestartGame();

  },
  HitEnemy() {
    console.log("HitEnemy");
    new Audio("./src/audios/new-mirror.wav").play();
    audios.PlaySoundCoin();

    Enemy.removeEnemy();
    StatusBar.score = StatusBar.score + 1;
    StatusBar.lives = StatusBar.lives + 1;
  },
  Missed() {
    new Audio("./src/audios/break-mirror.wav").play();
    console.log("Missed");

    Enemy.moveEnemy()


    --StatusBar.lives;


  },
  clickSquare(e) {
    if (Enemy.spawned) {
      if (this.id == Enemy.squaresId) {
        action.HitEnemy();
        console.log("clickSquare ", e);

      } else {
        action.Missed();
        action.mirror(e.x, e.y, 10, 'f' + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9))
      }
    } else {
    }

  },
  windowBrokenByEnemy() {
    const e = Squares.squaresRefs[Enemy.squaresId]
    const x = e.offsetLeft + (e.offsetWidth / 2)
    const y = e.offsetTop + (e.offsetHeight / 2)
    action.mirror(x, y, 2, 'cff')
  },
  mirror(x, y, intensity, color) {
    console.log("mirror ", intensity);
    const clientX = x
    const clientY = y

    // Create triangles
    for (let i = 0; i < intensity; i++) {
      const triangle = document.createElement('div');
      triangle.className = 'triangle';
      const style = triangle.style;
      style.zIndex = '9999'
      style.width = '0';
      style.height = '0';
      style.borderStyle = 'solid';
      style.borderWidth = `0 ${Math.random() * 70}px ${Math.random() * 70}px`;
      style.borderColor = 'transparent transparent #' + color;
      style.position = 'absolute';
      style.left = `${clientX - 25}px`;
      style.top = `${clientY - 20}px`;
      style.pointerEvents = 'none';
      style.opacity = 0.01;
      //style.backgroundColor = '#aaf8';
      //pointer-events: none;
      document.body.appendChild(triangle);

      // Randomize rotation and position
      const rotation = Math.random() * 360 * intensity;
      const distance = Math.random() * intensity * 10;

      style.transform = `rotate(${rotation}deg) translate(${distance}px)`;
      style.opacity = '0';

      // Apply physics (falling animation)
      setTimeout(() => {
        triangle.style.transform = `rotate(${rotation}deg) translate(${distance * 10}px) translateY(80px) translateX(80px)`;
        triangle.style.opacity = '1';
        triangle.style.transitionDuration = '1s'
      }, 10);
      setTimeout(() => {
        triangle.style.transform = `rotate(${rotation}deg) translate(${distance}px) translateY(100px) translateX(100px)`;
        triangle.style.opacity = '0.1';
        triangle.style.transitionDuration = '0.5s'
      }, 0);
      setTimeout(() => {
        triangle.style.opacity = '0.7';
        triangle.style.transform = `translate(60px)  translateY(1000px)`;
        triangle.style.transitionDuration = '7s'
        //triangle.remove();
      }, 500);
      setTimeout(() => {
        triangle.style.opacity = '0'
        triangle.style.transitionDuration = '1s'
      }, 2000);
      setTimeout(() => {
        triangle.remove();
      }, 3000);

    }
  }
}
const services = {
  clickSquare: {
    enabled: false,
    Start() {
      console.log("clickSquare start");
      if (this.enabled) {

      } else {
        Squares.squaresRefs.forEach((square) => {
          square.addEventListener("pointerdown", action.clickSquare);
        });
        this.enabled = true;
      }

    },
    Stop() {
      console.log("clickSquare stop");
      if (this.enabled) {
        Squares.squaresRefs.forEach((square) => {
          square.removeEventListener("pointerdown", action.clickSquare);
        });
        this.enabled = false;
      } else {

      }

    }
  }
}

const lifeCycle = {
  Load() {
    EventsHandle.add(EventsEnemy.hitMirror, action.windowBrokenByEnemy)
    EventsHandle.add(EventsStatusBar.endTime, action.EndGame)
    EventsHandle.add(Events.pauseGame, services.clickSquare.Stop)
    EventsHandle.add(Events.unPauseGame, services.clickSquare.Start)
    Enemy.wait = 0;
    actionGameMenu.StartGame()

  },
  EarlyUpdate() {
    if (Game.pauseGame) return

    if (StatusBar.score > 60) {
      Enemy.wait = 350;
    } else if (StatusBar.score > 50) {
      Enemy.wait = 600;
    } else if (StatusBar.score > 40) {
      Enemy.wait = 700;
    } else if (StatusBar.score > 7) {
      Enemy.wait = 1000;
    } else if (StatusBar.score > 3) {
      Enemy.wait = 1500;
    } else if (TimeLeft.currentTimeLeft > 57) {
      Enemy.wait = 0;
    } else {
      Enemy.wait = 2000;
    }




  },
  Update() {

  }
}

import { CreateBehavior } from "../BehaviorSystem.js";
CreateBehavior(lifeCycle);

(function Pause() {
  window.addEventListener("keydown",
    function (e) {
      if (e.key == " ") {
        if (Game.pauseGame) {
          actionGameMenu.PlayGame()
        } else {
          actionGameMenu.PauseGame()
        }
      }
    })

})();

(function Restart() {
  window.addEventListener("keydown",
    function (e) {
      if (e.key == "Escape") {
        Engine.restart = true;
      }
    })

})();



