import PixelObject from "./PixelObject.ts";
import GameModel from "../../GameModel.ts";
import {Textures} from "../../../data/Textures.ts";
import SceneObject3D from "../../../data/SceneObject3D.ts";
import Model from "../../../lib/model/Model.ts";
import Object3D from "../../../lib/model/Object3D.ts";
import IndexedItem from "../WebsiteLevel/IndexedItem.ts";
import gsap from "gsap";
import Timer from "../../../lib/Timer.ts";
export default class ArduinoGamePixels extends IndexedItem {

    private title!: Model;
    private ship!: Model;
    private head!: Model;
    private arm1!: Model;
    private arm2!: Model;
    private shipHolder: Object3D;
    private enabled =false;
    private tl!: gsap.core.Timeline;

    constructor() {
        super();
        this.shipHolder = new Object3D(GameModel.renderer)

    }
    setEnabled(enabled:boolean){
       if( this.enabled==enabled)return
      if( !this.enabled){
          this.enabled =true
          if(this.tl) this.tl.clear()
        this.tl = gsap.timeline()

          this.tl.to(       this.shipHolder,{y:0.2,duration:2,ease:"elastic.out(1,0.9)"});
          this.tl.to(this.head,{y:0.07},2);

      }else if(this.enabled){
          this.enabled = false;
          if(this.tl) this.tl.clear()
          this.tl = gsap.timeline()
          this.tl.to(this.head,{y:0.02,duration:0.5},0);
          this.tl.to(        this.shipHolder,{y:2,duration:2,ease:"back.in(0.5)"},0.5);


      }

    }
    init(holder: SceneObject3D) {



        this.title = this.add(new PixelObject(GameModel.renderer, Textures.TEXT_INVASION).pixelModel, holder);
      holder.addChild(this.shipHolder)


        this.ship = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_SHIP).pixelModel, this.shipHolder);
        this.head = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_HEAD).pixelModel, this.ship);
        this.arm1 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.arm2 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.title.x = -40 * 0.01

        this.shipHolder.y = 2
        this.shipHolder.x = -0.05

        this.head.x = 0.01 * 7
        this.head.y = 0.02
        this.arm1.x = -0.01 * 3
        this.arm1.y = 0.01 * 2

        this.arm2.x = 0.01 * 9
        this.arm2.y = 0.01 * 2
        this.arm2.ry = Math.PI

        this.title.y = 0.4
    }

    update() {
if(this.enabled){
    this.ship.y = Math.sin(Timer.time)*0.01
}
    }

    private add(m: Model, h: Object3D) {
        GameModel.gameRenderer.addModel(m)
        GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(m)
        h.addChild(m)
        return m;
    }
}
