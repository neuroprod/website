import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import MeatMaterial from "./MeatMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import {smoothstep} from "../../../lib/MathUtils.ts";




export default class Shaders extends NavigationLevel{
    private material: MeatMaterial;
    private button!: SceneObject3D;
    private buttonPos!: Vector3;
    private startDraggX: number =0;
    private startButtonX: number=0;
    private isDragging: boolean =false;
    private min =-0.47
    private max =0.4

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
        this.button =SceneHandler.getSceneObject("button")
        this.button.x =-0.2
        this.buttonPos = this.button.getPosition();
        let button = this.mouseInteractionMap.get("button") as MouseInteractionWrapper
        button.onDown =()=>{
            this.ray.setFromCamera(GameModel.gameCamera.camera, GameModel.mouseListener.getMouseNorm())
            let int = this.ray.intersectPlane(this.buttonPos,new Vector3(0,0,1))
            if(int){
                this.startDraggX = int.x
                this.startButtonX =this.button.getPosition().x
                this.isDragging =true;

            }

        }
        button.onUp =()=>{
            this.isDragging =false;
        }
        this.updateButton()
    }

    public update() {
        super.update()
        if(this.isDragging){
            this.ray.setFromCamera(GameModel.gameCamera.camera, GameModel.mouseListener.getMouseNorm())
            let int = this.ray.intersectPlane(this.buttonPos,new Vector3(0,0,1))
            if(int) {
                let move = this.startDraggX- int.x ;
                this.button.x  =move +this.startButtonX
                if(this.button.x<this.min)this.button.x =this.min
                if(this.button.x>this.max)this.button.x =this.max

this.updateButton()

            }
        }


        this.material.setUniform("time", Timer.time)
    }
updateButton (){
    let  pos =(this.button.x -this.min)/ (this.max-this.min)
    pos*=0.9
    let pos1 = smoothstep(0,0.5,pos)
    let pos2 = smoothstep(0.25,0.75,pos)
    let pos3 = smoothstep(0.5,1,pos)
    let pos4 = smoothstep(0.0,0.15,pos)

    this.material.setUniform("pos1", pos1)
    this.material.setUniform("pos2", pos2)
    this.material.setUniform("pos3", pos3)
    this.material.setUniform("pos4", pos4)
}
    destroy() {
        super.destroy()

    }


}
