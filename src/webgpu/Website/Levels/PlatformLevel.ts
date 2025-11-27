import { BaseLevel } from "./BaseLevel.ts";
import CharacterController from "../CharacterController.ts";
import Timer from "../../lib/Timer.ts";
import SceneHandler from "../../data/SceneHandler.ts";
import CoinGrabber from "../handlers/CoinGrabber.ts";
import SceneObject3D from "../../data/SceneObject3D.ts";
import { HitTrigger } from "../../data/HitTriggers.ts";
import GameModel from "../GameModel.ts";
import KeyInput from "../KeyInput.ts";
import GameInput from "../GameInput.ts";

export class PlatformLevel extends BaseLevel {

    public characterController!: CharacterController;
    private coinHandler!: CoinGrabber;
    isConversation: boolean = false;



    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        GameModel.coinHandler.show()


    }
    endAnime(): number {
        GameModel.tweenToBlack()
        return 0.5;
    }

    configScene() {

        this.coinHandler = new CoinGrabber()
        GameModel.conversationHandler.dataCallBack = this.conversationDataCallBack.bind(this)
        GameInput.blockInput = false;
        GameModel.gameRenderer.setLevelType("platform")

        GameModel.tweenToNonBlack()
    }
    update() {


        let delta = Timer.delta;
        let jump = GameInput.jump

        let hInput = GameInput.hInput


        if (!this.isConversation) {
            this.characterController.update(delta, hInput, jump)
        } else {
            this.characterController.updateIdle(delta)
            GameModel.conversationHandler.setInput(hInput, jump)
            GameModel.textBalloonHandler.update()

        }
        this.coinHandler.update()
        this.checkTriggers()

    }
    private checkTriggers() {
        for (let f of SceneHandler.triggerModels) {
            f.drawTrigger();
            if (f.checkTriggerHit(this.characterController.charHitBottomWorld, this.characterController.charHitTopWorld, this.characterController.charHitRadius)) {
                this.resolveHitTrigger(f)

            }

        }

    }
    conversationDataCallBack(data: string) {

    }
    resolveHitTrigger(f: SceneObject3D) {
        if (f.hitTriggerItem == HitTrigger.COIN) {
            this.coinHandler.takeCoin(f)

            return true;
        }
        return false;
    }
}
