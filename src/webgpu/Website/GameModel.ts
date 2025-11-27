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
import FishstickHandler from "./handlers/FishstickHandler.ts";
import gsap from "gsap";

class GameModel {

    renderer!: Renderer;
    gameRenderer!: GameRenderer;
    gameCamera!: GameCamera;
    // gamepadInput!: GamePadInput;
    //keyInput!: KeyInput;
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

    gameCopy!: any;
    mainCamera!: Camera

    happyEnd: boolean = false;
    singleCopy!: any;
    fishstickHandler!: FishstickHandler;

    getCopy(key: string) {
        return this.singleCopy[key] + ""
    }
    tweenToNonBlack(duration = 2) {
        gsap.killTweensOf(this.UI2D)
        gsap.to(this.UI2D, { blackValue: 1, duration: duration, ease: "power2.in", delay: 0.5 })

    }
    setBlack(value = 0) {
        gsap.killTweensOf(this.UI2D)
        this.UI2D.blackValue = value

    }
    tweenToBlack() {
        gsap.killTweensOf(this.UI2D)
        gsap.to(this.UI2D, { blackValue: 0, duration: 0.5 })

    }


}
export default new GameModel()
