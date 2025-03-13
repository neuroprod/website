import GameModel from "../../../GameModel.ts";
import Model from "../../../../lib/model/Model.ts";
import GBufferMaterial from "../../../../render/GBuffer/GBufferMaterial.ts";
import Box from "../../../../lib/mesh/geometry/Box.ts";
import Path from "../../../../lib/path/Path.ts";
import {Vector2, Vector3} from "@math.gl/core";
import ExtrudeMesh from "../../../../modelMaker/ExtrudeMesh.ts";
import {MeshType} from "../../../../data/ProjectMesh.ts";
import Bezier from "../../../../lib/path/Bezier.ts";
import DripBezier from "./DripBezier.ts";

export default class Drip{
     model: Model;


    baseWith =0.7

    dropWith =0.2

    dropHeight =2
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



    private b1:DripBezier;
    private b2:DripBezier;
    private b3:DripBezier;


    private bezierSubs=10
    private points:Array<Vector2>=[]
    private mesh: ExtrudeMesh;
    constructor() {

        this.mesh = new ExtrudeMesh(GameModel.renderer,"extrudeMesh")
        this.model = new Model(GameModel.renderer,"drip")
        this.model.material =new GBufferMaterial(GameModel.renderer,"gbufferMat")
        this.model.mesh  =this.mesh
        this.model.setScaler(0.1)
        this.model.rz =Math.PI


        this.b1= new DripBezier(this.p1,this.p1c2,this.p2c1,this.p2)
        this.b2= new DripBezier(this.p2,this.p2c2,this.p3c1,this.p3)
        this.b3= new DripBezier(this.p3,this.p3c2,this.p4c1,this.p4)

        for(let i =0 ;i<this.bezierSubs*3;i++){
            this.points.push(new Vector2())
        }
        this.points.push(new Vector2())
       //

      //  this.setPoints()
        // this.mesh.setExtrusion(this.points,MeshType.EXTRUSION,0.1,this.zero)


    }


    private setPoints() {

        let dropStartIn = Math.min( this.baseWith*1.2,this.dropHeight);
        this.p1.set(this.baseWith,0)
        this.p1c2.set(this.baseWith-dropStartIn,0)
        this.p2c1.set(this.dropWith, this.dropHeight*0.7)
        this.p2.set(this.dropWith,  this.dropHeight)

        let dropDHeight =Math.min(this.dropHeight/2, this.dropWith*1.3)
        this.p2c2.set(this.dropWith,  this.dropHeight+dropDHeight)
        this.p3c1.set(-this.dropWith, this.dropHeight+dropDHeight)

        this.p3.set(-this.dropWith, this.dropHeight)
        this.p3c2.set(-this.dropWith, this.dropHeight*0.7)
        this.p4c1.set(-this.baseWith+dropStartIn,0)
        this.p4.set(-this.baseWith,  0)
        let count =0

        for(let i=0;i<this.bezierSubs;i++){
            this.b1.getTime(this.points[count],i/this.bezierSubs)
            count++
        }
      for(let i=0;i<this.bezierSubs;i++){
            this.b2.getTime(this.points[count],i/this.bezierSubs)
            count++
        }
       for(let i=0;i<this.bezierSubs+1;i++){
            this.b3.getTime(this.points[count],i/this.bezierSubs)
            count++
        }

    }

    update() {
        this.setPoints()

        this.mesh.setExtrusion(this.points,MeshType.EXTRUSION,0.5,this.zero)
    }
}
