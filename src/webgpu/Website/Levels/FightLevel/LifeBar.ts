import Renderer from "../../../lib/Renderer";
import DefaultTextures from "../../../lib/textures/DefaultTextures";
import Object2D from "../../../lib/twoD/Object2D";
import Sprite from "../../../lib/twoD/Sprite";

export default class LifeBar {
    backPanel: Sprite;
    frontPanel: Sprite;
    hide() {
        this.root.visible = false
    }
    show() {
        this.root.visible = true
    }


    root = new Object2D()

    constructor(renderer: Renderer) {


        this.frontPanel = new Sprite(renderer, DefaultTextures.getWhite(renderer))
        this.frontPanel.sx = 150;
        this.frontPanel.sy = 15;




        this.backPanel = new Sprite(renderer, DefaultTextures.getBlack(renderer))
        this.backPanel.sx = this.frontPanel.sx + 10;
        this.backPanel.sy = this.frontPanel.sy + 10
        this.root.addChild(this.backPanel)



        this.root.addChild(this.frontPanel)

    }
    setLive(live: number) {
        this.frontPanel.sx = 150 * live;
        this.frontPanel.x = -75 + this.frontPanel.sx / 2
    }


}