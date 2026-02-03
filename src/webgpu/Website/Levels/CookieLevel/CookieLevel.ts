
import { PlatformLevel } from "../PlatformLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { HitTrigger } from "../../../data/HitTriggers.ts";
import GameModel from "../../GameModel.ts";
import LevelHandler from "../LevelHandler.ts";
import CoinHandler from "../../handlers/CoinHandler.ts";
import FaceHandler from "../../handlers/FaceHandler.ts";
import { Vector3 } from "@math.gl/core";



export class CookieLevel extends PlatformLevel {
    private tl!: gsap.core.Timeline;


    private tree!: SceneObject3D;
    rootSausage!: SceneObject3D;
    charFaceHandler!: FaceHandler;


    private startPos = 0
    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("e857a11e-d9f9-4a0c").then(() => {

            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });

            /*  SceneHandler.addScene("58745956-acac-4aba").then(() => {
                  LoadHandler.stopLoading()
              });*/
            SceneHandler.addScene("9f307f29-4140-48d6").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("sausage")).then(() => {
                LoadHandler.stopLoading()
            });

            LoadHandler.stopLoading()
        })

    }
    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => { }


        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)

        sceneHandler.getSceneObject("coinTree1").hide()
        sceneHandler.getSceneObject("coinTree2").hide()
        sceneHandler.getSceneObject("coinTree3").hide()
        sceneHandler.getSceneObject("cointree4").hide()
        sceneHandler.getSceneObject("topCoin").hide()
        this.tree = sceneHandler.getSceneObject("rootTree")
        // this.tree.setScaler(1.5)
        this.tree.z = -2
        this.tree.x = -1.5


        let char = sceneHandler.getSceneObject("charRoot")
        char.setScaler(1.2)

        this.rootSausage = sceneHandler.getSceneObject("rootSausage")
        this.rootSausage.setScaler(1.4)

        this.rootSausage.z = -0.1
        this.rootSausage.x = 7.5
        this.rootSausage.ry = -0.2

        this.charFaceHandler = new FaceHandler(char)
        this.charFaceHandler.setState("default")



        GameModel.gameRenderer.setRenderSetting({})

        this.isConversation = true
        char.x = this.startPos - 2
        this.characterController.setCharacter()
        GameModel.gameCamera.setCharacter()
        this.characterController.gotoAndIdle(new Vector3(this.startPos, 0, 0), 1, () => { this.isConversation = false })
        GameModel.gameCamera.setMinMaxX(this.startPos, this.rootSausage.x)
        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))



    }
    onUI(): void {
        this.charFaceHandler?.onUI()
    }
    conversationDataCallBack(data: string) {
        super.conversationDataCallBack(data);

    }
    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {





            if (f.hitTriggerItem == HitTrigger.COOKIE) {
                f.triggerIsEnabled = false;
                this.charFaceHandler.setState("lookGirl")
                let target = this.rootSausage.getWorldPos().add([-0.4, 0.52, 0])
                GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 1.9]))
                this.isConversation = true

                this.characterController.gotoAndIdle(this.rootSausage.getWorldPos().add([-0.9, 0, 0]), 1, () => {
                    this.characterController.setAngle(0.4)
                    setTimeout(() => {
                        if (GameModel.presentID == -1) {
                            GameModel.conversationHandler.startConversation("cookieNoPresent")
                        }
                        else if (GameModel.presentID == 0) {
                            GameModel.conversationHandler.startConversation("cookieUser")
                        }
                        else if (GameModel.presentID == 1) {
                            GameModel.conversationHandler.startConversation("cookieDegree")
                        }
                        else if (GameModel.presentID == 2) {
                            GameModel.conversationHandler.startConversation("cookieBlank")
                        }
                        else if (GameModel.presentID == 3) {
                            GameModel.conversationHandler.startConversation("cookieNDA")
                        }
                        //     GameModel.conversationHandler.startConversation("cookie")

                        GameModel.conversationHandler.doneCallBack = () => {

                            GameModel.conversationHandler.startConversation("cookie")
                            GameModel.conversationHandler.dataCallBack = (data: string) => {

                                GameModel.coinHandler.addCoins(-5)
                            }
                            GameModel.conversationHandler.doneCallBack = () => {

                                //GameModel.gameCamera.setCharView()
                                setTimeout(() => {
                                    this.isConversation = false

                                    LevelHandler.setLevel("SausageGame")

                                }, 500)
                            }
                        }
                    }, 1500);

                });
                return true;
            }

        }

        return false;
    }


    destroy() {
        super.destroy()
        if (this.tl) this.tl.clear()

    }
}
