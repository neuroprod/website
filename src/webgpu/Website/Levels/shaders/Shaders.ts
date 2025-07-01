import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector3} from "@math.gl/core";
import MeatMaterial from "./MeatMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import {smoothstep} from "../../../lib/MathUtils.ts";
import PotatoMaterial from "./PotatoMaterial.ts";
import ProjectData from "../../../data/ProjectData.ts";
import SoundHandler from "../../SoundHandler.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import Model from "../../../lib/model/Model.ts";
import FlowerMaterial from "./FlowerMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";

class FlowerParticle{
    position:Vector3 =new Vector3()
     rotation: number=0;
   type: number=0;

    private rotSpeed =(Math.random()-0.5)*3;
    private fallSpeed =0.1+Math.random()*0.3
    constructor() {
        this.position.x =(Math.random()-0.5)*4
        this.position.y =(Math.random()-0.5)*2
        this.position.z =-Math.random()*0.3
        this.rotation = Math.random()*7
        this.type =Math.random()

    }
    update(delta:number , type:number=0){
        this.rotation+=this.rotSpeed*delta;
        this.position.y-=this.fallSpeed*delta;

        if(this.position.y<-1){
            this.position.y =1;


        }


    }

}
export default class Shaders extends NavigationLevel {
    private material: MeatMaterial;
    private button!: SceneObject3D;
    private buttonPos!: Vector3;
    private startDraggX: number = 0;
    private startButtonX: number = 0;
    private isDragging: boolean = false;
    private min = -0.47
    private max = 0.4
    private pos1: number = 0;
    private eye1!: SceneObject3D;
    private eye2!: SceneObject3D;
    private potato!: SceneObject3D;
    private e1Pos = new Vector3(0.05, -0.01, 0.14)
    private e2Pos = new Vector3(-0.08, 0, 0.14)
    private smile!: SceneObject3D;
    private lerpPos: number = 0;
    private time: number = 0;
    private flowerTexture!: TextureLoader;
private flowerModel!:Model
private particles:Array<FlowerParticle>=[]
private numParticles =40
    private posArr: Float32Array =new Float32Array(this.numParticles*3);
    private dataArr: Float32Array =new Float32Array(this.numParticles*2);
    private slidePos: number=0;
    private armR!: SceneObject3D;
    private armL!: SceneObject3D;
    constructor() {
        super();
        this.material = new MeatMaterial(GameModel.renderer, "meat")
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Shaders")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/looperman-l-4499538-0400053-chill-cloudy-vapor-loop.mp3"])
        //looperman-l-4499538-0400053-chill-cloudy-vapor-loop.mp3


        this.flowerTexture = new TextureLoader(GameModel.renderer,"flower.png")

        LoadHandler.startLoading()
        this.flowerTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }

        this.time = 0
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 1))

        GameModel.gameRenderer.setLevelType("website")

        let placeHolder = SceneHandler.getSceneObject("placeHolder")
        if (placeHolder.model) {
            placeHolder.model.material = this.material

        }
        this.potato = SceneHandler.getSceneObject("potato")
        if (this.potato.model) {
            this.potato.model.material = new PotatoMaterial(GameModel.renderer, "potato")
            let charProj = ProjectData.projectsNameMap.get("Shaders")
            if (charProj) {

                this.potato.model.material.setTexture("colorTexture", charProj.getBaseTexture())
            }
            // this.potato.model.material.setTexture("co")
        }
        this.smile = SceneHandler.getSceneObject("smile")
        this.eye1 = SceneHandler.getSceneObject("eye1")
        this.eye2 = SceneHandler.getSceneObject("eye2")

        this.button = SceneHandler.getSceneObject("button")
        this.button.x = this.min
        this.buttonPos = this.button.getPosition();
        let button = this.mouseInteractionMap.get("button") as MouseInteractionWrapper
        button.onDown = () => {
            this.ray.setFromCamera(GameModel.gameCamera.camera, GameModel.mouseListener.getMouseNorm())
            let int = this.ray.intersectPlane(this.buttonPos, new Vector3(0, 0, 1))
            if (int) {
                this.startDraggX = int.x
                this.startButtonX = this.button.getPosition().x
                this.isDragging = true;

            }

        }
        button.onUp = () => {
            this.isDragging = false;
        }
        this.updateButton()

        this.armR = SceneHandler.getSceneObject("armR")
        this.armL = SceneHandler.getSceneObject("armL")


      //  this.makeFlowers()
//this.makeParticles()

    }

    public update() {
        super.update()
        this.time += Timer.delta;
        if (this.isDragging) {
            this.ray.setFromCamera(GameModel.gameCamera.camera, GameModel.mouseListener.getMouseNorm())
            let int = this.ray.intersectPlane(this.buttonPos, new Vector3(0, 0, 1))
            if (int) {
                let move = this.startDraggX - int.x;
                this.button.x = move + this.startButtonX
                if (this.button.x < this.min) this.button.x = this.min
                if (this.button.x > this.max) this.button.x = this.max

                this.updateButton()

            }
        }
        let time = this.time
        let p1 = new Vector3(0.1 * this.pos1, 0, 0)
        let r = 0.15 + Math.sin(time) * 0.005 * this.pos1
        let v1 = new Vector3(-0.1, 0.1, 1)
        v1.normalize()
        v1.scale(r)
        p1.add(v1)
        this.e1Pos.y =Math.sin(time/3.33)*0.01-0.03 +this.slidePos*0.1
        p1.lerp(this.e1Pos, 1 - this.lerpPos)

        let p2 = new Vector3(-0.1 * this.pos1, 0.03 * this.pos1, 0)
        r = 0.15 + Math.cos(time) * 0.01 * this.pos1
        v1.set(0.1, 0.0, 1)
        v1.normalize()
        v1.scale(r)
        p2.add(v1)
        this.e2Pos.y =Math.cos(time/4)*0.01-0.03+this.slidePos*0.1
        p2.lerp(this.e2Pos, 1 - this.lerpPos)

        this.eye2.setPositionV(p2)
        this.eye1.setPositionV(p1)

        this.button.setScaler(1 + Math.sin(time * 2) * 0.05)
        //  let d1 = sdSphere(pFlat+vec3f(0.1,0.0,0)*uniforms.pos1,0.15+sin(uniforms.time)*0.005*uniforms.pos1);
        // let d2 = sdSphere(pFlat+vec3f(-0.1,0.03,0)*uniforms.pos1,0.15+cos(uniforms.time)*0.01*uniforms.pos1);

        this.material.setUniform("time", time*1.5)
        this.armR.ry=0
        this.armL.ry=0
this.armR.rz = -this.slidePos*3+0.3+Math.sin(time)*0.1
        this.armL.rz= +this.slidePos*3-0.3+Math.sin(time)*0.1
      //  this.updateParticles()
    }

    updateButton() {
        let pos = (this.button.x - this.min) / (this.max - this.min)
       this.slidePos =pos;
        pos *= 0.9


        this.eye2.sx = this.eye2.sy=this.eye1.sx = this.eye1.sy=(1-Math.pow(1- this.slidePos,6))*0.6+0.4;
        if (this.potato.model) {
            this.potato.model.material.setUniform("alpha", 1-Math.pow( smoothstep(0, 0.5, pos),8))
        }
        this.pos1 = smoothstep(0.0, 0.5, pos);

        let pos2 = smoothstep(0.25, 0.75, pos)
        let pos3 = smoothstep(0.5, 1, pos)
        this.lerpPos =  pos2;
        let pos4 = smoothstep(0.0, 0.15, pos)


        let smileS = smoothstep(0.8, 1.0, pos)
        this.smile.y = -100
        if (smileS > 0) this.smile.y = (-0.03 - 0.03 + smileS * 0.03) +0.01

        this.material.setUniform("pos1", this.pos1 * 0.5 + 0.5)
        this.material.setUniform("pos2", pos2)
        this.material.setUniform("pos3", pos3)
        this.material.setUniform("pos4", pos4)
    }

    destroy() {
        super.destroy()
    //    this.flowerTexture.destroy()
        SoundHandler.killBackgroundSounds()

    }


    private makeFlowers() {
    if(this.flowerModel){
        this.flowerModel.material.setTexture("colorTexture",this.flowerTexture)
       GameModel.gameRenderer.postLightModelRenderer.addModel( this.flowerModel)
        return;
    }
        this.flowerModel =new Model(GameModel.renderer,"flower")
        this.flowerModel.material =new FlowerMaterial(GameModel.renderer,"flowerMat")
        this.flowerModel.mesh =new Plane(GameModel.renderer,1,1,1,1,false)
        GameModel.gameRenderer.postLightModelRenderer.addModel( this.flowerModel)
        this.flowerModel.material.setTexture("colorTexture",this.flowerTexture)
    }

    private makeParticles() {
        return;
        this.particles=[]
        for(let i=0;i<this.numParticles;i++){
            let p =new FlowerParticle()
            this.particles.push(p)
        }
        this.flowerModel.numInstances =this.numParticles;
        this.flowerModel.z =-0.2
        this.particles.sort((a,b)=>{

            if(a.position.z>b.position.z)return 1;
            return -1

        })
    }

    private updateParticles() {
        let delta =Timer.delta


        for(let i=0;i<this.numParticles;i++){

            let  p= this.particles[i]
            p.update( delta,this.slidePos)
            this.posArr[i*3] =p.position.x
            this.posArr[i*3+1] =p.position.y
            this.posArr[i*3+2] =p.position.z

            this.dataArr[i*2] =p.rotation;
            this.dataArr[i*2+1] =p.type;

        }
        this.flowerModel.material.setUniform("progress", this.slidePos)
        this.flowerModel.createBuffer(this.posArr,"instancePos")
        this.flowerModel.createBuffer(this.dataArr,"instanceData")

    }
}
