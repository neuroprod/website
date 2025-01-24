import ModelRenderer from "../../lib/model/ModelRenderer.ts";
import RenderPass from "../../lib/RenderPass.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";
import Renderer from "../../lib/Renderer.ts";
import {TextureFormat} from "../../lib/WebGPUConstants.ts";

import Camera from "../../lib/Camera.ts";
import {Textures} from "../../data/Textures.ts";



export default class MaskRenderPass extends RenderPass {

    public modelRenderer: ModelRenderer;
    public colorTarget: RenderTexture;



    private colorAttachment: ColorAttachment;





    constructor(renderer: Renderer,camera:Camera) {

        super(renderer, "ShadowRenderPass");



        this.colorTarget = new RenderTexture(renderer, Textures.MASK, {
            format: TextureFormat.R8Unorm,
            sampleCount: this.sampleCount,
           scaleToCanvas:true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        this.colorAttachment = new ColorAttachment(this.colorTarget,{
            clearValue:{r: 0, g: 0, b: 0, a: 0}
        });
        this.colorAttachments = [this.colorAttachment];


        //
        this.modelRenderer = new ModelRenderer(renderer,"modelRendererMask",camera)
        this.modelRenderer.setMaterialType("mask")




    }
    update(){

    }
    draw() {

        this.modelRenderer.draw(this);


    }


}
