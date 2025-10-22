import Renderer from "../lib/Renderer.ts";
import GameRenderer from "../render/GameRenderer.ts";
import GameCamera from "./GameCamera.ts";
import GamePadInput from "./GamePadInput.ts";
import KeyInput from "./KeyInput.ts";
import TextBalloonHandler from "./conversation/TextBalloonHandler.ts";
import ConversationHandler from "./conversation/ConversationHandler.ts";
import MouseListener from "../lib/MouseListener.ts";
import UI2D from "./UI2D/UI2D.ts";
import Overlay from "./Overlay.ts";
import CoinHandler from "./handlers/CoinHandler.ts";
import { MainState } from "../Main.ts";
import Renderer2D from "../lib/twoD/Renderer2D.ts";
import GLFTLoader from "../lib/GLFTLoader.ts";
import Camera from "../lib/Camera.ts";


class GameModel {

    renderer!: Renderer;
    gameRenderer!: GameRenderer;
    gameCamera!: GameCamera;
    gamepadInput!: GamePadInput;
    keyInput!: KeyInput;
    textBalloonHandler!: TextBalloonHandler;
    conversationHandler!: ConversationHandler;
    mouseListener!: MouseListener;
    overlay!: Overlay;
    coinHandler!: CoinHandler;

    //godPresent
    presentID = -1;
    setMainState!: OmitThisParameter<(state: MainState) => void>;
    debug: boolean = false;
    renderer2D!: Renderer2D;
    UI2D!: UI2D;
    glft!: GLFTLoader;
    glft2!: GLFTLoader;
    gameCopy!: any;
    mainCamera!: Camera






}
export default new GameModel()
