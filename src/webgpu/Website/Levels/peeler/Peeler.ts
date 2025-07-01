import NavigationLevel from "../NavigationLevel.ts";

import GameModel from "../../GameModel.ts";
import { Vector3} from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import Timer from "../../../lib/Timer.ts";
import SoundHandler from "../../SoundHandler.ts";



export default class Peeler extends NavigationLevel{





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


    }

    public update() {
        super.update()
        SceneHandler.sceneAnimations[0].autoPlay(Timer.delta)

    }

    destroy() {
        super.destroy()
        GameModel.gameCamera.setMouseInput()
        SoundHandler.killBackgroundSounds()
    }


}
