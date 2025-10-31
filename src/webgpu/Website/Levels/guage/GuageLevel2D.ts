import Renderer from "../../../lib/Renderer";
import AnimatedTextMaterial from "../../../lib/twoD/AnimatedTextMaterial.ts";
import Font from "../../../lib/twoD/Font";
import FontPool from "../../../lib/twoD/FontPool";
import Object2D from "../../../lib/twoD/Object2D";
import Text from "../../../lib/twoD/Text.ts";
import gsap from "gsap";
import SoundHandler from "../../SoundHandler.ts";
export default class GuageLevel2D {

    root = new Object2D()
    private renderer: Renderer;
    mainCopy = ["Time is running out...", "You have to act now!", "But you are a pirate.", "You will do the right thing."]
    leftRightCopy = ["Strawbery", 'Sugar', "Macaroni", "Fishstick", "Create", "Consume", "Fight", "Flight", "Pirate", "Steal", "Love", "Hate", "Wrong", "Right", "Right", "Wrong", "Live", "Die"]


    mainText: Array<Text> = []
    leftRightText: Array<Text> = []
    currentText!: Text;
    charPos = 0;
    charPosOld = -1;
    charCount = 0;
    constructor(renderer: Renderer) {
        this.renderer = renderer;
        let font = FontPool.getFont("bold") as Font;
        for (let c of this.mainCopy) {
            let text = new Text(renderer, font, 50, c)
            text.material = new AnimatedTextMaterial(renderer, "fontMat")
            text.material.setTexture("texture", font.texture)
            this.mainText.push(text)
            text.visible = false
            text.x = -text.width / 2
            text.y = -50
            this.root.addChild(text)
        }
        let cc = 0
        for (let c of this.leftRightCopy) {
            let text = new Text(renderer, font, 100, c)

            this.leftRightText.push(text)
            text.visible = false
            if (cc % 2 == 0) {
                text.x = -text.width - 300
                text.r = Math.random() * 0.2
            }
            else {
                text.x = 300
                text.r = -Math.random() * 0.2
            }

            text.y = -25
            this.root.addChild(text)
            cc++;
        }


        this.currentText = this.mainText[0];
    }
    setTick(count: number) {

        let halfCount = (count - 3) / 4;
        for (let i = 0; i < this.mainText.length; i++) {
            let text = this.mainText[i]
            if (i == halfCount) {
                text.visible = true
                this.currentText = text;
                this.charPos = 0
                this.charPosOld = -1;
                this.charCount = 0;
                gsap.to(this, { charPos: this.currentText.mesh.charCount, duration: this.currentText.mesh.charCount / 30 })
            }

            if (i == halfCount - 1) {

                text.visible = false
            }

        }

        let leftRightCount = (count - 25) / 2


        for (let i = 0; i < this.leftRightText.length; i++) {
            let text = this.leftRightText[i]
            if (i == leftRightCount) {
                text.visible = true

            } if (i == leftRightCount + 1) {
                text.visible = true

            }

            if ((i == leftRightCount - 2 || i == leftRightCount - 1) && i < this.leftRightText.length - 2) {

                // text.visible = false
            }

        }
    }
    destroy() {
        for (let i = 0; i < this.mainText.length; i++) {
            let text = this.mainText[i]
            text.visible = false;
        }
        for (let i = 0; i < this.leftRightText.length; i++) {
            let text = this.leftRightText[i]
            text.visible = false;
        }
    }
    setLevel(key: string) {


        if (key == "Guage") {
            this.root.visible = true


        } else {
            this.root.visible = false
        }

    }
    public update() {
        if (!this.root.visible) return
        this.root.x = this.renderer.htmlWidth / 2
        this.root.y = this.renderer.htmlHeight / 2
        this.currentText.material.setUniform("charPos", this.charPos)

        let charPosR = Math.round(this.charPos)
        if (charPosR != this.charPosOld) {

            this.charCount++
            this.charCount %= 2
            if (this.charCount == 0) SoundHandler.playTalking()
        }
        this.charPosOld = charPosR

    }

}