import Renderer from "../../../lib/Renderer.ts";
import Font from "../../../lib/twoD/Font.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import Object2D from "../../../lib/twoD/Object2D.ts";
import Text from "../../../lib/twoD/Text.ts";
export default class InfoPanel {
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


        this.text = new Text(renderer, font, 30, "item")
        this.text.setText("Mister Billy shot you in the eye, Ouch")
        this.text.x = -700 / 2 + 20
        this.text.y = -150 / 2 + 20

        this.root.addChild(this.text)

    }
    setText(text: string) {
        this.text.setText(text)
    }


}