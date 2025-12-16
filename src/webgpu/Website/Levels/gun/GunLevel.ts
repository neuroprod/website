import { Vector3 } from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler";
import SceneHandler from "../../../data/SceneHandler";
import GameModel from "../../GameModel";
import { BaseLevel } from "../BaseLevel";
import Timer from "../../../lib/Timer";
import gsap from "gsap";
import SoundHandler from "../../SoundHandler";
import LevelHandler from "../LevelHandler";
export default class GunLevel extends BaseLevel {
    animationTime: number = 0;
    tl!: gsap.core.Timeline;


    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()




        SceneHandler.setScene(SceneHandler.getSceneIDByName("Gun")).then(() => {

            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {

        GameModel.tweenToBlack(2)
        return 2;
    }

    private configScene() {

        LoadHandler.onComplete = () => { }
        SoundHandler.setBackgroundSounds([])

        GameModel.gameRenderer.setModels(SceneHandler.allModels)



        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
        // GameModel.gameCamera.setPan(new Vector3(0, 0, 0), new Vector3(0, 0, 1.5))
        GameModel.tweenToNonBlack(1)
        let gun = SceneHandler.getSceneObject("gun")
        SceneHandler.sceneAnimations[0].setTime(0)
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        gun.rz = -0.5;
        gun.y = -0.5;
        this.animationTime = 0;
        this.tl.to(gun, { rz: 0, y: 0, duration: 2 }, 1);
        this.tl.to(this, { animationTime: 30, duration: 1 }, 3.5);
        this.tl.call(() => { SoundHandler.playGun() }, [], 3.6)
        this.tl.to(this, { animationTime: 60, duration: 5 }, 5);
        this.tl.call(() => { LevelHandler.setLevel("Fight") }, [], 4)
        // SceneHandler.sceneAnimations[0].play = true


    }

    update() {
        super.update();
        if (this.animationTime != 0) {
            SceneHandler.sceneAnimations[0].setTime(this.animationTime)
        }
    }

    destroy() {
        super.destroy();

        if (this.tl) this.tl.clear()

    }


}
