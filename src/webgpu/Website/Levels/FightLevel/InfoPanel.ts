import { Textures } from "../../../data/Textures.ts";
import Renderer from "../../../lib/Renderer.ts";

import Font from "../../../lib/twoD/Font.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import Object2D from "../../../lib/twoD/Object2D.ts";
import Sprite from "../../../lib/twoD/Sprite.ts";
import Text from "../../../lib/twoD/Text.ts";
export default class InfoPanel {
    nextTriangle: Sprite;

    hide() {
        this.root.visible = false
    }
    show() {
        this.root.visible = true
    }


    root = new Object2D()
    text: Text;
    constructor(renderer: Renderer) {

        let font = FontPool.getFont("bold") as Font;


        this.text = new Text(renderer, font, 30, "_")

        this.text.x = -700 / 2 + 20
        this.text.y = -150 / 2 + 20

        this.root.addChild(this.text)


        this.nextTriangle = new Sprite(renderer, renderer.getTexture(Textures.TRIANGLE))

        this.nextTriangle.x = 700 / 2 - 20
        this.nextTriangle.y = 150 / 2 - 20
        this.nextTriangle.sx = this.nextTriangle.sy = 0.6
        this.root.addChild(this.nextTriangle)
        this.nextTriangle.visible = false

    }
    showNext() {
        this.nextTriangle.visible = true
    }
    setText(text: string) {
        this.nextTriangle.visible = false
        this.text.setText(text)
    }


}