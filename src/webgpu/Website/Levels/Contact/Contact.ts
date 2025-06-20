import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import {Howl} from "howler";


export default class Contact extends NavigationLevel{
    private bgSound!: Howl;

private prevBeat=0
    private beatCount=0
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Contact")).then(() => {
            LoadHandler.stopLoading()

        });

        this.bgSound = new Howl({
            src: ['sound/ritmo-loop-bunciac-313953.mp3'],
            loop:true,
            autoplay:true,
            onload: ()=>{
this.beatCount=0
                this.bgSound.fade(0, 0.5, 2000);
            }
        });
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")



    }

    public update() {
        super.update()
        let s =Math.round( this.bgSound.seek()*1000)
        s%=462;
        s/=462;
        if(s<this.prevBeat){
            console.log( this.beatCount)
            this.beatCount++
            this.beatCount%=8
        }
        this.prevBeat=s;


    }

    destroy() {
        super.destroy()
      this.bgSound.unload()
    }


}
