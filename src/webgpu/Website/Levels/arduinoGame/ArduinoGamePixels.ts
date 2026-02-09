import PixelObject from "./PixelObject.ts";
import GameModel from "../../GameModel.ts";
import { Textures } from "../../../data/Textures.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Model from "../../../lib/model/Model.ts";
import Object3D from "../../../lib/model/Object3D.ts";

import gsap from "gsap";
import Timer from "../../../lib/Timer.ts";
import UI from "../../../lib/UI/UI.ts";
export default class ArduinoGamePixels {


    private title!: Model;
    private ship!: Model;
    private head!: Model;
    private arm1!: Model;
    private arm2!: Model;
    private shipHolder: Object3D;
    private enabled = false;
    private tl!: gsap.core.Timeline;
    loopArm: boolean = false;
    loopTime: number = 0;
    stateCount = 0
        ;

    constructor() {

        this.shipHolder = new Object3D(GameModel.renderer)

    }
    setEnabled(enabled: boolean) {

        if (this.enabled == enabled) return
        if (!this.enabled) {
            this.enabled = true
            if (this.tl) this.tl.clear()
            this.tl = gsap.timeline()
            this.stateCount = 0
            this.loopTime = 0
            this.tl.to(this.shipHolder, { y: 0.2, duration: 2, ease: "elastic.out(1,0.9)" });
            this.tl.to(this.head, { y: 0.07 }, 2);
            this.tl.to(this.arm1, { x: -0.01 * 3, duration: 0.5, }, 2.5);
            this.tl.to(this.arm2, { x: 0.01 * 9, duration: 0.5, }, 2.5);
            this.tl.call(() => { this.loopArm = true }, [], 3)

        } else {
            this.enabled = false;
            this.loopArm = false
            this.arm1.x = 0//-0.01 * 3
            this.arm1.y = 0.01 * 2

            this.arm2.x = 0.04;// 0.01 * 9
            this.arm2.y = 0.01 * 2
            this.arm2.ry = Math.PI

            this.arm1.rx = 0
            this.arm2.rx = 0
            if (this.tl) this.tl.clear()
        }



    }
    onUI() {
        if (!this.arm1) return
        //  this.arm1.x = UI.LFloat("test", this.arm1.x, "")
        // this.arm2.x = UI.LFloat("test2", this.arm2.x, "")
    }

    setArmState(index: number) {
        if (index == 0) {
            this.arm1.x = -0.01 * 3
            this.arm1.y = 0.01 * 2

            this.arm2.x = 0.01 * 9
            this.arm2.y = 0.01 * 2
            this.arm1.rx = Math.PI
            this.arm2.rx = 0


        } else if (index == 1) {
            this.arm1.x = -0.01 * 3
            this.arm1.y = 0.01 * 2

            this.arm2.x = 0.01 * 9
            this.arm2.y = 0.01 * 2
            this.arm2.rx = Math.PI
            this.arm1.rx = 0
        }
    }

    init(holder: SceneObject3D) {



        this.title = this.add(new PixelObject(GameModel.renderer, Textures.TEXT_INVASION).pixelModel, holder);
        holder.addChild(this.shipHolder)


        this.ship = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_SHIP).pixelModel, this.shipHolder);
        this.head = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_HEAD).pixelModel, this.ship);
        this.arm1 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.arm2 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.title.x = -40 * 0.01

        this.shipHolder.y = 2
        this.shipHolder.x = -0.05

        this.head.x = 0.01 * 7
        this.head.y = 0.02
        this.head.z = -0.01
        this.arm1.x = 0//-0.01 * 3
        this.arm1.y = 0.01 * 2
        this.arm1.z = -0.001
        this.arm2.x = 0.04;// 0.01 * 9
        this.arm2.y = 0.01 * 2
        this.arm2.ry = Math.PI
        this.arm2.z = -0.001
        this.title.y = 0.4


    }

    update() {
        if (this.enabled) {
            this.ship.y = Math.sin(Timer.time) * 0.01

        }
        if (this.loopArm) {
            this.loopTime -= Timer.delta
            if (this.loopTime < 0) {
                this.loopTime += 0.4 + 0.02
                this.stateCount++
                this.setArmState(this.stateCount % 2)
            }
        }
    }

    private add(m: Model, h: Object3D) {
        GameModel.gameRenderer.addModel(m)
        GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(m)
        h.addChild(m)
        return m;
    }
}
