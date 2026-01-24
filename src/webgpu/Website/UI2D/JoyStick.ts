import { Vector2, Vector3 } from "@math.gl/core";
import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";
import GameModel from "../GameModel";
import GameInput from "../GameInput";
import { gsap } from "gsap";
import { smoothstep } from "../../lib/MathUtils";

export default class JoyStick {
    joystickRoot: Object2D;
    renderer: Renderer;
    joyStick: Sprite;
    joyStickBack: Sprite;
    down: boolean = false;

    private moveVec = new Vector2()
    joyStickBtn: Sprite;
    jump: boolean = false
    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.joystickRoot = new Object2D()

        this.joyStick = new Sprite(renderer, this.renderer.getTexture(Textures.JOYSTICK))
        this.joyStick.sx = this.joyStick.sy = 0.5
        this.joyStickBack = new Sprite(renderer, this.renderer.getTexture(Textures.JOYSTICKBACK))
        this.joyStickBack.sx = this.joyStickBack.sy = 0.5

        this.joystickRoot.addChild(this.joyStickBack)
        this.joystickRoot.addChild(this.joyStick)



        this.joyStick.mouseDown = () => {

            this.down = true;

            gsap.killTweensOf(this.joyStick)

        }
        this.joyStick.mouseUp = () => {

            this.down = false;

            GameInput.setJoystick(0, 0, this.jump)

            gsap.to(this.joyStick, { x: this.joyStickBack.x, y: this.joyStickBack.y, duration: 0.5, ease: "elastic.out(1, 0.5)" })

        }






        this.joyStickBtn = new Sprite(renderer, this.renderer.getTexture(Textures.JOYSTICK))
        this.joyStickBtn.sx = this.joyStickBtn.sy = 0.5
        this.joyStickBtn.mouseDown = () => {
            this.joyStickBtn.sx = this.joyStickBtn.sy = 0.7
            this.jump = true;

        }
        this.joyStickBtn.mouseUp = () => {
            this.jump = false;
            this.joyStickBtn.sx = this.joyStickBtn.sy = 0.5
            GameInput.setJoystick(this.moveVec.x, this.moveVec.y, this.jump)
        }
        this.joystickRoot.addChild(this.joyStickBtn)
    }

    setAllPos(x: number, y: number, x2: number) {
        this.joyStick.x = this.joyStickBack.x = x
        this.joyStick.y = this.joyStickBack.y = y
        this.joyStickBtn.x = x2;
        this.joyStickBtn.y = y;
    }
    update() {
        this.setAllPos(100, this.renderer.htmlHeight - 100, this.renderer.htmlWidth - 100)

        if (this.down || this.jump) {

            if (this.down) {
                let pos = this.joyStick.mousePos.clone()
                pos.scale(1 / this.renderer.pixelRatio)

                this.joyStick.x = pos.x;
                this.joyStick.y = pos.y;

                this.moveVec.set(this.joyStick.x, this.joyStick.y)
                this.moveVec.subtract([this.joyStickBack.x, this.joyStickBack.y])



                let moveLen = this.moveVec.len()
                let xDir = smoothstep(0.4, 0.6, Math.abs(this.moveVec.x / 50))
                let sX = Math.sign(this.moveVec.x)
                let yDir = smoothstep(0.4, 0.6, Math.abs(this.moveVec.y / 50))
                let sY = Math.sign(this.moveVec.y)
                if (moveLen > 50) {
                    this.moveVec.normalize()
                    this.moveVec.scale(50)
                    this.joyStick.x = this.joyStickBack.x + this.moveVec.x
                    this.joyStick.y = this.joyStickBack.y + this.moveVec.y


                }

                this.moveVec.set(xDir * sX, yDir * sY)


            } else {
                this.moveVec.set(0, 0)
            }

            GameInput.setJoystick(this.moveVec.x, this.moveVec.y, this.jump)


        }
    }



}