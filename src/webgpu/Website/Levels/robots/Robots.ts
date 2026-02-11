import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";

import Quad from "../../../lib/mesh/geometry/Quad.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import { Howl } from "howler";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import SoundHandler from "../../SoundHandler.ts";
import FullScreenFillMaterial from "../../backgroundShaders/FullscreenFillMaterial.ts";

export default class Robots extends NavigationLevel {

    private video!: VideoPlayer;
    private bgModel!: Model;
    private bgSound!: Howl;
    private bgSound2!: Howl;

    constructor() {
        super();

    }


    init() {
        super.init();


        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("robots")).then(() => {
            LoadHandler.stopLoading()

        });
        /*
                this.bgSound = new Howl({
                    src: ['sound/robot-riff-44991.mp3'],
                    loop: true,
                    autoplay: true,
                    onload: () => {
        
                        this.bgSound.fade(0, 1, 2000);
                    }
                });
                this.bgSound2 = new Howl({
                    src: ['sound/robot-robby-1-83380.mp3'],
                    loop: true,
                    autoplay: true,
                    onload: () => {
        
                        this.bgSound2.fade(0, 1, 2000);
                    }
                });*/
        SoundHandler.setBackgroundSounds(['sound/robot-riff-44991.mp3', 'sound/robot-robby-1-83380.mp3'])
        if (!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/robot.mp4", new Vector2(1920, 1080))
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))

        GameModel.gameRenderer.setLevelType("website")


        this.video.play()


        this.bgModel = new Model(GameModel.renderer, "background")
        this.bgModel.mesh = new Quad(GameModel.renderer)
        this.bgModel.material = new FullScreenFillMaterial(GameModel.renderer, "bg")
        this.bgModel.material.setTexture("colorTexture", this.video.getTexture())
        this.bgModel.z = -100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)

        this.video.onPlay = () => {

            this.bgModel.material.setTexture('colorTexture', this.video.getTexture())
        }


        let link = this.mouseInteractionMap.get("youtube") as MouseInteractionWrapper

        link.onClick = () => {

            // @ts-ignore
            window.open("https://www.youtube.com/channel/UCUdunfSS-4CyZsIhICtgr6A", '_blank').focus();
        }
        link.onRollOver = () => {
            GameModel.renderer.setCursor(true)


        }
        link.onRollOut = () => {
            GameModel.renderer.setCursor(false)


        }

    }

    public update() {
        super.update();

        (this.bgModel.material as FullScreenFillMaterial).setRatios(GameModel.renderer.ratio, 16 / 9)

    }

    destroy() {
        super.destroy()
        this.video.pauze()

    }


}
