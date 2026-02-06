import GameModel from "../../GameModel.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import gsap from "gsap";
import { MainState } from "../../../Main.ts";

import SceneHandler from "../../../data/SceneHandler.ts";

export default class MeatHandler {
    private meat1!: SceneObject3D;
    private meat2!: SceneObject3D;
    private time = 0;
    private indexCount = 0
    private copy: Array<string> = []
    private btnTimeLine!: gsap.core.Timeline;
    public enabled: boolean = false;
    private m1pL!: SceneObject3D;
    private m1pR!: SceneObject3D;
    private m2pL!: SceneObject3D;
    private m2pR!: SceneObject3D;
    private button!: SceneObject3D;
    githubBtn!: SceneObject3D;
    constructor() {

    }

    init(meat1: SceneObject3D, meat2: SceneObject3D, editBtn: SceneObject3D, edit: MouseInteractionWrapper,githubBtn: SceneObject3D, github: MouseInteractionWrapper) {

        this.meat1 = meat1;
        this.meat2 = meat2;
        this.copy = []
        this.copy.push("What the fuck is up with this website?")
        this.copy.push("Yea, this website sucks!")
        this.copy.push("I can't believe someone wasted\nhis time on this crap.")
        //this.copy.push("And the scrolling\nthing that they do?")

        //this.copy.push("I want some white space!")
        //this.copy.push("I want a fancy font!")

        this.copy.push("Hey You!")
        this.copy.push("Yes, You!")
        this.copy.push("You should edit it!")
        this.copy.push("You can make it better!")
        this.copy.push("Much better!")
        this.copy.push(" Do it!")
        this.copy.push(" Fix it!")
        this.copy.push("Push the button!")
        this.copy.push("Destroy it all!")

        edit.onRollOver = () => {
            if (this.btnTimeLine) this.btnTimeLine.clear()
            this.btnTimeLine = gsap.timeline()
            GameModel.renderer.setCursor(true)
            this.btnTimeLine.to(editBtn, { sx: 1.1, sy: 1.1, sz: 1.2, duration: 0.5, ease: "back.out" }, 0)
        }
        edit.onRollOut = () => {
            if (this.btnTimeLine) this.btnTimeLine.clear()
            this.btnTimeLine = gsap.timeline()
            this.btnTimeLine.to(editBtn, { sx: 1, sy: 1, sz: 1, duration: 0.3 }, 0)
            GameModel.renderer.setCursor(false)

        }
        edit.onClick = () => {
            GameModel.goBackToLevel = "This"
            GameModel.setMainState(MainState.editor)


        }
        this.githubBtn =githubBtn;
        githubBtn.hide()
         github.onRollOver = () => {
         
            GameModel.renderer.setCursor(true)
          
        }
        github.onRollOut = () => {
           
            
            GameModel.renderer.setCursor(false)

        }
        github.onClick = () => {
               // @ts-ignore
              window.open("https://github.com/neuroprod/website", '_blank').focus();


        }
        this.indexCount = 0;
        this.button = editBtn
        this.button.setScaler(0.0)
        this.m1pL = SceneHandler.getSceneObject("m1pL")


        this.m1pR = SceneHandler.getSceneObject("m1pR")



        this.m2pL = SceneHandler.getSceneObject("m2pL")


        this.m2pR = SceneHandler.getSceneObject("m2pR")


    }

    update() {
        if (!this.enabled) return
        this.time -= Timer.delta
        if (this.time < 0) {

            if (this.indexCount % 2 == 1) {
                GameModel.textBalloonHandler.setModel(this.meat1, [0.2, 0.05, 0])
            } else {
                GameModel.textBalloonHandler.setModel(this.meat2, [0.05, 0.1, 0])
            }
            GameModel.textBalloonHandler.setText(this.copy[this.indexCount])
            if (this.indexCount == 4) {

                this.m2pL.setPosition(-0.0009767480974801892 - 0.001, 0.000004354680553351337, 0.00007301144147933702)
                this.m2pR.setPosition(0.000571303997929512 - 0.001, 0.000139665003704742, 0.0018431549561302996)
            }
            if (this.indexCount == 3) {
                this.m1pR.setPosition(-0.00810517918170008, -0.00033073023909241384, 0.00016850744404123263)
                this.m1pL.setPosition(-0.012850655509481876, 0.00045434851853159985, 0.003405766999831278)
            }
            if (this.indexCount == 5) {
                gsap.to(this.button, { sx: 1, sy: 1, sz: 1, ease: "elastic.out" })
this.githubBtn.sx=this.githubBtn.sy =0
this.githubBtn.show();
 gsap.to(this.githubBtn, { sx: 1, sy: 1, sz: 1, duration:0.2,delay:1.0 })
            }
            this.time = 2.5;
            this.indexCount++
            if (this.indexCount == this.copy.length) {
                this.indexCount -= 6
            }

        }

        GameModel.textBalloonHandler.update()
    }
    destroy() {
        GameModel.textBalloonHandler.hideText()
    }

}
