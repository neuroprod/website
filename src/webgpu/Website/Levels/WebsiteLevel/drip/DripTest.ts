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
    private holderLeft: Object3D;
    private holderRight: Object3D;
private drips:Array<Drip>=[]

    constructor() {

        this.holderLeft = new Object3D(GameModel.renderer);
        this.holderLeft.setScaler(0.03)
        this.holderRight = new Object3D(GameModel.renderer);
        this.holderRight.setScaler(0.03)


        //left
        this.drip1 =new Drip();
        this.drip1.sideOffset=0.0
        this.drip1.model.x =-2
        this.drip1.model.y =-4.6
        this.drip1.baseWith =0.44
        this.drips.push(this.drip1)
        this.holderLeft.addChild(this.drip1.model)

        this.drip2 =new Drip();
        this.drip2.model.x =0
        this.drip2.model.y =-4.4
        this.drip2.sideOffset=0.1
        this.drip2.baseWith =0.71
        this.drips.push(this.drip2)
        this.holderLeft.addChild(this.drip2.model)


        this.drip3 =new Drip();
        this.drip3.model.x =1.58
        this.drip3.model.y =-4.2
        this.drip3.baseWith =0.6
        this.drip3.sideOffset =0.2
        this.drips.push(this.drip3)
        this.holderLeft.addChild(this.drip3.model)


        this.drip4 =new Drip();
        this.drip4.model.x =0.75
        this.drip4.model.y =-4.8
        this.drip4.baseWith =0.79
        this.drips.push(this.drip4)
        this.holderRight.addChild(this.drip4.model)


        this.drip5 =new Drip();
        this.drip5.model.x =-1.2
        this.drip5.model.y =-4.8
        this.drip5.baseWith =0.9
        this.drip5.sideOffset =0.05
        this.drips.push(this.drip5)
        this.holderRight.addChild(this.drip5.model)

    }
    update(){
        for(let drip of this.drips){
            drip.update()
        }
    }

    init(holderLeft: SceneObject3D,holderRight: SceneObject3D) {

        this.holderLeft.setPositionV(holderLeft.getPosition())
        this.holderLeft.setRotationQ(holderLeft.getRotation())


        this.holderRight.setPositionV(holderRight.getPosition())
        this.holderRight.setRotationQ(holderRight.getRotation())



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
