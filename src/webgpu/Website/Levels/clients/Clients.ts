
import {Vector2, Vector3} from "@math.gl/core";
import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import ClientFontMaterial from "./ClientFontMaterial.ts";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import Timer from "../../../lib/Timer.ts";


export default class Clients extends NavigationLevel{
    private fontMaterial!: ClientFontMaterial;
    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;
    private size: number=0;
private time =0


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
        this.backgroundTexture = new TextureLoader(GameModel.renderer,"backgrounds/paper.jpg")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }

        this.bgModel = new Model(GameModel.renderer,"background")
        this.bgModel.mesh =new Quad(GameModel.renderer)
        this.bgModel.material =new FullScreenStretchMaterial(GameModel.renderer,"bg")
        this.bgModel.material.setTexture("colorTexture",  this.backgroundTexture)

        this.bgModel.z =-100
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        let text = SceneHandler.getSceneObject("text")
        if(text.model){
            this.size =text.model.mesh.max.x
            if(!this.fontMaterial ) this.fontMaterial = new ClientFontMaterial(GameModel.renderer,"clientFontMaterial")
            text.model.material =this.fontMaterial
            GameModel.gameRenderer.postLightModelRenderer.addModel(text.model)
text.z =-0.005
            text.setScaler(0.8)
        }


        this.time=0;
    }

    public update() {
        super.update()
        this.time +=Timer.delta*0.2
        this.fontMaterial.setUniform("time",this.time)
        this.fontMaterial.setUniform("size",this.size)
    }

    destroy() {
        super.destroy()
        GameModel.gameCamera.setMouseInput()
    }


}
