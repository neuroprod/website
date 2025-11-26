import Renderer from "../../../lib/Renderer";
import Font from "../../../lib/twoD/Font";
import FontPool from "../../../lib/twoD/FontPool";
import Object2D from "../../../lib/twoD/Object2D";
import Text from "../../../lib/twoD/Text.ts";
export default class FightPannel {


    root = new Object2D()

    private fightOptionsCopy = ["FIGHT", "HEAL", "RUN"]
    private fightOptions: Array<Text> = []
    constructor(renderer: Renderer) {

        let font = FontPool.getFont("bold") as Font;
        let spacing = 0

        for (let op of this.fightOptionsCopy) {



            let text = new Text(renderer, font, 30, op)

            text.x = -700 / 2 + 20 + 40
            text.y = -150 / 2 + 20 + spacing;
            spacing += 40

            this.root.addChild(text)
            this.fightOptions.push(text);
        }


    }



}