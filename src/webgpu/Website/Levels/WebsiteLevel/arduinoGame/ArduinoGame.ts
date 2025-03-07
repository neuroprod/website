import PixelObject from "./PixelObject.ts";
import GameModel from "../../../GameModel.ts";
import {Textures} from "../../../../data/Textures.ts";
import SceneObject3D from "../../../../data/SceneObject3D.ts";
import Model from "../../../../lib/model/Model.ts";
import Object3D from "../../../../lib/model/Object3D.ts";
import IndexedItem from "../IndexedItem.ts";

export default class ArduinoGame extends IndexedItem {

    private title!: Model;
    private ship!: Model;
    private head!: Model;
    private arm1!: Model;
    private arm2!: Model;


    constructor() {
        super();
    }
    setCurrentIndex(index:number){

      if(index ==3){

      }else{

      }

    }
    init(holder: SceneObject3D) {
        this.title = this.add(new PixelObject(GameModel.renderer, Textures.TEXT_INVASION).pixelModel, holder);
        this.ship = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_SHIP).pixelModel, holder);
        this.head = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_HEAD).pixelModel, this.ship);
        this.arm1 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.arm2 = this.add(new PixelObject(GameModel.renderer, Textures.SPACE_ARM).pixelModel, this.head);
        this.title.x = -40 * 0.01

        this.ship.y = 0.2
        this.ship.x = -10 * 0.01
        this.head.x = 0.01 * 7
        this.head.y = 0.01 * 7
        this.arm1.x = -0.01 * 3
        this.arm1.y = 0.01 * 2

        this.arm2.x = 0.01 * 9
        this.arm2.y = 0.01 * 2
        this.arm2.ry = Math.PI

        this.title.y = 0.4
    }

    update() {

    }

    private add(m: Model, h: Object3D) {
        GameModel.gameRenderer.addModel(m)
        GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(m)
        h.addChild(m)
        return m;
    }
}
