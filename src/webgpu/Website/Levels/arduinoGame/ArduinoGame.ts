import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";
import ArduinoGamePixels from "./ArduinoGamePixels.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import SoundHandler from "../../SoundHandler.ts";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";
import Timer from "../../../lib/Timer.ts";
import ColorV from "../../../lib/ColorV.ts";



export default class ArduinoGame extends NavigationLevel {
    private arduinoGame: ArduinoGamePixels;
    private video!: VideoPlayer;
    private arduino!: SceneObject3D;



    constructor() {
        super();
        this.arduinoGame = new ArduinoGamePixels()
    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("arduinoGame")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/neighbourhood.mp3"])

        if (!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/game.mp4", new Vector2(1920, 1080))
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")

        this.arduinoGame.init(SceneHandler.getSceneObject("root4"))
        this.arduinoGame.setEnabled(true)


        let fv = SceneHandler.getSceneObject("arduinPicture")
        let m = new Model(GameModel.renderer, "video1")
        m.material = new GBufferMaterial(GameModel.renderer, "video1")
        m.material.setTexture('colorTexture', this.video.getTexture())


        this.video.onPlay = () => {

            m.material.setTexture('colorTexture', this.video.getTexture())
        }

        this.video.play()
        m.mesh = new Plane(GameModel.renderer, 1920 / 1000, 1080 / 1000)
        m.setScaler(0.26)
        m.z = 0.017
        m.x = 0.01
        m.y = 0.04
        m.rx = Math.PI / 2
        m.rz = 0.01
        fv.addChild(m)
        GameModel.gameRenderer.addModel(m)
        this.arduino = SceneHandler.getSceneObject("arduino")

        GameModel.gameRenderer.setRenderSettingsNeutral({ backgroundColor: new ColorV(0.04, 0.05, 0.07, 0.00) })


    }
    onUI(): void {
        this.arduinoGame.onUI()
    }
    public update() {
        super.update()
        this.arduinoGame.update()
        if (this.arduino.model)
            this.arduino.model.rz += Timer.delta

    }

    destroy() {
        super.destroy()
        this.arduinoGame.setEnabled(false)
        SoundHandler.killBackgroundSounds()
        this.video.pauze()
    }


}
