import RenderPass from "../../lib/RenderPass.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";
import Renderer from "../../lib/Renderer.ts";
import Camera from "../../lib/Camera.ts";
import { Textures } from "../../data/Textures.ts";
import { LoadOp, TextureFormat } from "../../lib/WebGPUConstants.ts";
import ModelRenderer from "../../lib/model/ModelRenderer.ts";
import Model from "../../lib/model/Model.ts";
import Quad from "../../lib/mesh/geometry/Quad.ts";
import ParticleMaterial from "./ParticleMaterial.ts";
import UI from "../../lib/UI/UI.ts";

class Particle {
    x: number = 0;
    y: number = 0;

    fx: number = 0;
    fy: number = 0;
    friendCount: number = 0;
    speed: number = Math.random() * 0.1 + 0.3;

    resolve() {

        this.x += this.fx
        this.y += this.fy


        if (this.x < 0) this.x = 0.1
        if (this.y < 0) this.y = 0.1
        if (this.x >= 100) this.x = 99.99
        if (this.y >= 100) this.y = 99.99
    }
}

class Grid {
    particles: Array<Particle> = []
    numParticles: number = 0;
    maxSize: number = 0;
    x = 0;
    y = 0;

    addParticle(p: Particle) {
        if (this.numParticles == this.maxSize) {
            this.particles.push(p)
            this.numParticles++;
            this.maxSize++;
            return;
        }
        this.numParticles++;
        this.particles[this.numParticles] = p;
    }

}


export default class DripPass extends RenderPass {
    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;
    private camera: Camera;
    private modelRenderer: ModelRenderer;
    private model: Model;
    private numParticle = 1000;
    private instanceData: Float32Array;

    private particles: Array<Particle> = []
    private grids: Array<Grid> = []
    private width = 100;
    private height = 200;
    private gridSize = 10;
    private numHGrids: number = 0;
    private numVGrids: number = 0;

    private attractionDistance = 10;
    private topAttraction: number = 0.5;
    private surfaceTension: number = 0.01;
    private gravety: number = 1;

    constructor(renderer: Renderer) {
        super(renderer, "dripRenderPass");
        this.colorTarget = new RenderTexture(renderer, Textures.DRIP, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget, {
            clearValue: { r: 0, g: 0.0, b: 0.0, a: 0.0 },
            loadOp: LoadOp.Clear
        });
        this.colorAttachments = [this.colorAttachment]


        this.camera = new Camera(renderer)
        this.camera.near = -100;
        this.camera.far = 100;
        this.renderer = renderer;
        this.modelRenderer = new ModelRenderer(renderer, "overlayRenderer", this.camera)


        this.model = new Model(this.renderer, "part")
        this.model.mesh = new Quad(this.renderer)
        this.model.material = new ParticleMaterial(this.renderer, "particleMaterial")

        this.instanceData = new Float32Array(this.numParticle * 2)
        for (let i = 0; i < this.numParticle; i++) {
            let index = i * 2;
            this.instanceData[index] = Math.random() * 100
            this.instanceData[index + 1] = Math.random() * 100


            let p = new Particle();
            p.x = this.instanceData[index]
            p.y = this.instanceData[index + 1]
            this.particles.push(p)
        }
        this.model.numInstances = this.numParticle
        this.model.createBuffer(this.instanceData, "instancesData");

        this.modelRenderer.addModel(this.model)

        this.numHGrids = this.width / this.gridSize
        this.numVGrids = this.height / this.gridSize

        for (let i = 0; i < this.numVGrids; i++) {
            for (let j = 0; j < this.numHGrids; j++) {
                let g = new Grid()
                g.x = j
                g.y = i
                this.grids.push(g);


            }
        }


    }

    update() {
        this.camera.setOrtho(100 * this.renderer.ratio, 0 * this.renderer.ratio, 100, 0)
        // this.test1()


        this.assignGrid()
        this.compareFriends()


        this.setParticles()
        this.assignGrid()
        this.compareFriends()


        this.setParticles()


        this.model.createBuffer(this.instanceData, "instancesData");

    }

    getGridIndex(x: number, y: number) {
        let px = Math.floor((x / this.width) * this.numHGrids);
        let py = Math.floor((y / this.height) * this.numVGrids);

        let index = py * this.numHGrids + px;

        return index;

    }



    draw() {
        this.modelRenderer.draw(this)


    }

    unUI() {
        this.topAttraction = UI.LFloat(this, "topAttraction", "topAttraction")
        this.surfaceTension = UI.LFloat(this, "surfaceTension", "surfaceTension")
        this.gravety = UI.LFloat(this, "gravety", "gravety")
    }

    private setParticles() {
        let indexCount = 0
        let resetCount = 0
        for (let p of this.particles) {

            if (resetCount < 1) {
                if (p.y < 10) {
                    p.y = 100 - Math.random() * 1
                    p.x = Math.random() * 100
                    p.fx = 0;
                    p.fy = 0;
                    resetCount++
                }
            }
            if (p.y > 80) {

                let atr = Math.pow((p.y - 80) / 20, 2);
                p.fy += atr * this.topAttraction
            }

            p.fy -= p.speed * this.gravety
            // p.fx -= p.speed
            p.resolve()
            this.instanceData[indexCount++] = p.x
            this.instanceData[indexCount++] = p.y
            p.friendCount = 0;
            p.fx *= 0.1;
            p.fy *= 0.1;
        }

    }

    private resolveParticles(p1: Particle, p2: Particle) {
        let d1 = p1.x - p2.x

        if (Math.abs(d1) < this.attractionDistance) {

            let d2 = p1.y - p2.y
            if (Math.abs(d2) < this.attractionDistance) {
                let dist = Math.sqrt(d1 * d1 + d2 * d2)
                if (dist == 0) {
                    dist = 0.1
                    d2 = 0.1
                    d1 = 0.1
                }
                d1 /= dist;
                d2 /= dist;

                if (dist < this.attractionDistance) {
                    let distN = Math.pow(1 - (dist / this.attractionDistance), 2);


                    let of = (-distN) * this.surfaceTension
                    p1.fx += d1 * of//x
                    p1.fy += d2 * of//y


                    p2.fx -= d1 * of//x
                    p2.fy -= d2 * of//y
                    p1.friendCount++
                    p2.friendCount++
                }
                if (dist < 1) {

                    let of = (1 - dist) / 2
                    p1.fx += d1 * of//x
                    p1.fy += d2 * of//y


                    p2.fx -= d1 * of//x
                    p2.fy -= d2 * of//y


                }

            }
        }
    }

    private compareFriends() {
        for (let g of this.grids) {
            const xP = g.x;
            const yP = g.y;

            for (let i = 0; i < g.numParticles; i++) {
                let p1 = g.particles[i]
                for (let xg = xP - 1; xg <= xP + 1; xg++) {
                    if (xg < 0) continue
                    if (xg >= this.numHGrids) continue
                    for (let yg = yP - 1; yg <= yP + 1; yg++) {

                        if (yg < 0) continue
                        if (yg >= this.numVGrids) continue


                        let index = yg * this.numHGrids + xg;

                        let gComp = this.grids[index];
                        for (let j = 0; j < gComp.numParticles; j++) {
                            let p2 = gComp.particles[j]


                            if (p2 == p1) continue
                            this.resolveParticles(p1, p2)
                        }

                    }
                }

            }

        }


    }

    private assignGrid() {

        for (let g of this.grids) {

            g.numParticles = 0
        }

        for (let p of this.particles) {

            let index = this.getGridIndex(p.x, p.y)
            if (!this.grids[index]) {
                console.log(p.x, p.y)
            }
            this.grids[index].addParticle(p)

        }

    }


}
