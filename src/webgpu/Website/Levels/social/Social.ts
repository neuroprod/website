import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";
import SpiralMaterial from "./SpiralMaterial.ts";
import Timer from "../../../lib/Timer.ts";


export default class Social extends NavigationLevel{
    private bgModel!: Model;



    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Social")).then(() => {
            LoadHandler.stopLoading()

        });
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }

        this.bgModel = new Model(GameModel.renderer,"background")
        this.bgModel.mesh =new Quad(GameModel.renderer)
        this.bgModel.material =new SpiralMaterial(GameModel.renderer,"bg")


        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))

        GameModel.gameRenderer.setLevelType("website")



    }

    public update() {
        super.update()
        this.bgModel.material.setUniform("ratio",GameModel.renderer.ratio)
        this.bgModel.material.setUniform("time",Timer.time)
    }

    destroy() {
        super.destroy()
        this.bgModel.destroy()
    }


}
