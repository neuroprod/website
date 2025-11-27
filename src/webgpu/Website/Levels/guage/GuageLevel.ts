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
import GameInput from "../../GameInput";
export default class GuageLevel extends BaseLevel {
    arrow!: SceneObject3D;
    colorDisk!: SceneObject3D;
    tl!: gsap.core.Timeline;
    count = 0
    stl!: gsap.core.Timeline;
    clockSpeed = 0.8;
    clockTime = this.clockSpeed;
    guageLevel2D!: GuageLevel2D
    colorAngle = 0
    doTick: boolean = true;
    canStopClock: boolean = false;
    waitTime: number = 0;
    textCount: number = 0;
    init() {
        super.init();

        this.configScene()

    }

    private configScene() {

        LoadHandler.onComplete = () => { }

        this.guageLevel2D = GameModel.UI2D.guageLevel2D;
        GameModel.setBlack(0)

        this.count = 0
        this.textCount = 0
        this.waitTime = this.guageLevel2D.setTick(0)
    }


    update() {
        super.update();
        this.clockTime -= Timer.delta;
        if (this.clockTime < 0) {
            this.clockTime += this.clockSpeed;
            SoundHandler.playTick(this.count)
            this.count++;
        }
        this.waitTime -= Timer.delta;
        if (this.waitTime < 0) {
            if (GameInput.space) {
                this.textCount++
                if (this.textCount > 3) {
                    SoundHandler.playGunShot()
                    LevelHandler.setLevel("Fight")
                } else {
                    this.waitTime = this.guageLevel2D.setTick(this.textCount)
                }


            }
        }
        //this.guageLevel2D.setTick(this.count)


    }

    destroy() {
        super.destroy();
        if (this.tl) this.tl.clear()
        if (this.stl) this.stl.clear()

        this.guageLevel2D.destroy()

    }


}

