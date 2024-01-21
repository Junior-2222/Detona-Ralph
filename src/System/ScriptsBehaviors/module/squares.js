export const Squares = {
    squaresRefs: document.querySelectorAll(".square"),
    GetRandomSquare: (EnemySquaresId) => {
        let randomNumber = Math.floor(Math.random() * 9);
        if (randomNumber == EnemySquaresId) {
            randomNumber += 1;
            if (randomNumber >= 9) {
                randomNumber = 0;
            }
        }
        return Squares.squaresRefs[randomNumber];
    }
}

const lifeCycle = {

    Load() {
    },
    EarlyUpdate() { },
    Update() {
    }
}
import { CreateBehavior } from "../../BehaviorSystem.js";

CreateBehavior(lifeCycle)



