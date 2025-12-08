import { Textures } from "../../data/Textures";
import Blit from "../../lib/blit/Blit"
import Renderer from "../../lib/Renderer"
import RenderPass from "../../lib/RenderPass"
import ColorAttachment from "../../lib/textures/ColorAttachment";
import RenderTexture from "../../lib/textures/RenderTexture";
import { TextureFormat } from "../../lib/WebGPUConstants";
import DofBlurMaterial from "./DofBlurMaterial";


export default class DofHorPass extends RenderPass {
    colorTarget: RenderTexture;
    colorAttachment: ColorAttachment;
    blit: Blit;
    dofBlurMaterial: DofBlurMaterial;

    constructor(renderer: Renderer) {
        super(renderer, "DofPrepPass")
        this.colorTarget = new RenderTexture(renderer, Textures.DOF_HORIZONTAL, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]
        this.dofBlurMaterial = new DofBlurMaterial(renderer, "dofBlur")
        this.blit = new Blit(renderer, "blitDOFBlur", this.dofBlurMaterial)

    }


    draw() {

        this.blit.draw(this)


    }


}