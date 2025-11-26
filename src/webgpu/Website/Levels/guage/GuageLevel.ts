import { Vector3 } from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler";
import SceneHandler from "../../../data/SceneHandler";
import SceneObject3D from "../../../data/SceneObject3D";
import Timer from "../../../lib/Timer";
import GameModel from "../../GameModel";
import { BaseLevel } from "../BaseLevel";

import LevelHandler from "../LevelHandler";
import gsap from "gsap";
import SoundHandler from "../../SoundHandler";
import GuageLevel2D from "./GuageLevel2D";
export default class GuageLevel extends BaseLevel {
    arrow!: SceneObject3D;
    colorDisk!: SceneObject3D;
    tl!: gsap.core.Timeline;
    count = 0
    stl!: gsap.core.Timeline;
    clockSpeed = 0.8;
    guageLevel2D!: GuageLevel2D
    colorAngle = 0
    doTick: boolean = true;
    canStopClock: boolean = false;
    init() {
        super.init();

        this.configScene()

    }
    endAnime(): number {
        if (this.tl) this.tl.clear()
        GameModel.gameRenderer.tweenToBlack()
        return 0.5;
    }
    private configScene() {

        LoadHandler.onComplete = () => { }

        this.guageLevel2D = GameModel.UI2D.guageLevel2D;
        GameModel.gameRenderer.setBlack(0)



        this.tick()
    }
    tick() {
        if (!this.doTick) return;

        let angle = 1
        if (this.count % 2 == 0) {

            angle *= -1

        }
        this.guageLevel2D.setTick(this.count)
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        this.tl.call(() => {
            SoundHandler.playTick(this.count)
        }, [], Math.min(0.3, this.clockSpeed))
        this.tl.call(() => {
            console.log(this.count)
            if (this.count == 19) {
                GameModel.happyEnd = true
                LevelHandler.setLevel("Fight");

            } else {
                this.tick()
            }

        }, [], this.clockSpeed)

        this.count++;


    }
    update() {
        super.update();




    }
    stopClock() {
        this.canStopClock = false;
        this.doTick = false;
        this.stl.clear()
        let die = true;
        if (this.count % 2 == 0) {
            die = false
        }

        this.stl = gsap.timeline()

        this.stl.call(() => {
            GameModel.gameRenderer.tweenToBlack()
            this.guageLevel2D.destroy()
        }, [], 0.5)
        this.stl.call(() => {
            SoundHandler.playGunShot()

        }, [], 2)
        this.stl.call(() => {
            if (die) {
                GameModel.happyEnd = false
                LevelHandler.setLevel("Dead");

            } else {
                GameModel.happyEnd = true
                LevelHandler.setLevel("Sea");
            }

        }, [], 3)

    }

    destroy() {
        super.destroy();
        if (this.tl) this.tl.clear()
        if (this.stl) this.stl.clear()

        this.guageLevel2D.destroy()
        console.log("destroy")
    }


}

