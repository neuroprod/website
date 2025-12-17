import { BaseLevel } from "../BaseLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";

import { Vector3 } from "@math.gl/core";
import Kris from "./Kris.ts";

import gsap from "gsap";

import CharacterController from "../../CharacterController.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import LevelHandler from "../LevelHandler.ts";
import SoundHandler from "../../SoundHandler.ts";
import GameModel from "../../GameModel.ts";
import FaceHandler from "../../handlers/FaceHandler.ts";
import Model from "../../../lib/model/Model.ts";
import SceneObject3D from "../../../data/SceneObject3D";


export class StartLevel extends BaseLevel {

    private kris!: Kris;


    private camPos = new Vector3()
    private camTarget = new Vector3()

    private characterController!: CharacterController;
    private goGraphicDev: boolean = false;
    charFaceHandler!: FaceHandler;
    game!: SceneObject3D

    gameLine!: SceneObject3D


    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()


        SceneHandler.setScene("456").then(() => {
            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene("f26911cf-86dc-498a").then(() => {
                LoadHandler.stopLoading()
            });
            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {
        if (this.goGraphicDev) return 0
        GameModel.tweenToBlack()
        return 0.5;
    }
    update() {
        super.update();
        if (this.kris) this.kris.update()

        this.characterController.updateIdle(Timer.delta)



    }

    private configScene() {

        LoadHandler.onComplete = () => {
        }
        GameModel.coinHandler.hide()
        GameModel.coinHandler.numCoins = 0
        GameModel.coinHandler.displayCoins = 0
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.setLevelType("platform")

        GameModel.gameRenderer.setRenderSetting({ curveRed: 0.85, curveBlue: 1.17 })

        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        SoundHandler.setBackgroundSounds([])
        if (!this.kris) this.kris = new Kris()
        this.kris.reset()

        let char = sceneHandler.getSceneObject("charRoot")
        char.setScaler(1.2)
        char.x = -2;
        char.y = 1;

        this.characterController.setCharacter()
        this.charFaceHandler = new FaceHandler(char)
        this.charFaceHandler.setState("front")
        this.camPos.set(0, 0.7, 2)
        this.camTarget.set(0, 0.7, 0)
        GameModel.gameCamera.setLockedView(this.camTarget.add([0, 0, 0]), this.camPos.clone().add([0, 0, 1]))
        GameModel.gameCamera.TweenToLockedView(this.camTarget, this.camPos, 3)
        this.game = SceneHandler.getSceneObject("game")



        this.game.hide()

        this.gameLine = SceneHandler.getSceneObject("gameLine")



        this.gameLine.hide()

        let kris = this.mouseInteractionMap.get("kris") as MouseInteractionWrapper

        let devText = sceneHandler.getSceneObject("graphicsDev").model as Model
        kris.onClick = () => {
            SoundHandler.playSound = true
            gsap.to(pirate, { sx: 0, sy: 0, sz: 0, duration: 0.2 })
            gsap.to(graphicsDev, { sx: 0, sy: 0, sz: 0, duration: 0.2 })
            this.kris.jump()
            this.kris.stopWave()
            this.goGraphicDev = true;
            gsap.killTweensOf(GameModel.gameRenderer)
            GameModel.gameRenderer.distortValue = 0
            gsap.delayedCall(1.5, () => {

                LevelHandler.setLevel(LevelHandler.navigationLevels[0])

            })
            // LevelHandler.setLevel("Website")
        }
        kris.onRollOver = () => {
            this.kris.startWave()
            GameModel.renderer.setCursor(true)
            gsap.killTweensOf(devText)
            devText.sx = devText.sy = 0.7
            gsap.to(devText, { sx: 1.2, sy: 1.2, duration: 0.8, ease: "elastic.out" })
            GameModel.gameRenderer.distortValue = 0.15


        }
        kris.onRollOut = () => {
            this.kris.stopWave()
            gsap.killTweensOf(devText)
            gsap.to(devText, { sx: 1.21, sy: 1.21, duration: 0.1, ease: "back.in" })
            GameModel.renderer.setCursor(false)

            GameModel.gameRenderer.distortValue = 0.0


        }

        let mainChar = this.mouseInteractionMap.get("mainChar") as MouseInteractionWrapper

        let line = sceneHandler.getSceneObject("line")
        line.sx = 0;
        mainChar.onClick = () => {
            SoundHandler.playSound = true
            gsap.to(pirate, { sx: 0, sy: 0, sz: 0, duration: 0.2 })
            gsap.to(graphicsDev, { sx: 0, sy: 0, sz: 0, duration: 0.2 })
            this.characterController.gotoAndIdle(new Vector3(5, 0.1, 0), 1, () => {


            })
            gsap.delayedCall(2, () => { this.goGraphicDev = false; LevelHandler.setLevel("Intro") })
            gsap.killTweensOf(GameModel.gameRenderer)
            GameModel.gameRenderer.distortValue = 0
        }
        mainChar.onRollOver = () => {
            // this.characterController.startWave()
            line.sx = 0.5;
            gsap.killTweensOf(line)
            gsap.to(line, { sx: 1, duration: 0.2, ease: "back.out" })
            GameModel.renderer.setCursor(true)
            this.game.show()
            this.gameLine.show()

        }
        mainChar.onRollOut = () => {
            // this.characterController.stopWave()
            gsap.killTweensOf(line)
            gsap.to(line, { sx: 0.5, duration: 0.1, ease: "back.in", onComplete: () => { line.sx = 0 } })
            GameModel.renderer.setCursor(false)
            this.game.hide()
            this.gameLine.hide()

        }
        this.kris.show();
        this.characterController.gotoAndIdle(new Vector3(0, 0.1, 0), 1, () => {
        })




        let choose = SceneHandler.getSceneObject("choose")
        let your = SceneHandler.getSceneObject("your")
        let hero = SceneHandler.getSceneObject("hero")
        let exMark = SceneHandler.getSceneObject("exMark")
        choose.setScaler(0)
        your.setScaler(0)
        hero.setScaler(0)
        exMark.setScaler(0)
        let delay = 3


        gsap.to(choose, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay, duration: 0.5 })
        gsap.to(your, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay + 0.1, duration: 0.5 })
        gsap.to(hero, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay + 0.2, duration: 0.5 })
        gsap.to(exMark, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay + 0.3, duration: 0.5 })
        let graphicsDev = SceneHandler.getSceneObject("graphicsDev")
        let pirate = SceneHandler.getSceneObject("pirate")
        graphicsDev.setScaler(0)
        pirate.setScaler(0)
        gsap.to(pirate, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay + 0.7, duration: 0.5 })
        gsap.to(graphicsDev, { sx: 1, sy: 1, sz: 1, ease: "back.out", delay: delay + 0.8, duration: 0.5 })
        gsap.to(GameModel.gameRenderer, {
            distortValue: 1, delay: delay + 1.5, duration: 0.3, onComplete: () => {

                gsap.to(GameModel.gameRenderer, { distortValue: 0, delay: 0.2, duration: 0.5 })
            }
        })
        GameModel.tweenToNonBlack()
    }
    onUI(): void {
        this.charFaceHandler?.onUI()
    }
    destroy() {
        super.destroy();
    }

}
