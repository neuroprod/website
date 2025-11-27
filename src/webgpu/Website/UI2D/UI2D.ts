import Renderer2D from "../../lib/twoD/Renderer2D.ts";

import Object2D from "../../lib/twoD/Object2D.ts";
import Renderer from "../../lib/Renderer.ts";
import Menu from "./Menu.ts";
import GameModel from "../GameModel.ts";
import GuageLevel from "../Levels/guage/GuageLevel.ts";
import GuageLevel2D from "../Levels/guage/GuageLevel2D.ts";
import SettingsUI from "./SettingsUI.ts";
import FightUI from "../Levels/FightLevel/FigthUI.ts";
import Sprite from "../../lib/twoD/Sprite.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";

export default class UI2D {


    private renderer2D: Renderer2D;
    private root: Object2D;
    private menu: Menu;
    guageLevel2D: GuageLevel2D;
    settings: SettingsUI;
    fightUI: FightUI;
    black: Sprite;
    _blackValue: number = 1;

    set blackValue(value: number) {

        this._blackValue = value;
        this.black.alpha = 1 - this._blackValue
        if (this.blackValue == 1) {
            this.black.visible = false
        } else {
            this.black.visible = true
        }
    }
    get blackValue() {

        return this._blackValue
    }
    constructor(renderer: Renderer, renderer2D: Renderer2D) {
        this.renderer2D = renderer2D
        this.root = renderer2D.root


        this.black = new Sprite(renderer, DefaultTextures.getBlack(renderer))
        this.black.alpha = 0
        this.black.sx = 10000
        this.black.sy = 10000
        this.menu = new Menu(renderer)
        this.guageLevel2D = new GuageLevel2D(renderer)
        this.settings = new SettingsUI(renderer)


        this.fightUI = new FightUI(renderer)


        //  

        this.root.addChild(this.fightUI.root)

        this.root.addChild(this.menu.menuRoot)
        this.root.addChild(this.black)
        this.root.addChild(this.settings.settingsRoot)
        this.root.addChild(this.guageLevel2D.root)
        this.root.sx = this.root.sy = renderer.pixelRatio
        //LevelHandler.
    }

    public update() {
        this.menu.update()
        this.guageLevel2D.update()
        this.settings.update()
        this.fightUI.update()
    }

    updateMouse() {
        this.root.updateMouse(GameModel.mouseListener.mousePos, GameModel.mouseListener.isDownThisFrame, GameModel.mouseListener.isUpThisFrame)

    }
    setCoins(displayCoins: number) {
        this.settings.setCoins(displayCoins)
    }
    setFishsticks(numFishsticks: number) {
        this.settings.setFishSticks(numFishsticks)
    }
    showCoins() {
        this.settings.showCoins()
    }
    hideCoins() {
        this.settings.hideCoins()
    }

    setLevel(key: string) {
        this.menu.setLevel(key)
        this.guageLevel2D.setLevel(key)
        this.settings.setLevel(key)
        this.fightUI.setLevel(key)
    }
}
