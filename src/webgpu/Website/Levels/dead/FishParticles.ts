import { Vector3, Matrix4 } from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D";
import Model from "../../../lib/model/Model";
import GBufferCloudMaterial from "../../../render/GBuffer/GBufferCloudMaterial";
import GameModel from "../../GameModel";
import ProjectData from "../../../data/ProjectData";
import Timer from "../../../lib/Timer";
import GBufferFishStickMaterial from "../../../render/GBuffer/GbufferFishStickMaterial";
import MathUtils from "../../../lib/MathUtils";
class FishParticle {

    position: Vector3 = new Vector3();
   
    time = 0;
    canDelete = false;
    speed: number;
    startZ = 0
    startY = 0
    constructor() {
    
        this.position = new Vector3(MathUtils.fastRandom() * 3+1 , MathUtils.fastRandom()-0.5, 0);
        this.time = MathUtils.fastRandom() * 100
        this.speed = 0.5 + MathUtils.fastRandom() * 0.5;
        this.speed *= 0.1;
         this.startY = (MathUtils.fastRandom() - 0.5) * 2
              this.startZ = -(MathUtils.fastRandom()) * 2 + 0.5
    }

    update(delta: number) {
        this.position.x -= this.speed * delta
        this.time += delta
        this.position.z = this.startZ + Math.sin(this.time * 1) * 0.03
        this.position.y = this.startY + Math.sin(this.time * 0.4) * 0.05
        if (this.position.x < -3) {
            this.position.x += 6
            this.position.y = (MathUtils.fastRandom() - 0.5) * 3
            this.startZ = -(MathUtils.fastRandom()) * 2 + 0.5
            this.startY = (MathUtils.fastRandom() - 0.5) * 2
        }
    }



}
export default class FishParicles {
    particlesModel: Model;

    private particles: Array<FishParticle> = []
    destroy() {
        console.log("destroy Particles?")
    }


    constructor(obj: SceneObject3D) {

        let model = obj.children[0] as Model;
        let mesh = model.mesh

        let renderer = GameModel.renderer;
        this.particlesModel = new Model(renderer, "particlesModel")

        this.particlesModel.mesh = mesh

        this.particlesModel.material = new GBufferFishStickMaterial(renderer, "cloudMaterial")

        let charProj = ProjectData.projectsNameMap.get("seaFishStick")
        if (charProj) {
            this.particlesModel.material.setTexture("colorTexture", charProj.getBaseTexture())
        }
        this.particlesModel.needCulling = false;
        this.particlesModel.visible = true;
        for (let i = 0; i <20; i++) {
            let fish = new FishParticle();
            if(i%5==0){ 
fish.startZ =0.1+MathUtils.fastRandom()*0.15
            }else   
            {
fish.startZ =-0.2+MathUtils.fastRandom()*-1.7

            }
            this.particles.push(fish)


        }

    }
    public update() {



        this.particlesModel.visible = true;
        this.particlesModel.numInstances = this.particles.length;
        let positions: Array<number> = [];
   let delta = Timer.delta ;
        for (let p of this.particles) {
            p.update(delta);
       
           positions = positions.concat(p.position);
         
        }


        this.particlesModel.createBuffer(new Float32Array(positions), "position");
this.particlesModel.material.setUniform("time",Timer.time)
    }


}