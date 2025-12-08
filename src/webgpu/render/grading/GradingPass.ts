import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import { Textures } from "../../data/Textures.ts";
import { TextureFormat } from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Blit from "../../lib/blit/Blit.ts";
import Camera from "../../lib/Camera.ts";
import DirectionalLight from "../lights/DirectionalLight.ts";
import { Vector4 } from "@math.gl/core";
import GradingMaterial from "./GradingMaterial.ts";
import Texture from "../../lib/textures/Texture.ts";
import { RenderOptions } from "../GameRenderer.ts";


export default class GradingRenderPass extends RenderPass {

    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;

    private blit: Blit;
    private gradingMaterial: GradingMaterial;
    blackValue = 1;

    constructor(renderer: Renderer) {
        super(renderer, "lightRenderPass");
        this.colorTarget = new RenderTexture(renderer, Textures.GRADING, {
            format: TextureFormat.RGBA8Unorm,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]

        this.gradingMaterial = new GradingMaterial(renderer, "gradingMaterial")


        this.blit = new Blit(renderer, "blitGrading", this.gradingMaterial)

    }
    setSettings(options: RenderOptions) {



        this.gradingMaterial.setUniform("exposure", options.exposure)
        this.gradingMaterial.setUniform("contrast", options.contrast)
        this.gradingMaterial.setUniform("brightness", options.brightness)
        console.log(options.brightness)
        this.gradingMaterial.setUniform("vinFalloff", options.vinFalloff)
        this.gradingMaterial.setUniform("vinAmount", options.vinAmount)

        this.gradingMaterial.setUniform("curveRed", options.curveRed)
        this.gradingMaterial.setUniform("curveGreen", options.curveGreen)
        this.gradingMaterial.setUniform("curveBlue", options.curveBlue)

    }
    setBaseTexture(t: Texture) {
        this.gradingMaterial.setTexture("colorTexture", t)
    }

    update() {

    }
    draw() {

        this.blit.draw(this)


    }












}
