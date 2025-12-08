import { Textures } from "../../data/Textures";
import Blit from "../../lib/blit/Blit"
import Renderer from "../../lib/Renderer"
import RenderPass from "../../lib/RenderPass"
import ColorAttachment from "../../lib/textures/ColorAttachment";
import RenderTexture from "../../lib/textures/RenderTexture";
import { TextureFormat } from "../../lib/WebGPUConstants";
import DOFPrepMaterial from "./DofPrepMaterial";

export default class DofPrepPass extends RenderPass {

    colorTarget: RenderTexture;
    colorAttachment: ColorAttachment;
    blit: Blit;
    dofPrepMaterial: DOFPrepMaterial;

    constructor(renderer: Renderer) {
        super(renderer, "DofPrepPass")
        this.colorTarget = new RenderTexture(renderer, Textures.DOF_PREP, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,

            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment]
        this.dofPrepMaterial = new DOFPrepMaterial(renderer, "dofDepthPrep")
        this.blit = new Blit(renderer, "blitDOFPrep", this.dofPrepMaterial)

    }
    setMinMax(dofMin: number, dofMax: number) {
        this.dofPrepMaterial.setUniform("dofMin", dofMin)
        this.dofPrepMaterial.setUniform("dofMax", dofMax)
    }

    draw() {

        this.blit.draw(this)


    }


}