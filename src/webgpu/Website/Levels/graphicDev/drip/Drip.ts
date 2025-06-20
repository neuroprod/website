import GameModel from "../../../GameModel.ts";
import Model from "../../../../lib/model/Model.ts";
import GBufferMaterial from "../../../../render/GBuffer/GBufferMaterial.ts";
import {Vector2, Vector3} from "@math.gl/core";
import ExtrudeMesh from "../../../../modelMaker/ExtrudeMesh.ts";
import {MeshType} from "../../../../data/ProjectMesh.ts";
import DripBezier from "./DripBezier.ts";
import UI from "../../../../lib/UI/UI.ts";
import Timer from "../../../../lib/Timer.ts";
import gsap from "gsap";
import GBufferColorMaterial from "../../../../render/GBuffer/GbufferColorMaterial.ts";
import ShadowDepthMaterial from "../../../../render/shadow/ShadowDepthMaterial.ts";
import SoundHandler from "../../../SoundHandler.ts";
export default class Drip {
    model: Model;
    modelDrop: Model;

    baseWith = 0.7

    dropWith = 0.2
    height = 0.2
    dropHeight = 2
    public sideOffset = 0
    public heightOffset = 1
    private zero = new Vector3()
    private p1 = new Vector2()
    private p1c2 = new Vector2()
    private p2c1 = new Vector2()
    private p2 = new Vector2()
    private p2c2 = new Vector2()
    private p3c1 = new Vector2()
    private p3 = new Vector2()
    private p3c2 = new Vector2()
    private p4c1 = new Vector2()
    private p4 = new Vector2()
    private dropDir = new Vector2()
    private b1: DripBezier;
    private b2: DripBezier;
    private b3: DripBezier;
    private bezierSubs = 10
    private points: Array<Vector2> = []
    private mesh: ExtrudeMesh;
    private nextTime: number;
    private tl!: gsap.core.Timeline;
    private isDripping: boolean =false;
    private meshDrop: ExtrudeMesh;
    private dropSpeed: number=1;
private isDropping=false;

    constructor() {

        this.mesh = new ExtrudeMesh(GameModel.renderer, "extrudeMesh")
        this.model = new Model(GameModel.renderer, "drip")
        this.model.material = new GBufferColorMaterial(GameModel.renderer, "gbufferMat")
        this.model.setMaterial("shadow",new ShadowDepthMaterial(GameModel.renderer,"shadowdrip"))
        this.model.mesh = this.mesh
        this.model.rz =Math.PI

        this.meshDrop = new ExtrudeMesh(GameModel.renderer, "extrudeMesh")
        this.modelDrop = new Model(GameModel.renderer, "dripdrip")
        this.modelDrop.material =this.model.material
        this.modelDrop.setMaterial("shadow",new ShadowDepthMaterial(GameModel.renderer,"shadowdrip"))
        this.modelDrop.mesh = this.meshDrop
        this.modelDrop.y =100
        this.model.addChild(this.modelDrop)

        let steps =10
        let angle = Math.PI*2/steps
        let circlePoints:Array<Vector2> =[]
        for(let i=0;i<steps;i++){
            circlePoints.push(new Vector2(Math.sin(angle*i)* this.dropWith,Math.cos(angle*i)* this.dropWith))
        }
        this.meshDrop.setExtrusion(circlePoints, MeshType.EXTRUSION, 0.6, this.zero)






        this.b1 = new DripBezier(this.p1, this.p1c2, this.p2c1, this.p2)
        this.b2 = new DripBezier(this.p2, this.p2c2, this.p3c1, this.p3)
        this.b3 = new DripBezier(this.p3, this.p3c2, this.p4c1, this.p4)
        this.points.push(new Vector2())
        for (let i = 0; i < this.bezierSubs * 3; i++) {
            this.points.push(new Vector2())
        }
        this.points.push(new Vector2())
        this.points.push(new Vector2())
        //

        //  this.setPoints()
        // this.mesh.setExtrusion(this.points,MeshType.EXTRUSION,0.1,this.zero)

        this.nextTime =Math.random()*2
    }

    update() {

        if(this.nextTime<0){
            this.startDrip();
            this.nextTime =Math.random()*2+2
        }
        if(  this.isDripping){
            this.setDrip();



        }else{
            this.nextTime-=Timer.delta
        }
        if(  this.isDropping){

            this.modelDrop.y+=this.dropSpeed*Timer.delta
            this.dropSpeed+=15*Timer.delta;
            let y =this.modelDrop.getWorldPos().y

            if(y<0){
                this.isDropping =false
                SoundHandler.playDrip(this.model.x)

            }
        }
    }
    public setDrip() {
        this.setPoints()
        this.mesh.setExtrusion(this.points, MeshType.EXTRUSION, 0.4, this.zero)
    }
    private startDrip() {
        if(this.tl)this.tl.clear()
            this.tl = gsap.timeline()
        this.dropSpeed=10;
        this.isDripping = true;
        let dripHeight  =2+Math.pow(Math.random(),2.0)*2
        let dripDur = dripHeight*2+Math.random();
        this.tl.to(this,{height:dripHeight,duration:dripDur,ease:"power2.in"},0)
        this.tl.set(this,{height:1},dripDur)

        let start =dripHeight * this.baseWith
        this.tl.set(this.modelDrop,{y:start},dripDur)
        this.tl.set(this,{isDropping:true})
        this.tl.to(this,{height:0.2,ease:"elastic.out",duration:1},dripDur)
        this.tl.set(this,{isDripping:false},dripDur+1)
    }


    onUI() {
        UI.LFloat(this.model, "x", "Position X")
        UI.LFloat(this.model, "y", "Y")
        UI.LFloat(this.model, "z", "Z")
        UI.LFloat(this, "baseWith", "baseWith")
        UI.LFloat(this,"sideOffset","sideOffset")
    }

    private setPoints() {

        let angle = Math.PI / 2 * this.height
        if (angle > Math.PI / 2) angle = Math.PI / 2
        this.dropDir.set(Math.cos(angle), Math.sin(angle))

        this.dropHeight = this.height * this.baseWith
        let dropStartIn = Math.min(this.baseWith * 1.2, this.dropHeight);
        this.p1.set(this.baseWith, this.sideOffset)
        this.p1c2.set(this.baseWith - dropStartIn, this.sideOffset)
        this.p2c1.set(this.dropWith + this.dropDir.x * 0.3, this.dropHeight - this.dropDir.y * 0.3)
        this.p2.set(this.dropWith, this.dropHeight)

        let dropDHeight = Math.min(this.dropHeight / 2, this.dropWith * 1.3)
        this.p2c2.set(this.dropWith - this.dropDir.x * dropDHeight, this.dropHeight + this.dropDir.y * dropDHeight)
        this.p3c1.set(-this.dropWith + this.dropDir.x * dropDHeight, this.dropHeight + this.dropDir.y * dropDHeight)

        this.p3.set(-this.dropWith, this.dropHeight)
        this.p3c2.set(-this.dropWith - this.dropDir.x * 0.3, this.dropHeight - this.dropDir.y * 0.3)
        this.p4c1.set(-this.baseWith + dropStartIn, 0)
        this.p4.set(-this.baseWith, 0)
        let count = 0


        this.points[count].set(this.baseWith, -this.heightOffset)
        count++

        for (let i = 0; i < this.bezierSubs; i++) {
            this.b1.getTime(this.points[count], i / this.bezierSubs)
            count++
        }
        for (let i = 0; i < this.bezierSubs; i++) {
            this.b2.getTime(this.points[count], i / this.bezierSubs)
            count++
        }
        for (let i = 0; i < this.bezierSubs + 1; i++) {
            this.b3.getTime(this.points[count], i / this.bezierSubs)
            count++
        }
        this.points[count].set(-this.baseWith, -this.heightOffset)
    }


}
