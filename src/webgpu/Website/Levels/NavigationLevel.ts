import GameModel from "../GameModel.ts";
import { BaseLevel } from "./BaseLevel.ts";
import LevelHandler from "./LevelHandler.ts";


export default class NavigationLevel extends BaseLevel {

    public lockNavigation = true;
    constructor() {
        super()
    }
    init() {

        super.init();

    }
    configScene() {

        GameModel.gameRenderer.needsDof = false
        setTimeout(() => {
            this.setScrollPos();
        }, 1000)

        this.lockNavigation = true;
        GameModel.tweenToNonBlack(1)
        GameModel.gameRenderer.setRenderSettingsNeutral({})

    }
    setScrollPos() {

        this.lockNavigation = false
    }
    update() {

        let delta = GameModel.mouseListener.wheelDelta;
        if (delta > 0 && !this.lockNavigation) {
            this.lockNavigation = true
            LevelHandler.setNextNavigationLevel()

        } if (delta < 0 && !this.lockNavigation) {
            this.lockNavigation = true
            LevelHandler.setPrevNavigationLevel()

        }

    }
    destroy() {
     
        super.destroy()
    }

}
