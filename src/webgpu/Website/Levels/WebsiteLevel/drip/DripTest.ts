import SceneObject3D from "../../../../data/SceneObject3D.ts";
import Drip from "./Drip.ts";
import GameModel from "../../../GameModel.ts";
import SceneHandler from "../../../../data/SceneHandler.ts";
import UI from "../../../../lib/UI/UI.ts";
import Object3D from "../../../../lib/model/Object3D.ts";


export default class DripTest{
    private drip1: Drip;
    private drip2: Drip;
    private drip3: Drip;
    private drip4: Drip;
    private drip5: Drip;
    private holder: Object3D;
private drips:Array<Drip>=[]

    constructor() {

        this.holder = new Object3D(GameModel.renderer);
        this.holder.setScaler(0.03)


        this.drip1 =new Drip();
        this.drip1.sideOffset=0.0
        this.drip1.model.x =-3.53
        this.drip1.model.y =-3.78
        this.drip1.baseWith =0.44
        this.drips.push(this.drip1)
        this.holder.addChild(this.drip1.model)

        this.drip2 =new Drip();
        this.drip2.model.x =4.13
        this.drip2.model.y =-1.54
        this.drip2.baseWith =0.71
        this.drips.push(this.drip2)
        this.holder.addChild(this.drip2.model)

        this.drip3 =new Drip();
        this.drip3.model.x =1.58
        this.drip3.model.y =-3.7
        this.drip3.baseWith =0.71
        this.drips.push(this.drip3)
        this.holder.addChild(this.drip3.model)


        this.drip4 =new Drip();
        this.drip4.model.x =0
        this.drip4.model.y =-3.71
        this.drip4.baseWith =0.79
        this.drips.push(this.drip4)
        this.holder.addChild(this.drip4.model)


        this.drip5 =new Drip();

        this.drip5.model.x =-1.75
        this.drip5.model.y =-3.73
        this.drip5.baseWith =0.9
        this.drip5.sideOffset =0.05
        this.drips.push(this.drip5)
        this.holder.addChild(this.drip5.model)

    }
    update(){
        for(let drip of this.drips){
            drip.update()
        }
    }

    init(holder: SceneObject3D) {

        this.holder.setPositionV(holder.getPosition())
        this.holder.setRotationQ(holder.getRotation())

        for(let drip of this.drips){
           drip.setDrip()
            GameModel.gameRenderer.addModel(drip.model)
            GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(drip.model)
            GameModel.gameRenderer.addModel(drip.modelDrop)
            GameModel.gameRenderer.shadowMapPass.modelRenderer.addModel(drip.modelDrop)
        }
    }

    onUI() {
    let count =0
        for(let drip of this.drips){
            UI.pushID(count+"test")
            drip.onUI()
            UI.popID()
            count++
        }
      /*     let f = UI.LFloat("dropHeight",0.7,"dropHeight")
       // this.drip.onUI()
        if(f!=    this.drip.height ){
            this.drip.height =f;
            this.drip.update()



        }*/
    }
}
