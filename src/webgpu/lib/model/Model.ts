import Renderer from "../Renderer";


import Object3D from "./Object3D.ts";
import Material from "../material/Material.ts";
import Mesh from "../mesh/Mesh.ts";
import ModelTransform from "./ModelTransform.ts";
import { Vector3 } from "@math.gl/core";


export default class Model extends Object3D {

    material!: Material;
    mesh!: Mesh
    public markedDelete = false;
    public modelTransform: ModelTransform;
    public visible: boolean = true;

    private buffers: Array<GPUBuffer> = [];
    private bufferMap: Map<string, GPUBuffer> = new Map<string, GPUBuffer>();
    numInstances: number = 1;

    private materialMap: Map<string, Material> = new Map<string, Material>();
    needCulling: boolean = true;
    transparent: boolean = false
    camDistSquared: number = 0;
    zDistance: number = 0;
    min: Vector3 = new Vector3()
    max: Vector3 = new Vector3()
    center: Vector3 = new Vector3()
    radius: number = 1;
    static: boolean = false;
    frustumCull: boolean = false;


    constructor(renderer: Renderer, label: string) {
        super(renderer, label);
        this.modelTransform = new ModelTransform(renderer)
        this.renderer.addModel(this);
    }

    setMaterial(name: string, mat: Material) {

        this.materialMap.set(name, mat)
    }
    getMaterial(name: string) {
        return this.materialMap.get(name);

    }

    public update() {
        if (!this._drawDirty) return;
        if (!this.visible) return;

        this._drawDirty = false;



        this.modelTransform.setWorldMatrix(this.worldMatrix);
        if (!this.static && this.needCulling) {
            if (!this.mesh) return;
            if (!this.mesh.positions) return;
            this.min.from(this.mesh.min)
            this.max.from(this.mesh.max)
            this.min.transform(this.worldMatrix)
            this.max.transform(this.worldMatrix)
            this.center.from(this.min)
            this.center.add(this.max)
            this.center.scale(0.5);

            this.radius = this.center.distance(this.max);
        }
    }

    public setStatic() {
        if (this.mesh) {
            this.min.from(this.mesh.min)
            this.max.from(this.mesh.max)
            this.min.transform(this.worldMatrix)
            this.max.transform(this.worldMatrix)
            this.center.from(this.min)
            this.center.add(this.max)
            this.center.scale(0.5);

            this.radius = this.center.distance(this.max);
        }
        this.static = true;
    }

    createBuffer(data: Float32Array, name: string) {

        let bufferOld = this.getBufferByName(name);
        if (bufferOld) {
            let i = this.buffers.indexOf(bufferOld)
            this.buffers.splice(i, 1);
            bufferOld.destroy()
        }

        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        const dst = new Float32Array(buffer.getMappedRange());
        dst.set(data);

        buffer.unmap();
        buffer.label = "vertexBuffer_" + this.label + "_" + name;

        this.buffers.push(buffer);
        this.bufferMap.set(name, buffer);
    }


    getBufferByName(name: string) {
        return this.bufferMap.get(name);
    }

    clone() {

    }
    public destroy() {
        for (let b of this.buffers) {
            b.destroy()
        }
        this.modelTransform.destroy()
        this.renderer.removeModel(this);
        this.markedDelete = true;


    }

    setCamDistance(cam: Vector3) {
        this.camDistSquared = this.getWorldPos().distanceSquared(cam)
    }
    setZDistance() {
        this.zDistance = this.getWorldPos().z
    }
}
