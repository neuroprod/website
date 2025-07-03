import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector2, Vector3} from "@math.gl/core";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import SoundHandler from "../../SoundHandler.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";

export default class Lab101 extends NavigationLevel{

    private video!:VideoPlayer;
    private bgModel!: Model;

    constructor() {
        super();

    }


    init() {
        super.init();
        if(!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/overview1.mp4", new Vector2(1920, 1080))

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("lab101")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/somnium-female-choir-vocalise-319176.mp3"])
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

        this.bgModel = new Model(GameModel.renderer,"background")
        this.bgModel.mesh =new Quad(GameModel.renderer)
        this.bgModel.material =new FullScreenStretchMaterial(GameModel.renderer,"bg")
        this.bgModel.material.setTexture("colorTexture",  this.video.getTexture())
        this.bgModel.z =-100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)
        let link = this.mouseInteractionMap.get("lab101") as MouseInteractionWrapper

        link.onClick = () => {

            // @ts-ignore
            window.open("https://lab101.be", '_blank').focus();
        }
        link.onRollOver = () => {
            GameModel.renderer.setCursor(true)
           
           
        }
        link.onRollOut = () => {
            GameModel.renderer.setCursor(false)
          

        }
    }

public update() {
        super.update()


    }

    destroy() {
        super.destroy()
this.video.pauze()
        SoundHandler.killBackgroundSounds()
    }


}
