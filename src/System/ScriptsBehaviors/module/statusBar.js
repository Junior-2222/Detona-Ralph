import { EventsHandle } from "../game.js";
export const StatusBar = (() => {
    const _timeLeft = document.querySelector("#time-left")
    const _score = document.querySelector("#score")
    const _lives = document.querySelector("#lives")
    return {
        get timeLeft() {
            return Number(_timeLeft.textContent);
        },
        /**
         * @param {number} value
         */
        set timeLeft(value) {
            if (value <= 0) {
                _timeLeft.textContent = 0;
                setTimeout(() => EventsHandle.exe(Events.endTime), 100);
            } else {
                _timeLeft.textContent = value;
            }

        },

        get score() {
            return Number(_score.textContent);
        },
        set score(value) {
            _score.textContent = Number(value);
        },

        get lives() {
            return action.StringXToInt(_lives.textContent);
        },
        set lives(value) {
            if (StatusBar.lives <= 0) return;
            if (value <= 0) {
                _lives.textContent = "x0";
                TimeLeft.currentTimeLeft = 1;
            } else {
                _lives.textContent = action.IntToStringX(value);
            }

        },
        resetLives(value) {
            _lives.textContent = "x" + value;
        }
    }
})();
export const Events = {
    endTime: new Event("endTime")
}
const action = {
    StringXToInt(string) {
        let int = string.substring(1, string.length);
        return Number(int);
    },
    IntToStringX(int) {
        return `x${int}`;
    }
}

const lifeCycle = {
    Load() {
        StatusBar.resetLives(10);
        StatusBar.score = 0;
        StatusBar.timeLeft = 60;
    },
    EarlyUpdate() { },
    Update() { }
}
import { CreateBehavior } from "../../BehaviorSystem.js";
import { TimeLeft } from "./timeLeft.js";
CreateBehavior(lifeCycle)