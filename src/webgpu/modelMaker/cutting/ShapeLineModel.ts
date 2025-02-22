import ShapeLineMaterial from "./ShapeLineMaterial.ts";

import Model from "../../lib/model/Model.ts";
import Mesh from "../../lib/mesh/Mesh.ts";
import Renderer from "../../lib/Renderer.ts";
import Path from "../../lib/path/Path.ts";
import ColorV from "../../lib/ColorV.ts";


export default class ShapeLineModel extends Model {

    positions: Array<number> = [];

    private indices: Array<number> = [];

//#0066ff
    constructor(renderer: Renderer, label: string, colorString="#ffae00") {
        super(renderer, label);
        this.mesh = new Mesh(this.renderer, label + "m")
        this.material = new ShapeLineMaterial(this.renderer, "ShapeLineMaterial")

            this.material.setUniform("color", new ColorV().setHex(colorString))



        this.material.depthWrite = false;
        this.material.depthCompare = "always";
        this.visible = false;
    }


    setPathControlPoints(path: Path) {

        if (path.numCurves < 1) {
            this.visible = false;
            return;
        }

        this.visible = true;
        this.positions = []
        this.indices = []
        path.setMeshDataControlPoints(this.indices, this.positions)
        if (this.indices.length > 0) {

            this.visible = true;
            this.mesh.setPositions(new Float32Array(this.positions))
            this.mesh.setIndices(new Uint16Array(this.indices))
        } else {
            this.visible = false
        }
    }

    setPath(path: Path) {

        if (path.numCurves < 1) return false;

        this.visible = true;
        this.positions = []
        this.indices = []
        path.setMeshData(this.indices, this.positions)

        this.mesh.setPositions(new Float32Array(this.positions))
        this.mesh.setIndices(new Uint16Array(this.indices))
        return true
    }

    setPaths(paths: Array<Path>) {
        if (paths.length == 0) {
            this.visible = false;
            return;
        }

        this.positions = [];
        this.indices = [];
        let indexPos = 0;
        for (let path of paths) {
            let positionsTemp: Array<number> = []
            let indicesTemp: Array<number> = []
            path.setMeshData(indicesTemp, positionsTemp)
            for (let i = 0; i < indicesTemp.length; i++) {
                indicesTemp[i] += indexPos;

            }

            this.positions = this.positions.concat(positionsTemp)
            this.indices = this.indices.concat(indicesTemp)

            indexPos += positionsTemp.length / 3;

        }

        if (indexPos == 0) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.mesh.setPositions(new Float32Array(this.positions))
        this.mesh.setIndices(new Uint16Array(this.indices))


    }
}
