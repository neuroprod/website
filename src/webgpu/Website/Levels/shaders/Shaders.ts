import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import MeatMaterial from "./MeatMaterial.ts";
import Timer from "../../../lib/Timer.ts";




export default class Shaders extends NavigationLevel{
    private material: MeatMaterial;



    constructor() {
        super();
       this.material =  new MeatMaterial(GameModel.renderer,"meat")
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Shaders")).then(() => {
            LoadHandler.stopLoading()

        });


    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 1))

        GameModel.gameRenderer.setLevelType("website")

        let placeHolder =SceneHandler.getSceneObject("placeHolder")
        if(placeHolder.model){
            placeHolder.model.material = this.material

        }

    }

    public update() {
        super.update()
this.material.setUniform("time", Timer.time)

    }

    destroy() {
        super.destroy()

    }


}
