
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
import FaceHandler from "../../handlers/FaceHandler.ts";
import Timer from "../../../lib/Timer.ts";
import Animation from "../../../sceneEditor/timeline/animation/Animation.ts";


export class GirlLevel extends PlatformLevel {
    private tl!: gsap.core.Timeline;
    private startPos: number = -5;
    girl!: SceneObject3D;
    charFaceHandler!: FaceHandler;
    girlLegL!: SceneObject3D;
    girlLegR!: SceneObject3D;
    girlBody!: SceneObject3D;
    girlPhoneAnimation!: Animation;
    girlFrame = 10
    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()

        LoadHandler.startLoading()

        SceneHandler.setScene("316d99ad-bd50-49e3").then(() => {
            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene("e5e28257-5e4f-4630").then(() => {
                LoadHandler.stopLoading()
            });
            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }


        GameModel.gameCamera.setCharacter()


        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)
        this.isConversation = true

        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos - 2
        charRoot.y = 0.0
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()




        this.girl = SceneHandler.getSceneObject("rootFairy");

        this.girlLegL = SceneHandler.getSceneObject("legFL");
        this.girlLegR = SceneHandler.getSceneObject("legFR");
        this.girlBody = SceneHandler.getSceneObject("bodyFairy");

        this.girl.x = 5
        this.girl.y = 2.2
        this.girl.ry = -0.3
        this.girl.setScaler(1.2)


        this.charFaceHandler = new FaceHandler(charRoot)
        this.charFaceHandler.setState("default")


        this.girlPhoneAnimation = SceneHandler.sceneAnimationsByName.get("lookPhone") as Animation;

        this.girlFrame = 10
        this.girlPhoneAnimation.setTime(this.girlFrame)


        this.isConversation = true





        this.characterController.gotoAndIdle(new Vector3(this.startPos, 0, 0), 1, () => { this.isConversation = false })
        GameModel.gameCamera.setMinMaxX(this.startPos, this.girl.x + 2 + 5)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))
    }
    onUI(): void {
        this.charFaceHandler?.onUI()
    }
    conversationDataCallBack(data: string) {
        super.conversationDataCallBack(data);
        if (data == "lookDown") {
            let tl = this.getTimeline(() => {
                this.girlPhoneAnimation.setTime(this.girlFrame)

            })
            tl.to(this, { girlFrame: 10, duration: 2, ease: "power2.inOut" }, 0.0)
        }
        if (data == "lookUp") {
            let tl = this.getTimeline(() => {
                this.girlPhoneAnimation.setTime(this.girlFrame)

            })
            tl.to(this, { girlFrame: 0, duration: 1, ease: "power2.inOut" }, 0.0)
        }
    }
    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {





            if (f.hitTriggerItem == HitTrigger.GIRL) {

                f.triggerIsEnabled = false;
                GameModel.conversationHandler.replaceMap.set("numCoins", GameModel.coinHandler.numCoins + "")
                GameModel.conversationHandler.replaceMap.set("numFishsticks", GameModel.fishstickHandler.numFishsticks + "")
                // 
                this.isConversation = true
                this.characterController.gotoAndIdle(new Vector3(this.girl.x - 1.0, 0, 0), 1, () => {

                    let target = new Vector3(this.girl.x - 0.5, 0.5, 0)
                    GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 1.9]))

                    this.charFaceHandler.setState("lookGirl")
                    let tl = this.getTimeline(() => {
                        this.girlPhoneAnimation.setTime(this.girlFrame)

                    })

                    tl.to(this, { girlFrame: 0, duration: 1, ease: "power2.inOut" }, 2.5)

                    //this.girl.rz = 0.2

                    // gsap.to(this.girl, { y: 0.6, rz: 0, ease: "elastic.out(1,1)", duration: 4 })




                    gsap.delayedCall(4.5, () => {

                        GameModel.conversationHandler.startConversation("girl")

                        GameModel.conversationHandler.doneCallBack = () => {

                            if (GameModel.fishstickHandler.numFishsticks== 4) {
                                GameModel.conversationHandler.startConversation("girlFishEndOne")
                            } else if (GameModel.fishstickHandler.numFishsticks < 5) {
                                GameModel.conversationHandler.startConversation("girlFishEndSome")
                            }else {
                                GameModel.conversationHandler.startConversation("girlEnd")

                            }
                            GameModel.conversationHandler.doneCallBack = () => {

                               if (GameModel.fishstickHandler.numFishsticks < 5) {

                                
                                    GameModel.fishstickHandler.addFishstick(5 - GameModel.fishstickHandler.numFishsticks)

                                }
                                let tl = this.getTimeline(() => {
                                    this.girlPhoneAnimation.setTime(this.girlFrame)

                                })

                                tl.to(this, { girlFrame: 10, duration: 2, ease: "power2.inOut" }, 0.3)
                                gsap.delayedCall(5, () => { LevelHandler.setLevel("Dock") });

                            }

                        }
                    });

                });
                return true;
            }

        }

        return false;
    }
    getTimeline(updateFuction: any = null) {
        if (this.tl) this.tl.clear()

        if (updateFuction) {
            this.tl = gsap.timeline({ onUpdate: updateFuction })
        } else {
            this.tl = gsap.timeline()
        }

        return this.tl;
    }
    update() {
        super.update();
        let t = Timer.time
        this.girl.rz = Math.sin(t) * 0.02

        this.girlBody.rz = Math.sin(t - 1) * 0.01 - 0.05
        t -= 2.2
        this.girlLegL.rz = Math.sin(t) * 0.05 - 0.05
        t += 0.4
        this.girlLegR.rz = Math.sin(t) * 0.06 - 0.05
    }

    destroy() {
        super.destroy();
        if (this.tl) this.tl.clear()
    }



}
