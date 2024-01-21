export var EngineTime = {
    // performance.now()
    initial: 0,
    /** @type{number} fracao de segundo desde o ultimo segundo.*/
    get deltaTime() {
        //console.log("ççç delta time:", performance.now() - this.initial, "->", performance.now(), " - ", this.initial)
        return performance.now() - this.initial;
    },
    set deltaTime(value) {
        throw new Error(`\nCannot change deltat.`);
    }
}

export async function UpdateTimeInitial() {
    EngineTime.initial = performance.now();
}
