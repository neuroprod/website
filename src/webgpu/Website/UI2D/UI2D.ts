import Renderer2D from "../../lib/twoD/Renderer2D.ts";

import Object2D from "../../lib/twoD/Object2D.ts";
import Renderer from "../../lib/Renderer.ts";
import Menu from "./Menu.ts";
import GameModel from "../GameModel.ts";

import SettingsUI from "./SettingsUI.ts";
import FightUI from "../Levels/FightLevel/FigthUI.ts";
import Sprite from "../../lib/twoD/Sprite.ts";
import DefaultTextures from "../../lib/textures/DefaultTextures.ts";
import JoyStick from "./JoyStick.ts";
import MultiTouchInput from "../../lib/input/MultiTouchInput.ts";
import LevelHandler from "../Levels/LevelHandler.ts";
import EndCredits from "./EndCredits.ts";

export default class UI2D {



    private renderer2D: Renderer2D;
    private root: Object2D;
    private menu: Menu;
    private joyStick!: JoyStick;
    private multiTouchInput: MultiTouchInput | null = null;
    //  guageLevel2D: GuageLevel2D;
    settings: SettingsUI;
    fightUI: FightUI;
    black: Sprite;
    _blackValue: number = 1;
    isNavigation: boolean = false
    renderer: Renderer;
    isDown: boolean = false;
    navPos: any;
    endCredits: EndCredits;

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
        this.renderer = renderer;
        this.renderer2D = renderer2D
        this.root = renderer2D.root


        this.black = new Sprite(renderer, DefaultTextures.getBlack(renderer))
        this.black.alpha = 0
        this.black.sx = 10000
        this.black.sy = 10000
        this.menu = new Menu(renderer)
        //  this.guageLevel2D = new GuageLevel2D(renderer)
        this.settings = new SettingsUI(renderer)


        this.fightUI = new FightUI(renderer)


        //  

        this.root.addChild(this.fightUI.root)

        this.root.addChild(this.menu.menuRoot)

        if (renderer.isMobile) {
            this.joyStick = new JoyStick(renderer)
            this.root.addChild(this.joyStick.joystickRoot)
        }


        this.endCredits = new EndCredits(renderer)
        this.root.addChild(this.endCredits.root)

        this.root.addChild(this.black)
        this.root.addChild(this.settings.settingsRoot)



        this.root.multiTouch = true;


        // this.root.addChild(this.guageLevel2D.root)
        this.root.sx = this.root.sy = renderer.pixelRatio

        // Initialize multitouch input handler on the canvas
        const canvas = renderer.canvas;
        if (canvas) {
            this.multiTouchInput = new MultiTouchInput(canvas);
        }

        //LevelHandler.
    }



    public update() {
        this.menu.update()
        // this.guageLevel2D.update()
        this.settings.update();
        this.fightUI.update();
        this.joyStick?.update();
this.endCredits.update();
        // Update input
        this.updateMouse()
    }


    updateMouse() {
        this.root.updateMouse(GameModel.mouseListener.mousePos, GameModel.mouseListener.isDownThisFrame, GameModel.mouseListener.isUpThisFrame, GameModel.mouseListener.getAllPointers())
        if (this.renderer.isMobile && this.isNavigation) {

            if (GameModel.mouseListener.isDownThisFrame) {
                this.isDown = true;
                this.navPos = GameModel.mouseListener.mousePos.clone()

            }
            if (GameModel.mouseListener.isUpThisFrame) {
                this.isDown = false;

            }
            if (this.isDown) {
                let dY = GameModel.mouseListener.mousePos.y - this.navPos.y;
                let dX = GameModel.mouseListener.mousePos.x - this.navPos.x;
                if (dX == 0) return;
                console.log(dY, Math.abs(dY / dX))
                if (Math.abs(dY / dX) > 2 && dY > 200) {
                    this.isDown = false;
                    LevelHandler.setPrevNavigationLevel()
                }
                if (Math.abs(dY / dX) > 2 && dY < -200) {
                    this.isDown = false;
                    LevelHandler.setNextNavigationLevel()
                }
            }
        } else {
            this.isDown = false;
        }

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


        if (LevelHandler.navigationLevels.includes(key)) {
            this.isNavigation = true;
        } else {
            this.isNavigation = false;
        }
        this.menu.setLevel(key)

        this.settings.setLevel(key)
        this.fightUI.setLevel(key)
        this.joyStick?.setLevel(key);
    }

        hideEnd() {
       this.endCredits.hide()
    }
    showEnd() {
      this.endCredits.show()
    }
}
