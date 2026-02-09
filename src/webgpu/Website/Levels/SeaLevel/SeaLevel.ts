import { PlatformLevel } from "../PlatformLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";

import GameModel from "../../GameModel.ts";

import Timer from "../../../lib/Timer.ts";
import { Vector3 } from "@math.gl/core";
import SeaFull from "./SeaFull.ts";
import God from "../GodLevel/God.ts";
import levelHandler from "../LevelHandler.ts";
import SoundHandler from "../../SoundHandler.ts";
import FaceHandler from "../../handlers/FaceHandler.ts";



export class SeaLevel extends PlatformLevel {
    private tl!: gsap.core.Timeline;

    private rootShip!: SceneObject3D;
    private sea!: SeaFull;
    private foam!: SceneObject3D;

    private camLookAt!: Vector3;
    private camPosition!: Vector3;
    private god!: SceneObject3D;
    private godController!: God;
    public renderDepth = 0.94
    charFaceHandler!: FaceHandler
    godFaceHandler!: FaceHandler;
    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("51c74f13-320e-4899").then(() => {


            SceneHandler.addScene("edb3050b-b132-4958").then(() => {
                LoadHandler.stopLoading()
            });

            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });

            /*  SceneHandler.addScene("9f307f29-4140-48d6").then(() => {
                  LoadHandler.stopLoading()
              });
               SceneHandler.addScene("58745956-acac-4aba").then(() => {
                    LoadHandler.stopLoading()
                });
                SceneHandler.addScene("c7dc8752-9088-476b").then(() => {
                    LoadHandler.stopLoading()
                });
    */
            SceneHandler.addScene("0c10748d-698e-4393").then(() => {
                LoadHandler.stopLoading()
            });

            LoadHandler.stopLoading()
        })

    }
    onUI(): void {
        if (!this.charFaceHandler) return;
        this.charFaceHandler.onUI()
        this.godFaceHandler.onUI()
    }
    endAnime(): number {
        GameModel.tweenToBlack(3)
        return 3;
    }
    configScene() {
        super.configScene()


        SoundHandler.setBackgroundSounds(["sound/JuliaFlorida.mp3", "sound/653311__mfedward__relaxing-sea.mp3"])
        LoadHandler.onComplete = () => {
        }
        this.isConversation = false


        this.rootShip = sceneHandler.getSceneObject("rootShip")
        this.rootShip.x = -7
        this.rootShip.z = -0.7


        let eyeLeft = sceneHandler.getSceneObject("eyeLeft")
        eyeLeft.hide()
        let pupilLeft = sceneHandler.getSceneObject("pupilLeft")
        pupilLeft.hide()

        let char = sceneHandler.getSceneObject("charRoot")
        char.x = -1.6;
        char.y = 0.4;
        char.ry = Math.PI;
        char.setScaler(1.2)
        this.rootShip.addChild(char)


        /* let tree = sceneHandler.getSceneObject("rootTree")
         tree.setScaler(1.5)
         tree.z = 0
         tree.x = 1.5
         tree.y = 0.3
         tree.ry = Math.PI;
         tree.rz = 0.02;
         this.rootShip.addChild(tree)
 
 
         let cookie = sceneHandler.getSceneObject("cookieRoot")
         cookie.setScaler(1.3)
         cookie.z = 0
         cookie.x = 0
         cookie.y = 0.3
         cookie.ry = Math.PI;
         this.rootShip.addChild(cookie)
 
 
         let strawberyy = sceneHandler.getSceneObject("strawberryRoot")
         strawberyy.setScaler(1.2)
         strawberyy.z = 0.1
         strawberyy.x = 0.7
         strawberyy.y = 0.7
         strawberyy.ry = Math.PI;
         this.rootShip.addChild(strawberyy)
 */
        SceneHandler.getSceneObject("fishTrow").hide();

        SceneHandler.getSceneObject("fish1").hide();
        SceneHandler.getSceneObject("fish2").hide();
        SceneHandler.getSceneObject("fish3").hide();
        SceneHandler.getSceneObject("fish4").hide();

        this.god = sceneHandler.getSceneObject("godRoot")

        this.godFaceHandler = new FaceHandler(this.god)


        this.god.ry = 0
        this.god.y = 0
        this.god.x = 0.9
        this.god.z = -0.7

        this.godController = new God()
        this.godController.initEnd(this.god)





        this.foam = sceneHandler.getSceneObject("foamHolder")
        for (let s of this.foam.children) {
            s.rz = Math.random() * 6
        }

        //this.characterController.setCharacter()
        GameModel.gameCamera.setCharacter()
        this.camLookAt = new Vector3(0, 1, 0);
        this.camPosition = new Vector3(0, 1, 4);
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        // GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)

        this.sea = new SeaFull(GameModel.renderer)
        GameModel.gameRenderer.addModel(this.sea.seaModel)

        GameModel.gameCamera.camDistance = 8;
        GameModel.gameCamera.heightOffset = 0.5
        this.isConversation = true

        this.tl = gsap.timeline()

        this.tl.to(this.rootShip, { x: 0.2, duration: 10 }, 0)
        this.tl.to(this.camPosition, { z: 3, ease: "power2.inOut", duration: 9 }, 0)
        let end = 15
        this.tl.to(this.camPosition, { x: 2.4, y: 1, z: 1.5, ease: "power2.inOut", duration: 5 }, end)
        this.tl.to(this.camLookAt, { x: 2.4, y: 1, z: 0, ease: "power2.inOut", duration: 5 }, end)
        this.tl.to(this, { renderDepth: 0.9, ease: "power2.inOut", duration: 5 }, end)
        this.tl.call(() => {
            this.godFaceHandler.setState("godLook")
            this.godController.showEnd(() => {
                GameModel.conversationHandler.startConversation("godEnd")
                GameModel.conversationHandler.doneCallBack = () => {

                    levelHandler.setLevel("Dead")
                }


            })
        }, [], end + 5)
        GameModel.happyEnd = true
        GameModel.gameRenderer.setRenderSetting({ dofMin: 0.94, dofMax: 0.96 })
        this.renderDepth = 0.94
        this.charFaceHandler = new FaceHandler(char)
        this.charFaceHandler.setState("lookGod")
    }

    conversationDataCallBack(data: string) {
        super.conversationDataCallBack(data);

    }

    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {


        }

        return false;
    }

    update() {
        super.update();
        this.sea.update()
        this.rootShip.y = Math.sin(Timer.time * 2.4) * 0.03
        this.rootShip.rz = Math.sin(Timer.time * 1) * 0.02 + Math.PI + 0.05
        GameModel.gameRenderer.dofPrepPass.setMinMax(this.renderDepth, 0.96)
        this.foam.y = -this.rootShip.y * 1.5

        for (let s of this.foam.children) {
            s.rz -= Timer.delta * 2
        }
        this.godController.update()
        GameModel.gameCamera.setLockedView(this.camLookAt, this.camPosition)
    }

    destroy() {
        super.destroy()

        if (this.tl) this.tl.clear()

    }
}
