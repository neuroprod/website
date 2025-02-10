import {BaseLevel} from "../BaseLevel.ts";
import LoadHandler from "../../../data/LoadHandler.ts";
import SceneHandler from "../../../data/SceneHandler.ts";
import {Vector2, Vector3} from "@math.gl/core";
import UI from "../../../lib/UI/UI.ts";

import MouseInteractionWrapper from "../../MouseInteractionWrapper.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";

import gsap from "gsap";
import LevelHandler from "../LevelHandler.ts";
import GameModel from "../../GameModel.ts";
import VideoPlayer from "../../../lib/video/VideoPlayer.ts";
import Model from "../../../lib/model/Model.ts";
import GBufferMaterial from "../../../render/GBuffer/GBufferMaterial.ts";
import Plane from "../../../lib/mesh/geometry/Plane.ts";
import Box from "../../../lib/mesh/geometry/Box.ts";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import WebsitePath from "./WebsitePath.ts";
import KrisWebsite from "./KrisWebsite.ts";
import SoundHandler from "../../SoundHandler.ts";

export class WebsiteLevel extends BaseLevel {



    private video1!: VideoPlayer;
    private st!: ScrollTrigger;
    private numItems: number =5;
    private websitePath!: WebsitePath;
    private height: number=0;
    private krisWebsite!: KrisWebsite;
constructor() {

    super();
    gsap.registerPlugin(ScrollTrigger)
    this.video1 =new VideoPlayer(GameModel.renderer,"video/test.mp4",new Vector2(1920,1080))

}
    init() {
        super.init();
        LoadHandler.onComplete = this.configScene.bind(this)
        LoadHandler.startLoading()
       LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        LoadHandler.startLoading()
        SceneHandler.setScene("1f78eea8-a005-4204").then(() => {
         SceneHandler.addScene(SceneHandler.getSceneIDByName("website1")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("website2")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("kris")).then(() => {
                LoadHandler.stopLoading()
            });
            SceneHandler.addScene(SceneHandler.getSceneIDByName("website3")).then(() => {
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



        GameModel.gameCamera.setLockedView(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

        GameModel.gameRenderer.setLevelType("website")
        let placeHolder =SceneHandler.getSceneObject("placeHolder")

        this.numItems = placeHolder.children.length
        this.websitePath = new WebsitePath(this.numItems,placeHolder.children)

        let websiteItems= ["root1","root2","root3"]
        for(let i=0;i<websiteItems.length;i++){
            let item = SceneHandler.getSceneObject(websiteItems[i])
            if(item){
                let p = placeHolder.children[i];
                item.setPositionV(p.getPosition().clone())
                item.y-=0.2;
                item.setRotationQ(p.getRotation().clone());
                (p as SceneObject3D).hide();
            }

        }
        SceneHandler.getSceneObject("root1").addChild(SceneHandler.getSceneObject("krisRoot"))

        this.krisWebsite = new KrisWebsite()
        this.krisWebsite.reset()
        this.krisWebsite.show()

        let kris = this.mouseInteractionMap.get("kris") as MouseInteractionWrapper

        kris.onRollOver =()=>{
            this.krisWebsite.startWave()
            GameModel.gameRenderer.distortValue =1
        }
        kris.onRollOut =()=>{
            this.krisWebsite.stopWave()
            GameModel.gameRenderer.distortValue =0
        }




     /*  let char = SceneHandler.getSceneObject("charRoot")
        char.setScaler(0.7)
        char.x =0.5
        char.z =0.0
        char.ry =Math.PI
        char.y =-1.6;
        let fv =SceneHandler.getSceneObject("foodVideo")


        let m = new Model(GameModel.renderer,"video1")
        m.material =new GBufferMaterial(GameModel.renderer,"video1")
        m.material.setTexture('colorTexture',this.video1.getTexture())
        m.mesh =new Plane(GameModel.renderer,1920/1000,1080/1000)
            m.setScaler(0.3)
        m.z = 0.03
        m.rx =Math.PI/2

        fv.addChild(m)
        GameModel.gameRenderer.addModel(m)*/
this.setScroll()

       /* let webSiteRoot = SceneHandler.getSceneObject("rootWebsite")
        this.websiteShow.setObjects(webSiteRoot.children)

        this.websiteShow.show()*/
    /*    gsap.delayedCall(2, () => {
            let backButton = this.mouseInteractionMap.get("backButton") as MouseInteractionWrapper
            backButton.onClick = () => {
                LevelHandler.setLevel("Start")
            }
            backButton.onRollOver = () => {

                this.bounce("backButton")
            }

        });*/



        this.video1.play()

    }



    destroy() {
        let char = SceneHandler.getSceneObject("charRoot")
     if(char) {
         char.x = 0
         char.z = 0
         char.ry = 0
         char.y = 0
     }
        super.destroy();
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden"

        this.video1.pauze()

    }

    onUI() {
        if (UI.LButton("test")) {}
    }

    update() {
        super.update();
        if(this.st){
            this.websitePath.update(this.st.progress)
        }

        if (window.scrollY==0) {
            window.scroll(0,  this.height-1); // reset the scroll position to the top left of the document.
        }
        if (window.scrollY>this.height-1) {
            window.scroll(0,  1); // reset the scroll position to the top left of the document.
        }
        GameModel.gameCamera.setLockedView(this.websitePath.camLookAt, this.websitePath.camPosition);
        this.krisWebsite.update()

    }
onResize(){
    let numSnaps =this.numItems;
    let scrollPos =0;
    if(this.st){
        scrollPos = this.st.scroll()
        this.st.kill()
    }


    this.height =window.innerHeight*(numSnaps+1);
    let app = document.getElementById("app")
    if(app) app.style.height =this.height+"px"

    let heightSnap =window.innerHeight*(numSnaps);
    this.height-=window.innerHeight;
    let  snaps:Array<number> =[]
    snaps.push(0.001)
    for(let i=1;i<=numSnaps;i++){
        snaps.push(1/(numSnaps) *i)
    }
    console.log(snaps,scrollPos)

    this.st =ScrollTrigger.create({
            trigger: "body",
            start: "0",
            end:heightSnap,
           /* snap: {
                snapTo: snaps, // snap to the closest label in the timeline
                duration: { min: 0.1, max: 2 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
                ease: 'power2.inOut' // the ease of the snap animation ("power3" by default)
            },*/

           //onUpdate: () => {this.st.progress}

        }
    )
    window.scrollTo(0, 1);
  //  this.st.scroll(scrollPos)
}

    private setScroll() {
        window.scrollTo(0, 1);

        document.body.style.overflowY = "visible"
        document.body.style.overflowX = "hidden"

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize()






    }
}
