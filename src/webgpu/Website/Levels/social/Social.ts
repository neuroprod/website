import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import {Vector3} from "@math.gl/core";
import Model from "../../../lib/model/Model.ts";
import Quad from "../../../lib/mesh/geometry/Quad.ts";

import SpiralMaterial from "./SpiralMaterial.ts";
import Timer from "../../../lib/Timer.ts";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";

import gsap from "gsap";
import SoundHandler from "../../SoundHandler.ts";

export default class Social extends NavigationLevel {
    private bgModel!: Model;

    private links: Array<Array<string>> = [["linkedin", "https://www.linkedin.com/in/neuroproductions/"], ["youtube", "https://www.youtube.com/channel/UCUdunfSS-4CyZsIhICtgr6A"], ["bluesky", "https://bsky.app/profile/kristemmerman.bsky.social"], ["twitter", "https://twitter.com/NeuroProd"], ["instagram", "https://www.instagram.com/kris.temmerman/"], ["github", "https://github.com/neuroprod"]]

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

        this.bgModel.z =-100;
        GameModel.gameRenderer.postLightModelRenderer.addModelToFront(this.bgModel)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedView(new Vector3(0, 0.0, 0), new Vector3(0, 0.0, 0.65))

        GameModel.gameRenderer.setLevelType("website")


        for (let l of this.links) {
            let link = this.mouseInteractionMap.get(l[0]) as MouseInteractionWrapper
            link.onClick = () => {

                // @ts-ignore
                window.open(l[1], '_blank').focus();
            }
            link.onRollOver = () => {
                gsap.killTweensOf(link.sceneObject)
                gsap.to(link.sceneObject, {
                    sx: 1.1,
                    sy: 1.1,
                    rz: (Math.random() - 0.5) * 0.2,
                    ease: "elastic.out",
                    duration: 0.5
                })
               // SoundHandler.playFart()
            }
            link.onRollOut = () => {

                gsap.killTweensOf(link.sceneObject)
                gsap.to(link.sceneObject, {sx: 1.0, sy: 1.0, rz: 0, ease: "back.out", duration: 0.1})

            }

        }


    }

    public update() {
        super.update()
        this.bgModel.material.setUniform("ratio", GameModel.renderer.ratio)
        this.bgModel.material.setUniform("time", Timer.time)
    }

    destroy() {
        super.destroy()
        this.bgModel.destroy()
        SoundHandler.killBackgroundSounds()
    }


}
