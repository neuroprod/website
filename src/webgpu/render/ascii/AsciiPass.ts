import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import { Textures } from "../../data/Textures.ts";
import { TextureFormat } from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";

import Blit from "../../lib/blit/Blit.ts";


import AsciiCloudMaterial from "./AsciiCloudMaterial.ts";
import Timer from "../../lib/Timer.ts";


export default class AsciiPass extends RenderPass {
    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;

    private blit: Blit;
    private asciiCloudMaterial: AsciiCloudMaterial;

    constructor(renderer: Renderer) {
        super(renderer, "asciiPass");
        this.colorTarget = new RenderTexture(renderer, Textures.ASCII, {
            format: TextureFormat.R8Unorm,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,
            sizeMultiplier: 1 / 3,
            heightMultiplier: 18 / 27,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]

        this.asciiCloudMaterial = new AsciiCloudMaterial(renderer, "asciiCloudMaterial")


        this.blit = new Blit(renderer, "blitAsciiCloud", this.asciiCloudMaterial)

    }

    update() {
        this.asciiCloudMaterial.setUniform("time", Timer.time / 40)
    }
    draw() {

        this.blit.draw(this)


    }












}
