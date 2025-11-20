
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";

import CharacterController from "../../CharacterController.ts";

import GameModel from "../../GameModel.ts";
import { PlatformLevel } from "../PlatformLevel.ts";
import { Vector3 } from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { HitTrigger } from "../../../data/HitTriggers.ts";
import gsap from "gsap";
import LevelHandler from "../LevelHandler.ts";
import Timer from "../../../lib/Timer.ts";


export class FactoryLevel extends PlatformLevel {
    private startPos: number = -3;

    tlBox!: gsap.core.Timeline;
    tlLever!: gsap.core.Timeline;
    tlDrink!: gsap.core.Timeline;
    boxes: Array<SceneObject3D> = []
    rollers: Array<SceneObject3D> = []
    boxIndex = 1;
    drinkTime = 0
    pullTime = 0
    fishRoot!: SceneObject3D;
    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()


        SceneHandler.setScene("aee2b3e2-c1b5-4e53").then(() => {
            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene("cdfb5c38-67db-4e1a").then(() => {
                LoadHandler.stopLoading()
            });
            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        this.blockInput = false

        GameModel.gameCamera.setCharacter()


        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)

        this.fishRoot = SceneHandler.getSceneObject("FishBoyRoot");
        this.fishRoot.x = 7
        this.fishRoot.y = 0.0
        this.fishRoot.z = -1.0
        this.fishRoot.ry = -0.0
        this.fishRoot.setScaler(1.4)

        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos
        charRoot.y = 0.0
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.blockInput = true
        this.characterController.gotoAndIdle(new Vector3(this.startPos + 0.5, 0, 0), 1, () => { this.blockInput = false })



        GameModel.gameCamera.setMinMaxX(this.startPos, this.startPos + 20)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))
        GameModel.gameCamera.camDistance = 2.3
        for (let i = 1; i < 7; i++) {
            this.rollers.push(SceneHandler.getSceneObject("r" + i))

        }

        let roller = SceneHandler.getSceneObject("roller");
        let grabber = SceneHandler.getSceneObject("grabber");
        let grabberBox = SceneHandler.getSceneObject("boxGrabber");
        this.boxes.push(SceneHandler.getSceneObject("box1"))
        this.boxes.push(SceneHandler.getSceneObject("box2"))
        grabber.y = 0;
        roller.x = -4;
        this.tlBox = gsap.timeline({ repeat: -1 })
        this.tlBox.call(() => { grabberBox.show(); grabberBox.ry = (Math.random() - 0.5) * 0.5 }, [], 0)
        this.tlBox.to(roller, { x: -2, ease: "power3.out", duration: 1.5 }, 0.5)
        this.tlBox.to(grabber, { y: -0.86, ease: "power3.inout", duration: 1 }, 1.5)
        this.tlBox.call(() => {
            grabberBox.hide()
            let p = grabberBox.getWorldPos()
            let pL = this.boxes[this.boxIndex].parent?.getLocalPos(p)
            this.boxes[this.boxIndex].ry = grabberBox.ry;
            if (pL) this.boxes[this.boxIndex].setPosition(pL.x, pL.y, pL.z)
            this.boxIndex = (this.boxIndex + 1) % 2;
        }, [], 2.5)
        this.tlBox.to(grabber, { y: 0, ease: "power3.inout", duration: 1 }, 2.5)
        this.tlBox.to(roller, { x: -4, ease: "power3.in", duration: 1 }, 3.0)

        this.pullTime = 0;
        this.tlLever = gsap.timeline({ repeat: -1 })
        this.tlLever.to(this, { pullTime: 20, ease: "power2.in", duration: 0.7 }, 0)
        this.tlLever.to(this, { pullTime: 0, ease: "power2.inOut" }, 0.9)


        this.tlDrink = gsap.timeline({ repeat: -1 })
        this.tlDrink.to(this, { drinkTime: 20, ease: "power2.inOut", duration: 1.6 }, 3)
        this.tlDrink.to(this, { drinkTime: 0, ease: "power2.inOut" }, 5)
    }

    setFishLoop() {



    }
    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {


            if (f.hitTriggerItem == HitTrigger.FISHBOY) {
                f.triggerIsEnabled = false;

                // 
                this.blockInput = true
                this.characterController.gotoAndIdle(new Vector3(this.fishRoot.x - 0.7, 0, 0), 1, () => {
                    let target = new Vector3(this.fishRoot.x + 0.12, 0.6, 0)
                    GameModel.gameCamera.TweenToLockedView(target, target.clone().add([1, 0.1, 1.1]))
                    this.characterController.setAngle(1)
                    gsap.delayedCall(0.5, () => {
                        GameModel.conversationHandler.startConversation("fishBoy")

                        GameModel.conversationHandler.doneCallBack = () => {
                            LevelHandler.setLevel("Girl");
                        }
                    });

                });
                return true;
            }



        }

        return false;
    }
    update() {
        super.update();

        for (let b of this.boxes) {
            b.x += 0.3 * Timer.delta;
        }
        for (let r of this.rollers) {
            r.rz += 5 * Timer.delta;
        }

        SceneHandler.sceneAnimations[0].setTime(this.pullTime)
        SceneHandler.sceneAnimations[1].setTime(this.drinkTime)
    }

    destroy() {
        super.destroy();
        this.boxes = []
        this.tlBox.clear()
        this.tlLever.clear()
        this.tlDrink.clear()
    }



}
