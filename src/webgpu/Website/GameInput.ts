import GamePadInput from "./GamePadInput";
import KeyInput from "./KeyInput";

class GameInput {

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
    init(keyInput: KeyInput, gamepadInput: GamePadInput) {
        this.keyInput = keyInput;
        this.gamePadInput = gamepadInput;

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