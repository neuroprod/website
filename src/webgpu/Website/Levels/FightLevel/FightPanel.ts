import { Textures } from "../../../data/Textures.ts";
import Renderer from "../../../lib/Renderer.ts";
import DefaultTextures from "../../../lib/textures/DefaultTextures.ts";
import Font from "../../../lib/twoD/Font.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import Object2D from "../../../lib/twoD/Object2D.ts";
import Sprite from "../../../lib/twoD/Sprite.ts";
import Text from "../../../lib/twoD/Text.ts";
import GameModel from "../../GameModel.ts";
export default class FightPanel {


    root = new Object2D()

    private fightOptionsCopy = ["FIGHT", "HEAL", "RUN"]
    private fightTextCopy: Array<string> = []
    private fightOptions: Array<Text> = []
    line: Sprite;
    triangle: Sprite;
    text: Text;
    constructor(renderer: Renderer) {

        let font = FontPool.getFont("bold") as Font;
        let spacing = 0
        this.line = new Sprite(renderer, DefaultTextures.getWhite(renderer));
        this.line.alpha = 0.5
        this.line.sx = 2
        this.line.sy = 150;
        this.line.x = -200
        this.root.addChild(this.line)

        this.triangle = new Sprite(renderer, renderer.getTexture(Textures.TRIANGLE));
        this.triangle.sx = this.triangle.sy = 0.5;
        this.triangle.x = -350;
        this.root.addChild(this.triangle)


        for (let op of this.fightOptionsCopy) {



            let text = new Text(renderer, font, 35, op)

            text.x = -800 / 2 + 20 + 50
            text.y = -200 / 2 + 35 + spacing;
            spacing += 45

            this.root.addChild(text)
            this.fightOptions.push(text);
        }

        this.text = new Text(renderer, font, 30, "_")

        //this.text.material.setUniform("color", new ColorV(0, 0, 0, 1))
        this.text.x = -160
        this.text.y = -70
        this.text.alpha = 0.5

        this.root.addChild(this.text)

        this.fightTextCopy.push(GameModel.getCopy("FFightText"))
        this.fightTextCopy.push(GameModel.getCopy("FHealText"))
        this.fightTextCopy.push(GameModel.getCopy("FRunText"))
    }
    show(index: number) {
        this.root.visible = true


        this.triangle.y = -45 + index * 45 - 3;
        this.text.setText(this.fightTextCopy[index], false, false)


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