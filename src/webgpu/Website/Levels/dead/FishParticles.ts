import { Vector3, Matrix4 } from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D";
import Model from "../../../lib/model/Model";
import GBufferCloudMaterial from "../../../render/GBuffer/GBufferCloudMaterial";
import GameModel from "../../GameModel";
import ProjectData from "../../../data/ProjectData";
import Timer from "../../../lib/Timer";
class FishParticle {

    private position: Vector3 = new Vector3();
    private positionTarget: Vector3 = new Vector3();
    private rotation: number = 0;
    private scale: Vector3 = new Vector3();
    private m: Matrix4 = new Matrix4()
    time = 0;
    canDelete = false;
    speed: number;
    startZ = 0
    startY = 0
    constructor() {
        this.speed = (Math.random() + 1) * 0.05;
        this.scale.set(0.3, 0.3, 2)
        this.startZ = -(Math.random()) * 2 + 0.3
        this.startY = (Math.random() - 0.5) * 2
        this.position = new Vector3(Math.random() * 3 + 2, 0, 0);
        this.time = Math.random() * 100
    }
    getMatrix() {
        this.m.identity()
        this.m.translate(this.position)
        this.m.rotateY(this.rotation)
        this.m.scale(this.scale)
        return this.m;
    }
    update(delta: number) {
        this.position.x -= this.speed * delta
        this.time += delta
        this.position.z = this.startZ + Math.sin(this.time * 1) * 0.03
        this.position.y = this.startY + Math.sin(this.time * 0.4) * 0.1
        if (this.position.x < -3) {
            this.position.x += 6
            this.position.y = (Math.random() - 0.5) * 3
            this.startZ = -(Math.random()) * 2 + 0.5
            this.startY = (Math.random() - 0.5) * 2
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

        this.particlesModel.material = new GBufferCloudMaterial(renderer, "cloudMaterial")
        this.particlesModel.material.depthCompare = "less-equal"
        let charProj = ProjectData.projectsNameMap.get("seaFishStick")
        if (charProj) {
            this.particlesModel.material.setTexture("colorTexture", charProj.getBaseTexture())
        }
        this.particlesModel.needCulling = false;
        this.particlesModel.visible = true;
        for (let i = 0; i < 10; i++) {
            this.particles.push(new FishParticle())

        }

    }
    public update() {



        this.particlesModel.visible = true;
        this.particlesModel.numInstances = this.particles.length;
        let matrices0: Array<number> = [];
        let matrices1: Array<number> = [];
        let matrices2: Array<number> = [];
        let matrices3: Array<number> = [];
        let delta = Timer.delta;
        for (let p of this.particles) {
            p.update(delta);
            let m = p.getMatrix()
            matrices0 = matrices0.concat(m.getColumn(0));
            matrices1 = matrices1.concat(m.getColumn(1));
            matrices2 = matrices2.concat(m.getColumn(2));
            matrices3 = matrices3.concat(m.getColumn(3));
        }


        this.particlesModel.createBuffer(new Float32Array(matrices0), "instancesMatrix0");
        this.particlesModel.createBuffer(new Float32Array(matrices1), "instancesMatrix1");
        this.particlesModel.createBuffer(new Float32Array(matrices2), "instancesMatrix2");
        this.particlesModel.createBuffer(new Float32Array(matrices3), "instancesMatrix3");


    }


}