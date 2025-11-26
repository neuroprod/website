import Renderer from "../../../lib/Renderer";
import AnimatedTextMaterial from "../../../lib/twoD/AnimatedTextMaterial.ts";
import Font from "../../../lib/twoD/Font";
import FontPool from "../../../lib/twoD/FontPool";
import Object2D from "../../../lib/twoD/Object2D";
import Text from "../../../lib/twoD/Text.ts";
import gsap from "gsap";
import SoundHandler from "../../SoundHandler.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import Sprite from "../../../lib/twoD/Sprite.ts";
import InfoPanel from "./InfoPanel.ts";
import FightPanel from "./FightPanel.ts";
import { Vector3 } from "@math.gl/core";
import LifeBar from "./LifeBar.ts";
export default class FightUI {


    root = new Object2D()
    private renderer: Renderer;
    backPanel: Sprite;
    infoPanel: InfoPanel;
    infoHolder: Object2D;
    fightPannel: FightPanel;
    pirateLife: LifeBar;
    landLordLife: any;


    constructor(renderer: Renderer) {
        this.renderer = renderer;

        this.infoHolder = new Object2D()
        this.root.addChild(this.infoHolder)
        this.backPanel = new Sprite(renderer, DefaultTextures.getBlack(renderer))
        this.backPanel.sx = 700;
        this.backPanel.sy = 150;
        this.infoHolder.addChild(this.backPanel)

        this.infoPanel = new InfoPanel(renderer)
        this.infoHolder.addChild(this.infoPanel.root)
        this.fightPannel = new FightPanel(renderer)
        this.infoHolder.addChild(this.fightPannel.root)
        this.fightPannel.root.visible = false

        this.pirateLife = new LifeBar(renderer)
        this.root.addChild(this.pirateLife.root)

        this.landLordLife = new LifeBar(renderer)
        this.root.addChild(this.landLordLife.root)

    }
    setCharPositionsLife(pPos: Vector3, pLife: number, lPos: Vector3, lLife: number) {
        this.pirateLife.root.x = pPos.x * this.renderer.htmlWidth / 2
        this.pirateLife.root.y = pPos.y * this.renderer.htmlHeight / 2
        this.pirateLife.setLive(pLife)
        this.landLordLife.root.x = lPos.x * this.renderer.htmlWidth / 2
        this.landLordLife.root.y = lPos.y * this.renderer.htmlHeight / 2
        this.landLordLife.setLive(lLife)

    }

    destroy() {


    }
    setInfoPanel(text: string) {
        this.infoPanel.show()
        this.fightPannel.hide()
        this.infoPanel.setText(text)
    }
    setFightPannel(index: number) {
        this.infoPanel.hide()
        this.fightPannel.show(index)
        console.log("setPannelIndex", index)
    }
    setLevel(key: string) {


        if (key == "Fight") {
            this.root.visible = true


        } else {
            this.root.visible = false
        }

    }
    public update() {
        if (!this.root.visible) return

        this.root.x = this.renderer.htmlWidth / 2
        this.root.y = this.renderer.htmlHeight / 2
        this.infoHolder.y = this.renderer.htmlHeight / 3
    }

}