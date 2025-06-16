import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Timer from "../../../lib/Timer.ts";


export default class Friends extends NavigationLevel{

    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;
    private rossTexture!: TextureLoader;
    private rossModel!: Model;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("friends")).then(() => {
            LoadHandler.stopLoading()

        });
        this.backgroundTexture = new TextureLoader(GameModel.renderer,"backgrounds/friendsBG.png")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }

        this.rossTexture = new TextureLoader(GameModel.renderer,"ross.jpg")

        LoadHandler.startLoading()
        this.rossTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))
        GameModel.gameCamera.setMouseInput(0.01)
        GameModel.gameRenderer.setLevelType("website")

        this.bgModel = new Model(GameModel.renderer,"background")
        this.bgModel.mesh =new Quad(GameModel.renderer)
        this.bgModel.material =new GBufferFullScreenStretchMaterial(GameModel.renderer,"bg")
        this.bgModel.material.setTexture("colorTexture",  this.backgroundTexture)
   GameModel.gameRenderer.gBufferPass.modelRenderer.addModel(this.bgModel)



        this.rossModel = new Model(GameModel.renderer,"ross")
        this.rossModel.mesh =GameModel.glft.meshes[0]
        this.rossModel.material =new GBufferMaterial(GameModel.renderer,"ross")
        this.rossModel.material.setTexture("colorTexture",  this.rossTexture)
        GameModel.gameRenderer.gBufferPass.modelRenderer.addModel(this.rossModel)
        this.rossModel.rx =Math.PI/2
        this.rossModel.setPosition(0,0,-2)
        this.rossModel.setScaler(0.7)
    }

    public update() {
        super.update()

        this.rossModel.ry+=Timer.delta
    }

    destroy() {
        super.destroy()
        this.backgroundTexture.destroy()
        this.bgModel.mesh.destroy()
        GameModel.gameCamera.setMouseInput(0.04)
        this.rossTexture.destroy()

    }


}
