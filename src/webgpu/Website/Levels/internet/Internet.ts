import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import SoundHandler from "../../SoundHandler.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import FullScreenFillMaterial from "../../backgroundShaders/FullscreenFillMaterial.ts";

export default class Internet extends NavigationLevel {


    private bgModel!: Model;
    backgroundTexture!: TextureLoader;
    private video!: VideoPlayer;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)

        this.backgroundTexture = new TextureLoader(GameModel.renderer, "backgrounds/deadInternet.jpg")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }
        SoundHandler.setBackgroundSounds(["sound/389493__juanlopz08__06-boiling-water-present.mp3"])


        if (!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/macaroni.mp4", new Vector2(1920, 1080))
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels([])
        // this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")



        this.bgModel = new Model(GameModel.renderer, "background")
        this.bgModel.mesh = new Quad(GameModel.renderer)
        this.bgModel.material = new FullScreenFillMaterial(GameModel.renderer, "bg")
        this.bgModel.material.setTexture("colorTexture", this.backgroundTexture)
        this.bgModel.z = -100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)



        /*
                this.bgModel = new Model(GameModel.renderer, "background")
                this.bgModel.mesh = new Quad(GameModel.renderer)
                this.bgModel.material = new FullScreenStretchMaterial(GameModel.renderer, "bg")
                this.bgModel.material.setTexture("colorTexture", this.video.getTexture())
                this.bgModel.z = -100
        */

        this.video.onPlay = () => {

            this.bgModel.material.setTexture('colorTexture', this.video.getTexture())
        }

        this.video.play()


        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)

    }

    public update() {
        super.update();
        (this.bgModel.material as FullScreenFillMaterial).setRatios(GameModel.renderer.ratio, 16 / 9)

    }

    destroy() {
        super.destroy()
        this.video.pauze()
        SoundHandler.killBackgroundSounds()
    }


}
