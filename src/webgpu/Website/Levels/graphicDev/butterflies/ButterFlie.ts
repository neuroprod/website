import Box from "../../../../lib/mesh/geometry/Box";
import Model from "../../../../lib/model/Model";
import { createNoise4D } from "../../../../lib/SimplexNoise";
import GBufferMaterial from "../../../../render/GBuffer/GBufferMaterial";
import GameModel from "../../../GameModel";
import { createNoise3D, NoiseFunction3D } from "../../../../lib/SimplexNoise";
import { Matrix3, Matrix4, Quaternion, Vector3 } from "@math.gl/core";
import Timer from "../../../../lib/Timer";
import ShadowDepthMaterial from "../../../../render/shadow/ShadowDepthMaterial";
export default class ButterFlie {


    model: Model;
    noise: NoiseFunction3D;


    private modelPos = new Vector3(0, 0.2, -0.2)
    private center = new Vector3(0, 0.2, -0.2)
    private modelSpeed = new Vector3(0, 0, 0.2)

    private targetQ = new Quaternion()
    constructor() {

        this.model = new Model(GameModel.renderer, "butterflie")
        this.model.mesh = new Box(GameModel.renderer, { width: 0.5, height: 0.05, depth: 0.5 })
        this.model.material = new GBufferMaterial(GameModel.renderer, "butterfly")

        this.model.setMaterial("shadow", new ShadowDepthMaterial(GameModel.renderer, "shadowdrip"))

        this.model.setScale(0.1, 0.1, 0.1)
        this.noise = createNoise3D()
        let zPos = -0.2
        if (Math.random() > 0.3) {
            zPos = -0.4 - Math.random()
        }

        this.modelPos.z = this.center.z = zPos;
        this.modelPos.x = this.center.x = Math.random() - 0.5
        this.modelPos.x *= 10
    }
    update() {
        let t = Timer.time
        let pScale = 6;
        let nScale = 0.02;
        let vx = this.noise(this.modelPos.y * pScale, this.modelPos.z * pScale, t) * nScale
        let vy = this.noise(this.modelPos.x * pScale, this.modelPos.z * pScale, t) * nScale * 0.5
        let vz = this.noise(this.modelPos.y * pScale, this.modelPos.x * pScale, t) * nScale * 0.1
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
        dir.scale(0.003)


        this.modelPos.subtract(dir)
        if (this.modelPos.y < 0.1) this.modelPos.y = 0.1
        mp.subtract(this.modelPos)
        mp.normalize()
        let mpx = mp.x
        let mpy = mp.y
        let mpz = mp.z

        console.log(mp)
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
