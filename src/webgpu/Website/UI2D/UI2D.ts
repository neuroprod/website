import Renderer2D from "../../lib/twoD/Renderer2D.ts";

import Object2D from "../../lib/twoD/Object2D.ts";
import Renderer from "../../lib/Renderer.ts";
import Menu from "./Menu.ts";
import GameModel from "../GameModel.ts";

export default class UI2D {
    private renderer2D: Renderer2D;
    private root: Object2D;
    private menu: Menu;

    constructor(renderer: Renderer, renderer2D: Renderer2D) {
        this.renderer2D = renderer2D
        this.root = renderer2D.root


        /* let sprite  =new Sprite(renderer,renderer.getTexture(Textures.BLUE_NOISE))
         this.root.addChild(sprite)
         sprite.x =200
         sprite.y =200
         sprite.scale =1*/

        this.menu = new Menu(renderer)
        this.root.addChild(this.menu.menuRoot)
        this.root.sx =   this.root.sy =renderer.pixelRatio
        //LevelHandler.
    }

    public update() {
        this.menu.update()
    }

    updateMouse() {
        this.root.updateMouse (GameModel.mouseListener.mousePos,GameModel.mouseListener.isDownThisFrame,GameModel.mouseListener.isUpThisFrame)

    }

    setLevel(key: string) {
        this.menu.setLevel(key)
    }
}
