import Renderer2D from "../../lib/twoD/Renderer2D.ts";

import Object2D from "../../lib/twoD/Object2D.ts";
import Renderer from "../../lib/Renderer.ts";
import Menu from "./Menu.ts";
import GameModel from "../GameModel.ts";
import GuageLevel from "../Levels/guage/GuageLevel.ts";
import GuageLevel2D from "../Levels/guage/GuageLevel2D.ts";

export default class UI2D {
    private renderer2D: Renderer2D;
    private root: Object2D;
    private menu: Menu;
    guageLevel2D: GuageLevel2D;

    constructor(renderer: Renderer, renderer2D: Renderer2D) {
        this.renderer2D = renderer2D
        this.root = renderer2D.root




        this.menu = new Menu(renderer)
        this.guageLevel2D = new GuageLevel2D(renderer)
        this.root.addChild(this.guageLevel2D.root)
        this.root.addChild(this.menu.menuRoot)
        this.root.sx = this.root.sy = renderer.pixelRatio
        //LevelHandler.
    }

    public update() {
        this.menu.update()
        this.guageLevel2D.update()
    }

    updateMouse() {
        this.root.updateMouse(GameModel.mouseListener.mousePos, GameModel.mouseListener.isDownThisFrame, GameModel.mouseListener.isUpThisFrame)

    }

    setLevel(key: string) {
        this.menu.setLevel(key)
        this.guageLevel2D.setLevel(key)
    }
}
