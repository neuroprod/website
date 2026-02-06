import NavigationLevel from "../NavigationLevel.ts";

import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import MeatHandler from "./MeatHandler.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import {Howl} from "howler";


export default class Meat extends NavigationLevel{
    private meatHandler: MeatHandler;




    constructor() {
        super();
        this.meatHandler = new MeatHandler()
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("meat")).then(() => {
            LoadHandler.stopLoading()

        });

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.23, 0), new Vector3(0, 0.28, 0.65))

        GameModel.gameRenderer.setLevelType("website")

        this.meatHandler.init(SceneHandler.getSceneObject("meat1"), SceneHandler.getSceneObject("meat2"), SceneHandler.getSceneObject("editBtn"), this.mouseInteractionMap.get("edit") as MouseInteractionWrapper,SceneHandler.getSceneObject("github"), this.mouseInteractionMap.get("github") as MouseInteractionWrapper)

        this.meatHandler.enabled =true;
    }

    public update() {
        super.update()
        this.meatHandler.update()

    }

    destroy() {
        super.destroy()
        this.meatHandler.destroy()
        this.meatHandler.enabled =false;

    }


}
