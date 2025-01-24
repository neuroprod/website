import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import {Textures} from "../../data/Textures.ts";
import {TextureFormat} from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Blit from "../../lib/blit/Blit.ts";

import DistortionMaterial from "./DistortionMaterial.ts";
import Timer from "../../lib/Timer.ts";
import {createNoise2D, NoiseFunction2D} from "../../lib/SimplexNoise.ts";
import {smoothstep} from "../../lib/MathUtils.ts";


export default class InGameFXPass extends RenderPass{
    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;

    private blit: Blit;
    private distortionMaterial: DistortionMaterial;
    private noise: NoiseFunction2D;
    distortValue: number =0;

    constructor(renderer:Renderer) {
        super(renderer,"InGameFX");
        this.colorTarget = new RenderTexture(renderer, Textures.INGAMEFX, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]

        this.distortionMaterial =new DistortionMaterial(this.renderer,"distortionMat")

        this.blit  =new Blit(renderer,"blitLight", this.distortionMaterial)
this.noise = createNoise2D();
    }
    update(){

        this.distortionMaterial.setUniform("time",Timer.time)


        this.distortionMaterial.setUniform("value1",this.distortValue)




        this.distortionMaterial.setUniform("value2", this.distortValue)
        this.distortionMaterial.setUniform("rand",1+this.distortValue*Math.random()*1.5)


    }
    draw() {

        this.blit.draw(this)


    }












}
