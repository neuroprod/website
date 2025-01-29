import {Vector3} from "@math.gl/core";
import Object3D from "../../../lib/model/Object3D.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import PathBezier from "./PathBezier.ts";

export default class WebsitePath{

    private cameraPoints:Array<Vector3>=[]
    private lookatPoints:Array<Vector3>=[]
    private cameraBeziers:Array<PathBezier>=[]
    private lookatBeziers:Array<PathBezier>=[]

    private numItems: number;
    private numItemsPlus: number;
    camPosition: Vector3;
     camLookAt: Vector3;

    constructor(numItems: number, children: Array<Object3D>) {

        this.numItems =numItems;
        this.numItemsPlus = this.numItems+1;

        for(let i=0;i<children.length;i++){
            let c =children[i]
            this.lookatPoints.push( c.getWorldPos().clone())
            this.cameraPoints.push( c.getWorldPos(new Vector3(0,0,1)).clone())
        }
        for(let i=0;i<=children.length;i++){
            let lookBezier = new PathBezier( this.lookatPoints[this.getIndex(i-1)].clone(),this.lookatPoints[this.getIndex(i)].clone(),this.lookatPoints[this.getIndex(i+1)].clone(),this.lookatPoints[this.getIndex(i+2)].clone())
            let camBezier = new PathBezier(  this.cameraPoints[this.getIndex(i-1)].clone(),  this.cameraPoints[this.getIndex(i)].clone(),  this.cameraPoints[this.getIndex(i+1)].clone(),  this.cameraPoints[this.getIndex(i+2)].clone())
            this.lookatBeziers.push(lookBezier);
            this.cameraBeziers.push(camBezier);
        }



        this.camPosition = this.cameraPoints[0].clone()

        this.camLookAt = this.lookatPoints[0].clone()
    }
    getIndex(i:number){

        if(i<0)i+=this.numItems
        if(i>this.numItems-1)i-=this.numItems

        return i;
    }
    public update(progress:number){
        let p= progress*(  this.numItems);
        let p1 = Math.floor(p);
        let f = p-p1;
        if (p1 > this.numItems) p1 = 0


       this.cameraBeziers[p1].getTime(this.camPosition,f);
        this.lookatBeziers[p1].getTime(this.camLookAt,f);
       // console.log(p1,f,progress,this.camLookAt)


    }


}
