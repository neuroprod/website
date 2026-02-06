import { Textures } from "../../../data/Textures.ts";
import ColorV from "../../../lib/ColorV.ts";
import Renderer from "../../../lib/Renderer.ts";
import AnimatedTextMaterial from "../../../lib/twoD/AnimatedTextMaterial.ts";

import Font from "../../../lib/twoD/Font.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import Object2D from "../../../lib/twoD/Object2D.ts";
import Sprite from "../../../lib/twoD/Sprite.ts";
import Text from "../../../lib/twoD/Text.ts";
import Color from "../../../lib/UI/math/Color.ts";
import SoundHandler from "../../SoundHandler.ts";
import gsap from "gsap";
export default class InfoPanel {
    nextTriangle: Sprite;

    hide() {
        this.root.visible = false
    }
    show() {
        this.root.visible = true
    }
    charPos = 0;
    charPosOld = -1;
    charCount = 0;

    root = new Object2D()
    text: Text;
    constructor(renderer: Renderer) {

        let font = FontPool.getFont("bold") as Font;


        this.text = new Text(renderer, font, 32, "_")
        this.text.material = new AnimatedTextMaterial(renderer, "fontMat")
        this.text.material.setTexture("texture", font.texture)
        //this.text.material.setUniform("color", new ColorV(0, 0, 0, 1))
        this.text.x = 0
        this.text.y = -20
        this.text.visible = false
        this.root.addChild(this.text)


        this.nextTriangle = new Sprite(renderer, renderer.getTexture(Textures.TRIANGLE))

        this.nextTriangle.x = 0
        this.nextTriangle.y = 150 / 2 - 20
        this.nextTriangle.sx = this.nextTriangle.sy = 0.6
        this.nextTriangle.sx *= 0.75
        this.nextTriangle.r = Math.PI / 2
        this.root.addChild(this.nextTriangle)
        this.nextTriangle.visible = false

    }
    showNext() {
        this.nextTriangle.visible = true
    }
    setText(text: string) {
        this.text.visible = true
        this.nextTriangle.visible = false
        this.text.setText(text, true, true)

        this.charPos = 0
        this.charPosOld = -1;
        this.charCount = 0;
        let max = this.text.mesh.charCount;
        let start = Math.max(max - 40, 0)
        let length = max - start;
        this.charPos = start
        gsap.to(this, { charPos: this.text.mesh.charCount, duration: length / 30 })
        this.text.alpha = 0
        gsap.to(this.text, { alpha: 0.7, duration: 1 })
    }
    update() {


        this.text.material.setUniform("charPos", this.charPos)

        let charPosR = Math.round(this.charPos)

        if (charPosR != this.charPosOld) {

            this.charCount++
            this.charCount %= 2
            if (this.charCount == 0) SoundHandler.playTalking()
        }
        this.charPosOld = charPosR
    }

}