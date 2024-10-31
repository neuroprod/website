import {GodLevel} from "./GodLevel/GodLevel.ts";

import {BaseLevel} from "./BaseLevel.ts";
import {StartLevel} from "./StartLevel/StartLevel.ts";
import LevelObjects from "./LevelObjects.ts";


class LevelHandler {
    public levelKeys: Array<string> = [];
    public levels: Map<string, BaseLevel> = new Map()

    public currentLevel!: BaseLevel;
    private levelObjects!: LevelObjects;

    init(levelObjects: LevelObjects) {
        this.levelObjects = levelObjects;
        this.addLevel("Start", new StartLevel())
        this.addLevel("God", new GodLevel())
    }

    setLevel(key: string) {

        if (this.currentLevel) this.currentLevel.destroy()
        this.currentLevel = this.levels.get(key) as BaseLevel;
        this.currentLevel.initObjects(this.levelObjects)
        this.currentLevel.init()
    }


    private addLevel(key: string, level: BaseLevel) {

        this.levelKeys.push(key)
        this.levels.set(key, level)
    }


}

export default new LevelHandler()