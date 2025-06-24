import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector3} from "@math.gl/core";
import ArduinoGamePixels from "./ArduinoGamePixels.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import SoundHandler from "../../SoundHandler.ts";



export default class ArduinoGame extends NavigationLevel{
    private arduinoGame: ArduinoGamePixels;



    constructor() {
        super();
        this.arduinoGame = new ArduinoGamePixels()
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("arduinoGame")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/neighbourhood.mp3"])
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")

        this.arduinoGame.init(SceneHandler.getSceneObject("root4"))
        this.arduinoGame.setEnabled(true)
    }

    public update() {
        super.update()
        this.arduinoGame.update()

    }

    destroy() {
        super.destroy()
        this.arduinoGame.setEnabled(false)
        SoundHandler.killBackgroundSounds()
    }


}
