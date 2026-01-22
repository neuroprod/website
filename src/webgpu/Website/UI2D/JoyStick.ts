import { Vector2, Vector3 } from "@math.gl/core";
import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";
import GameModel from "../GameModel";

export default class JoyStick {
    joystickRoot: Object2D;
    renderer: Renderer;
    joyStick: Sprite;
    joyStickBack: Sprite;
    down: boolean = false;

    private moveVec = new Vector2()
    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.joystickRoot = new Object2D()

        this.joyStick = new Sprite(renderer, this.renderer.getTexture(Textures.JOYSTICK))
        this.joyStick.sx = this.joyStick.sy = 0.5
        this.joyStickBack = new Sprite(renderer, this.renderer.getTexture(Textures.JOYSTICKBACK))
        this.joyStickBack.sx = this.joyStickBack.sy = 0.5

        this.joystickRoot.addChild(this.joyStickBack)
        this.joystickRoot.addChild(this.joyStick)



        this.joyStickBack.mouseDown = () => {
            console.log("down")
            this.down = true;
            let pos = GameModel.mouseListener.mousePos.clone()
            pos.scale(1 / this.renderer.pixelRatio)
            this.setAllPos(pos.x, pos.y)
        }
        this.joyStickBack.mouseUp = () => {
            console.log("up")
            this.down = false;




        }
        console.log(this.renderer.htmlHeight - 100)
        this.setAllPos(100, 300)

    }

    setAllPos(x: number, y: number) {
        this.joyStick.x = this.joyStickBack.x = x
        this.joyStick.y = this.joyStickBack.y = y
    }
    update() {

        if (this.down) {

            let pos = GameModel.mouseListener.mousePos.clone()
            pos.scale(1 / this.renderer.pixelRatio)
            console.log(pos)
            this.joyStick.x = pos.x;
            this.joyStick.y = pos.y;

            this.moveVec.set(this.joyStick.x, this.joyStick.y)
            this.moveVec.subtract([this.joyStickBack.x, this.joyStickBack.y])


            console.log(this.moveVec)
        }
    }



}