import Renderer from "../../../lib/Renderer.ts";
import Font from "../../../lib/twoD/Font.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import Object2D from "../../../lib/twoD/Object2D.ts";
import Text from "../../../lib/twoD/Text.ts";
export default class FightPanel {


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
    show(index: number) {
        this.root.visible = true
        for (let i = 0; i < 3; i++) {

            let options = this.fightOptions[i];
            if (i == index) {
                options.alpha = 1
            }
            else {
                options.alpha = 0.6
            }

        }

    }
    hide() {
        this.root.visible = false
    }



}