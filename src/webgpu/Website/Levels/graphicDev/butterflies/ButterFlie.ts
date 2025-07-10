import Box from "../../../../lib/mesh/geometry/Box";
import Model from "../../../../lib/model/Model";
import { createNoise4D } from "../../../../lib/SimplexNoise";
import GBufferMaterial from "../../../../render/GBuffer/GBufferMaterial";
import GameModel from "../../../GameModel";
import { createNoise3D, NoiseFunction3D } from "../../../../lib/SimplexNoise";
import { Matrix3, Matrix4, Quaternion, Vector3, Vector4 } from "@math.gl/core";
import Timer from "../../../../lib/Timer";
import ShadowDepthMaterial from "../../../../render/shadow/ShadowDepthMaterial";
import GbufferButterMaterial from "./GbufferButterMaterial";
import Mesh from "../../../../lib/mesh/Mesh";
import ButterShadowMaterial from "./ButterShadowMaterial";
export default class ButterFlie {


    model: Model;
    noise: NoiseFunction3D;


    private modelPos = new Vector3(0, 0.2, -0.2)
    private center = new Vector3(0, 0.2, -0.2)
    private modelSpeed = new Vector3(0, 0, 0.2)

    private targetQ = new Quaternion()

    private mesh!: Mesh;
    private angle2 = 0;
    private rand = Math.random() * 5
    private rand2 = Math.random() * 5
    constructor() {

        this.makeMesh()
        this.model = new Model(GameModel.renderer, "butterflie")
        this.model.mesh = this.mesh
        this.model.material = new GbufferButterMaterial(GameModel.renderer, "butterfly")
        this.model.material.setTexture("colorTexture", GameModel.renderer.getTexture("wing.png"))
        this.model.setMaterial("shadow", new ButterShadowMaterial(GameModel.renderer, "shadowdrip"))

        this.model.setScale(0.05, 0.05, 0.05);
        this.noise = createNoise3D()
        let zPos = Math.random() * 0.5 - 0.2
        if (Math.random() > 0.3) {
            zPos = -0.4 - Math.random()
        }
        if (Math.random() > 0.7) {
            zPos - 0.2
        }

        this.modelPos.z = this.center.z = zPos;
        this.modelPos.x = this.center.x = Math.random() - 0.5
        this.modelPos.x *= 10
    }
    makeMesh() {
        this.mesh = new Mesh(GameModel.renderer, "butterMesh")

        let points: Array<number> = []
        let uv: Array<number> = []
        points.push(1, 0, 1)
        uv.push(0, 0)
        points.push(1, 0, 0)
        uv.push(1, 0)
        points.push(0, 1, 1)
        uv.push(0, 1)
        points.push(0, 1, 0)
        uv.push(1, 1)

        points.push(1, 0, -1)
        uv.push(0, 0)
        points.push(1, 0, 0)
        uv.push(1, 0)
        points.push(0, 1, -1)
        uv.push(0, 1)
        points.push(0, 1, 0)
        uv.push(1, 1)

        this.mesh.setPositions(new Float32Array(points))
        this.mesh.setUV0(new Float32Array(uv))
        let indices: Array<number> = []
        indices.push(0, 1, 2)
        indices.push(1, 3, 2)
        indices.push(5, 4, 6)
        indices.push(6, 7, 5)

        this.mesh.setIndices(new Uint16Array(indices))


    }
    update() {
        let t = (Timer.time + this.rand) * (20 + this.rand2)
        let angle = Math.sin(t) * 1.5;
        let t2 = t - 0.5

        this.angle2 = Math.sin(t2) * 1.5;
        this.model.material.setUniform("angle", new Vector4(Math.cos(angle), Math.sin(angle), Math.cos(this.angle2), Math.sin(this.angle2)))
        let mat = this.model.getMaterial("shadow");
        if (mat) mat.setUniform("angle", new Vector4(Math.cos(angle), Math.sin(angle), Math.cos(this.angle2), Math.sin(this.angle2)))

        let pScale = 3;
        let nScale = 0.1;
        let vx = this.noise(this.modelPos.y * pScale, this.modelPos.z * pScale, t) * nScale
        let vy = this.noise(this.modelPos.x * pScale, this.modelPos.z * pScale, t) * nScale * 0.8
        let vz = this.noise(this.modelPos.y * pScale, this.modelPos.x * pScale, t) * nScale * 0.2
        this.modelSpeed.x += vx;
        this.modelSpeed.y += vy;
        this.modelSpeed.z += vz;

        let mp = this.modelPos.clone()

        this.modelPos.x += this.modelSpeed.x * Timer.delta;
        this.modelPos.y += this.modelSpeed.y * Timer.delta;
        this.modelPos.z += this.modelSpeed.z * Timer.delta;

        this.modelSpeed.scale(0.99)

        let dir = this.modelPos.clone()
        dir.subtract(this.center)
        dir.scale(0.001)


        this.modelPos.subtract(dir)
        if (this.modelPos.y < 0.1) this.modelPos.y = 0.1
        mp.subtract(this.modelPos)
        mp.normalize()
        let mpx = mp.x
        let mpy = mp.y
        let mpz = mp.z


        let m = new Matrix4()
        m.lookAt({ center: new Vector3(0, 0, 0), eye: mp, up: new Vector3(0, 1, 0) })

        let m2 = new Matrix3()
        m.getRotationMatrix3(m2)

        let q = new Quaternion()
        m2.invert()
        q.fromMatrix3(m2)

        this.targetQ.slerp(q, 0.05)
        this.model.setPositionV(this.modelPos)
        this.model.setRotationQ(this.targetQ)

    }

}
