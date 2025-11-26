
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


export class GirlLevel extends PlatformLevel {
    private startPos: number = -5;
    girl!: SceneObject3D;



    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()



        SceneHandler.setScene("316d99ad-bd50-49e3").then(() => {
            SceneHandler.addScene("1234").then(() => {
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



        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos
        charRoot.y = 0.0
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.isConversation = true
        this.characterController.gotoAndIdle(new Vector3(this.startPos + 0.5, 0, 0), 1, () => { this.isConversation = false })

        this.girl = SceneHandler.getSceneObject("girl");

        GameModel.gameCamera.setMinMaxX(this.startPos, this.girl.x + 2 + 5)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))


    }
    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {





            if (f.hitTriggerItem == HitTrigger.GIRL) {
                f.triggerIsEnabled = false;

                // 
                this.isConversation = true
                this.characterController.gotoAndIdle(new Vector3(this.girl.x - 1.0, 0, 0), 1, () => {
                    let target = new Vector3(this.girl.x - 0.5, 0.6, 0)
                    GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 2.3]))

                    gsap.delayedCall(0.5, () => {
                        GameModel.conversationHandler.startConversation("girlStrawberry")

                        GameModel.conversationHandler.doneCallBack = () => {
                            LevelHandler.setLevel("Dock");
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
