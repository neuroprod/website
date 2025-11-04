import { Vector3 } from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler";
import SceneHandler from "../../../data/SceneHandler";
import SceneObject3D from "../../../data/SceneObject3D";
import Timer from "../../../lib/Timer";
import GameModel from "../../GameModel";
import { BaseLevel } from "../BaseLevel";
import God from "../GodLevel/God";
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
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()




        SceneHandler.setScene(SceneHandler.getSceneIDByName("Guage")).then(() => {

            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {
        if (this.tl) this.tl.clear()
        GameModel.gameRenderer.tweenToBlack()
        return 0.5;
    }
    private configScene() {

        LoadHandler.onComplete = () => { }
        this.doTick = true;
        this.canStopClock = false;
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.guageLevel2D = GameModel.UI2D.guageLevel2D;

        this.arrow = SceneHandler.getSceneObject("arrow")
        this.arrow.rz = 1

        this.colorDisk = SceneHandler.getSceneObject("color")
        this.colorAngle = -1.5
        this.colorDisk.rz = this.colorAngle
        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1.5))

        GameModel.gameRenderer.setBlack(0)

        this.clockSpeed = 1;
        this.count = 0

        if (this.stl) this.stl.clear()
        let endIntro = 18 * 1
        this.stl = gsap.timeline()

        this.stl.call(() => {
            GameModel.gameRenderer.tweenToNonBlack(5);
            GameModel.gameCamera.setPan(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
        }, [], endIntro)
        this.stl.to(this, { clockSpeed: 0.221, colorAngle: 1.2, duration: 30, ease: "power1.inout" }, endIntro)
        this.stl.call(() => {
            this.canStopClock = true;
        }, [], endIntro)

        this.tick()
    }
    tick() {
        if (!this.doTick) return;
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        let angle = 1
        if (this.count % 2 == 0) {

            angle *= -1

        }
        this.guageLevel2D.setTick(this.count)
        this.tl.to(this.arrow, { rz: angle, duration: Math.min(0.3, this.clockSpeed), ease: "back.out" }, 0)
        this.tl.call(() => {
            SoundHandler.playTick(this.count)
        }, [], Math.min(0.3, this.clockSpeed))
        this.tl.call(() => {
            this.tick()
        }, [], this.clockSpeed)

        this.count++;
    }
    update() {
        super.update();
        this.colorDisk.rz = this.colorAngle;

        if (this.canStopClock) {
            let jump = GameModel.keyInput.getJump()

            if (GameModel.gamepadInput.connected) {



                if (!jump) jump = GameModel.gamepadInput.getJump()
            }
            if (jump) {
                this.stopClock()
            }
        }

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
                LevelHandler.setLevel("Dead");
            } else {
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

