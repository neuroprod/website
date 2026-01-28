import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import DefaultTextures from "../../lib/textures/DefaultTextures";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";

export default class Slider extends Object2D {
    startDragPos: number = 0;
    isDragging: boolean = false;
    value: number = 0.8;
    onUpdate!: (vale: number) => void;

    constructor(renderer: Renderer) {
        super()

        let s = new Sprite(renderer, DefaultTextures.getWhite(renderer));
        s.sx = 300

        this.addChild(s);

        let btn = new Sprite(renderer, renderer.getTexture(Textures.SLIDER_BUTTON));
        btn.sx = btn.sy = 0.5
        btn.x = -150 + this.value * 300;
        this.addChild(btn);
        btn.mouseDown = () => {
            this.isDragging = true;
            this.startDragPos = btn.mousePos.x
        }
        btn.mouseUp = () => {

            this.isDragging = false;
        }

        btn.rollOver = () => {
            renderer.setCursor(true);
        }
        btn.rollOut = () => {
            renderer.setCursor(false);
        }
    }
    updateF(): void {
        if (this.isDragging) {
            let btn = this.children[1] as Sprite;
            let deltaX = btn.mousePos.x - this.startDragPos;
            btn.x += deltaX;
            if (btn.x < -150) btn.x = -150;
            if (btn.x > 150) btn.x = 150;
            this.startDragPos = btn.mousePos.x;
            this.value = (btn.x + 150) / 300;
            if (this.onUpdate) this.onUpdate(this.value);
        }
    }

}