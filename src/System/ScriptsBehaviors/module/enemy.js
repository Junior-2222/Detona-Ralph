import { Squares } from "./squares.js";
import { EventsHandle, Game } from "../game.js";
import { EngineTime as Time } from "../../time.js";
import { audios } from "../game.js";


export const Enemy = (() => {
    return {
        waitCount: 0,
        wait: 0,
        /**
         * @param {number} value
         */
        set spawned(value) {
            if (value) {
                setTimeout(() => {
                    EventsHandle.exe(Events.hitMirror);
                    audios.PlaySoundHitMirror();
                }, 100)
            } else {
                setTimeout(() => {
                    audios.PlaySoundHitMirror();
                }, 100)
            }
            this._spawned = value;
        },
        get spawned() {
            return this._spawned || true;
        },
        squaresId: 3,
        FindEnemyAndClear: () => {
            let someDeleted = false;
            Squares.squaresRefs.forEach((square) => {
                if (square.classList.contains("enemy")) someDeleted = true;
                square.classList.remove("enemy");
            });
            Enemy.spawned = false;
            return { someDeleted };
        },
        RandomAddEnemy: () => {

            let square = Squares.GetRandomSquare();
            square.classList.add("enemy");
            Enemy.squaresId = square.id;
            Enemy.spawned = true;
            return Enemy.spawned;
        },
        removeEnemy: () => {
            Enemy.spawned = false;
            Squares.squaresRefs[Enemy.squaresId].classList.remove("enemy");
        },
        moveEnemy: () => {
            setTimeout(() => {
                Enemy.removeEnemy();
                Enemy.RandomAddEnemy();
                Enemy.hitMirror();
            }, 2000);
        },
        hitMirror: () => {
            EventsHandle.exe(Events.hitMirror);
            audios.PlaySoundHitMirror();
        }
    }
})()

export const Events = {
    extendsEnemy: Enemy,
    hitMirror: new Event("hitMirror")
}

const action = {
    MoveRalphAfterWait() {

        if (Enemy.waitCount > Enemy.wait) {

            Enemy.waitCount = 0;
            if (Enemy.spawned) {
                Enemy.moveEnemy();
            }

        } else {
            Enemy.waitCount += Time.deltaTime;
        }
    }

}

const lifeCycle = {
    Load() {
        Enemy.waitCount = 0;
    },
    EarlyUpdate() { },
    Update() {
        if (!Game.pauseGame)
            action.MoveRalphAfterWait();


    }
}

import { CreateBehavior } from "../../BehaviorSystem.js";
CreateBehavior(lifeCycle)