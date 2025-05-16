import {BaseLevel} from "../BaseLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector3} from "@math.gl/core";
import sceneHandler from "../../../data/SceneHandler.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";

export class Website extends BaseLevel {
    private kris!: SceneObject3D;
    constructor() {
        super();
    }



    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene(SceneHandler.getSceneIDByName("websiteGraphicsDev")).then(() => {
            LoadHandler.stopLoading()
            SceneHandler.addScene(SceneHandler.getSceneIDByName("kris")).then(() => {
                LoadHandler.stopLoading()
            });
            });
    }

    configScene() {

        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        this.kris = sceneHandler.getSceneObject("krisRoot")
        this.kris.setScaler(0.5)
        this.kris.x =0;
        this.kris.y = 0

        this.kris.z = -0.3
        this.kris.ry =0
    }




}
