import { Vector3 } from "@math.gl/core";
import NavigationLevel from "../NavigationLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import ClientFontMaterial from "./ClientFontMaterial.ts";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import SoundHandler from "../../SoundHandler.ts";


export default class Clients extends NavigationLevel {
    private fontMaterial!: ClientFontMaterial;
    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;
    private size: number = 0;
    private time = 0

    private chin!: SceneObject3D;
    private overTexture!: TextureLoader;
    private overModel!: Model;


    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("clients")).then(() => {
            LoadHandler.stopLoading()

        });
        this.backgroundTexture = new TextureLoader(GameModel.renderer, "backgrounds/paper.jpg")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }


        this.overTexture = new TextureLoader(GameModel.renderer, "backgrounds/overlay.png")

        LoadHandler.startLoading()
        this.overTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }
        SoundHandler.setBackgroundSounds(["sound/clients.mp3"]);

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }


        GameModel.gameRenderer.setModels(SceneHandler.allModels)

        this.bgModel = new Model(GameModel.renderer, "background")
        this.bgModel.mesh = new Quad(GameModel.renderer)
        this.bgModel.material = new FullScreenStretchMaterial(GameModel.renderer, "bg")
        this.bgModel.material.setTexture("colorTexture", this.backgroundTexture)
        this.bgModel.z = -100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)


        this.overModel = new Model(GameModel.renderer, "over");
        this.overModel.mesh = new Quad(GameModel.renderer)
        this.overModel.material = new FullScreenStretchMaterial(GameModel.renderer, "over")
        this.overModel.material.setTexture("colorTexture", this.overTexture)
        this.overModel.z = -0.01
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.overModel)

        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        let text = SceneHandler.getSceneObject("text")
        if (text.model) {
            this.size = text.model.mesh.max.x
            if (!this.fontMaterial) this.fontMaterial = new ClientFontMaterial(GameModel.renderer, "clientFontMaterial")
            text.model.material = this.fontMaterial
            GameModel.gameRenderer.postLightModelRenderer.addModel(text.model)
            text.z = -0.005

            text.setScaler(0.8)
        }
        this.chin = SceneHandler.getSceneObject("chin");

        this.time = 0;
    }

    public update() {
        super.update()
        this.time += Timer.delta * 0.2
        this.fontMaterial.setUniform("time", this.time)
        this.fontMaterial.setUniform("size", this.size)

        this.chin.y = 0.2065 - ((Timer.time * 5) % 1) * 0.01
    }

    destroy() {
        super.destroy()
        SoundHandler.killBackgroundSounds()
        GameModel.gameCamera.setMouseInput()
        this.overTexture.destroy()
        this.backgroundTexture.destroy()
    }


}
