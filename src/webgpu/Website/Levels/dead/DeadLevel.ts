import { Vector3 } from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler";
import SceneHandler from "../../../data/SceneHandler";
import GameModel from "../../GameModel";
import { BaseLevel } from "../BaseLevel";
import Timer from "../../../lib/Timer";
import gsap from "gsap";
import SoundHandler from "../../SoundHandler";
import LevelHandler from "../LevelHandler";
import SceneObject3D from "../../../data/SceneObject3D";
export default class DeadLevel extends BaseLevel {
    animationTime: number = 0;
    tl!: gsap.core.Timeline;
    holder!: SceneObject3D
    leg1!: SceneObject3D;
    leg1R = 1.3114134535216055;
    leg2!: SceneObject3D;
    leg2R = 0.9923987886617837;
    arm1!: SceneObject3D;
    arm1R = 1.8901269736680002 + 2.7;
    arm2!: SceneObject3D;
    arm2R = 2.6541042343949774;
    posy = 0.3;
    fall = 1
    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()




        SceneHandler.setScene(SceneHandler.getSceneIDByName("dead")).then(() => {

            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {

        GameModel.gameRenderer.tweenToBlack()
        return 0.5;
    }

    private configScene() {

        LoadHandler.onComplete = () => { }

        this.posy = 0.3;
        this.fall = 1
        SoundHandler.setBackgroundSounds(["sound/JuliaFlorida.mp3", "sound/651743__department64__underwater-deep-water-loop.mp3"])

        GameModel.gameRenderer.setModels(SceneHandler.allModels)

        this.holder = SceneHandler.getSceneObject("pirateHolder")
        this.holder.y = 1
        this.leg1 = SceneHandler.getSceneObject("l1");
        this.leg2 = SceneHandler.getSceneObject("l2");

        this.arm1 = SceneHandler.getSceneObject("a1");

        this.arm2 = SceneHandler.getSceneObject("a2");

        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
        // GameModel.gameCamera.setPan(new Vector3(0, 0, 0), new Vector3(0, 0, 1.5))
        GameModel.gameRenderer.tweenToNonBlack(1)
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()

        this.tl.to(this, { fall: 0, ease: "elastic.out(0.5,0.5),0.5", duration: 2 }, 0.5)
        this.tl.call(() => { SoundHandler.playSplash() }, [], 0.3 + 0.5)
    }

    update() {
        super.update();
        this.holder.rz = Math.sin(Timer.time * 0.5) * 0.05
        this.posy -= Timer.delta * 0.02
        this.holder.y = this.fall + this.posy;
        this.holder.x = Math.sin(Timer.time * 0.1) * 0.02
        this.leg1.rz = this.leg1R + Math.cos(Timer.time * 0.5) * 0.2
        this.leg2.rz = this.leg2R + Math.cos((Timer.time + 0.3) * 0.5) * 0.2
        this.arm1.rz = this.arm1R + Math.sin(Timer.time * 0.3) * 0.1
        this.arm2.rz = this.arm2R - Math.cos((Timer.time + 0.3) * 0.3) * 0.2

    }

    destroy() {
        super.destroy();
        if (this.tl) this.tl.clear()


    }


}
