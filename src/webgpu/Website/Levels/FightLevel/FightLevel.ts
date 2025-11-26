

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import gsap from "gsap";
import SceneObject3D from "../../../data/SceneObject3D.ts";

import GameModel from "../../GameModel.ts";


import { BaseLevel } from "../BaseLevel.ts";
import { Vector3 } from "@math.gl/core";



export class FightLevel extends BaseLevel {
    private tl!: gsap.core.Timeline;

    private rootShip!: SceneObject3D;
    private landlord!: SceneObject3D;






    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("c27ed274-ed0a-4d6e").then(() => {



            SceneHandler.addScene("1234").then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene("697e1443-b2d5-4871").then(() => {
                LoadHandler.stopLoading()
            });



            LoadHandler.stopLoading()
        })

    }
    configScene() {


        LoadHandler.onComplete = () => { }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)



        let char = sceneHandler.getSceneObject("charRoot")
        char.x = 0.6;
        char.y = 0;
        char.ry = Math.PI - 0.2

        char.setScaler(1.2)

        this.landlord = sceneHandler.getSceneObject("rootLandlord")
        this.landlord.setScaler(1.2)
        this.landlord.x = -0.6
        this.landlord.y = 0
        this.landlord.z = 0;



        sceneHandler.getSceneObject("landlordArmPoint").hide()




        let x = 0
        let y = 0.3
        GameModel.gameCamera.setLockedView(new Vector3(x, y, 0), new Vector3(x, y, 2))
        GameModel.gameRenderer.tweenToNonBlack()



    }


    update() {
        super.update();


    }

    destroy() {
        super.destroy()
        if (this.tl) this.tl.clear()

    }


}
