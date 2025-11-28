

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";

import GameModel from "../../GameModel.ts";


import { BaseLevel } from "../BaseLevel.ts";
import { Vector3 } from "@math.gl/core";
import UI from "../../../lib/UI/UI.ts";
import FightUI from "./FigthUI.ts";
import GameInput from "../../GameInput.ts";
import LevelHandler from "../LevelHandler.ts";


enum FSTATE {
    START,
    PAUZE,
    FIGHT_SELECT,
    WAIT,

}

export class FightLevel extends BaseLevel {
    private tl!: gsap.core.Timeline;


    fightUI!: FightUI;


    state: FSTATE = FSTATE.START
    fightSelectIndex: number = 0;
    private pirate!: SceneObject3D;
    private landlord!: SceneObject3D;
    pirateLife: number = 1;
    landlordLife: number = 1;
    nextFunction!: () => void;
    waitForNext = false;

    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("c27ed274-ed0a-4d6e").then(() => {



            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene("697e1443-b2d5-4871").then(() => {
                LoadHandler.stopLoading()
            });



            LoadHandler.stopLoading()
        })

    }
    endAnime(): number {

        GameModel.tweenToBlack()
        return 0.5;
    }
    configScene() {


        LoadHandler.onComplete = () => { }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)

        sceneHandler.getSceneObject("patch").hide()
        let char = sceneHandler.getSceneObject("charRoot")
        char.x = 0.6;
        char.y = 0;
        char.ry = Math.PI - 0.2
        char.setScaler(1.2)
        this.pirate = char;
        let eyeLeft = sceneHandler.getSceneObject("eyeLeft")
        eyeLeft.hide()
        let pupilLeft = sceneHandler.getSceneObject("pupilLeft")
        pupilLeft.hide()
        this.landlord = sceneHandler.getSceneObject("rootLandlord")
        this.landlord.setScaler(1.2)
        this.landlord.x = -0.6
        this.landlord.y = 0
        this.landlord.z = 0;



        sceneHandler.getSceneObject("landlordArmPoint").hide()




        let x = 0
        let y = 0.3
        GameModel.gameCamera.setLockedView(new Vector3(x, y, 0), new Vector3(x, y, 2))
        GameModel.tweenToNonBlack()

        this.fightUI = GameModel.UI2D.fightUI;
        this.pirateLife = 1;
        this.landlordLife = 1;

        this.setFirstShot()
    }

    onUI(): void {
        if (UI.LButton("fightSucces",)) {
            this.doPirateFightSucces()
        }
        if (UI.LButton("fightFail",)) {
            this.doPirateFightFail()
        }
        if (UI.LButton("healSucces",)) {
            this.doPirateHealSucces()
        }
        if (UI.LButton("healFail",)) {
            this.doPirateHealFail()
        }
    }

    getTimeline() {
        if (this.tl) this.tl.clear()
        this.tl = gsap.timeline()
        return this.tl;
    }
    setFightPanel() {
        this.state = FSTATE.FIGHT_SELECT
        this.fightSelectIndex = 0;
        this.fightUI.setFightPannel(this.fightSelectIndex)
    }
    setNextCall(nextFunction: () => void) {
        this.state = FSTATE.WAIT

        this.nextFunction = nextFunction;
        this.fightUI.showNext()

    }
    update() {
        super.update();


        let pPos = this.pirate.getWorldPos().add([0, -0.3, 0])
        pPos.transform(GameModel.gameCamera.camera.viewProjection)



        let lPos = this.landlord.getWorldPos().add([0, -0.2, 0])
        lPos.transform(GameModel.gameCamera.camera.viewProjection)

        this.fightUI.setCharPositionsLife(pPos, this.pirateLife, lPos, this.landlordLife)
        if (this.state == FSTATE.WAIT) {
            if (GameInput.space) {

                this.nextFunction()
                GameInput.reset();
            }
        }

        else if (this.state == FSTATE.FIGHT_SELECT) {
            let vInput = GameInput.vInput;
            if (vInput != 0) {
                this.fightSelectIndex += vInput + 3;
                this.fightSelectIndex %= 3;
                this.fightUI.setFightPannel(this.fightSelectIndex)
                GameInput.reset();
            }

            else if (GameInput.space) {
                if (this.fightSelectIndex == 0) {
                    this.doPirateFight()
                }
                if (this.fightSelectIndex == 1) {
                    this.doPirateHeal()
                }
                if (this.fightSelectIndex == 2) {
                    this.doPirateRun()
                }
                GameInput.reset();
            }

        }

    }
    setFirstShot() {
        let tl = this.getTimeline()
        this.state = FSTATE.PAUZE


        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FShot")) }, [], 0)
        tl.to(this, { pirateLife: 0.6 }, 1)
        tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 2)


    }
    doLandlordFight() {
        if (Math.random() > 0.5) {
            this.doLandlordFightSucces()
        } else {
            this.doLandlordFightFail()
        }
    }
    doLandlordFightFail() {
        this.state = FSTATE.PAUZE

        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel("billy fight fail") }, [], 0)

        tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 2)



    }
    doLandlordFightSucces() {
        this.state = FSTATE.PAUZE

        let target = Math.max(this.pirateLife - 0.2, 0);


        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel("billy fight succes") }, [], 0)
        tl.to(this, { pirateLife: target }, 2)
        if (target == 0) {

            tl.call(() => {
                GameModel.happyEnd = false;
                this.setNextCall(this.doLose.bind(this))
            }, [], 2)
        } else {
            tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 2)

        }

    }
    doPirateFight() {
        if (Math.random() > 0.3) {
            this.doPirateFightSucces()
        } else {
            this.doPirateFightFail()
        }
    }
    doPirateFightSucces() {

        this.state = FSTATE.PAUZE

        let target = Math.max(this.landlordLife - 0.34, 0);


        let tl = this.getTimeline()

        tl.to(this, { landlordLife: target }, 1)
        if (target == 0) {
            tl.call(() => { this.fightUI.setInfoPanel("you win") }, [], 0)
            tl.call(() => {
                GameModel.happyEnd = true;
                this.setNextCall(this.doWin.bind(this))
            }, [], 2)
        } else {


            tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FFightSucces")) }, [], 0)
            tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 2)




        }

    }
    doPirateFightFail() {
        this.state = FSTATE.PAUZE




        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FFightFail")) }, [], 0)

        tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 2)


    }
    doPirateHeal() {
        if (Math.random() > 0.5 || this.pirateLife < 0.3) {
            this.doPirateHealSucces()
        } else {
            this.doPirateHealFail()
        }
    }
    doPirateHealSucces() {


        this.state = FSTATE.PAUZE
        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FHealSucces")) }, [], 0)
        let target = Math.min(this.pirateLife + 0.3, 1);

        tl.to(this, { pirateLife: target }, 2)

        tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 2)



    }
    doPirateHealFail() {
        this.state = FSTATE.PAUZE
        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FHealFail")) }, [], 0)
        let target = Math.min(this.pirateLife - 0.2);
        tl.to(this, { pirateLife: target }, 2)
        tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 2)

    }


    doPirateRun() {


        let tl = this.getTimeline()
        this.state = FSTATE.PAUZE
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FRun")) }, [], 0)
        tl.to(this, { pirateLife: 0.0 }, 2)

        tl.call(() => {
            GameModel.happyEnd = false;
            this.setNextCall(this.doLose.bind(this))

        }, [], 2)
    }
    doWin() {
        LevelHandler.setLevel("Sea")
    }
    doLose() {
        LevelHandler.setLevel("Dead")
    }
    destroy() {
        super.destroy()
        if (this.tl) this.tl.clear()

    }


}


