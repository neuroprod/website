import GameModel from "../GameModel"
import gsap from "gsap";
import SoundHandler from "../SoundHandler";
export default class FishstickHandler {

    numFishsticks = 0
    tl!: gsap.core.Timeline;

    constructor() {


    }
    addFishstick(value: number) {
        let temp = this.numFishsticks;
        this.numFishsticks += value
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        GameModel.UI2D.setFishsticks(temp++)
        for (let i = 1; i <= value; i++) {
            this.tl.call(() => { GameModel.UI2D.setFishsticks(temp++); SoundHandler.playCoin() }, [], i * 0.5)
        }




    }
    reset() {
        this.numFishsticks = 0
        GameModel.UI2D.setFishsticks(this.numFishsticks)
    }
}