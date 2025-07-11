import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector3 } from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import gsap from "gsap";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import ProjectData from "../../../data/ProjectData.ts";
import SoundHandler from "../../SoundHandler.ts";
import MouthMaterial from "./MouthMaterial.ts";
import Ray from "../../../lib/Ray.ts";
import TextMesh from "../../../lib/twoD/TextMesh.ts";
import FontPool from "../../../lib/twoD/FontPool.ts";
import FontMesh from "../../../modelMaker/FontMesh.ts";

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
    private contactText!: SceneObject3D;

    private eCount = 0
    private line1!: SceneObject3D;
    private mouth!: SceneObject3D;
    private mouthMaterial!: MouthMaterial;
    private overTexture!: TextureLoader;
    private overModel!: Model;
    private ray2 = new Ray()
    private prevSeek: number = 100000;
    private contactTextMesh!: FontMesh;

    private contactTextArr = ["Contact me!", "For great\nprojects!", "cool visuals!", "Happy CLients!", "Macaroni Art!"]
    private contactTextArrCount = 0
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


        this.overTexture = new TextureLoader(GameModel.renderer, "backgrounds/overlay.png")
        LoadHandler.startLoading()
        this.overTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }
    }

    configScene() {
        super.configScene()
        this.eCount = 0
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0.05, 0.25, 0), new Vector3(0.05, 0.25, 0.60))

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

        this.contactText = SceneHandler.getSceneObject("contact")
        if (this.contactText.model) {
            this.contactTextMesh = this.contactText.model.mesh as FontMesh
        }
        this.line1 = SceneHandler.getSceneObject("line1")


        this.mouth = SceneHandler.getSceneObject("mouth")
        if (!this.mouthMaterial) this.mouthMaterial = new MouthMaterial(GameModel.renderer, "mouth")
        if (this.mouth.model) this.mouth.model.material = this.mouthMaterial

        let charProj = ProjectData.projectsNameMap.get("Contact")
        if (charProj) {

            this.mouthMaterial.setTexture("colorTexture", charProj.getBaseTexture())
        }
        this.beatCount = 0

        this.overModel = new Model(GameModel.renderer, "over");
        this.overModel.mesh = new Quad(GameModel.renderer)
        this.overModel.material = new FullScreenStretchMaterial(GameModel.renderer, "over")
        this.overModel.material.setTexture("colorTexture", this.overTexture)
        this.overModel.z = 0.24
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.overModel)
        if (this.contactText.model) {
            this.contactText.model.x = -0.035;
            this.contactText.model.y = +0.01;
        }
        this.prevSeek = 10000
        this.contactTextArrCount = 0;
    }

    public update() {
        super.update()
        let seek = SoundHandler.bgSounds[0].seek()
        if (seek < this.prevSeek) {
            this.beatCount = 0



        }
        this.prevSeek = seek;
        let s = Math.round(SoundHandler.bgSounds[0].seek() * 1000) + 200
        s %= 462;
        s /= 462;
        if (s < this.prevBeat) {

            this.beatCount++
            this.beatCount %= 8
            if (this.beatCount == 0) {
                this.contactTextArrCount++
                this.contactTextArrCount %= this.contactTextArr.length
                this.contactTextMesh.setText(this.contactTextArr[this.contactTextArrCount].toUpperCase(), ProjectData.font)
            }
            this.beat()
        }
        this.prevBeat = s;
        if (this.beatCount < 5) {
            let sF = Math.sin(s * Math.PI * 2) * 0.01;
            this.mouthMaterial.setUniform("topOffset", -sF)
            this.mouthMaterial.setUniform("bottomOffset", sF)
        }

        this.ray2.setFromCamera(GameModel.gameCamera.camera, GameModel.mouseListener.mouseNorm);
        let int = this.ray2.intersectPlaneCor(new Vector3(0, 0, 0.25), new Vector3(0, 0, -1))

        if (int) {


            this.contactText.setPositionV(int)
        }

    }

    destroy() {
        super.destroy()
        SoundHandler.killBackgroundSounds()
        this.backgroundTexture.destroy()
        this.overTexture.destroy()
    }


    private beat() {

        this.line1.rz -= 0.2

        this.arms.y = this.armsY + 0.01
        gsap.to(this.arms, { y: this.armsY, duration: 0.4 })


        if (this.isLeftLeg) {
            gsap.to(this.leg1, { y: this.leg1Y + 0.01, duration: 0.2 })
            gsap.to(this.leg2, { y: this.leg2Y, duration: 0.2 })
        } else {
            gsap.to(this.leg1, { y: this.leg1Y, duration: 0.2 })
            gsap.to(this.leg2, { y: this.leg2Y + 0.01, duration: 0.2 })
        }
        this.isLeftLeg = !this.isLeftLeg;
        this.contactText.rz = Math.random() - 0.5
        this.contactText.sx = this.contactText.sy = 2

        gsap.to(this.contactText, { sy: 1, sx: 1, duration: 0.2 })

        let beat4 = this.beatCount % 4
        for (let i = 0; i < 4; i++) {
            this.lightArray[i].sx = 1
            this.lightArray[i].sy = 1
            if (i == beat4) {
                this.lightArray[i].sx = 1.1
                this.lightArray[i].sy = 1.1
            }
        }


    }
}
