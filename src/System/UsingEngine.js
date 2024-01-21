import { ListBehavior } from "./BehaviorSystem.js";
import { CreateService } from "./CreateService.js";
import { UpdateTimeInitial } from "./time.js";

const initialProperties = JSON.parse(await (await fetch("./engine.json")).text());

export const Engine = (() => {
    let _velocity = -1;
    return {
        restart: true,
        GetServices() { service },
        SetStartproperties() {
            console.log("set properties");
            for (const key in initialProperties) {
                Engine[key] = initialProperties[key];
            }
        },
        initialVelocity: 0,
        running: false,
        get velocity() {//*1000
            console.log("get velocity:", _velocity);
            return _velocity;
        },
        /**
         * @param {number} value
         */
        set velocity(value = 0) {
            if (value < 0) {
                _velocity = 0;

            } else {
                _velocity = value;
            }
            console.log("set velocity:", value);
        }
    }
})();

const service = {
    checkLoadedBehaviorsAndRunLoadCycle: CreateService(() => {
        console.log("numero de Behavior:", ListBehavior.Load.length);
        // *[contar scripts a serem carregados] 6
        // *[elaborar estrutura de pastas] refatore behaviorSystem. componente modulo statico. htmlElement tipo gameobject
        if (ListBehavior.Load.length >= 5) {

            document.getElementById('start').onclick = () => {
                if (Engine.running) {
                    console.error('start não pode chamar o LoadMainLoop');
                } else {
                    document.getElementById('menu-game').style.display = 'none';
                    Engine.running = true;
                    action.LoadCycle();

                }


            }

            service.checkLoadedBehaviorsAndRunLoadCycle.Stop();


        }
    }, 0.1, false),
}

const action = {
    async LoadBehaviors() {
        Engine.SetStartproperties();
        await import("./ScriptsBehaviors/game.js")
        service.checkLoadedBehaviorsAndRunLoadCycle.Start();
    },
    async Sleep(ms) {
        new Promise(async (resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

    }, async LoadCycleEvents() {
        console.log("INIT LOAD ALL +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(ListBehavior.Load);
        await Promise.all(ListBehavior.Load.map(event => event()));
    },
    LoadCycle() {
        console.log("Load Cycle Events/////////////////////////");
        new Audio("./src/audios/break-mirror.wav").play();
        new Audio("./src/audios/heavymetal.wav").play();
        new Audio("./src/audios/end-game.wav").play();
        new Audio("./src/audios/distorted-guitar.wav").play();

        Engine.restart = false;

        Engine.SetStartproperties();
        Engine.velocity = Engine.initialVelocity;
        action.LoadCycleEvents()
        //action.Sleep(10000);
        UpdateTimeInitial();
        requestAnimationFrame(action.UpdateCycle);
    },
    async UpdateCycle() {

        await Promise.all(ListBehavior.EarlyUpdate.map(event => event()));
        //console.log("---------------EarlyUpdate executados---------");
        await Promise.all(ListBehavior.Update.map(event => event()));
        //console.log("-----------------Update executados-------------");


        await UpdateTimeInitial();

        setTimeout(() => {
            if (Engine.restart) {
                requestAnimationFrame(action.LoadCycle);
            } else {

                requestAnimationFrame(action.UpdateCycle);
            }
        }, 50)


    }
}
action.LoadBehaviors()
