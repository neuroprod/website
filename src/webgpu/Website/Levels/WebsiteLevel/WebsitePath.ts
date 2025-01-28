import {Vector3} from "@math.gl/core";

export default class WebsitePath{

    private cameraPoints:Array<Vector3>=[]
    private lookatPoints:Array<Vector3>=[]


    private numItems: number;
    private numItemsPlus: number;
    constructor(numItems:number) {

        this.numItems =numItems;
        this.numItemsPlus = this.numItems+1;
        let step = Math.PI*2/numItems;
        for(let i=0;i<numItems;i++){



        }

    }
    public update(progress:number){
        let p= progress*(  this.numItemsPlus);
        let p1 = Math.floor(p);
        let f = p-p1;


    }


}
