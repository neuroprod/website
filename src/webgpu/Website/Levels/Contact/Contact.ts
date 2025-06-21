import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector3} from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import gsap from "gsap";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import FontMesh from "../../../modelMaker/FontMesh.ts";
import ProjectData from "../../../data/ProjectData.ts";
import SoundHandler from "../../SoundHandler.ts";

export default class Contact extends NavigationLevel {


    private prevBeat = 0
    private beatCount = 0
    private bgModel!: Model;
    private leg1!: SceneObject3D;
    private leg1Y = -0.058880
    private leg2!: SceneObject3D;
    private leg2Y = -0.06153
    private arms!: SceneObject3D;
    private armsY = 0


    private light1!: SceneObject3D;
    private light2!: SceneObject3D;
    private light3!: SceneObject3D;
    private light4!: SceneObject3D;

    private lightArray: Array<SceneObject3D> = [];
    private isLeftLeg: boolean = false
    private backgroundTexture!: TextureLoader;
    private mee!: SceneObject3D;
    private meeMesh!: FontMesh;
    private eCount = 0
    private line1!: SceneObject3D;
    private mouth!: SceneObject3D;

    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Contact")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/ritmo-loop-bunciac-313953.mp3"])

        this.backgroundTexture = new TextureLoader(GameModel.renderer, "backgrounds/contact.png")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }

        this.eCount = 0
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.60))

        GameModel.gameRenderer.setLevelType("website")

        this.leg1 = SceneHandler.getSceneObject("leg1")
        this.leg2 = SceneHandler.getSceneObject("leg2")
        this.arms = SceneHandler.getSceneObject("arms")


        this.light4 = SceneHandler.getSceneObject("light1")
        this.light3 = SceneHandler.getSceneObject("light2")
        this.light2 = SceneHandler.getSceneObject("light3")
        this.light1 = SceneHandler.getSceneObject("light4")
        this.lightArray = []
        this.lightArray.push(this.light1)
        this.lightArray.push(this.light2)
        this.lightArray.push(this.light3)
        this.lightArray.push(this.light4)
        this.bgModel = new Model(GameModel.renderer, "background")
        this.bgModel.mesh = new Quad(GameModel.renderer)
        this.bgModel.material = new FullScreenStretchMaterial(GameModel.renderer, "bg")
        this.bgModel.material.setTexture("colorTexture", this.backgroundTexture)
        this.bgModel.z = -100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)

        this.mee = SceneHandler.getSceneObject("mee")
        this.meeMesh = this.mee.model?.mesh as FontMesh
        this.line1 = SceneHandler.getSceneObject("line1")


        this.mouth = SceneHandler.getSceneObject("mouth")

    }

    public update() {
        super.update()
        let s = Math.round(SoundHandler.bgSounds[0].seek() * 1000) + 200
        s %= 462;
        s /= 462;
        if (s < this.prevBeat) {
            console.log(this.beatCount)
            this.beatCount++
            this.beatCount %= 8
            this.beat()
        }
        this.prevBeat = s;


    }

    destroy() {
        super.destroy()
        SoundHandler.killBackgroundSounds()
        this.backgroundTexture.destroy()
    }


    private beat() {

        this.line1.rz -= 0.2

        this.arms.y = this.armsY + 0.01
        gsap.to(this.arms, {y: this.armsY, duration: 0.4})


        if (this.isLeftLeg) {
            gsap.to(this.leg1, {y: this.leg1Y + 0.01, duration: 0.2})
            gsap.to(this.leg2, {y: this.leg2Y, duration: 0.2})
        } else {
            gsap.to(this.leg1, {y: this.leg1Y, duration: 0.2})
            gsap.to(this.leg2, {y: this.leg2Y + 0.01, duration: 0.2})
        }
        this.isLeftLeg = !this.isLeftLeg;


        let beat4 = this.beatCount % 4
        for (let i = 0; i < 4; i++) {
            this.lightArray[i].sx = 1
            this.lightArray[i].sy = 1
            if (i == beat4) {
                this.lightArray[i].sx = 1.1
                this.lightArray[i].sy = 1.1
            }
        }

        this.eCount++
        let s = "M"
        for (let i = 0; i < this.eCount; i++) {
            s += "E"
            //if(i%20==19)s+="\n "

        }
        s += "!"
        this.meeMesh.setText(s, ProjectData.font)
        if (this.eCount > 16) this.eCount = 0

    }
}
