import SceneObject3D from "../../../data/SceneObject3D.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import {lerp, Vector3} from "@math.gl/core";
import {NumericArray} from "@math.gl/types";
import {createNoise2D, NoiseFunction2D} from "../../../lib/SimplexNoise.ts";
import Timer from "../../../lib/Timer.ts";

export default class LinkedItem{
    parent!: LinkedItem;
    child!: LinkedItem;
    co!: SceneObject3D;
    private name: string;
    private dirVec!: Vector3;
    private speed:Vector3 =new Vector3(0.1,0,0)
    private count =0
    noise: NoiseFunction2D;
    constructor(name:string,noise:NoiseFunction2D) {
        this.name =name;
        this.co =sceneHandler.getSceneObject(name)
this.noise = noise;

    }

    init() {
        if(this.parent){

            let pW = this.parent.co.getWorldPos().clone()
            let w = this.co.getWorldPos().clone()
            this.dirVec = w.subtract(pW)

            console.log( this.dirVec,this.name)
        }
    }
    set(){

        if(this.parent){

            this.co.setPositionV(this.parent.co.getWorldPos().add(  this.dirVec))

        }
        if(this.child)this.child.set()

    }

    update() {
        if(this.parent){
        let posTarget = this.parent.co.getWorldPos().add(  this.dirVec)
        let pos = this.co.getPosition().clone();
            posTarget.subtract(pos);

            if(this.count <2){
                posTarget.scale(0.2)

            }else{
                posTarget.scale(0.05)
            }

            this.count++
            this.speed.add(posTarget)
            this.speed.scale(0.8)
        this.co.setPositionV(this.co.getPosition().clone().add(this.speed));}
        this.speed.y+=this.noise(this.co.getPosition().x+2,Timer.time*0.1)*0.0003
        this.speed.x+=this.noise(Timer.time*0.1,this.co.getPosition().x+2)*0.0004
        if(this.child)this.child.update()
    }
}
