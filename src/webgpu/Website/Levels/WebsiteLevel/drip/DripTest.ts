import SceneObject3D from "../../../../data/SceneObject3D.ts";
import Drip from "./Drip.ts";
import GameModel from "../../../GameModel.ts";
import SceneHandler from "../../../../data/SceneHandler.ts";
import UI from "../../../../lib/UI/UI.ts";


export default class DripTest{
    private drip: Drip;


    constructor() {
       this.drip =new Drip()

    }
    update(){
        //this.drip.update();
    }

    init(holder: SceneObject3D) {
        this.drip.model.setPositionV(holder.getPosition())
        GameModel.gameRenderer.addModel(this.drip.model)
    }

    onUI() {

           let f = UI.LFloat("dropHeight",0.7,"dropHeight")
        if(f!=    this.drip.dropHeight ){
            this.drip.dropHeight =f;
            this.drip.update()
        }
    }
}
