import Renderer from "../../../lib/Renderer";
import Font from "../../../lib/twoD/Font";
import FontPool from "../../../lib/twoD/FontPool";
import Object2D from "../../../lib/twoD/Object2D";
import Text from "../../../lib/twoD/Text.ts";
export default class InfoPannel {


    root = new Object2D()
    constructor(renderer: Renderer) {

        let font = FontPool.getFont("bold") as Font;


        let text = new Text(renderer, font, 30, "item")
        text.setText("Mister Billy shot you in the eye, Ouch")
        text.x = -700 / 2 + 20
        text.y = -150 / 2 + 20

        this.root.addChild(text)

    }
    setText(text: string) {


    }


}