import NavigationLevel from "../NavigationLevel.ts";

import GameModel from "../../GameModel.ts";
import { Vector3} from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import Timer from "../../../lib/Timer.ts";
import SoundHandler from "../../SoundHandler.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";



export default class Peeler extends NavigationLevel{
    private glow!: SceneObject3D;
    private knife!: SceneObject3D;





    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("peeler")).then(() => {
            LoadHandler.stopLoading()

        });

        SoundHandler.setBackgroundSounds(["sound/376416__ehohnke__funk-lead-loop.mp3"])

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0.35, -0.07, 0), new Vector3(0.35, 0, 0.9))
        GameModel.gameCamera.setMouseInput(0.1,0.0)
        GameModel.gameRenderer.setLevelType("website")

        this.glow =SceneHandler.getSceneObject("glow")
        if(this.glow.model)
       // this.glow.model.material.depthCompare="always"
       this.knife = SceneHandler.getSceneObject("knifeRot")
    }

    public update() {
        super.update()
        SceneHandler.sceneAnimations[0].autoPlay(Timer.delta)
        this.glow.rz+=Timer.delta*3.0;
        this.knife.rx  =Math.sin(Timer.time)*0.2
        this.knife.rz  =Math.sin(Timer.time)*0.03-0.35
    }

    destroy() {
        super.destroy()
        GameModel.gameCamera.setMouseInput()
        SoundHandler.killBackgroundSounds()
    }


}
