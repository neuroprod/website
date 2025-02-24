import {GodLevel} from "./GodLevel/GodLevel.ts";

import {BaseLevel} from "./BaseLevel.ts";
import {StartLevel} from "./StartLevel/StartLevel.ts";

import GodChoiceLevel from "./GodChoiceLevel/GodChoiseLevel.ts";
import {CookieLevel} from "./CookieLevel/CookieLevel.ts";
import {WebsiteLevel} from "./WebsiteLevel/WebsiteLevel.ts";
import CookieGame from "./CookieGame/CookieGame.ts";
import {StrawberryLevel} from "./StrawberryLevel/StrawberryLevel.ts";
import AppState from "../../AppState.ts";
import GameModel from "../GameModel.ts";
import {DockLevel} from "./DockLevel/DockLevel.ts";
import {SeaLevel} from "./SeaLevel/SeaLevel.ts";
import {HandLevel} from "./HandLevel/HandLevel.ts";
import {IntroLevel} from "./IntroLevel/IntroLevel.ts";
import gsap from "gsap";
import {GnomeLevel} from "./GnomeLevel/GnomeLevel.ts";
import {GirlLevel} from "./GirlLevel/GirlLevel.ts";

class LevelHandler {
    public levelKeys: Array<string> = [];
    public levels: Map<string, BaseLevel> = new Map()

    public currentLevel!: BaseLevel | null;


    init() {

        this.addLevel("Start", new StartLevel())
        this.addLevel("Website", new WebsiteLevel())
        this.addLevel("Intro", new IntroLevel())
        this.addLevel("God", new GodLevel())
        this.addLevel("GodChoice", new GodChoiceLevel())
        this.addLevel("Cookie", new CookieLevel())
        this.addLevel("CookieGame", new CookieGame())

        this.addLevel("StrawBerry", new StrawberryLevel())
        this.addLevel("Hand", new HandLevel())
        this.addLevel("Gnome", new GnomeLevel())
        this.addLevel("Girl", new GirlLevel())
        this.addLevel("Dock", new DockLevel())
        this.addLevel("Sea", new SeaLevel())
    }

    setLevel(key: string) {

        GameModel.gameRenderer.tweenToBlack()
gsap.delayedCall(0.5,()=>{
    if (this.currentLevel) this.currentLevel.destroy()
    this.currentLevel = this.levels.get(key) as BaseLevel;
    if (this.currentLevel) {
        AppState.setState("currentLevel", key);
        this.currentLevel.init()
    } else {
        console.log("level doesnt exist ->", key)
    }
    GameModel.gameRenderer.fxEnabled = false
    GameModel.coinHandeler.hide()
})



    }

    destroyCurrentLevel() {
        if (this.currentLevel) this.currentLevel.destroy()
        this.currentLevel = null;
    }

    onUI() {
        if (this.currentLevel) {
            this.currentLevel.onUI()
        }
    }

    private addLevel(key: string, level: BaseLevel) {

        this.levelKeys.push(key)
        this.levels.set(key, level)
    }
}

export default new LevelHandler()
