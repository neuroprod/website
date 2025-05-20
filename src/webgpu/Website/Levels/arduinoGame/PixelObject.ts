import Renderer from "../../../lib/Renderer.ts";
import Model from "../../../lib/model/Model.ts";
import Box from "../../../lib/mesh/geometry/Box.ts";
import PixelMaterial from "./PixelMaterial.ts";
import {Textures} from "../../../data/Textures.ts";
import PixelMaterialShadow from "./PixelMaterialShadow.ts";

export default class PixelObject {
    pixelModel: Model;
    private renderer: Renderer;

    public cubeSpacing = 0.01
    private width: number;
    private height: number;
    private shadowMaterial: PixelMaterialShadow;

    constructor(renderer: Renderer, textureName: string) {
        this.renderer =renderer;
        this.pixelModel = new Model(renderer,"pixelModel");
        this.pixelModel.mesh =new Box(renderer)
        this.pixelModel.material =new PixelMaterial(this.renderer,"pixelMaterial")

        let texture = this.renderer.getTexture(textureName)
        this.pixelModel.material.setTexture("colorTexture",texture)

       this.width = texture.options.width;
        this.height = texture.options.height;

        let hw =0;// (this.width*this.cubeSpacing)/2

       let data:Array<number>=[];
        for(let y=0;y<this.height;y++) {
            for (let x = 0; x < this.width; x++) {
                data.push(x*this.cubeSpacing-hw,y*this.cubeSpacing,x, this.height-1 -y)
            }

        }

        this.pixelModel.createBuffer(new Float32Array(data),"instanceData")
        this.pixelModel.numInstances =  this.width*this.height

        this.shadowMaterial = new PixelMaterialShadow(this.renderer,"shadowPixels")
        this.shadowMaterial.setTexture("colorTexture",texture)
        this.pixelModel.setMaterial("shadow", this.shadowMaterial)

    }



}
