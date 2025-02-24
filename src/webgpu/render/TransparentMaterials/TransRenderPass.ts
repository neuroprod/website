import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";

import {Textures} from "../../data/Textures.ts";

import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Camera from "../../lib/Camera.ts";
import DirectionalLight from "../lights/DirectionalLight.ts";
import DepthStencilAttachment from "../../lib/textures/DepthStencilAttachment.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import ModelRenderer from "../../lib/model/ModelRenderer.ts";
import {LoadOp} from "../../lib/WebGPUConstants.ts";


export default class TransRenderPass extends RenderPass{

    private colorAttachment: ColorAttachment;
    public modelRenderer: ModelRenderer;

    constructor(renderer:Renderer,camera:Camera,dirLight:DirectionalLight,modelRenderer: ModelRenderer) {
            super(renderer,"TransRenderPass");
        this.modelRenderer =modelRenderer;
        this.colorAttachment = new ColorAttachment(renderer.getTexture(Textures.LIGHT),{ loadOp: LoadOp.Load});
        this.colorAttachments = [this.colorAttachment]

        this.depthStencilAttachment = new DepthStencilAttachment(renderer.getTexture(Textures.GDEPTH) as RenderTexture,{ depthLoadOp: LoadOp.Load});

    }
    update(){

    }
    draw() {

        this.modelRenderer.draw(this)


    }












}
