import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Matrix4, Vector2, Vector3} from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import Mesh from "../../../lib/mesh/Mesh.ts";
import LineMaterial from "./LineMaterial.ts";
import SoundHandler from "../../SoundHandler.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import RossMaterial from "./RossMaterial.ts";
import LevelHandler from "../LevelHandler.ts";
import TextMesh from "../../../lib/twoD/TextMesh.ts";

class LineParticle{

    private position: Vector3 =new Vector3();

    private rotationY=Math.random()-0.5;
    private rotationX=Math.random()*7;
    private m:Matrix4 =new Matrix4()
    constructor() {
        this.position.x =Math.random()*5
    }
    getMatrix(){
        this.m.identity()
        this.m.rotateY( this.rotationY)
        this.m.rotateZ( this.rotationX)

        this.m.translate(this.position)
        return this.m;
    }
    update(delta:number){
       this.position.x+=delta;
       if(this.position.x >5){
           this.position.x=0
      this.rotationY=(Math.random()-0.5)*100;
           this.rotationX=Math.random()*100;
       }

    }

}
export default class Friends extends NavigationLevel{


    private rossTexture!: TextureLoader;
    private rossModel!: Model;
    private lineModel!: Model;
    private particles:Array<LineParticle> =[]
    private rossRot: number=-1;
    private textMesh: TextMesh;

    constructor() {
        super();
        for(let l = 0;l<10;l++){
            let p = new LineParticle()
            this.particles.push(p)
        }
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("friends")).then(() => {
            LoadHandler.stopLoading()

        });




        this.rossTexture = new TextureLoader(GameModel.renderer,"ross.jpg")

        LoadHandler.startLoading()
        this.rossTexture.onComplete =()=>{
            LoadHandler.stopLoading()
        }



        SoundHandler.setBackgroundSounds(["sound/looperman-l-2470216-0396423-extraterrestrial-alarm.mp3"])
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))
        GameModel.gameCamera.setMouseInput(0.001)
        GameModel.gameRenderer.setLevelType("website")

let tso  =SceneHandler.getSceneObject("text1")
        if(tso.model){
            this.textMesh =tso.model.mesh as TextMesh;
           // this.textMesh.setText()
        }


        this.rossModel = new Model(GameModel.renderer,"ross")
        this.rossModel.mesh =GameModel.glft.meshes[0]
        this.rossModel.material =new RossMaterial(GameModel.renderer,"ross")
        this.rossModel.material.setTexture("colorTexture",  this.rossTexture)
        this.rossModel.material.setTexture("specular",  GameModel.renderer.getTexture("je_gray_02_1k.hdr"))
        GameModel.gameRenderer.postLightModelRenderer.addModel(this.rossModel)
        this.rossModel.rx =Math.PI/2
        this.rossModel.setPosition(0,0,-2)
        this.rossModel.setScaler(0.8)
        this.rossModel.ry=-1

        this.lineModel =new Model(GameModel.renderer,"lines");
        this.lineModel.material =new LineMaterial(GameModel.renderer,"line")
        this.lineModel.mesh =this.getLineMesh()
        GameModel.gameRenderer.postLightModelRenderer.addModel(this.lineModel)
        this.lineModel.setPosition(0,0.3,-2)
let t =[0.8,Math.random()*Math.PI*2,Math.random()*Math.PI*2]
       let d = new Float32Array(t)
        this.lineModel.createBuffer(d,"aTrans")
        this.rossRot =Math.PI*2-1;

    }

    public update() {
        super.update()

        this.rossRot += Timer.delta*0.5;


        this.rossModel.ry =this.rossRot

        this.lineModel.material.setUniform("time",Timer.time*0.2)


        this.lineModel.numInstances =this.particles.length;
        let matrices0:Array<number> =[];
        let matrices1:Array<number> =[];
        let matrices2:Array<number> =[];
        let matrices3:Array<number> =[];

        for(let p of this.particles) {
            p.update(Timer.delta)
            let m = p.getMatrix();
            matrices0 =matrices0.concat(m.getColumn(0));
            matrices1 =matrices1.concat(m.getColumn(1));
            matrices2 =matrices2.concat(m.getColumn(2));
            matrices3 =matrices3.concat(m.getColumn(3));
        }


        this.lineModel.createBuffer(new Float32Array(matrices0),"instancesMatrix0");
        this.lineModel.createBuffer(new Float32Array(matrices1),"instancesMatrix1");
        this.lineModel.createBuffer(new Float32Array(matrices2),"instancesMatrix2");
        this.lineModel.createBuffer(new Float32Array(matrices3),"instancesMatrix3");




    }

    destroy() {
        super.destroy()

        GameModel.gameCamera.setMouseInput(0.04)
        this.rossTexture.destroy()
        SoundHandler.killBackgroundSounds()




    }


    private getLineMesh() {

        let m =new Mesh(GameModel.renderer)

        let widthSegments =3;
        let heightSegments =20;


        let index = 0;
        const grid = [];

        const vertex = new Vector3();
        const normal = new Vector3();

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // generate vertices, normals and uvs
        for (let iy = 0; iy <= heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / heightSegments;

            // special case for the poles
            let uOffset = 0;

            for (let ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;

                vertex.x =v ;
                vertex.y = Math.cos( u*Math.PI*2 );
                vertex.z = Math.sin( u*Math.PI*2) ;


                vertices.push(vertex.x, vertex.y, vertex.z);
                vertex.y =0
                normal.copy(vertex).normalize();
                normals.push(normal.x, normal.y, normal.z);

                uvs.push(0, 0);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        // indices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];
                 indices.push(a, d, b);
                indices.push(b, d, c);
            }
        }

        m.setIndices(new Uint16Array(indices));
        m.setPositions(new Float32Array(vertices));
        m.setNormals(new Float32Array(normals));
        m.setUV0(new Float32Array(uvs));
        return m;
    }
}
