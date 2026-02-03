import { Textures } from "../../../data/Textures";
import Renderer from "../../../lib/Renderer";
import DefaultTextures from "../../../lib/textures/DefaultTextures";
import Object2D from "../../../lib/twoD/Object2D";
import Sprite from "../../../lib/twoD/Sprite";
import LifeBarMaterial from "./LifeBarMaterial";

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

let s =0.8
        this.frontPanel = new Sprite(renderer, renderer.getTexture(Textures.LIFE_BAR))
        this.frontPanel.material =new LifeBarMaterial(renderer)
        this.frontPanel.material.setTexture("texture",renderer.getTexture(Textures.LIFE_BAR))
        this.frontPanel.sx = s;
        this.frontPanel.sy =s;




        this.backPanel = new Sprite(renderer, renderer.getTexture(Textures.LIFE_BAR_BACK))
        this.backPanel.sx = s;
        this.backPanel.sy =s;
        this.root.addChild(this.backPanel)



        this.root.addChild(this.frontPanel)

    }
    setLive(live: number) {
   
this.frontPanel.material.setUniform("life",live)
        
    }


}