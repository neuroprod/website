
import SceneHandler from "../../../data/SceneHandler.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Timer from "../../../lib/Timer.ts";
import gsap from "gsap";
class Tear {
    private tear: SceneObject3D;

    private startY: number;
    private tl: gsap.core.Timeline;
    constructor(tear: SceneObject3D) {
        this.tear = tear;
        this.startY = this.tear.posEditor.y
        this.tear.setScaler(1)
        this.tl = gsap.timeline({ repeat: -1, delay: Math.random() * 40 })
        this.tl.to(this.tear, { sx: 1, sy: 1, sz: 1, duration: 2 })
        this.tl.to(this.tear, { y: this.startY - 0.05, duration: 2, ease: "power2.inOut" })
        this.tl.to(this.tear, { y: this.startY - 0.4, duration: 0.7, ease: "power2.in" })
        let time = Math.random() + 5
        this.tl.set(this.tear, { y: this.startY, sx: 0, sy: 0, sz: 0 }, time)
        this.tl.to(this.tear, { sx: 1, sy: 1, sz: 1, duration: 0.7, ease: "power2.in" }, time + 1)
    }



    public destroy() {
        this.tl.clear()
    }
}
export default class Strawberry {

    tears: Array<Tear> = []
    constructor() {
    }
    init() {
        this.tears = []
        let th = SceneHandler.getSceneObject("tearHolder")

        for (let s of th.children) {
            let t = new Tear(s as SceneObject3D)
            this.tears.push(t)
        }

    }
    update() {
        let delta = Timer.delta;

    }
    destroy() {
        for (let t of this.tears) {
            t.destroy()
        }
        this.tears = []
    }

}
