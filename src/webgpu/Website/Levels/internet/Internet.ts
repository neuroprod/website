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



    }

    public update() {
        super.update();
        (this.bgModel.material as FullScreenFillMaterial).setRatios(GameModel.renderer.ratio, this.backgroundTexture.options.width / this.backgroundTexture.options.height)

    }

    destroy() {
        super.destroy()

        SoundHandler.killBackgroundSounds()
    }


}
