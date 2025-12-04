
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


export class GirlLevel extends PlatformLevel {
    private startPos: number = -10;
    girl!: SceneObject3D;
    charFaceHandler!: FaceHandler;



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
        charRoot.x = this.startPos
        charRoot.y = 0.0
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.isConversation = true
        this.characterController.gotoAndIdle(new Vector3(this.startPos + 0.5, 0, 0), 1, () => { this.isConversation = false })

        this.girl = SceneHandler.getSceneObject("rootFairy");
        this.girl.x = 5
        this.girl.y = 0.6
        this.girl.ry = -0.3
        this.girl.setScaler(1.2)
        GameModel.gameCamera.setMinMaxX(this.startPos, this.girl.x + 2 + 5)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))

        this.charFaceHandler = new FaceHandler(charRoot)
        this.charFaceHandler.setState("default")
    }
    onUI(): void {
        this.charFaceHandler?.onUI()
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
                    let target = new Vector3(this.girl.x - 0.5, 0.6, 0)
                    GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 1.9]))

                    gsap.delayedCall(0.5, () => {
                        this.charFaceHandler.setState("lookGirl")
                        GameModel.conversationHandler.startConversation("girl")

                        GameModel.conversationHandler.doneCallBack = () => {

                            if (GameModel.fishstickHandler.numFishsticks < 3) {
                                GameModel.conversationHandler.startConversation("girlFishEnd")
                            } else {
                                GameModel.conversationHandler.startConversation("girlEnd")

                            }
                            GameModel.conversationHandler.doneCallBack = () => {
                                if (GameModel.fishstickHandler.numFishsticks < 3) {
                                    GameModel.fishstickHandler.addFishstick(1)

                                }
                                gsap.delayedCall(3, () => { LevelHandler.setLevel("Dock") });

                            }

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


    }

    destroy() {
        super.destroy();
    }



}
