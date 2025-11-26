import GamePadInput from "./GamePadInput";
import KeyInput from "./KeyInput";

class GameInput {
    keyInput!: KeyInput;
    gamePadInput!: GamePadInput;

    constructor() {

    }
    init(keyInput: KeyInput, gamepadInput: GamePadInput) {
        this.keyInput = keyInput;
        this.gamePadInput = gamepadInput;

    }

}
export default new GameInput()