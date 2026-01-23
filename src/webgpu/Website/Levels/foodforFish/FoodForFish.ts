import NavigationLevel from "../NavigationLevel.ts";

import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import GameModel from "../../GameModel.ts";
import { Vector2, Vector3 } from "@math.gl/core";

import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";
import SoundHandler from "../../SoundHandler.ts";
import gsap from "gsap";
import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import TextureLoader from "../../../lib/textures/TextureLoader.ts";

export default class FoodForFish extends NavigationLevel {


    private video!: VideoPlayer;
    fwa!: Model
    fishMouth!: Model;
    constructor() {
        super();
    
    }


    init() {
        super.init();


        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()

        SceneHandler.setScene(SceneHandler.getSceneIDByName("foodforfish")).then(() => {
            LoadHandler.stopLoading()

        });
        SoundHandler.setBackgroundSounds(["sound/Goldberg.mp3"])

            if (!this.video) this.video = new VideoPlayer(GameModel.renderer, "video/foodfish.mp4", new Vector2(1920, 1080))
                 
              
                
    }

    configScene() {
        super.configScene()
        console.log("CONFIG SCENE FOOD FOR FISH")
        LoadHandler.onComplete = () => {
        }
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);

        GameModel.gameCamera.setLockedViewZoom(new Vector3(0, 0.25, 0), new Vector3(0, 0.25, 0.65))

console.log(this.configScene,"CONFIG SCENE FOOD FOR FISH???????????????????????????????")
        GameModel.gameRenderer.setLevelType("website")

        
        let fv = SceneHandler.getSceneObject("videoHolder")
        let m = new Model(GameModel.renderer, "video1")
        m.material = new GBufferMaterial(GameModel.renderer, "video1")
        m.material.setTexture('colorTexture', this.video.getTexture())
        m.mesh = new Plane(GameModel.renderer, 1920 / 1000, 1080 / 1000)
        this.video.onPlay = () => {
            console.log("onplayé")
            m.material.setTexture('colorTexture', this.video.getTexture())
        }
        console.log(this.video.onPlay,"????????????????????????????????")
        this.video.play()
        m.setScaler(0.37)
        m.z = 0.017
        m.x = 0.00
        m.y = 0.005
        m.rx = Math.PI / 2
        fv.addChild(m)
        GameModel.gameRenderer.addModel(m)


        let link = this.mouseInteractionMap.get("playFish") as MouseInteractionWrapper

        link.onClick = () => {

            // @ts-ignore
            window.open("https://foodforfish.org", '_blank').focus();
        }
        link.onRollOver = () => {
            GameModel.renderer.setCursor(true)
            gsap.killTweensOf(link.sceneObject)
            gsap.to(link.sceneObject, {
                sx: 1.1,
                sy: 1.1,

                ease: "elastic.out",
                duration: 0.5
            })

        }
        link.onRollOut = () => {
            GameModel.renderer.setCursor(false)
            gsap.killTweensOf(link.sceneObject)
            gsap.to(link.sceneObject, { sx: 1.0, sy: 1.0, ease: "back.out", duration: 0.1 })

        }



        this.fwa = SceneHandler.getSceneObject("fwaLogo").model as Model
        this.fwa.sx = 0.65
        this.fwa.x = -0.2


        this.fishMouth = SceneHandler.getSceneObject("FishMouth").model as Model

        let tl = gsap.timeline({
            delay: 5
        })


        this.fishMouth.rz = -1

        tl.to(this.fishMouth, { rz: 0, ease: "power2.inout", duration: 1.5 })
        tl.to(this.fwa, { x: 0, sx: 1, ease: "power2.inout", duration: 2 })

        for (let i = 0; i < 2; i++) {
            tl.to(this.fwa, { x: -0.1, ease: "power2.inout", duration: 2 })
            tl.to(this.fwa, { x: -0, ease: "power2.inout", duration: 2 })

        }
        tl.to(this.fwa, { x: -0.2, sx: 0.65, ease: "power2.in", duration: 2 })
        tl.to(this.fishMouth, { rz: -1, ease: "power2.inout", duration: 1 })
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
