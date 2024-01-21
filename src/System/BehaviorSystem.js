export { CreateBehavior, ListBehavior };

/**
 * @typedef {Object} LifecycleEvents
 * @property {Array<Load>} Load
 * @property {Array<EarlyUpdate>} EarlyUpdate
 * @property {Array<Update>} Update
 */
/**
 * @type {LifecycleEvents}
 * {@link LifecycleEvents}
 * @example type LifecycleEvents = {
 *  Load: Array<Load>;
 *  EarlyUpdate: Array<EarlyUpdate>;
 *  Update: Array<Update>;
 * }
 * */
const ListBehavior = {
    Load: [],
    EarlyUpdate: [],
    Update: []
}

/**
 * @typedef {Object} Lifecycle
 * @property {Function} Load
 * @property {Function} EarlyUpdate
 * @property {Function} Update
 */
/**
 * ### Function responsible for adding the script to the Engine.<br>
 *
 * @param {Lifecycle} script
 * @example 
 * const lifeCycle = { 
 *  Load() { },
 *  EarlyUpdate() { }, 
 *  Update() { }
 * }
 * CreateBehavior(lifeCycle)
 */
function CreateBehavior(script) {
    if (!script) throw new Error(`\nCreateMonoBehavior(${script}). script argument cannot be (${script})`);

    for (const event of ['Load', 'EarlyUpdate', 'Update']) {
        if (script[event]) {
            ListBehavior[event].push(Promisify(script[event]))
        }

    }
}


export function Promisify(func) {
    return () => new Promise(async (resolve, reject) => {
        try {
            const result = await func();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });

}