import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";

export default class Lab101 extends NavigationLevel{

    private video!:VideoPlayer;

    constructor() {
        super();

    }


    init() {
        super.init();
        if(!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/lab101.mp4", new Vector2(1920, 1080))

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("lab101")).then(() => {
            LoadHandler.stopLoading()

        });
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")


        this.video.play()

        let m = new Model(GameModel.renderer, "videoLab")
        m.material = new GBufferMaterial(GameModel.renderer, "videoLab")
        m.material.setTexture('colorTexture', this.video.getTexture())
        m.mesh = new Plane(GameModel.renderer, 1920 / 1000, 1080 / 1000)

        m.z =-0.3
        m.x = 0.20
        m.y = 0.25
        m.setScaler(0.4)
        m.rx = Math.PI / 2
m.transparent =false
        GameModel.gameRenderer.addModel(m)

    }

public update() {
        super.update()


    }

    destroy() {
        super.destroy()
this.video.pauze()
    }


}
