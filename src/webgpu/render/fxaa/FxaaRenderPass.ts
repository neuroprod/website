import RenderPass from "../../lib/RenderPass.ts";
import Renderer from "../../lib/Renderer.ts";
import RenderTexture from "../../lib/textures/RenderTexture.ts";
import { Textures } from "../../data/Textures.ts";
import { TextureFormat } from "../../lib/WebGPUConstants.ts";
import ColorAttachment from "../../lib/textures/ColorAttachment.ts";
import Blit from "../../lib/blit/Blit.ts";
import Texture from "../../lib/textures/Texture.ts";
import FxaaMaterial from "./FxaaMaterial.ts";

export default class FxaaRenderPass extends RenderPass {
    private colorTarget: RenderTexture;
    private colorAttachment: ColorAttachment;
    private blit: Blit;
    private fxaaMaterial: FxaaMaterial;

    constructor(renderer: Renderer) {
        super(renderer, "fxaaRenderPass");

        this.colorTarget = new RenderTexture(renderer, Textures.FXAA, {
            format: TextureFormat.RGBA16Float,
            sampleCount: this.sampleCount,
            scaleToCanvas: true,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });

        this.colorAttachment = new ColorAttachment(this.colorTarget);
        this.colorAttachments = [this.colorAttachment];

        this.fxaaMaterial = new FxaaMaterial(renderer, "fxaaMaterial");
        this.blit = new Blit(renderer, "blitFxaa", this.fxaaMaterial);
    }

    /**
     * Set the input texture for FXAA (typically the output from GradingRenderPass)
     */


    /**
     * Update FXAA parameters
     * @param subPixelAlias Sub-pixel aliasing removal (0.0 to 1.0, default 0.75)
     * @param edgeThreshold Edge detection threshold (default 0.166)
     * @param edgeThresholdMin Minimum edge threshold (default 0.0833)
     * @param useHDRLuma Use tone-mapped luma for HDR content (1.0 = yes, 0.0 = no, default 1.0)
     */
    setParameters(
        subPixelAlias: number = 0.75,
        edgeThreshold: number = 0.166,
        edgeThresholdMin: number = 0.0833,
        useHDRLuma: number = 1.0
    ) {
        this.fxaaMaterial.setUniform("subPixelAlias", subPixelAlias);
        this.fxaaMaterial.setUniform("edgeThreshold", edgeThreshold);
        this.fxaaMaterial.setUniform("edgeThresholdMin", edgeThresholdMin);
        this.fxaaMaterial.setUniform("useHDRLuma", useHDRLuma);
    }

    /**
     * Update with canvas size (call this when canvas resizes)
     * Note: Frame size is now computed from texture dimensions, so this is optional
     */


    draw() {
        this.blit.draw(this);
    }

    /**
     * Get the output texture after FXAA
     */
  
}
