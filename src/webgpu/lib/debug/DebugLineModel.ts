import Model from "../model/Model.ts";
import Renderer from "../Renderer.ts";
import Mesh from "../mesh/Mesh.ts";
import DebugLineMaterial from "./DebugLineMaterial.ts";
import { Matrix4, Vector3 } from "@math.gl/core";
import ColorV from "../ColorV.ts";

export default class DebugLineModel extends Model {

    private positions: Array<number> = [];
    private colors: Array<number> = [];
    private indices: Array<number> = [];
    private indexCount: number = 0;
    public autoClear = false;


    constructor(renderer: Renderer) {
        super(renderer, "DebugLineModel");
        this.mesh = new Mesh(this.renderer, "DebugLineMesh")
        this.material = new DebugLineMaterial(this.renderer, "DebugLineMaterial")
    }

    drawLine(point1: Vector3, point2: Vector3, color: ColorV) {
        this.positions = this.positions.concat(point1)
        this.positions = this.positions.concat(point2)
        this.colors = this.colors.concat(color)
        this.colors = this.colors.concat(color)
        this.indices.push(this.indexCount++, this.indexCount++)

    }

    drawBezier(p1: Vector3, c1: Vector3, c2: Vector3, p2: Vector3, divisions: number, color: ColorV) {

        let tempPos = [p1]

        for (let i = 1; i < divisions; i++) {
            let t = i / divisions;
            tempPos.push(this.getTime(p1, c1, c2, p2, t));
        }

        tempPos.push(p2)

        for (let p = 0; p < tempPos.length - 1; p++) {
            this.positions = this.positions.concat(tempPos[p])
            this.positions = this.positions.concat(tempPos[p + 1])
            this.colors = this.colors.concat(color)
            this.colors = this.colors.concat(color)
            this.indices.push(this.indexCount++, this.indexCount++)
        }



    }


    public getTime(p1: Vector3, c1: Vector3, c2: Vector3, p2: Vector3, t: number) {

        const inverseFactor = 1 - t;
        const inverseFactorTimesTwo = inverseFactor * inverseFactor;
        const factorTimes2 = t * t;

        const factor1 = inverseFactorTimesTwo * inverseFactor;
        const factor2 = 3 * t * inverseFactorTimesTwo;
        const factor3 = 3 * factorTimes2 * inverseFactor;
        const factor4 = factorTimes2 * t;
        let p = new Vector3();
        p.x = p1.x * factor1 + c1.x * factor2 + c2.x * factor3 + p2.x * factor4;
        p.y = p1.y * factor1 + c1.y * factor2 + c2.y * factor3 + p2.y * factor4;
        p.z = p1.z * factor1 + c1.z * factor2 + c2.z * factor3 + p2.z * factor4;
        return p;
    }





    update() {
        if (!this.positions.length) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.mesh.setPositions(new Float32Array(this.positions))
        this.mesh.setColor0(new Float32Array(this.colors))
        this.mesh.setIndices(new Uint16Array(this.indices))
        super.update();
        if (this.autoClear) {
            this.positions = []
            this.colors = []
            this.indices = []
            this.indexCount = 0;
        }
    }

}
