
import {Vector2, Vector3} from "@math.gl/core";
import NavigationLevel from "../Levels/NavigationLevel.ts";
import LoadHandler from "../../data/LoadHandler.ts";
import SceneHandler from "../../data/SceneHandler.ts";
import GameModel from "../GameModel.ts";
import ClientFontMaterial from "./ClientFontMaterial.ts";


export default class Clients extends NavigationLevel{
    private fontMaterial!: ClientFontMaterial;



    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("clients")).then(() => {
            LoadHandler.stopLoading()

        });
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))
        GameModel.gameCamera.setMouseInput(0,0)
        GameModel.gameRenderer.setLevelType("website")

        let text = SceneHandler.getSceneObject("text")
        if(text.model){
            if(!this.fontMaterial ) this.fontMaterial = new ClientFontMaterial(GameModel.renderer,"clientFontMaterial")
            text.model.material =this.fontMaterial
        }

    }

    public update() {
        super.update()


    }

    destroy() {
        super.destroy()
        GameModel.gameCamera.setMouseInput()
    }


}
