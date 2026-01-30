import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Timer from "../../../lib/Timer.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";
import GBufferFullScreenStretchMaterial from "../../backgroundShaders/GBufferFullScreenStretchMaterial.ts";
import gsap from "gsap";
import FullScreenStretchMaterial from "../../backgroundShaders/FullscreenStretchMaterial.ts";
import SoundHandler from "../../SoundHandler.ts";
import { Howl } from "howler";
export default class Scroll extends NavigationLevel {
    private scroll1!: SceneObject3D;
    private scroll2!: SceneObject3D;
    private scroll3!: SceneObject3D;
    private scroll4!: SceneObject3D;
    private worm1!: SceneObject3D;
    private worm2!: SceneObject3D;
    private backgroundTexture!: TextureLoader;
    private bgModel!: Model;

    private worm1Time = 0
    private worm2Time = 4

    private worm1Dir = 1
    private worm2Dir = -1
    private scrollArr: Array<SceneObject3D> = []
    private head1!: SceneObject3D;
    private head2!: SceneObject3D;
    private bgSound!: Howl;
    private overTexture!: TextureLoader;
    private overModel!: Model;
    splash1!: SceneObject3D;
    splash2!: SceneObject3D;
    worm1Playing: boolean = true;
    worm2Playing: boolean = true;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("scroll")).then(() => {
            LoadHandler.stopLoading()

        });
        this.backgroundTexture = new TextureLoader(GameModel.renderer, "backgrounds/scrollBG.jpg")

        LoadHandler.startLoading()
        this.backgroundTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }

        this.overTexture = new TextureLoader(GameModel.renderer, "backgrounds/overlay.png")
        LoadHandler.startLoading()
        this.overTexture.onComplete = () => {
            LoadHandler.stopLoading()
        }


        SoundHandler.setBackgroundSounds(["sound/meatLoop.mp3"])


    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        this.scroll1 = SceneHandler.getSceneObject("scroll1")
        this.scroll2 = SceneHandler.getSceneObject("scroll2")
        this.scroll3 = SceneHandler.getSceneObject("scroll3")
        this.scroll4 = SceneHandler.getSceneObject("scroll4")

        this.scrollArr.push(this.scroll1)
        this.scrollArr.push(this.scroll2)
        this.scrollArr.push(this.scroll3)
        this.scrollArr.push(this.scroll4)

        this.worm1 = SceneHandler.getSceneObject("worm1")
        this.worm2 = SceneHandler.getSceneObject("worm2")
        this.head1 = SceneHandler.getSceneObject("head1")
        this.head2 = SceneHandler.getSceneObject("head2")

        this.splash1 = SceneHandler.getSceneObject("splash1")
        this.splash1.hide()
        this.splash2 = SceneHandler.getSceneObject("splash2")
        this.splash2.hide()



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
        this.overModel.z = 100
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.overModel)



        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        let worm1Mouse = this.mouseInteractionMap.get("worm1")
        if (worm1Mouse) {
            worm1Mouse.onRollOver = () => { if(! this.worm1Playing )return; GameModel.renderer.setCursor(true) }
            worm1Mouse.onRollOut = () => { if(! this.worm1Playing )return; GameModel.renderer.setCursor(false) }
            worm1Mouse.onClick = () => {
if(! this.worm1Playing )return;
                this.splash1.show()
                this.head1.hide()
                this.worm1.hide()
                this.worm1Playing = false;
                SoundHandler.playSquatch()
                gsap.killTweensOf(this.worm1)
                this.splash1.sx = 0.7
                this.splash1.sy = 0.9
                gsap.to(this.splash1, { sx: 1, sy: 1, ease: "power3.out", duration: 0.3 })
                 GameModel.renderer.setCursor(false)
            }
        }

        let worm2Mouse = this.mouseInteractionMap.get("worm2")
        if (worm2Mouse) {
            worm2Mouse.onRollOver = () => {if(! this.worm2Playing )return; GameModel.renderer.setCursor(true) }
            worm2Mouse.onRollOut = () => { if(! this.worm2Playing )return;GameModel.renderer.setCursor(false) }
            worm2Mouse.onClick = () => {

 if(! this.worm2Playing )return;
                this.splash2.show()
                this.head2.hide()
                this.worm2.hide()
                this.worm2Playing = false;
                SoundHandler.playSquatch()
                gsap.killTweensOf(this.worm2)

                this.splash2.sx = 0.7
                this.splash2.sy = 0.9
                gsap.to(this.splash2, { sx: 1, sy: 1, ease: "power3.out", duration: 0.3 })
                GameModel.renderer.setCursor(false)
            }
        }

        this.worm1Playing = true
        this.worm2Playing = true
    }

    public update() {
        super.update()

        for (let s of this.scrollArr) {

            s.y -= Timer.delta * 0.3;
            if (s.y < -0.5) {
                s.y = 0.5
                s.x = Math.random() - 0.5
            }

        }




        if (this.worm1Playing) {
            this.worm1Time -= Timer.delta
            if (this.worm1Time < 0) {

                if (this.worm1.x > 0.1) {
                    this.worm1Dir = -1
                    this.worm1.x -= 0.05
                }
                if (this.worm1.x < -0.1) {
                    this.worm1Dir = 1
                    this.worm1.x += 0.05
                }
                if (this.worm1Dir == 1) {
                    this.worm1.ry = 0
                    this.head1.z = 0.01
                } else {
                    this.worm1.ry = Math.PI
                    this.head1.z = -0.01
                }
                this.moveWorm(this.worm1, this.worm1Dir, 1)
                this.worm1Time += 3 + Math.random() * 8

            }
        }
        if (this.worm2Playing) {
            this.worm2Time -= Timer.delta
            if (this.worm2Time < 0) {
                if (this.worm2.x > 0.1) {
                    this.worm2Dir = -1
                    this.worm2.x -= 0.05
                }
                if (this.worm2.x < -0.1) {
                    this.worm2Dir = 1
                    this.worm2.x += 0.05
                }
                if (this.worm2Dir == 1) {
                    this.worm2.ry = Math.PI
                    this.head2.z = -0.01
                } else {
                    this.worm2.ry = 0
                    this.head2.z = 0.01
                }
                this.moveWorm(this.worm2, this.worm2Dir, 0.5)
                this.worm2Time += 6 + Math.random() * 9
            }
        }

    }
    moveWorm(worm: SceneObject3D, dir: number, vol: number) {
        let tl = gsap.timeline()
        let wx = worm.x;
        SoundHandler.playScroll(wx, vol)
        tl.to(worm, { sx: 0.9, sy: 1.05, duration: 0.6, ease: "power2.inOut" }, 0)
        tl.to(worm, { sx: 1, sy: 1, x: wx + 0.02 * dir, duration: 1.5, ease: "power2.inOut" }, 1.1)
    }

    destroy() {
        super.destroy()
        this.backgroundTexture.destroy()
        this.overTexture.destroy()
        this.overModel.mesh.destroy()
        this.bgModel.mesh.destroy()
        this.scrollArr = []
        SoundHandler.killBackgroundSounds();
    }


}
