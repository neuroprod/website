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


    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()




        SceneHandler.setScene(SceneHandler.getSceneIDByName("Gun")).then(() => {

            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {

        GameModel.gameRenderer.tweenToBlack()
        return 0.5;
    }

    private configScene() {

        LoadHandler.onComplete = () => { }

        GameModel.gameRenderer.setModels(SceneHandler.allModels)



        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
        // GameModel.gameCamera.setPan(new Vector3(0, 0, 0), new Vector3(0, 0, 1.5))
        GameModel.gameRenderer.tweenToNonBlack(1)
        let gun = SceneHandler.getSceneObject("gun")
        SceneHandler.sceneAnimations[0].setTime(0)
        let tl = gsap.timeline()
        gun.rz = -0.5;
        gun.y = -0.5;
        this.animationTime = 0;
        tl.to(gun, { rz: 0, y: 0, duration: 2 }, 1);
        tl.to(this, { animationTime: 30, duration: 1 }, 3.5);
        tl.call(() => { SoundHandler.playGun() }, [], 3.6)
        tl.to(this, { animationTime: 60, duration: 5 }, 5);
        tl.call(() => { LevelHandler.setLevel("Guage") }, [], 5)
        // SceneHandler.sceneAnimations[0].play = true
        SoundHandler.fadeSea()

    }

    update() {
        super.update();
        if (this.animationTime != 0) {
            SceneHandler.sceneAnimations[0].setTime(this.animationTime)
        }
    }

    destroy() {
        super.destroy();



    }


}
