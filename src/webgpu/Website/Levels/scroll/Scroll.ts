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
import gsap from "gsap";
export default class Scroll extends NavigationLevel{
    private scroll1!: SceneObject3D;
    private scroll2!: SceneObject3D;
    private scroll3!: SceneObject3D;
    private worm1!: SceneObject3D;
    private worm2!: SceneObject3D;
    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;

    private worm1Time =0
    private worm2Time =4

    private worm1Dir =1
    private worm2Dir =-1
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

        this.worm1Time-=Timer.delta
        if(this.worm1Time<0){
            console.log(this.worm1.x,"worm1")
            if(this.worm1.x>0.2){
                this.worm1Dir =-1
                this.worm1.x -=0.05
            }
            if(this.worm1.x<-0.2){
                this.worm1Dir =1
                this.worm1.x +=0.05
            }
            if(this.worm1Dir==1){
                this.worm1.ry =0
            }else{
                this.worm1.ry =Math.PI
            }
            this.moveWorm(this.worm1,this.worm1Dir)
            this.worm1Time +=3+Math.random()*2

        }
        this.worm2Time-=Timer.delta
        if(this.worm2Time<0){
            console.log(this.worm2.x,"worm2")
            this.moveWorm(this.worm2,this.worm2Dir)
            this.worm2Time +=3+Math.random()*2
        }

    }
    moveWorm(worm:SceneObject3D,dir:number) {
        let tl = gsap.timeline()
        let wx =worm.x;
        tl.to(worm, {sx: 0.9, sy: 1.05,duration:0.5,ease:"power2.inOut"}, 0)
        tl.to(worm, {sx: 1, sy: 1,x:wx+0.02*dir,duration:1.5,ease:"power2.inOut"}, 0.5)
    }

    destroy() {
        super.destroy()
        this.backgroundTexture.destroy()
        this.bgModel.mesh.destroy()

    }


}
