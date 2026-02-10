

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
import SoundHandler from "../../SoundHandler.ts";
import Animation from "../../../sceneEditor/timeline/animation/Animation.ts";
import GameCamera from "../../GameCamera.ts";
import FishstickHandler from "../../handlers/FishstickHandler.ts";

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
    armGun!: SceneObject3D;
    kickAnimation!: Animation
    pirateFrame = 0
    landlordFrame = 0
    charGotHitAnimation!: Animation;
    kickSplash!: SceneObject3D;
    hitLandAnimation!: Animation;
    fishTrowAnimation!: Animation;
    fishTrow!: SceneObject3D;
    billyDeadAnimation!: Animation;
    eyeLeft!: SceneObject3D;
    pupilLeft!: SceneObject3D;
    bullet!: SceneObject3D;
    landlordArm!: SceneObject3D;
    splash!: SceneObject3D;
    firstShot: boolean = true;
    charHealAnimation!: Animation;
    fishTicks: Array<SceneObject3D> = [];
    eyeRight!: SceneObject3D;
    pupilRight!: SceneObject3D;
    pirateDeadAnimation!: Animation;
    fishTrowMissAnimation!: Animation;
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


        this.fishTicks = []
        this.fishTicks.push(sceneHandler.getSceneObject("fish1"))
        this.fishTicks.push(SceneHandler.getSceneObject("fish2"))
        this.fishTicks.push(SceneHandler.getSceneObject("fish3"))
        this.fishTicks.push(SceneHandler.getSceneObject("fish4"))
        this.fishTicks.reverse()






        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.coinHandler.show()
        sceneHandler.getSceneObject("patch").hide()
        let char = sceneHandler.getSceneObject("charRoot")
        char.x = 0.6;
        char.y = 0;
        char.ry = Math.PI - 0.2
        char.setScaler(1.2)
        this.pirate = char;
        this.eyeLeft = sceneHandler.getSceneObject("eyeLeft")
        this.eyeRight = sceneHandler.getSceneObject("eyeRight")

        // eyeLeft.hide()
        this.pupilLeft = sceneHandler.getSceneObject("pupilLeft")
        this.pupilRight = sceneHandler.getSceneObject("pupilRight")
        // pupilLeft.hide()
        this.landlord = sceneHandler.getSceneObject("rootLandlord")
        this.landlord.setScaler(1.2)
        this.landlord.x = -0.6
        this.landlord.y = 0
        this.landlord.z = 0;


        this.kickSplash = sceneHandler.getSceneObject("kickSplash")
        this.kickSplash.hide()
        this.bullet = sceneHandler.getSceneObject("bullet")
        this.bullet.x = 0
        this.bullet.y = 0.3284
        this.splash = sceneHandler.getSceneObject("splash")
        this.splash.hide();
        sceneHandler.getSceneObject("landlordArmPoint").hide()

        GameModel.setBlack(0)


        let x = 0
        let y = this.bullet.y
        GameModel.gameCamera.camera.near = 0.1
        GameModel.gameCamera.setLockedView(new Vector3(x, y, 0), new Vector3(x, y, 0.2))

        this.fightUI = GameModel.UI2D.fightUI;
        this.pirateLife = 1;
        this.landlordLife = 1;
        this.kickAnimation = SceneHandler.sceneAnimationsByName.get("kick") as Animation;
        this.charGotHitAnimation = SceneHandler.sceneAnimationsByName.get("charGotHit2") as Animation;
        this.fishTrowAnimation = SceneHandler.sceneAnimationsByName.get("fishTrow4") as Animation;
        this.fishTrowMissAnimation = SceneHandler.sceneAnimationsByName.get("fishTrowmiss") as Animation;
        this.hitLandAnimation = SceneHandler.sceneAnimationsByName.get("hitLand") as Animation;

        this.charHealAnimation = SceneHandler.sceneAnimationsByName.get("fishEat") as Animation;


        this.landlordArm = sceneHandler.getSceneObject("LandlordArmGun")
        this.landlordArm.rz = 0.21
        this.fishTrow = sceneHandler.getSceneObject("fishTrow")
        this.fishTrow.hide()

        this.billyDeadAnimation = SceneHandler.sceneAnimationsByName.get("billyDead") as Animation;
        this.pirateDeadAnimation = SceneHandler.sceneAnimationsByName.get("dead") as Animation;
        this.firstShot = true
        this.setFirstShot()
    }

    onUI(): void {

        UI.LText(GameModel.fishstickHandler.numFishsticks + "", "num fishsticks")
        if (UI.LButton("addFishstick")) GameModel.fishstickHandler.addFishstick(1)

        if (UI.LBool("moveBilly", false)) {
            UI.LFloat(this.landlord, "y", "y")
            UI.LFloat(this.landlord, "x", "x")

        }
        if (UI.LBool("moveSplash", false)) {
            UI.LFloat(this.kickSplash, "x", "x")
            UI.LFloat(this.kickSplash, "y", "y")

            UI.LFloat(this.kickSplash, "z", "z")
        }

        if (UI.LButton("fightSucces",)) {
            this.doPirateFightSucces()
        }
        if (UI.LButton("fightFail",)) {
            this.doPirateFightFail()
        }
        if (UI.LButton("heal",)) {
            this.doPirateHeal()
        }
        if (UI.LButton("healSucces",)) {
            this.doPirateHealSucces()
        }
        if (UI.LButton("healFail",)) {
            this.doPirateHealFail()
        }
        if (UI.LButton("billyFightSucc",)) {
            this.doLandlordFightSucces()
        }
        if (UI.LButton("billyFightFail",)) {
            this.doLandlordFightFail()
        }
        if (UI.LButton("deadBlow",)) {
            this.doDeadBlow()
        }
    }

    getTimeline(updateFuction: any = null) {
        if (this.tl) this.tl.clear()

        if (updateFuction) {
            this.tl = gsap.timeline({ onUpdate: updateFuction })
        } else {
            this.tl = gsap.timeline()
        }

        return this.tl;
    }
    setFishsticks() {
        let n = GameModel.fishstickHandler.numFishsticks
        for (let i = 0; i < this.fishTicks.length; i++) {
            if (i <= n - 1) {
                this.fishTicks[i].show()
            }
            else {
                this.fishTicks[i].hide()
            }
        }

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


        let pPos = this.pirate.getWorldPos().add([0, 0.3, 0])
        pPos.y *= -1
        pPos.transform(GameModel.gameCamera.camera.viewProjection)



        let lPos = this.landlord.getWorldPos().add([0, 0.2, 0])
        lPos.y *= -1
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


        this.fightUI.show()
        let time = 0
        tl.call(() => { SoundHandler.playGunShot() }, [], time)
        tl.call(() => { GameModel.tweenToNonBlack(1) }, [], time)

        this.bullet.x = -0.03
        tl.to(this.bullet, { x: 0, duration: 3.3, ease: "power1.in" }, time)
        time += 1
        tl.call(() => {
            let x = 0
            let y = 0.3
            GameModel.gameCamera.camera.near = 0.1
            GameModel.gameCamera.TweenToLockedView(new Vector3(x, y, 0), new Vector3(x, y, 2), 0.5)
        }, [], time)
        tl.to(this.bullet, { rz: 0.21, duration: 0.3 }, time)
        tl.to(GameModel.gameCamera.camera, { near: 0.3, duration: 0.5 }, time)
        let eyeWorld = this.eyeLeft.getWorldPos()
        this.splash.setPosition(eyeWorld.x - 0.01, eyeWorld.y - 0.01, eyeWorld.z + 0.1)
        this.splash.sx = this.splash.sy = 1
        time += 0.3
        tl.to(this.bullet, { x: eyeWorld.x, y: eyeWorld.y, z: eyeWorld.z + 0.1, duration: 0.5, ease: "power4.in" }, time)
        time += 0.5
        tl.call(() => { this.bullet.hide(); this.pupilLeft.hide(); this.eyeLeft.hide(); this.splash.show(); SoundHandler.playEyeHit(), GameModel.gameCamera.screenShakeHit(-0.01) }, [], time)
        tl.to(this.splash, { sx: 1.2, sy: 1.2, duration: 0.1, ease: "power3.out" }, time)


        time += 0.1
        tl.call(() => { this.splash.hide() }, [], time)
        time += 1
        tl.to(this.landlordArm, { rz: 0, duration: 1.5, ease: "power2.inout" }, time)
        time += 1
        tl.to(this, { pirateLife: 0.6, duration: 2 }, time)
        time += 1

        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FShot")) }, [], time)
        tl.call(() => { this.setNextCall(this.fightBackText.bind(this)) }, [], time)


    }
    fightBackText() {
        let tl = this.getTimeline()

        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FFightBack")) }, [], 0)
        tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 0)

    }
    doLandlordFight() {


        if (GameModel.fishstickHandler.numFishsticks <= 0) {
            let tl = this.getTimeline()
            tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("outOfFishSticks")) }, [], 0)
            tl.call(() => { this.setNextCall(this.doDeadBlow.bind(this)) }, [], 0)
        }

        else if (Math.random() > 0.5) {
            this.doLandlordFightSucces()
        } else {
            this.doLandlordFightFail()
        }
    }
    doDeadBlow() {
        this.state = FSTATE.PAUZE
        GameModel.happyEnd = false;
        this.pirateFrame = 0
        let tl = this.getTimeline(() => {
            this.pirateDeadAnimation.setTime(this.pirateFrame)
        })
        let lR = this.landlordArm.rz;
        this.landlordArm.rz = 0.28
        let startPos = this.landlordArm.getWorldPos(new Vector3(0.25, 0.025, 0));
        this.landlordArm.rz = lR;
        let endPos = this.pupilRight.getWorldPos();



        this.splash.setPosition(endPos.x - 0.01, endPos.y - 0.01, endPos.z + 0.1)
        this.splash.sx = this.splash.sy = 1

        this.bullet.setPositionV(startPos)
        tl.to(this.landlordArm, { rz: 0.28, duration: 2 }, 0)
        tl.call(() => { this.bullet.show(), SoundHandler.playGunShot() }, [], 2)
        let time = 0.4
        tl.to(this.bullet, { x: endPos.x, y: endPos.y, z: endPos.z, duration: time, ease: "power2.in" }, 2)
        time += 2;
        tl.call(() => { this.bullet.hide(); this.pupilRight.hide(); GameModel.tweenToBlack(1); this.eyeRight.hide(); this.splash.show(); SoundHandler.playEyeHit(), GameModel.gameCamera.screenShakeHit(-0.01) }, [], time)
        tl.to(this.splash, { sx: 1.2, sy: 1.2, duration: 0.1, ease: "power3.out" }, time)
        time += 0.1
        tl.call(() => { this.splash.hide(), this.pirate.x = 0.8; }, [], time)
        tl.to(this, { pirateLife: 0 }, time)

        tl.to(this, { pirateFrame: 15, duration: 1 }, time)
        tl.to(this.pirate, { x: 1, y: -0.1, ease: "power1.in", duration: 1 }, time)
        tl.call(() => { LevelHandler.setLevel("Dead") }, [], time + 1)

    }
    doLandlordFightFail() {
        this.state = FSTATE.PAUZE
        let tl = this.getTimeline(() => {
        })
        let lR = this.landlordArm.rz;
        this.landlordArm.rz = 0.15
        let startPos = this.landlordArm.getWorldPos(new Vector3(0.25, 0.025, 0));
        this.landlordArm.rz = lR;
        let endPos = this.pupilRight.getWorldPos(new Vector3(0, -0.1, -0.2));
        let dir = endPos.clone().subtract(startPos)
        endPos.add(dir)
        endPos.add(dir)


        this.bullet.setPositionV(startPos)
        tl.to(this.landlordArm, { rz: 0.15, duration: 1 }, 0)
        tl.call(() => { this.bullet.show(), SoundHandler.playGunShot() }, [], 1)
        tl.to(this.bullet, { x: endPos.x, y: endPos.y, z: endPos.z, duration: 2 }, 1)


        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("BillyFightFail")); this.bullet.hide() }, [], 2)

        tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 2)



    }
    doLandlordFightSucces() {
        this.state = FSTATE.PAUZE

        let target = Math.max(this.pirateLife - 0.2, 0);
        if (target == 0) {

            this.doDeadBlow();
            return;
        }
        this.pirateFrame = 0
        this.landlordFrame = 0
        let tl = this.getTimeline(() => {
            this.kickAnimation.setTime(this.landlordFrame)
            this.charGotHitAnimation.setTime(this.pirateFrame)
        })
        this.kickSplash.setPosition(0.47, 0.46, 0.06)
        this.kickSplash.hide()
        this.kickSplash.sx = this.kickSplash.sy = 1
        tl.to(this, { pirateFrame: 8, duration: 0.2 }, 1.6)
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("BillyFightSucces")) }, [], 3)
        //prep

        tl.to(this, { landlordFrame: 5 }, 0.5)


        //hit
        tl.to(this, { landlordFrame: 18, duration: 0.2 }, 1.5)
        tl.to(this.landlord, { x: 0.2, y: 0.185, duration: 0.2 }, 1.5)
        tl.call(() => { SoundHandler.playKick() }, [], 1.5)
        tl.call(() => { this.kickSplash.show() }, [], 1.6)
        tl.to(this, { pirateFrame: 8, duration: 0.2 }, 1.6)
        tl.to(this.kickSplash, { sx: 3, sy: 3, duration: 0.2 }, 1.6)
        tl.call(() => { this.kickSplash.hide() }, [], 1.8)


        tl.to(this, { pirateFrame: 0, duration: 0.5 }, 2.7)
        tl.to(this, { landlordFrame: 60, duration: 0.3 }, 2.7)
        tl.to(this.landlord, { x: -0.6, y: 0, duration: 0.3, ease: "power4.out" }, 2.7)
        tl.to(this, { pirateLife: target }, 2.2)



        if (target == 0) {

            tl.call(() => {

                this.setNextCall(this.doLose.bind(this))
            }, [], 3)
        } else {
            tl.call(() => { this.setNextCall(this.setFightPanel.bind(this)) }, [], 4)

        }

    }
    doPirateFight() {




        if (Math.random() > 0.3 || this.firstShot) {
            this.doPirateFightSucces()
            this.firstShot = false;
        } else {
            this.doPirateFightFail()
        }
    }
    doPirateFightSucces() {

        this.state = FSTATE.PAUZE
        this.fightUI.hidePanels()
        let target = Math.max(this.landlordLife - 0.34, 0);
        this.pirateFrame = 0
        this.landlordFrame = 0
        this.kickSplash.setPosition(-0.4, 0.38, 0.08)
        this.kickSplash.sx = this.kickSplash.sy = 1
        this.kickSplash.hide()

        let tl = this.getTimeline(() => {

            if (target == 0) {
                this.billyDeadAnimation.setTime(this.landlordFrame)
            } else {
                this.hitLandAnimation.setTime(this.landlordFrame)
            }
            this.fishTrowAnimation.setTime(this.pirateFrame)
        })

        tl.to(this, { pirateFrame: 8, duration: 0.5, ease: "power3.out" }, 1)
        tl.call(() => {
            this.fishTrow.show()
            GameModel.fishstickHandler.removeFishstick(1)
            this.setFishsticks()


        }, [], 1.3)
        tl.to(this, { pirateFrame: 19, duration: 0.5, ease: "power2.in" }, 2.5)
        tl.call(() => { SoundHandler.playKick() }, [], 2.9)
        if (target != 0) {
            tl.to(this, { landlordFrame: 10, duration: 0.05, ease: "power2.out" }, 3)
        }
        tl.call(() => { this.kickSplash.show(); this.fishTrow.hide() }, [], 3)

        tl.to(this.kickSplash, { sx: 3, sy: 3, duration: 0.2, ease: "power2.out" }, 3)
        tl.call(() => { this.kickSplash.hide() }, [], 3.2)
        if (target == 0) {
            tl.to(this, { landlordFrame: 30, duration: 1.5, ease: "power2.out" }, 3)
            tl.to(this, { landlordFrame: 39, duration: 2, ease: "power2.inout" }, 5)
            tl.to(this, { landlordFrame: 40, duration: 0.2, ease: "power2.inout" }, 7)
        } else {
            tl.to(this, { landlordFrame: 0, duration: 1.5, ease: "power2.inout" }, 3.4)
        }

        tl.to(this, { pirateFrame: 60, duration: 1, ease: "power2.in" }, 3.2)
        tl.to(this, { landlordLife: target }, 3)
        if (target == 0) {
            tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("YouWin")) }, [], 3)
            tl.call(() => {

                this.setNextCall(this.doWin.bind(this))
            }, [], 9)
        } else {


            tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FFightSucces")) }, [], 4)
            tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 5)




        }

    }
    doPirateFightFail() {
        this.state = FSTATE.PAUZE




        this.pirateFrame = 0


        let tl = this.getTimeline(() => {


            this.fishTrowMissAnimation.setTime(this.pirateFrame)
        })

        tl.to(this, { pirateFrame: 8, duration: 0.5, ease: "power3.out" }, 1)
        tl.call(() => {
            this.fishTrow.show()
            GameModel.fishstickHandler.removeFishstick(1)
            this.setFishsticks()


        }, [], 1.3)
        tl.to(this, { pirateFrame: 22, duration: 1, ease: "power2.in" }, 2.5)

        tl.call(() => { this.fishTrow.hide() }, [], 3.5)



        tl.to(this, { pirateFrame: 60, duration: 1, ease: "power2.in" }, 3.5)
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FFightFail")) }, [], 3.5)

        tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 4)


    }
    doPirateHeal() {

        this.state = FSTATE.PAUZE


        this.pirateFrame = 0;

        let animeTime = 0.8
        let totaltime = 0

        let tl = this.getTimeline(() => {

            this.charHealAnimation.setTime(this.pirateFrame)
        })


        tl.to(this, { pirateFrame: 17, duration: animeTime })
        totaltime += animeTime
        tl.call(() => {
            this.fishTrow.show()
            GameModel.fishstickHandler.removeFishstick(1)
            this.setFishsticks()

        }, [], totaltime)

        totaltime += 0.6

        tl.call(() => {
            SoundHandler.playHeal();

        }, [], totaltime)
        //eat
        animeTime = 1.5
        tl.to(this, { pirateFrame: 41, duration: animeTime }, totaltime)
        totaltime += animeTime

        tl.call(() => {
            this.fishTrow.hide()


        }, [], totaltime)


        tl.to(this, { pirateFrame: 60, duration: 0.8 }, totaltime)
        totaltime += animeTime + 0.4
        tl.call(() => {
            if (Math.random() > 0.2 || this.pirateLife < 0.3) {
                this.doPirateHealSucces()
            } else {
                this.doPirateHealFail()
            }

        }, [], totaltime)






    }
    doPirateHealSucces() {



        let tl = this.getTimeline()
        tl.call(() => { this.fightUI.setInfoPanel(GameModel.getCopy("FHealSucces")) }, [], 0)
        let target = Math.min(this.pirateLife + 0.6, 1);

        tl.to(this, { pirateLife: target }, 2)

        tl.call(() => { this.setNextCall(this.doLandlordFight.bind(this)) }, [], 2)



    }
    doPirateHealFail() {

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


        tl.call(() => {

            this.setNextCall(this.doDeadBlow.bind(this))

        }, [], 2)
    }
    doWin() {
        GameModel.happyEnd = true;
        LevelHandler.setLevel("Sea")
    }
    doLose() {
        GameModel.happyEnd = false;
        LevelHandler.setLevel("Dead")
    }
    destroy() {
        super.destroy()

        GameModel.gameCamera.camera.near = 0.3
        this.fishTicks = []

        if (this.tl) this.tl.clear()

    }


}


