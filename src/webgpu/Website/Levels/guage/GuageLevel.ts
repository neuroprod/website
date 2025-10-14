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
export default class GuageLevel extends BaseLevel {
    arrow!: SceneObject3D;
    colorDisk!: SceneObject3D;
    tl!: gsap.core.Timeline;
    count = 0
    stl!: gsap.core.Timeline;
    clockSpeed = 1;

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

        GameModel.gameRenderer.setModels(SceneHandler.allModels)


        this.arrow = SceneHandler.getSceneObject("arrow")
        this.arrow.rz = 1

        this.colorDisk = SceneHandler.getSceneObject("color")
        this.colorDisk.rz = 0
        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1.5))
        GameModel.gameCamera.setPan(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
        GameModel.gameRenderer.tweenToNonBlack(3)
        this.clockSpeed = 1;
        if (this.stl) this.stl.clear()
        this.stl = gsap.timeline()
        this.stl.to(this, { clockSpeed: 0.221, duration: 10, ease: "power2.inout" }, 6)
        this.tick()
    }
    tick() {
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        let angle = 1
        if (this.count % 2 == 0) {

            angle *= -1

        }

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



    }

    destroy() {
        super.destroy();
        if (this.tl) this.tl.clear()
        if (this.stl) this.stl.clear()


    }


}
