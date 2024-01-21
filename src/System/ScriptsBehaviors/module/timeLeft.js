var _currentTimeLeft = 0;
export const TimeLeft = {
    initialTimeLeft: 60,
    currentTimeLeft: 0
}
import { EventsHandle, Events as EventsGame } from "../game.js";
import { StatusBar } from "./statusBar.js";
import { CreateService } from "../../CreateService.js";

const services = {
    CountDown: CreateService(() => {
        if (TimeLeft.currentTimeLeft <= 0) return;

        TimeLeft.currentTimeLeft = TimeLeft.currentTimeLeft - 1;
        StatusBar.timeLeft = TimeLeft.currentTimeLeft;
        console.log("CountDown", TimeLeft.currentTimeLeft);
        //som  
    }, 1)
}


const lifeCycle = {
    Load() {
        EventsHandle.add(EventsGame.pauseGame, services.CountDown.Stop)
        EventsHandle.add(EventsGame.unPauseGame, services.CountDown.Start)

        TimeLeft.currentTimeLeft = TimeLeft.initialTimeLeft;
    },
    EarlyUpdate() {

    },
    Update() {

    }

}
import { CreateBehavior } from "../../BehaviorSystem.js";
CreateBehavior(lifeCycle)