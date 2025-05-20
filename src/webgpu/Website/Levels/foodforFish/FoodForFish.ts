import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";

import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";

export default class FoodForFish extends NavigationLevel{


private video!:VideoPlayer;
    constructor() {
        super();

    }


    init() {
        super.init();
        if(!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/foodfish.mp4", new Vector2(1920, 1080))

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("foodforfish")).then(() => {
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
        let fv = SceneHandler.getSceneObject("videoHolder")
        let m = new Model(GameModel.renderer, "video1")
        m.material = new GBufferMaterial(GameModel.renderer, "video1")
        m.material.setTexture('colorTexture', this.video.getTexture())
        m.mesh = new Plane(GameModel.renderer, 1920 / 1000, 1080 / 1000)
        m.setScaler(0.20)
        m.z = 0.017
        m.x = 0.00
        m.y = 0.005
        m.rx = Math.PI / 2
        fv.addChild(m)
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
