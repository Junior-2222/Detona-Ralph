export var AudioSystem = {
    /**
     * @type {Record<string, Array<HTMLAudioElement>} AudiosPools
     * @example
     * type AudiosPools = {
     * [audioName: string]: HTMLAudioElement[];
     * }
     */
    audioPools: {},
    /**
     * @description ~Registra um Audio no sistema.
     * @arg {string} audioName
     * @arg {number} poolSize ~Tamanho do array do som {audioName}
     * @arg {number} startTime
     * @return {()=>{played}} ~Function que ao executar toca o audio
     * @return {boolean} ~Se foi executado audio
     * @example
     * const tocarSom = PreparePlaySoundPool("som.wav", 1, 0);
     * boolFoitocado = tocarSom();
     */
    PreparePlaySoundPool(audioName, poolSize, startTime) {
        var audioPool = AudioSystem.audioPools[audioName] = [new Audio];
        for (var i = 0; i < poolSize; i++) {
            audioPool[i] = new Audio(`./src/audios/${audioName}`);
            audioPool[i].volume = 0.2;
            audioPool[i].preload = "auto";
            audioPool[i].playbackRate = 1;


        }
        let indexPool = -1;
        return () => {
            let played;
            indexPool = indexPool + 1;
            if (indexPool >= poolSize) indexPool = 0;
            if (false) {
                played = false;
            } else {
                audioPool[indexPool].currentTime = startTime;
                audioPool[indexPool].play();
                played = true;
            }
            return { played };
        };
    }

};
