import { Vector2, Vector3 } from "@math.gl/core";
import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";
import GameModel from "../GameModel";
import GameInput from "../GameInput";
import { gsap } from "gsap";
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

            this.down = true;
            let pos = GameModel.mouseListener.mousePos.clone()
            pos.scale(1 / this.renderer.pixelRatio)
            this.setAllPos(pos.x, pos.y)
            gsap.killTweensOf(this.joyStick)

        }
        this.joyStickBack.mouseUp = () => {

            this.down = false;
            GameInput.setJoystick(0, 0)


            gsap.to(this.joyStick, { x: this.joyStickBack.x, y: this.joyStickBack.y, duration: 0.5, ease: "elastic.out(1, 0.5)" })

        }

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

            this.joyStick.x = pos.x;
            this.joyStick.y = pos.y;

            this.moveVec.set(this.joyStick.x, this.joyStick.y)
            this.moveVec.subtract([this.joyStickBack.x, this.joyStickBack.y])



            let moveLen = this.moveVec.len()
            if (moveLen > 50) {
                this.moveVec.normalize()
                this.moveVec.scale(moveLen - 50)
                this.joyStickBack.x += this.moveVec.x
                this.joyStickBack.y += this.moveVec.y
                this.moveVec.set(this.joyStick.x, this.joyStick.y)
                this.moveVec.subtract([this.joyStickBack.x, this.joyStickBack.y])

            }

            this.moveVec.scale(1 / 50);
            GameInput.setJoystick(this.moveVec.x, this.moveVec.y)


        }
    }



}