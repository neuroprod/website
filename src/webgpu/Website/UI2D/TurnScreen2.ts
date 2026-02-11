import Renderer from "../../lib/Renderer.ts";
import Object2D from "../../lib/twoD/Object2D.ts";

import Sprite from "../../lib/twoD/Sprite.ts";
import { Textures } from "../../data/Textures.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import FontPool from "../../lib/twoD/FontPool.ts";
import Font from "../../lib/twoD/Font.ts";
import Text from "../../lib/twoD/Text.ts";
import { Vector4 } from "@math.gl/core";
export default class TurnScreen2 {


    root: Object2D;
    renderer: Renderer;
    black: Sprite;
    turn: Text;
    home: boolean = true;




    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.root = new Object2D();
        this.black = new Sprite(renderer, DefaultTextures.getBlack(renderer))

        this.black.sx = 2000
        this.black.sy = 2000
        this.root.addChild(this.black)
        let font = FontPool.getFont("bold") as Font;

        let hAlign = true


        this.turn = new Text(renderer, font, 35, 'Turn your Device', hAlign, true);
        this.turn.material.setUniform("color", new Vector4(1, 1, 0, 1))

        this.root.addChild(this.turn)
        this.root.visible = false;
    }

    update() {

        if (this.renderer.ratio < 1) {
            if (this.home) {
                this.turn.x = this.renderer.htmlWidth / 2
                this.turn.y = 50
            } else {
                this.turn.x = this.renderer.htmlWidth / 2
                this.turn.y = this.renderer.htmlHeight / 2
                this.turn.r += 0.01

            }
            this.root.visible = true;
        } else {
            this.root.visible = false;
        }
    }
    setLevel(key: string) {

        if (key == "Home") {

            this.black.visible = false
            this.home = true;
        } else {
            this.black.visible = true
            this.home = false
        }
    }

}