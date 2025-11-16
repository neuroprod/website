import { GodLevel } from "./GodLevel/GodLevel.ts";

import { BaseLevel } from "./BaseLevel.ts";
import { StartLevel } from "./StartLevel/StartLevel.ts";

import GodChoiceLevel from "./GodChoiceLevel/GodChoiseLevel.ts";
import { CookieLevel } from "./CookieLevel/CookieLevel.ts";
import CookieGame from "./CookieGame/CookieGame.ts";
import { StrawberryLevel } from "./StrawberryLevel/StrawberryLevel.ts";
import AppState from "../../AppState.ts";
import GameModel from "../GameModel.ts";
import { DockLevel } from "./DockLevel/DockLevel.ts";
import { SeaLevel } from "./SeaLevel/SeaLevel.ts";
import { HandLevel } from "./HandLevel/HandLevel.ts";
import { IntroLevel } from "./IntroLevel/IntroLevel.ts";
import gsap from "gsap";

import { GirlLevel } from "./GirlLevel/GirlLevel.ts";

import { GraphicDev } from "./graphicDev/GraphicDev.ts";
import FoodForFish from "./foodforFish/FoodForFish.ts";
import Meat from "./meat/Meat.ts";
import ArduinoGame from "./arduinoGame/ArduinoGame.ts";
import FisTik from "./fistik/FisTik.ts";
import Lab101 from "./lab101/Lab101.ts";
import Scroll from "./scroll/Scroll.ts";
import Contact from "./Contact/Contact.ts";
import Shaders from "./shaders/Shaders.ts";
import Clients from "./clients/Clients.ts";
import Friends from "./friends/Friends.ts";
import Social from "./social/Social.ts";
import Robots from "./robots/Robots.ts";
import Peeler from "./peeler/Peeler.ts";
import Internet from "./internet/Internet.ts";
import GuageLevel from "./guage/GuageLevel.ts";
import GunLevel from "./gun/GunLevel.ts";
import DeadLevel from "./dead/DeadLevel.ts";
import { FactoryLevel } from "./factory/FactoryLevel.ts";

class LevelHandler {
    public levelKeys: Array<string> = [];
    public levels: Map<string, BaseLevel> = new Map()

    public currentLevel!: BaseLevel | null;

    public navigationLevels: Array<string> = ["Worries", "Me", "Smullen", "Food", "Shaders", "Clients", "Robot", "This", "Invasion", "Friends", "Lab101", "Macaroni", "Social", "Contact"]
    private currentLevelName: string = "";
    init() {
        this.addLevel("Factory", new FactoryLevel())
        this.addLevel("Home", new StartLevel())
        this.addLevel("Dead", new DeadLevel());
        this.addLevel("Gun", new GunLevel());
        this.addLevel("Guage", new GuageLevel());
        this.addLevel("Macaroni", new Internet())
        this.addLevel("Me", new GraphicDev())
        //this.addLevel("Peeler", new Peeler())
        this.addLevel("Shaders", new Shaders())
        this.addLevel("Food", new FoodForFish())
        this.addLevel("Friends", new Friends())
        this.addLevel("This", new Meat())
        this.addLevel("Clients", new Clients())
        this.addLevel("Invasion", new ArduinoGame())
        this.addLevel("Smullen", new FisTik())
        this.addLevel("Robot", new Robots())
        this.addLevel("Social", new Social())
        this.addLevel("Worries", new Scroll())
        this.addLevel("Lab101", new Lab101())
        this.addLevel("Contact", new Contact())
        this.addLevel("Intro", new IntroLevel())
        this.addLevel("God", new GodLevel())
        this.addLevel("GodChoice", new GodChoiceLevel())
        this.addLevel("Cookie", new CookieLevel())
        this.addLevel("CookieGame", new CookieGame())

        this.addLevel("StrawBerry", new StrawberryLevel())
        this.addLevel("Hand", new HandLevel())

        this.addLevel("Girl", new GirlLevel())
        this.addLevel("Dock", new DockLevel())
        this.addLevel("Sea", new SeaLevel())
    }

    setLevel(key: string) {
        if (this.currentLevelName == key) return
        this.currentLevelName = key;
        // history.pushState({urlPath: '/' + key}, "", '/' + key)
        // GameModel.gameRenderer.tweenToBlack()
        GameModel.UI2D.setLevel(key)
        let delay = 0
        if (this.currentLevel) delay = this.currentLevel.endAnime()
        gsap.delayedCall(delay, () => {
            GameModel.coinHandler.hide()
            if (this.currentLevel) this.currentLevel.destroy()

            this.currentLevel = this.levels.get(key) as BaseLevel;

            if (this.currentLevel) {
                AppState.setState("currentLevel", key);
                this.currentLevel.init()
            } else {
                console.log("level doesnt exist ->", key)
                key = "Home"
                this.currentLevel = this.levels.get(key) as BaseLevel;
                AppState.setState("currentLevel", key);
                this.currentLevel.init()
            }
            GameModel.gameRenderer.fxEnabled = false

        })


    }

    setNextNavigationLevel() {
        let i = this.navigationLevels.indexOf(this.currentLevelName)
        i += 1;
        i %= this.navigationLevels.length;
        this.setLevel(this.navigationLevels[i])
    }
    setPrevNavigationLevel() {
        let i = this.navigationLevels.indexOf(this.currentLevelName)
        i -= 1;
        i %= this.navigationLevels.length;
        if (i < 0) i += this.navigationLevels.length

        this.setLevel(this.navigationLevels[i])
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
