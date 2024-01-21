/**
* @param {Function} fn Service function () => { }
* @param {number} seconds Interval in seconds
*/
export function CreateService(fn = () => { }, seconds, lock = false) {
    return (() => {
        let _id = -1;
        const run = fn;
        /** 
         * @type {number} Interval in seconds  */
        let _interval = seconds;
        return {
            get interval() {
                return _interval;
            },
            set interval(value) {
                if (lock) return;
                _interval = value;
                if (_id > -1) {
                    setInterval(_id, _interval * 1000)
                }

            },
            Stop() {
                if (_id > -1) {
                    clearInterval(_id);
                    _id = -1;
                    return true;
                } else {
                    return false;
                }
            },
            Start() {
                if (_id > -1) {
                } else {
                    _id = setInterval(fn, _interval * 1000)
                }

            }
        }
    })()

}
