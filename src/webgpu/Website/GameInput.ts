import GamePadInput from "./GamePadInput";
import KeyInput from "./KeyInput";

class GameInput {
    keyInput!: KeyInput;
    gamePadInput!: GamePadInput;
    private _blockInput: boolean = false;
    jump: boolean = false;
    hInput: number = 0;

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
        if (this.gamePadInput.connected) {

            if (hInput == 0) hInput = this.gamePadInput.getHdir()

            if (!jump) jump = this.gamePadInput.getJump()
        }
        this.jump = jump;
        this.hInput = hInput;
    }
    get blockInput(): boolean {
        return this._blockInput;
    }

    set blockInput(value: boolean) {

        this.keyInput.clear()
        this.gamePadInput.clear()
        this._blockInput = value;
    }

}
export default new GameInput()