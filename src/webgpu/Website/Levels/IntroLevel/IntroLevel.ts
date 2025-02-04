import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";

import CharacterController from "../../CharacterController.ts";

import GameModel from "../../GameModel.ts";
import {PlatformLevel} from "../PlatformLevel.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import {Vector3} from "@math.gl/core";
import gsap from "gsap";
import LevelHandler from "../LevelHandler.ts";

export class IntroLevel extends PlatformLevel {
    private landlord!: SceneObject3D;


    private startPos = 0
    private landlordHand!: SceneObject3D;


    init() {
        super.init();
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
        LoadHandler.onComplete = () => {
        }
        this.blockInput = true

        GameModel.gameCamera.setCharacter()

        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        //GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)


        this.landlord = sceneHandler.getSceneObject("rootLandlord")
        this.landlord.setScaler(1.2)
        this.landlord.z = 0
        this.landlord.x = -1.5
        this.landlord.ry = 0
        sceneHandler.getSceneObject("LandlordArmGun").hide()
        this.landlordHand = sceneHandler.getSceneObject("landlordArmPoint")
        this.landlordHand.rz = -1.5
        this.landlordHand.x = 0.07
        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos - 3
        charRoot.y = 0.15
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.characterController.gotoAndIdle(new Vector3(this.startPos - 0.5, 0.1, 0), 1, () => {
            gsap.delayedCall(0.5, this.playIntro.bind(this));

        })
        GameModel.gameCamera.camDistance = 1.2;
        GameModel.gameCamera.heightOffset = 0.4
        GameModel.gameCamera.setMinMaxX(this.startPos - 0.5, this.startPos + 5)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos - 0.5, 0, 0))


    }

    update() {
        super.update();


    }

    destroy() {
        super.destroy();
    }

    private playIntro() {

        let tl = gsap.timeline()
        GameModel.gameCamera.TweenToLockedView(new Vector3(-1.0, 0.5, 0), new Vector3(-1.0, 0.5, 2))

        // GameModel.gameCamera.TweenToLockedView()


        this.characterController.setAngle(-Math.PI)
        gsap.delayedCall(1, () => {
            GameModel.conversationHandler.startConversation("mrLoathsome")
            GameModel.conversationHandler.dataCallBack = (data: string) => {
                gsap.to(this.landlordHand, {rz: 0, x: 0.1, y: 0.12})

            }
            GameModel.conversationHandler.doneCallBack = () => {
                this.characterController.setAngle(0)
                this.characterController.gotoAndIdle(new Vector3(this.startPos + 1, 0.1, 0), 1, () => {
                    LevelHandler.setLevel("God")

                })
            }
        });
    }

}
