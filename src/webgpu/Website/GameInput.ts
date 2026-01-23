import MouseListener from "../lib/MouseListener";
import GamePadInput from "./GamePadInput";
import KeyInput from "./KeyInput";

class GameInput {
    joyStickX: number = 0;
    joyStickY: number = 0;
    forceJump: boolean = false;
    setJoystick(x: number, y: number, forceJump: boolean) {
        this.joyStickX = x;
        this.joyStickY = y;
        this.forceJump = forceJump;

    }
    mouseListener!: MouseListener;

    getSpace() {
        throw new Error("Method not implemented.");
    }

    keyInput!: KeyInput;
    gamePadInput!: GamePadInput;
    private _blockInput: boolean = false;
    jump: boolean = false;
    hInput: number = 0;
    vInput: number = 0;
    space: boolean = false;
    constructor() {

    }
    init(keyInput: KeyInput, gamepadInput: GamePadInput, mouseListener: MouseListener) {
        this.keyInput = keyInput;
        this.gamePadInput = gamepadInput;
        this.mouseListener = mouseListener;

    }
    update() {
        this.gamePadInput.update();

        let jump = this.keyInput.getJump()
        let hInput = this.keyInput.getHdir()
        let vInput = this.keyInput.getVdir()
        if (this.gamePadInput.connected) {

            if (hInput == 0) hInput = this.gamePadInput.getHdir()

            if (!jump) jump = this.gamePadInput.getJump()
        }


        this.jump = jump;


        this.hInput = hInput;
        this.vInput = vInput;

        this.space = this.keyInput.getSpace()

        if (this.joyStickX != 0 || this.joyStickY != 0) {
            this.hInput = this.joyStickX;
            vInput = -this.joyStickY;

        }
        if (this.mouseListener.isUpThisFrame) {
            if (this.mouseListener.downTime < 400) {
                this.jump = true
                this.space = true
            }
        }
        if (this.forceJump) { this.jump = true; this.space = true; this.forceJump = false; }

    }
    reset() {
        this.keyInput.clear()
        this.gamePadInput.clear()
    }
    get blockInput(): boolean {
        return this._blockInput;
    }

    set blockInput(value: boolean) {

        this.reset()
        this._blockInput = value;
    }

}
export default new GameInput()