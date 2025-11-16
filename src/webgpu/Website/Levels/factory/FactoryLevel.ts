
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";

import CharacterController from "../../CharacterController.ts";

import GameModel from "../../GameModel.ts";
import { PlatformLevel } from "../PlatformLevel.ts";
import { Vector3 } from "@math.gl/core";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import { HitTrigger } from "../../../data/HitTriggers.ts";
import gsap from "gsap";
import LevelHandler from "../LevelHandler.ts";


export class FactoryLevel extends PlatformLevel {
    private startPos: number = -3;
    girl!: SceneObject3D;



    init() {
        super.init();
        this.characterController = new CharacterController(GameModel.renderer)
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()



        SceneHandler.setScene("aee2b3e2-c1b5-4e53").then(() => {
            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });

            LoadHandler.stopLoading()
        })

    }

    configScene() {
        super.configScene()
        LoadHandler.onComplete = () => {
        }
        this.blockInput = false

        GameModel.gameCamera.setCharacter()


        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        GameModel.gameRenderer.addModel(this.characterController.cloudParticles.particlesModel)



        let charRoot = SceneHandler.getSceneObject("charRoot");
        charRoot.x = this.startPos
        charRoot.y = 0.0
        charRoot.setScaler(1.2)
        this.characterController.setCharacter()
        this.blockInput = true
        this.characterController.gotoAndIdle(new Vector3(this.startPos + 0.5, 0, 0), 1, () => { this.blockInput = false })



        GameModel.gameCamera.setMinMaxX(this.startPos, this.startPos + 5)


        GameModel.gameCamera.setForCharPos(new Vector3(this.startPos, 0, 0))
        GameModel.gameCamera.camDistance = 2

    }
    resolveHitTrigger(f: SceneObject3D) {
        if (!super.resolveHitTrigger(f)) {






        }

        return false;
    }
    update() {
        super.update();

        console.log(GameModel.gameCamera.camDistance)

    }

    destroy() {
        super.destroy();
    }



}
