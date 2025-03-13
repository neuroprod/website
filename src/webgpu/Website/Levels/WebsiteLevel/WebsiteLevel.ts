import {BaseLevel} from "../BaseLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import sceneHandler from "../../../data/SceneHandler.ts";
import {Vector2, Vector3} from "@math.gl/core";
import UI from "../../../lib/UI/UI.ts";

import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";

import gsap from "gsap";
import GameModel from "../../GameModel.ts";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import KrisWebsite from "./KrisWebsite.ts";
import MeatHandler from "./meat/MeatHandler.ts";
import ArduinoGame from "./arduinoGame/ArduinoGame.ts";
import FoodForFish from "./foodforfish/FoodForFish.ts";
import IndexedItem from "./IndexedItem.ts";
import DripTest from "./drip/DripTest.ts";

export class WebsiteLevel extends BaseLevel {


    private video1!: VideoPlayer;


    private height: number = 0;
    private krisWebsite!: KrisWebsite;

    private meatHandler: MeatHandler;
    private arduinoGame: ArduinoGame;
    private foodForFish: FoodForFish;
    private websiteItems = ["root1", "root2", "root3", "root4", "root5", 'root6', 'root7']

    private indexedItems: Array<IndexedItem> = []

    private numItems: number = this.websiteItems.length;
    private heightMS!: number;
    private currentViewIndex: number = -1;
    private driptest: DripTest;

    constructor() {

        super();
        gsap.registerPlugin(ScrollTrigger)
        this.video1 = new VideoPlayer(GameModel.renderer, "video/foodfish.mp4", new Vector2(1920, 1080))
        this.meatHandler = new MeatHandler()
        this.arduinoGame = new ArduinoGame()
        this.foodForFish = new FoodForFish()
        this.driptest =new DripTest()

        this.indexedItems.push(this.meatHandler)
        this.indexedItems.push(this.arduinoGame)
        this.indexedItems.push(this.foodForFish)
    }

    init() {
        super.init();

        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("1f78eea8-a005-4204").then(() => {
            SceneHandler.addScene(SceneHandler.getSceneIDByName("websiteGraphicsDev")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("foodforfish")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("kris")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("meat")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("arduinoGame")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("lab101")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("youtube")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("rinusCorneel")).then(() => {
                LoadHandler.stopLoading()
            });
            LoadHandler.stopLoading()
        })

    }

    configScene() {

        LoadHandler.onComplete = () => {
        }

        //leftMargin
        GameModel.gameRenderer.setModels(SceneHandler.allModels)
        this.setMouseHitObjects(SceneHandler.mouseHitModels);


        // GameModel.gameRenderer.addModel(this.video1)

        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

        GameModel.gameRenderer.setLevelType("website")


        for (let i = 0; i < this.websiteItems.length; i++) {
            let item = SceneHandler.getSceneObject(this.websiteItems[i])
            item.x = 1 * i;
            item.y = 0;
            item.z = 0;
        }
        SceneHandler.getSceneObject(this.websiteItems[0]).addChild(sceneHandler.getSceneObject("krisRoot"))
        this.krisWebsite = new KrisWebsite()
        this.krisWebsite.reset()
        this.krisWebsite.show()

        let kris = this.mouseInteractionMap.get("kris") as MouseInteractionWrapper

        kris.onRollOver = () => {
            this.krisWebsite.startWave()
            GameModel.gameRenderer.distortValue = 1
        }
        kris.onRollOut = () => {
            this.krisWebsite.stopWave()
            GameModel.gameRenderer.distortValue = 0
        }


        let fv = SceneHandler.getSceneObject("videoHolder")


        let m = new Model(GameModel.renderer, "video1")
        m.material = new GBufferMaterial(GameModel.renderer, "video1")
        m.material.setTexture('colorTexture', this.video1.getTexture())
        m.mesh = new Plane(GameModel.renderer, 1920 / 1000, 1080 / 1000)
        m.setScaler(0.20)
        m.z = 0.017
        m.x = -0.01
        m.y = 0.005
        m.rx = Math.PI / 2

        fv.addChild(m)
        GameModel.gameRenderer.addModel(m)

        this.meatHandler.init(SceneHandler.getSceneObject("meat1"), SceneHandler.getSceneObject("meat2"), SceneHandler.getSceneObject("editBtn"), this.mouseInteractionMap.get("edit") as MouseInteractionWrapper)
        this.arduinoGame.init(SceneHandler.getSceneObject("root4"))

        this.foodForFish.init(SceneHandler.getSceneObject("root2"), SceneHandler.getSceneObject("fwaLogo"), SceneHandler.getSceneObject("FishMouth"))


        this.setScroll()


        this.video1.play()


        let holder = SceneHandler.getSceneObject("dripHolder")
        holder.hide()

        this.driptest.init(holder)



        this.setCurrentViewIndex(0)
    }


    destroy() {

        for (let i = 0; i < this.websiteItems.length; i++) {
            let item = SceneHandler.getSceneObject(this.websiteItems[i])
            item.x = 0;

        }


        let char = SceneHandler.getSceneObject("charRoot")
        if (char) {
            char.x = 0
            char.z = 0
            char.ry = 0
            char.y = 0
        }
        super.destroy();
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden"
        this.foodForFish.destroy()
        this.video1.pauze()

    }

    onUI() {
      this.driptest.onUI()
    }

    update() {
        super.update();

        let xPos = ((window.scrollY / this.height) * this.numItems)
        this.setCurrentViewIndex(Math.round(xPos) % this.numItems);
        if (window.scrollY > this.height / 2) {
            SceneHandler.getSceneObject(this.websiteItems[0]).x = this.websiteItems.length

        } else {

            SceneHandler.getSceneObject(this.websiteItems[0]).x = 0
        }

        if (window.scrollY == 0) {
            window.scroll(0, this.height - 1); // reset the scroll position to the top left of the document.
        }
        if (window.scrollY > this.height - 1) {
            window.scroll(0, 1); // reset the scroll position to the top left of the document.
        }
        GameModel.gameCamera.setLockedView(new Vector3(xPos, 0.25, 0), new Vector3(xPos, 0.25, 0.7));
        this.krisWebsite.update()
        this.meatHandler.update()
        this.arduinoGame.update()
        this.foodForFish.update()
        this.driptest.update()
    }

    onResize() {
        let numSnaps = this.numItems;
        let scrollPos = 0;


        this.height = window.innerHeight * (numSnaps);
        this.heightMS = window.innerHeight * (numSnaps);
        let app = document.getElementById("app")
        if (app) app.style.height = this.heightMS + "px"
        this.height -= window.innerHeight;
        /*
                let heightSnap = window.innerHeight * (numSnaps);

                let snaps: Array<number> = []
                snaps.push(0.001)
                for (let i = 1; i <= numSnaps; i++) {
                    snaps.push(1 / (numSnaps) * i)
                }


                this.st = ScrollTrigger.create({
                        trigger: "body",
                        start: "0",
                        end: heightSnap,
                        /* snap: {
                              snapTo: snaps, // snap to the closest label in the timeline
                              duration: { min: 0.1, max: 2 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                              delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
                              ease: 'power2.inOut' // the ease of the snap animation ("power3" by default)
                          },*/

        //onUpdate: () => {this.st.progress}

        //    }
        // )
        // window.scrollTo(0, 1);
        //  this.st.scroll(scrollPos)
    }

    private setScroll() {
        window.scrollTo(0, 1);

        document.body.style.overflowY = "visible"
        document.body.style.overflowX = "hidden"

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize()


    }

    private setCurrentViewIndex(index: number) {
        if (this.currentViewIndex != index) {
            this.currentViewIndex = index;

            for (let ii of this.indexedItems) {
                ii.setCurrentIndex(this.currentViewIndex)
            }


        }
    }
}
