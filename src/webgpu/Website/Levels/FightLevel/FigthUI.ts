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
import InfoPannel from "./InfoPannel.ts";
import FightPannel from "./FightPannel.ts";
export default class FightUI {

    root = new Object2D()
    private renderer: Renderer;
    backPanel: Sprite;
    infoPanel: InfoPannel;
    infoHolder: Object2D;
    fightPannel: FightPannel;


    constructor(renderer: Renderer) {
        this.renderer = renderer;

        this.infoHolder = new Object2D()
        this.root.addChild(this.infoHolder)
        this.backPanel = new Sprite(renderer, DefaultTextures.getBlack(renderer))
        this.backPanel.sx = 700;
        this.backPanel.sy = 150;
        this.infoHolder.addChild(this.backPanel)

        this.infoPanel = new InfoPannel(renderer)
        this.infoHolder.addChild(this.infoPanel.root)
        this.fightPannel = new FightPannel(renderer)
        this.infoHolder.addChild(this.fightPannel.root)
        this.fightPannel.root.visible = false

    }

    destroy() {


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