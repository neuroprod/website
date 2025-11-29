import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";

import CharacterController from "../../CharacterController.ts";

import GameModel from "../../GameModel.ts";
import { PlatformLevel } from "../PlatformLevel.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { Vector3 } from "@math.gl/core";
import gsap from "gsap";
import LevelHandler from "../LevelHandler.ts";
import SoundHandler from "../../SoundHandler.ts";

export class IntroLevel extends PlatformLevel {
    private landlord!: SceneObject3D;


    private startPos = 0
    private landlordHand!: SceneObject3D;
    tl!: gsap.core.Timeline;


    init() {
        super.init();
        GameModel.coinHandler.hide()
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()


        SceneHandler.setScene("4b7c6839-61ea-49a9").then(() => {
            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("landlord")).then(() => {
                LoadHandler.stopLoading()
            });
            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()

        GameModel.fishstickHandler.reset()
        LoadHandler.onComplete = () => {
        }
        this.isConversation = true

        GameModel.gameCamera.setCharacter()

        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        //GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)


        this.landlord = sceneHandler.getSceneObject("rootLandlord")
        this.landlord.setScaler(1.2)
        this.landlord.z = -0.3
        this.landlord.x = -1.5 - 0.5
        this.landlord.y = 0
        this.landlord.ry = 0
        sceneHandler.getSceneObject("LandlordArmGun").hide()
        this.landlordHand = sceneHandler.getSceneObject("landlordArmPoint")
        this.landlordHand.rz = -1
        this.landlordHand.x = 0.01
        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos - 3
        charRoot.y = 0.15
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.characterController.gotoAndIdle(new Vector3(this.startPos - 0.5, 0.1, 0), 1, () => {
            gsap.delayedCall(0.5, this.playIntro.bind(this));

        })
        GameModel.gameCamera.camDistance = 1.4;
        GameModel.gameCamera.heightOffset = 0.4
        GameModel.gameCamera.setMinMaxX(this.startPos - 0.5, this.startPos + 5)

        GameModel.coinHandler.hide()
        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos - 0.5, 0, 0))


    }

    update() {
        super.update();


    }

    destroy() {
        super.destroy();
    }

    private playIntro() {

        // this.landlord.x = -1.5
        let tl = gsap.timeline()
        GameModel.gameCamera.TweenToLockedView(new Vector3(-1.0, 0.5, 0), new Vector3(-1.0, 0.5, 2), 3)
        tl.to(this.landlord, { x: -1.5, ry: -0.1 }, 0)
        tl.to(this.landlordHand, { rz: -0.7, x: 0.05, y: 0.12 }, 0)
        // GameModel.gameCamera.TweenToLockedView()


        this.characterController.setAngle(-Math.PI - 0.2, 0.7, 0.7)
        let count = 0;
        gsap.delayedCall(2, () => {
            GameModel.conversationHandler.startConversation("mrLoathsome")
            GameModel.conversationHandler.dataCallBack = (data: string) => {
                if (this.tl) this.tl.clear();
                this.tl = gsap.timeline()
                if (data == "raiseHand") {
                    tl.to(this.landlordHand, { rz: -0.1, x: 0.1, y: 0.12 })
                } else if (data == "raiseHandCoins") {

                    GameModel.coinHandler.show()
                    SoundHandler.playCoin()
                    tl.to(this.landlordHand, { rz: -0.4, duration: 1, x: 0.1, y: 0.12 })
                }
                else if (data == "moveHand") {
                    tl.to(this.landlordHand, { rz: -0.2, x: 0.1, y: 0.12 })
                }
                else if (data == "lowerHand") {
                    tl.to(this.landlordHand, { rz: -0.4, duration: 2, x: 0.1, y: 0.12 })
                }
                count++



            }
            GameModel.conversationHandler.doneCallBack = () => {
                this.characterController.setAngle(0)
                this.characterController.gotoAndIdle(new Vector3(this.startPos + 1, 0.1, 0), 1, () => {
                    LevelHandler.setLevel("Tree")

                })
            }

        });
    }

}
