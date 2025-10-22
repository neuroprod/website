import Renderer from "../../lib/Renderer.ts";
import SoundHandler from "../SoundHandler.ts";
import Timer from "../../lib/Timer.ts";
import Model from "../../lib/model/Model.ts";
import TextBalloonFontMaterial from "../conversation/TextBalloonFontMaterial.ts";
import TextBalloonFontMesh from "../conversation/TextBalloonFontMesh.ts";
import ProjectData from "../../data/ProjectData.ts";
import GameModel from "../GameModel.ts";

export default class CoinHandler {

    numCoins = 0;//622; 999987470
    displayCoins = 0;//622; 999987470
    displayTime = 0

    constructor(renderer: Renderer) {

    }
    public addCoins(numCoins: number) {
        this.numCoins += numCoins;

    }
    update() {


        //  this.textModel.visible =true
        if (this.numCoins != this.displayCoins) {

            this.displayTime -= Timer.delta;
            if (this.displayTime < 0) {

                if (this.numCoins < this.displayCoins) {
                    this.displayCoins--
                    SoundHandler.playCoin()
                }
                else {
                    this.displayCoins++
                    SoundHandler.playCoin()
                }
                // this.textMesh.setText(""+this.displayCoins, ProjectData.font, 0.15)
                if (this.numCoins != this.displayCoins) {
                    this.displayTime = 0.1;
                }
            }

        }


    }

    hide() {

        // this.textModel.visible=false
    }
    show() {
        // this.textModel.visible=true
    }
}
