import Font from "../../lib/twoD/Font.ts";
import Text from "../../lib/twoD/Text.ts";
import { Textures } from "../../data/Textures";
import Renderer from "../../lib/Renderer";
import FontPool from "../../lib/twoD/FontPool";
import Object2D from "../../lib/twoD/Object2D";
import Sprite from "../../lib/twoD/Sprite";
import GameModel from "../GameModel";
import LevelHandler from "../Levels/LevelHandler";
import gsap from "gsap";
import SettingHolder from "./SettingsHolder.ts";
export default class SettingsUI {


    renderer: Renderer;
    settingsRoot = new Object2D()
    backButton: Sprite;
    settingsButton: Sprite;
    coinIcon: Sprite;
    scoreText: Text;
    numCoins: number = 0;
    stickIcon: Sprite;
    scoreStickText: Text;
    numFishsticks: number = 0;
    settingHolder: SettingHolder;

    constructor(renderer: Renderer) {
        this.renderer = renderer;


        let font = FontPool.getFont("bold") as Font;
        this.settingsRoot.x = 40
        this.settingsRoot.y = 40

        this.settingHolder = new SettingHolder(renderer);
        this.settingsRoot.addChild(this.settingHolder.root);


        this.backButton = new Sprite(renderer, this.renderer.getTexture(Textures.BACK_BTN))
        this.backButton.sx = this.backButton.sy = 0.2
        this.backButton.alpha = 0.7

        this.backButton.onClick = () => {
            // gsap.globalTimeline.clear()
            LevelHandler.setLevel("Home")
        }
        this.backButton.rollOver = () => {
            this.backButton.alpha = 1
            GameModel.renderer.setCursor(true)
        }
        this.backButton.rollOut = () => {
            GameModel.renderer.setCursor(false)
            this.backButton.alpha = 0.7

        }

        this.settingsRoot.addChild(this.backButton)


        this.settingsButton = new Sprite(renderer, this.renderer.getTexture(Textures.SETTINGS_BTN))
        this.settingsButton.sx = this.settingsButton.sy = 0.2
        this.settingsButton.x = 32
        this.settingsButton.alpha = 0.7
        this.settingsRoot.addChild(this.settingsButton)

        this.settingsButton.rollOver = () => {
            this.settingsButton.alpha = 1
            GameModel.renderer.setCursor(true)
        }
        this.settingsButton.rollOut = () => {
            GameModel.renderer.setCursor(false)
            this.settingsButton.alpha = 0.7

        }
        this.settingsButton.onClick = () => {
            this.settingHolder.root.visible = !this.settingHolder.root.visible;
        }
        this.coinIcon = new Sprite(renderer, this.renderer.getTexture(Textures.COIN_ICON))
        this.coinIcon.sx = this.coinIcon.sy = 0.2
        this.coinIcon.x = 32 * 2 + 10

        this.settingsRoot.addChild(this.coinIcon)


        this.scoreText = new Text(renderer, font, 22, "0/30")
        this.scoreText.x = 32 * 3
        this.scoreText.y = -11
        this.scoreText.alpha = 0.7
        this.settingsRoot.addChild(this.scoreText)


        this.stickIcon = new Sprite(renderer, this.renderer.getTexture(Textures.STICK_ICON))
        this.stickIcon.sx = this.stickIcon.sy = 0.2
        this.stickIcon.x = 32 * 2 + 10

        this.settingsRoot.addChild(this.stickIcon)


        this.scoreStickText = new Text(renderer, font, 22, "2")
        this.scoreStickText.x = 32 * 3
        this.scoreStickText.y = -11
        this.scoreStickText.alpha = 0.7
        this.settingsRoot.addChild(this.scoreStickText)
        this.backButton.visible = false
        this.settingsButton.visible = false
    }
    update() {
        this.scoreText.x = this.renderer.htmlWidth - 150
        if (this.numCoins > 9) this.scoreText.x -= 10
        this.coinIcon.x = this.renderer.htmlWidth - 80


        this.scoreStickText.x = this.renderer.htmlWidth - 150 - 110

        this.stickIcon.x = this.renderer.htmlWidth - 80 - 130
        if (this.settingHolder.root.visible) this.settingHolder.update();

    }
    setLevel(level: string) {

        if (LevelHandler.navigationLevels.includes(level)) {
            this.settingsRoot.x = 20
            this.settingsRoot.y = 20
        } else {
            this.settingsRoot.x = 40
            this.settingsRoot.y = 40
        }
        if (level == "Home") {
            this.backButton.alpha = 0.7
            this.backButton.visible = false
            this.settingsButton.visible = false
            this.hideCoins()
        } else {
            this.settingsButton.visible = true
            this.backButton.visible = true

        }


    }
    setCoins(displayCoins: number) {
        this.numCoins = displayCoins;
        this.scoreText.setText(displayCoins + "/30")
        this.coinIcon.sx = this.coinIcon.sy = 0.25
        this.scoreText.alpha = 1
        gsap.to(this.coinIcon, { sx: 0.2, sy: 0.2, ease: "back.in", duration: 0.2 })
        gsap.to(this.scoreText, { alpha: 0.7, duration: 0.2 })
    }
    setFishSticks(numFishsticks: number) {
        this.numFishsticks = numFishsticks;
        if (numFishsticks == 0) {
            this.scoreStickText.visible = false
            this.stickIcon.visible = false
        } else {
            this.scoreStickText.visible = true
            this.stickIcon.visible = true
            this.scoreStickText.setText(numFishsticks + "")
            this.stickIcon.sx = this.stickIcon.sy = 0.25
            this.scoreStickText.alpha = 1
            gsap.to(this.stickIcon, { sx: 0.2, sy: 0.2, ease: "back.in", duration: 0.2 })
            gsap.to(this.scoreStickText, { alpha: 0.7, duration: 0.2 })
        }

    }

    hideCoins() {
        this.scoreText.visible = false
        this.coinIcon.visible = false
        this.scoreStickText.visible = false
        this.stickIcon.visible = false
    }
    showCoins() {

        this.scoreText.visible = true
        this.coinIcon.visible = true
        if (this.numFishsticks > 0) {
            this.scoreStickText.visible = true
            this.stickIcon.visible = true
        }
    }

}