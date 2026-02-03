import { PlatformLevel } from "../PlatformLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { HitTrigger } from "../../../data/HitTriggers.ts";


import Strawberry from "./Strawberry.ts";
import GameModel from "../../GameModel.ts";
import LevelHandler from "../LevelHandler.ts";
import FaceHandler from "../../handlers/FaceHandler.ts";
import { Vector3 } from "@math.gl/core";


export class StrawberryLevel extends PlatformLevel {
    strawBerryHandler = new Strawberry()
    private tl!: gsap.core.Timeline;
    private strawBerry!: SceneObject3D;
    charFaceHandler!: FaceHandler;
    gaveCoins: boolean = false;
    startPos = -2
    init() {
        super.init();


        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()

        SceneHandler.setScene("bbd954c4-d38e-4618").then(() => {

            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });

            SceneHandler.addScene("c7dc8752-9088-476b").then(() => {
                LoadHandler.stopLoading()
            });


            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        this.isConversation = true
        this.characterController.setCharacter()
        GameModel.gameCamera.setCharacter()
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)
        this.strawBerryHandler.init()

        let startX = -2
        let char = sceneHandler.getSceneObject("charRoot")

        this.charFaceHandler = new FaceHandler(char);
        char.setScaler(1.2)

        GameModel.gameCamera.camDistance = 2.3;
        GameModel.gameCamera.heightOffset = 0.5

        // GameModel.gameCamera.setLockedView(this.camTarget.add([0, 0, 0]), this.camPos.clone().add([0, 0, 1]))
        this.strawBerry = sceneHandler.getSceneObject("strawberryRoot")
        this.strawBerry.setScaler(1.1)
        this.strawBerry.z = 0
        this.strawBerry.x = 4.8
        this.strawBerry.y = 1.055
        this.strawBerry.ry = -0.4

        GameModel.gameCamera.setMinMaxX(startX, 100)
        GameModel.gameRenderer.setRenderSetting({})
        //
        this.gaveCoins = false;
        console.log("configdone")
        this.characterController.gotoAndIdle(new Vector3(startX, 0.1, 0), 1, () => {
            this.isConversation = false
        })


        this.isConversation = true
        char.x = this.startPos - 2
        this.characterController.setCharacter()
        GameModel.gameCamera.setCharacter()
        this.characterController.gotoAndIdle(new Vector3(this.startPos, 0, 0), 1, () => { this.isConversation = false })
        GameModel.gameCamera.setMinMaxX(this.startPos, 4.8)
        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))

    }
    onUI() {
        if (this.charFaceHandler) this.charFaceHandler.onUI()
    }
    update() {
        super.update()

        this.strawBerryHandler.update()
    }

    conversationDataCallBack(data: string) {
        super.conversationDataCallBack(data);
        if (data == "coinsYes") {
            GameModel.coinHandler.addCoins(GameModel.coinHandler.numCoins * -1);

            // GameModel.conversationHandler.startConversation("giveCoins")

            this.gaveCoins = true;


        }

    }

    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {


            if (f.hitTriggerItem == HitTrigger.STRAWBERRY) {
                f.triggerIsEnabled = false;
                this.charFaceHandler.setState("lookStarw")
                let target = this.strawBerry.getWorldPos().add([-0.5, 0.5, 0])
                GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 2]))
                this.isConversation = true

                this.characterController.gotoAndIdle(this.strawBerry.getWorldPos().add([-0.9, 0, 0]), 1, () => {
                    gsap.delayedCall(1.5, () => {
                        GameModel.conversationHandler.replaceMap.set("numCoins", GameModel.coinHandler.numCoins + "")
                        GameModel.conversationHandler.startConversation("strawBerry")

                        GameModel.conversationHandler.doneCallBack = () => {
                            if (this.gaveCoins) {

                                GameModel.fishstickHandler.addFishstick(2)
                                gsap.delayedCall(2, () => { LevelHandler.setLevel("Hand") });
                            } else {
                                gsap.delayedCall(1, () => { LevelHandler.setLevel("Hand") });
                            }
                        }
                    });

                });
                return true;
            }

        }

        return false;
    }


    destroy() {
        this.strawBerryHandler.destroy()
        super.destroy()
        if (this.tl) this.tl.clear()

    }
}
