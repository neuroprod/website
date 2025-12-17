import { PlatformLevel } from "../PlatformLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { HitTrigger } from "../../../data/HitTriggers.ts";
import God from "./God.ts";
import LevelHandler from "../LevelHandler.ts";
import { Vector3 } from "@math.gl/core";
import GameModel from "../../GameModel.ts";
import FaceHandler from "../../handlers/FaceHandler.ts";

export class GodLevel extends PlatformLevel {
    private tl!: gsap.core.Timeline;

    private tree!: SceneObject3D;
    private god!: SceneObject3D;
    private godController!: God;
    private skipGodChoice: boolean = false;
    private startPos = 0
    private landlord!: SceneObject3D;
    charFaceHandler!: FaceHandler;
    godFaceHandler!: FaceHandler;
    treeFaceHandler!: FaceHandler;
    treeEyeLook: boolean = false;
    charRoot!: SceneObject3D;
    pupilRightTree!: SceneObject3D;
    pupilLeftTree!: SceneObject3D;
    treeEyeLeft!: SceneObject3D;
    treeEyeRight!: SceneObject3D;
    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()


        SceneHandler.setScene("01811203-860d-45a3").then(() => {

            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });

            SceneHandler.addScene("0c10748d-698e-4393").then(() => {
                LoadHandler.stopLoading()
            });


            SceneHandler.addScene("9f307f29-4140-48d6").then(() => {
                LoadHandler.stopLoading()
            });

            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }

        this.skipGodChoice = false
        GameModel.gameCamera.setCharacter()

        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)


        this.tree = sceneHandler.getSceneObject("rootTree")
        this.tree.setScaler(1.5)
        this.tree.z = -0.05
        this.tree.x = 3 + 14


        this.god = sceneHandler.getSceneObject("godRoot")

        this.god.setScaler(1.5)

        this.god.ry = -0.3
        this.god.z = -0.5
        this.god.x = this.tree.x + 1.3

        this.godController = new God()
        this.godController.init(this.god)


        this.isConversation = true

        let charRoot = SceneHandler.getSceneObject("charRoot");

        this.charFaceHandler = new FaceHandler(charRoot)
        this.charFaceHandler.setState("default")
        this.godFaceHandler = new FaceHandler(this.god)
        this.treeFaceHandler = new FaceHandler(this.tree)
        charRoot.x = this.startPos - 2
        charRoot.y = 0.15
        charRoot.setScaler(1.2)
        this.charRoot = charRoot
        this.characterController.setCharacter()
        this.characterController.gotoAndIdle(new Vector3(this.startPos, 0.1, 0), 3, () => {
            this.playIntro();

        })
        GameModel.gameCamera.camDistance = 2;
        GameModel.gameCamera.heightOffset = 0.5
        GameModel.gameCamera.setMinMaxX(this.startPos + 0.5, 17)


        this.pupilRightTree = SceneHandler.getSceneObject("pupilRightTree");
        this.pupilLeftTree = SceneHandler.getSceneObject("pupilLeftTree");
        this.treeEyeLeft = SceneHandler.getSceneObject("treeEyeLeft");
        this.treeEyeRight = SceneHandler.getSceneObject("treeEyeRight");

        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos + 0.5, 0, 0))
        this.treeEyeLook = true
        GameModel.gameRenderer.setRenderSetting({})
    }
    onUI() {
        this.charFaceHandler?.onUI()
        this.godFaceHandler?.onUI()
        if (!this.treeEyeLook)
            this.treeFaceHandler?.onUI()
    }
    conversationDataCallBack(data: string) {
        super.conversationDataCallBack(data);
        if (data == "godNo") {
            this.skipGodChoice = true;
        }
    }

    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {


            if (f.hitTriggerItem == HitTrigger.GOD) {


                f.triggerIsEnabled = false;
                let target = f.getWorldPos().add([1, -0.1, 0])
                GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 2]))
                this.isConversation = true

                this.characterController.gotoAndIdle(this.tree.getWorldPos(), 1, () => {
                    this.characterController.setAngle(0.6)
                    this.godController.show(() => {
                        this.charFaceHandler.setState("lookGod")
                        GameModel.conversationHandler.startConversation("god")
                        GameModel.conversationHandler.dataCallBack = this.conversationDataCallBack.bind(this)
                        GameModel.conversationHandler.doneCallBack = () => {

                            gsap.delayedCall(0.5, () => {

                                if (this.skipGodChoice) {
                                    gsap.delayedCall(2, () => {
                                        LevelHandler.setLevel("Sausage")
                                    })
                                    //GameModel.coinHandeler.show()
                                    GameModel.coinHandler.addCoins(5)

                                } else {
                                    LevelHandler.setLevel("GodPresent")
                                }

                            })

                        };
                    })

                });

            }

            if (f.hitTriggerItem == HitTrigger.TREE) {

                this.treeEyeLook = false
                f.triggerIsEnabled = false;

                let target = this.tree.getWorldPos().add([-0.5, 0.55, 0])
                GameModel.gameCamera.TweenToLockedView(target, target.clone().add([0, 0, 1.7]))
                this.isConversation = true

                this.characterController.gotoAndIdle(this.tree.getWorldPos().add([-0.65, 0, 0]), 1, () => {
                    this.characterController.setAngle(0.1)
                    gsap.delayedCall(0.5, () => {
                        this.charFaceHandler.setState("looktree")
                        this.treeFaceHandler.setState("look")
                        GameModel.conversationHandler.startConversation("tree")
                        GameModel.conversationHandler.dataCallBack = (data: string) => {
                            if (data == "sigh") this.treeFaceHandler.setState("lookup")
                            if (data == "sighDone") this.treeFaceHandler.setState("look")

                        }
                        GameModel.conversationHandler.doneCallBack = () => {
                            GameModel.gameCamera.setCharView()
                            GameModel.gameCamera.camDistance = 2.5;
                            GameModel.gameCamera.heightOffset = 0.7
                            this.characterController.setAngle(0.0)
                            this.treeEyeLook = true
                            gsap.delayedCall(0.5, () => {
                                this.isConversation = false
                                this.charFaceHandler.setState("default")
                                this.treeEyeLook = true
                            })

                        }
                    });

                });
                return true;
            }





        }

        return false;
    }

    update() {
        super.update()
        this.godController.update()

        if (this.treeEyeLook) {

            let worldPos = this.charRoot.getPosition().clone()
            worldPos.y += 0.6
            let offR = this.treeEyeRight.getLocalPos(worldPos)
            let angleR = Math.atan2(offR.y, offR.x)

            this.pupilRightTree.x = Math.cos(angleR) * 0.012
            this.pupilRightTree.y = Math.sin(angleR) * 0.019


            let offL = this.treeEyeLeft.getLocalPos(worldPos)
            let angleL = Math.atan2(offR.y, offR.x)

            this.pupilLeftTree.x = Math.cos(angleL) * 0.012
            this.pupilLeftTree.y = Math.sin(angleL) * 0.019

        }




    }

    destroy() {
        super.destroy()
        this.godController.destroy()
        if (this.tl) this.tl.clear()

    }

    private playIntro() {
        this.isConversation = true
        this.charFaceHandler.setState("front")
        GameModel.conversationHandler.startConversation("start")
        GameModel.conversationHandler.doneCallBack = () => {
            this.isConversation = false

            this.charFaceHandler.setState("default")
        }


    }
}
