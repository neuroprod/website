import {BaseLevel} from "../BaseLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector3} from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import DripTest from "./drip/DripTest.ts";
import KrisWebsite from "./KrisWebsite.ts";
import LevelHandler from "../LevelHandler.ts";
import NavigationLevel from "../NavigationLevel.ts";
import SoundHandler from "../../SoundHandler.ts";

export class GraphicDev extends NavigationLevel {
    private kris!: SceneObject3D;
    private driptest!: DripTest;
    private krisWebsite!: KrisWebsite;

    constructor() {
        super();
        this.driptest = new DripTest()
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene(SceneHandler.getSceneIDByName("websiteGraphicsDev")).then(() => {
            LoadHandler.stopLoading()
            SceneHandler.addScene(SceneHandler.getSceneIDByName("kris")).then(() => {
                LoadHandler.stopLoading()
            });
        });
        SoundHandler.setBackgroundSounds(["sound/a-music-box-with-a-tense-atmosphere-166472.mp3"])
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        this.kris = sceneHandler.getSceneObject("krisRoot")
        this.kris.setScaler(0.7)
        this.kris.x = 0;
        this.kris.y = 0

        this.kris.z = -0.3
        this.kris.ry = 0
        this.krisWebsite = new KrisWebsite()
        this.krisWebsite.reset()
        this.krisWebsite.show()


        let holderLeft = SceneHandler.getSceneObject("textHolderLeft")
        let holderRight = SceneHandler.getSceneObject("textHolderRight")

        this.driptest.init(holderLeft, holderRight)


    }

    public update() {
        super.update()
        this.driptest.update()

    }

    destroy() {
      super.destroy()
        SoundHandler.killBackgroundSounds()
    }

}
