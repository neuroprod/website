import GameModel from "../../GameModel.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import gsap from "gsap";
import {MainState} from "../../../Main.ts";

export default class MeatHandler{
    private meat1!: SceneObject3D;
    private meat2!: SceneObject3D;
    private time =0;
    private indexCount =0
    private copy:Array<string>=[]
    private btnTimeLine!: gsap.core.Timeline;

    constructor() {
    }

    init(meat1: SceneObject3D, meat2: SceneObject3D,editBtn:SceneObject3D, edit: MouseInteractionWrapper){

        this.meat1 =meat1;
        this.meat2 =meat2;

        this.copy.push("This website sucks!")
        this.copy.push("Yea, where are the particles?")
        this.copy.push("And the white space?")
        this.copy.push("And the fancy font?")
        this.copy.push("You should edit it!")
        this.copy.push("You can make it better")
        this.copy.push("much better")
        this.copy.push("do it")
        this.copy.push("do it")
        edit.onRollOver =()=>{
            if( this.btnTimeLine)this.btnTimeLine.clear()
            this.btnTimeLine = gsap.timeline()

            this.btnTimeLine.to(editBtn,{sx:1.2,sy:1.2,sz:1.2,duration:0.5,ease:"back.out"},0)
        }
        edit.onRollOut =()=>{
            if( this.btnTimeLine)this.btnTimeLine.clear()
            this.btnTimeLine = gsap.timeline()
            this.btnTimeLine.to(editBtn,{sx:1,sy:1,sz:1,duration:0.3},0)


        }
        edit.onClick=()=>{
         GameModel.setMainState(MainState.editor)


        }
    }

    update(){

        this.time-=Timer.delta
        if(this.time<0){

            if(this.indexCount%2==0){
                GameModel.textBalloonHandler.setModel(this.meat1,[0.2,0.1,0])
            }else{
                GameModel.textBalloonHandler.setModel(this.meat2,[-0.01,0.1,0])
            }
            GameModel.textBalloonHandler.setText(this.copy[this.indexCount])
            this.time =2;
            this.indexCount++
            this.indexCount%=this.copy.length
        }

        GameModel.textBalloonHandler.update()
    }

}
