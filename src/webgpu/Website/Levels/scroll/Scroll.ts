import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Timer from "../../../lib/Timer.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";

export default class Scroll extends NavigationLevel{
    private scroll1!: SceneObject3D;
    private scroll2!: SceneObject3D;
    private scroll3!: SceneObject3D;
    private worm1!: SceneObject3D;
    private worm2!: SceneObject3D;
    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("scroll")).then(() => {
            LoadHandler.stopLoading()

        });
        this.backgroundTexture = new TextureLoader(GameModel.renderer,"backgrounds/scrollBG.png")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }
        //this.setBackground("backgrounds/")
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
       this.scroll1 =SceneHandler.getSceneObject("scroll1")
        this.scroll2 =SceneHandler.getSceneObject("scroll2")
        this.scroll3 =SceneHandler.getSceneObject("scroll3")
        this.worm1 =SceneHandler.getSceneObject("worm1")
        this.worm2 =SceneHandler.getSceneObject("worm2")


        this.bgModel = new Model(GameModel.renderer,"background")
        this.bgModel.mesh =new Quad(GameModel.renderer)
        this.bgModel.material =new GBufferFullScreenStretchMaterial(GameModel.renderer,"bg")
        this.bgModel.material.setTexture("colorTexture",  this.backgroundTexture)
        GameModel.gameRenderer.gBufferPass.modelRenderer.addModel(this.bgModel)
    }

    public update() {
        super.update()
        this.scroll1.x+= Timer.delta*0.3;
        if(this.scroll1.x>1)this.scroll1.x =-1

        this.scroll2.x-= Timer.delta*0.2;
        if(this.scroll2.x<-1)this.scroll2.x =1


        this.scroll3.x+= Timer.delta*0.233;
        if(this.scroll3.x>1)this.scroll3.x =-1
    }

    destroy() {
        super.destroy()
        this.backgroundTexture.destroy()
        this.bgModel.mesh.destroy()

    }


}
