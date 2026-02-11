import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector3 } from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";

import SpiralMaterial from "./SpiralMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";

import gsap from "gsap";
import SoundHandler from "../../SoundHandler.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import LevelHandler from "../LevelHandler.ts";

export default class Social extends NavigationLevel {
    private bgModel!: Model;

    private links: Array<Array<string>> = [["linkedin", "https://www.linkedin.com/in/neuroproductions/"], ["youtube", "https://www.youtube.com/channel/UCUdunfSS-4CyZsIhICtgr6A"], ["bluesky", "https://bsky.app/profile/kristemmerman.bsky.social"], ["twitter", "https://twitter.com/NeuroProd"], ["instagram", "https://www.instagram.com/kris.temmerman/"], ["github", "https://github.com/neuroprod"]]

    private pupilLeft!: SceneObject3D;
    private pupilRight!: SceneObject3D;
    lx = 0.01074893674930702;
    ly = 0.06351309939657937;
    rx = 0.13538324159630588;
    ry = 0.08235943682215295;
    mouth!: SceneObject3D;
    tl!: gsap.core.Timeline;
    constructor() {
        super();

    }


    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("Social")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/looperman-l-2921269-0145176-delayed-mallet-riff-1.mp3"])
    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        this.setMouseHitObjects(SceneHandler.mouseHitModels);


        this.bgModel = new Model(GameModel.renderer, "background")
        this.bgModel.mesh = new Quad(GameModel.renderer)
        this.bgModel.material = new SpiralMaterial(GameModel.renderer, "bg")


        GameModel.gameRenderer.setModels(SceneHandler.allModels)

        this.bgModel.z = -100;
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))

        GameModel.gameRenderer.setLevelType("website")
        this.mouth = SceneHandler.getSceneObject("mouth")
        GameModel.mouseListener.directCheck = true

        for (let l of this.links) {
            let link = this.mouseInteractionMap.get(l[0]) as MouseInteractionWrapper
            link.onClick = () => {

                // @ts-ignore
                window.open(l[1], '_blank').focus();
            }
            link.onRollOver = () => {



                GameModel.renderer.setCursor(true)
                gsap.killTweensOf(link.sceneObject)
                gsap.to(link.sceneObject, {
                    sx: 1.1,
                    sy: 1.1,
                    rz: (Math.random() - 0.5) * 0.2,
                    ease: "elastic.out",
                    duration: 0.5
                })
                let index = Math.round(Math.random() * 100) % 7;

                if (this.tl) this.tl.clear();
                this.tl = gsap.timeline();
                this.tl.to(this.mouth, { sy: 1 + Math.random() * 0.05 + 0.05, y: -0.07 + (Math.random() * 0.03 - 0.015) * 0.2, ease: "power2.out" }, 0)
                this.tl.to(this.mouth, { sy: 1, y: -0.07, ease: "power2.out" }, 1)

                SoundHandler.playMoan(index)
                GameModel.renderer.setCursor(true)
            }
            link.onRollOut = () => {
                GameModel.renderer.setCursor(false)
                gsap.killTweensOf(link.sceneObject)
                gsap.to(link.sceneObject, { sx: 1.0, sy: 1.0, rz: 0, ease: "back.out", duration: 0.1 })
                GameModel.renderer.setCursor(false)
            }

        }
        this.pupilLeft = SceneHandler.getSceneObject("pupilLeft")
        this.pupilRight = SceneHandler.getSceneObject("pupilRight")


    }

    public update() {
        super.update()
        let t = Timer.time;
        this.bgModel.material.setUniform("ratio", GameModel.renderer.ratio)
        this.bgModel.material.setUniform("time", t)
        this.pupilLeft.x = this.lx + Math.cos(t) * 0.01
        this.pupilRight.x = this.rx + Math.sin(t + 1) * 0.01
        this.pupilLeft.y = this.ly + Math.cos(t + 3) * 0.005
        this.pupilRight.y = this.ry + Math.sin(t + 2) * 0.005

    }

    destroy() {
        super.destroy()
        if (this.tl) this.tl.clear();
        this.bgModel.destroy()
        SoundHandler.killBackgroundSounds()
        GameModel.mouseListener.directCheck = false
    }


}
